import { GoogleAuth } from "google-auth-library"
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import type { IncomingMessage, ServerResponse } from "node:http"

type VercelRequest = IncomingMessage & { body: unknown }
type VercelResponse = ServerResponse & {
  json: (body: unknown) => VercelResponse
  status: (statusCode: number) => VercelResponse
}

const maximumUploadBytes = 10 * 1024 * 1024
const uploadChunkBytes = 1024 * 1024
const defaultSpreadsheetId =
  "1-BQh1Lewx_OCfSyRxQXOTIpQSMhxC8_Nc3acUmWrtPQ"
const defaultDriveFolderId = "1ow1m3sImzblmsmFCEbOH72jLRzapDo-X"

const registrationHeaders = [
  "Submission ID",
  "Submitted At",
  "Full Name",
  "Preferred Name",
  "Personal Email",
  "School Email",
  "Mobile Number",
  "Facebook / Messenger Link",
  "Home Address",
  "Date of Birth",
  "Emergency Contact",
  "Student ID",
  "Program / Course",
  "Year Level",
  "Section",
  "Other Section",
  "Expected Graduation Year",
  "Skill Level",
  "Areas of Interest",
  "Microsoft Tools",
  "GitHub Username",
  "LinkedIn / Portfolio Link",
  "Previous Community",
  "Motivation",
  "Learning Goals",
  "Contribution",
  "Activities",
  "Committees",
  "Availability",
  "Membership Agreements",
  "CV Drive File ID",
  "OVRF / COE Drive File ID",
  "Letter of Intent Drive File ID",
  "Privacy Consent",
  "Signature",
  "Consent Date",
]

type UploadKind = "cv" | "ovrf" | "letter"

class RequestError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number
  ) {
    super(message)
    this.status = status
  }
}

function getConfiguration() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  const spreadsheetId =
    process.env.REGISTRATION_SHEET_ID || defaultSpreadsheetId
  const isTestMode = process.env.REGISTRATION_TEST_MODE === "true"
  const folderId = isTestMode
    ? process.env.REGISTRATION_TEST_DRIVE_FOLDER_ID ||
      process.env.REGISTRATION_DRIVE_FOLDER_ID ||
      defaultDriveFolderId
    : process.env.REGISTRATION_DRIVE_FOLDER_ID || defaultDriveFolderId
  const tabName = isTestMode
    ? process.env.REGISTRATION_TEST_SHEET_TAB || "Applications_Test"
    : process.env.REGISTRATION_SHEET_TAB || "Applications"
  const allowedOrigin = process.env.REGISTRATION_ALLOWED_ORIGIN
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  const permitSecret = process.env.REGISTRATION_TOKEN_SECRET

  if (
    !email ||
    !privateKey ||
    !spreadsheetId ||
    !folderId ||
    !allowedOrigin ||
    !turnstileSecret ||
    !permitSecret ||
    permitSecret.length < 32
  ) {
    throw new RequestError(
      "Registration is not configured. Contact the site administrator.",
      503
    )
  }

  return {
    email,
    privateKey,
    spreadsheetId,
    folderId,
    tabName,
    isTestMode,
    allowedOrigin,
    turnstileSecret,
    permitSecret,
  }
}

function requireRegistrationEnabled() {
  if (process.env.REGISTRATION_TEST_MODE === "true") return
  if (
    process.env.REGISTRATION_ENABLED !== "true" ||
    process.env.REGISTRATION_PRIVACY_NOTICE_APPROVED !== "true"
  ) {
    throw new RequestError("Registration submissions are not open.", 503)
  }
}

function requireSameOrigin(
  request: VercelRequest,
  allowedOrigin: string
): string {
  const requestOrigin = request.headers.origin
  let normalizedAllowedOrigin: string

  try {
    normalizedAllowedOrigin = new URL(allowedOrigin).origin
  } catch {
    throw new RequestError("The registration origin is misconfigured.", 503)
  }

  if (requestOrigin !== normalizedAllowedOrigin) {
    throw new RequestError("This request is not allowed.", 403)
  }
  return normalizedAllowedOrigin
}

async function verifyHuman(
  body: Record<string, unknown>,
  request: VercelRequest,
  config: ReturnType<typeof getConfiguration>,
  origin: string
) {
  const captchaToken = getText(body, "captchaToken", 2048, true)
  const forwardedFor = request.headers["x-forwarded-for"]
  const remoteIp =
    typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : ""
  const parameters = new URLSearchParams({
    secret: config.turnstileSecret,
    response: captchaToken,
  })
  if (remoteIp) parameters.set("remoteip", remoteIp)

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: parameters }
  )
  if (!response.ok) {
    throw new RequestError("Could not verify the bot check. Please try again.", 502)
  }
  const result = (await response.json()) as {
    success?: boolean
    hostname?: string
    action?: string
  }
  const expectedHost = new URL(origin).hostname
  if (
    result.success !== true ||
    result.hostname !== expectedHost ||
    result.action !== "registration"
  ) {
    throw new RequestError("The bot check failed. Please try again.", 400)
  }

  const payload = Buffer.from(
    JSON.stringify({
      expiresAt: Date.now() + 15 * 60 * 1000,
      origin,
      nonce: randomUUID(),
    })
  ).toString("base64url")
  const signature = createHmac("sha256", config.permitSecret)
    .update(payload)
    .digest("base64url")
  return { permit: `${payload}.${signature}` }
}

function requirePermit(
  body: Record<string, unknown>,
  permitSecret: string,
  origin: string
) {
  const permit = getText(body, "permit", 2048, true)
  const [payload, signature, extra] = permit.split(".")
  if (!payload || !signature || extra) {
    throw new RequestError("Please complete the bot check and try again.", 400)
  }

  const expectedSignature = createHmac("sha256", permitSecret)
    .update(payload)
    .digest()
  let actualSignature: Buffer
  try {
    actualSignature = Buffer.from(signature, "base64url")
  } catch {
    throw new RequestError("Please complete the bot check and try again.", 400)
  }
  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    throw new RequestError("Please complete the bot check and try again.", 400)
  }

  let decoded: { expiresAt?: number; origin?: string }
  try {
    decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  } catch {
    throw new RequestError("Please complete the bot check and try again.", 400)
  }
  if (
    typeof decoded.expiresAt !== "number" ||
    decoded.expiresAt <= Date.now() ||
    decoded.origin !== origin
  ) {
    throw new RequestError("The bot check expired. Please try again.", 400)
  }
}

function getRequestBody(request: VercelRequest): Record<string, unknown> {
  const body: unknown = request.body
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new RequestError("A JSON request body is required.", 400)
  }
  return body as Record<string, unknown>
}

function getText(
  body: Record<string, unknown>,
  key: string,
  maximumLength: number,
  required = false
): string {
  const value = body[key]
  if (typeof value !== "string") {
    if (required) throw new RequestError(`The ${key} field is required.`, 400)
    return ""
  }
  const trimmed = value.trim()
  if (required && !trimmed) {
    throw new RequestError(`The ${key} field is required.`, 400)
  }
  if (trimmed.length > maximumLength) {
    throw new RequestError(`The ${key} field is too long.`, 400)
  }
  return trimmed
}

function getEmail(body: Record<string, unknown>, key: string, required = false) {
  const email = getText(body, key, 320, required)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RequestError(`The ${key} field must be a valid email address.`, 400)
  }
  return email
}

function getHttpsUrl(
  body: Record<string, unknown>,
  key: string,
  required = false
) {
  const value = getText(body, key, 2000, required)
  if (!value) return ""
  try {
    if (new URL(value).protocol !== "https:") throw new Error()
  } catch {
    throw new RequestError(`The ${key} field must be a valid HTTPS URL.`, 400)
  }
  return value
}

function getStringList(
  body: Record<string, unknown>,
  key: string,
  maximumItems: number,
  required = false
): string[] {
  const value = body[key]
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    if (required) throw new RequestError(`Select at least one ${key}.`, 400)
    return []
  }
  const items = value.map((item) => item.trim()).filter(Boolean)
  if (items.length > maximumItems || items.some((item) => item.length > 200)) {
    throw new RequestError(`The ${key} selection is invalid.`, 400)
  }
  if (required && items.length === 0) {
    throw new RequestError(`Select at least one ${key}.`, 400)
  }
  return items
}

function getFileIds(body: Record<string, unknown>): Record<UploadKind, string> {
  const value = body.files
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new RequestError("All required documents must be uploaded.", 400)
  }
  const files = value as Record<string, unknown>
  const ids = {
    cv: files.cv,
    ovrf: files.ovrf,
    letter: files.letter,
  }
  if (
    Object.values(ids).some(
      (id) => typeof id !== "string" || !/^[\w-]{10,}$/.test(id)
    )
  ) {
    throw new RequestError("All required documents must be uploaded.", 400)
  }
  return ids as Record<UploadKind, string>
}

function getGoogleAuth() {
  const { email, privateKey } = getConfiguration()
  return new GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  })
}

async function googleFetch(
  path: string,
  init: RequestInit = {},
  host = "www.googleapis.com"
): Promise<Response> {
  const auth = await getGoogleAuth()
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) {
    throw new RequestError("Could not authenticate with Google.", 502)
  }

  const response = await fetch(`https://${host}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token.token}`,
      ...init.headers,
    },
  })
  if (!response.ok) {
    throw new RequestError(
      `Google rejected the request (HTTP ${response.status}). Check the service-account access and API setup.`,
      502
    )
  }
  return response
}

function validateUpload(kind: UploadKind, name: string, mimeType: string, size: number) {
  if (
    !name ||
    name.length > 160 ||
    name.includes("/") ||
    name.includes("\\") ||
    !Number.isInteger(size) ||
    size <= 0 ||
    size > maximumUploadBytes
  ) {
    throw new RequestError("The selected file is invalid or too large.", 400)
  }

  const extension = name.toLowerCase().split(".").pop()
  const isPdf = mimeType === "application/pdf" || extension === "pdf"
  const isImage = mimeType.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|bmp|heic|avif)$/i.test(name)

  if (
    (kind === "cv" && !isPdf) ||
    (kind === "ovrf" && !isImage) ||
    (kind === "letter" && !isPdf && !isImage)
  ) {
    throw new RequestError("The selected file type is not allowed.", 400)
  }
}

async function startUpload(body: Record<string, unknown>) {
  const kind = body.kind
  if (kind !== "cv" && kind !== "ovrf" && kind !== "letter") {
    throw new RequestError("The document type is invalid.", 400)
  }
  const name = getText(body, "name", 160, true)
  const mimeType = getText(body, "mimeType", 120, true)
  const size = body.size
  if (typeof size !== "number") {
    throw new RequestError("The file size is invalid.", 400)
  }
  validateUpload(kind, name, mimeType, size)

  const config = getConfiguration()
  const response = await googleFetch(
    "/upload/drive/v3/files?uploadType=resumable&fields=id%2Cname&supportsAllDrives=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Upload-Content-Type": mimeType,
        "X-Upload-Content-Length": String(size),
      },
      body: JSON.stringify({
        name: `${config.isTestMode ? "TEST-" : ""}${name.replace(/[\r\n]/g, "_")}`,
        mimeType,
        parents: [config.folderId],
      }),
    }
  )

  const uploadUrl = response.headers.get("location")
  if (!uploadUrl) {
    throw new RequestError("Google did not provide an upload session.", 502)
  }
  const parsedUrl = new URL(uploadUrl)
  if (
    parsedUrl.hostname !== "www.googleapis.com" ||
    !parsedUrl.pathname.startsWith("/upload/drive/v3/files")
  ) {
    throw new RequestError("Google returned an invalid upload session.", 502)
  }
  return { uploadUrl }
}

async function uploadChunk(body: Record<string, unknown>) {
  const uploadUrl = getText(body, "uploadUrl", 2048, true)
  const mimeType = getText(body, "mimeType", 120, true)
  const offset = body.offset
  const totalSize = body.totalSize
  const encodedChunk = body.chunk
  if (
    typeof offset !== "number" ||
    !Number.isInteger(offset) ||
    offset < 0 ||
    typeof totalSize !== "number" ||
    !Number.isInteger(totalSize) ||
    totalSize <= 0 ||
    totalSize > maximumUploadBytes ||
    typeof encodedChunk !== "string" ||
    encodedChunk.length > 1_500_000 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      encodedChunk
    )
  ) {
    throw new RequestError("The upload chunk is invalid.", 400)
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(uploadUrl)
  } catch {
    throw new RequestError("The upload session is invalid.", 400)
  }
  if (
    parsedUrl.hostname !== "www.googleapis.com" ||
    !parsedUrl.pathname.startsWith("/upload/drive/v3/files") ||
    !parsedUrl.searchParams.has("upload_id")
  ) {
    throw new RequestError("The upload session is invalid.", 400)
  }

  const chunk = Buffer.from(encodedChunk, "base64")
  if (
    chunk.length === 0 ||
    chunk.length > uploadChunkBytes ||
    (offset + chunk.length < totalSize && chunk.length !== uploadChunkBytes) ||
    offset + chunk.length > totalSize ||
    (offset % uploadChunkBytes !== 0)
  ) {
    throw new RequestError("The upload chunk size or offset is invalid.", 400)
  }

  const auth = await getGoogleAuth()
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) {
    throw new RequestError("Could not authenticate with Google.", 502)
  }

  const response = await fetch(parsedUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Length": String(chunk.length),
      "Content-Range": `bytes ${offset}-${offset + chunk.length - 1}/${totalSize}`,
      "Content-Type": mimeType,
    },
    body: new Uint8Array(chunk),
    redirect: "manual",
  })

  if (response.status === 308) {
    const range = response.headers.get("range")
    const lastUploadedByte = range?.match(/^bytes=0-(\d+)$/)?.[1]
    if (!lastUploadedByte || Number(lastUploadedByte) + 1 !== offset + chunk.length) {
      throw new RequestError("Google could not confirm the document upload chunk.", 502)
    }
    return { complete: false, uploadedBytes: Number(lastUploadedByte) + 1 }
  }
  if (!response.ok) {
    throw new RequestError(
      `Google rejected the document upload (HTTP ${response.status}).`,
      502
    )
  }
  const uploadedFile = (await response.json()) as { id?: string }
  if (!uploadedFile.id) {
    throw new RequestError("Google did not confirm the uploaded document.", 502)
  }
  return { complete: true, fileId: uploadedFile.id }
}

function escapeSheetName(name: string) {
  return `'${name.replace(/'/g, "''")}'`
}

async function ensureRegistrationTab() {
  const { spreadsheetId, tabName } = getConfiguration()
  const spreadsheet = await googleFetch(
    `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties.title`,
    {},
    "sheets.googleapis.com"
  )
  const metadata = (await spreadsheet.json()) as {
    sheets?: Array<{ properties?: { title?: string } }>
  }
  const hasTab = metadata.sheets?.some(
    (sheet) => sheet.properties?.title === tabName
  )

  if (!hasTab) {
    await googleFetch(
      `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{ addSheet: { properties: { title: tabName } } }],
        }),
      },
      "sheets.googleapis.com"
    )
  }

  const quotedTab = escapeSheetName(tabName)
  const headerResponse = await googleFetch(
    `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(`${quotedTab}!1:1`)}`,
    {},
    "sheets.googleapis.com"
  )
  const headerData = (await headerResponse.json()) as { values?: string[][] }
  const existingHeaders = headerData.values?.[0] ?? []

  if (existingHeaders.length === 0) {
    await googleFetch(
      `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(`${quotedTab}!A1`)}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [registrationHeaders] }),
      },
      "sheets.googleapis.com"
    )
  } else if (
    existingHeaders.length !== registrationHeaders.length ||
    existingHeaders.some((header, index) => header.trim() !== registrationHeaders[index])
  ) {
    throw new RequestError(
      `The "${tabName}" tab has different columns. Update its first row to the expected registration headers or use an empty tab.`,
      409
    )
  }
  return quotedTab
}

async function verifyUploadedFile(fileId: string, folderId: string) {
  const response = await googleFetch(
    `/drive/v3/files/${encodeURIComponent(fileId)}?fields=id%2Cname%2Cparents`
  )
  const file = (await response.json()) as {
    id?: string
    name?: string
    parents?: string[]
  }
  if (!file.id || !file.parents?.includes(folderId)) {
    throw new RequestError("An uploaded document is not in the registration folder.", 400)
  }
  return file
}

async function submitRegistration(body: Record<string, unknown>) {
  const config = getConfiguration()
  if (body.testMode !== config.isTestMode) {
    throw new RequestError("The registration mode does not match the server.", 400)
  }
  if (body.privacyConsent !== true) {
    throw new RequestError(
      config.isTestMode
        ? "Test acknowledgement is required."
        : "Privacy consent is required.",
      400
    )
  }

  const fullName = getText(body, "fullName", 200, true)
  const personalEmail = getEmail(body, "personalEmail", true)
  if (
    config.isTestMode &&
    (!/^TEST\b/i.test(fullName) ||
      !personalEmail.toLowerCase().endsWith(".invalid"))
  ) {
    throw new RequestError(
      "Test mode accepts only a full name starting with TEST and an email ending in .invalid.",
      400
    )
  }

  const files = getFileIds(body)
  const uploadedFiles = await Promise.all(
    Object.values(files).map((fileId) => verifyUploadedFile(fileId, config.folderId))
  )
  if (uploadedFiles.length !== 3) {
    throw new RequestError("All required documents must be uploaded.", 400)
  }

  const dateOfBirth = getText(body, "dateOfBirth", 30, true)
  const parsedBirthDate = new Date(`${dateOfBirth}T00:00:00.000Z`)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ||
    Number.isNaN(parsedBirthDate.getTime()) ||
    parsedBirthDate.toISOString().slice(0, 10) !== dateOfBirth ||
    parsedBirthDate.getTime() > Date.now()
  ) {
    throw new RequestError("The dateOfBirth field is invalid.", 400)
  }
  const consentDate = getText(body, "consentDate", 30, true)
  const consentDateMatch = consentDate.match(
    /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/([0-9]{4})$/
  )
  if (
    !consentDateMatch ||
    new Date(
      `${consentDateMatch[3]}-${consentDateMatch[1]}-${consentDateMatch[2]}T00:00:00.000Z`
    )
      .toISOString()
      .slice(0, 10) !==
      `${consentDateMatch[3]}-${consentDateMatch[1]}-${consentDateMatch[2]}`
  ) {
    throw new RequestError("The consentDate field is invalid.", 400)
  }
  const graduationYear = getText(body, "graduationYear", 10, true)
  if (
    !/^\d{4}$/.test(graduationYear) ||
    Number(graduationYear) < new Date().getFullYear()
  ) {
    throw new RequestError("The graduationYear field is invalid.", 400)
  }

  const values = [
    `${config.isTestMode ? "TEST-" : ""}${randomUUID()}`,
    new Date().toISOString(),
    fullName,
    getText(body, "preferredName", 120),
    personalEmail,
    getEmail(body, "schoolEmail"),
    getText(body, "mobileNumber", 60, true),
    getHttpsUrl(body, "facebookLink", true),
    getText(body, "homeAddress", 1000, true),
    dateOfBirth,
    getText(body, "emergencyContact", 100),
    getText(body, "studentId", 100, true),
    getText(body, "program", 120, true),
    getText(body, "yearLevel", 40),
    getText(body, "section", 80, true),
    getText(body, "sectionOther", 100),
    graduationYear,
    getText(body, "skillLevel", 40, true),
    getStringList(body, "interestAreas", 20, true).join("; "),
    getStringList(body, "microsoftTools", 20, true).join("; "),
    getText(body, "githubUsername", 100),
    getHttpsUrl(body, "portfolioLink"),
    getText(body, "previousCommunity", 2000),
    getText(body, "whyJoin", 5000, true),
    getText(body, "learningGoals", 3000, true),
    getText(body, "contribution", 3000, true),
    getStringList(body, "activities", 20, true).join("; "),
    getStringList(body, "committees", 20, true).join("; "),
    getStringList(body, "availability", 20, true).join("; "),
    getStringList(body, "membershipAgreements", 10, true).join("; "),
    files.cv,
    files.ovrf,
    files.letter,
    config.isTestMode ? "TEST ACKNOWLEDGEMENT (FAKE DATA ONLY)" : "I agree",
    getText(body, "signature", 200, true),
    consentDate,
  ]

  const quotedTab = await ensureRegistrationTab()
  const response = await googleFetch(
    `/v4/spreadsheets/${encodeURIComponent(config.spreadsheetId)}/values/${encodeURIComponent(`${quotedTab}!A:AJ`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: [values] }),
    },
    "sheets.googleapis.com"
  )
  const result = (await response.json()) as {
    updates?: { updatedRange?: string }
  }
  return { submissionId: values[0], row: result.updates?.updatedRange }
}

async function deleteUploadedFiles(body: Record<string, unknown>) {
  const config = getConfiguration()
  const ids = body.fileIds
  if (
    !Array.isArray(ids) ||
    ids.length > 3 ||
    !ids.every((id) => typeof id === "string" && /^[\w-]{10,}$/.test(id))
  ) {
    throw new RequestError("The uploaded file list is invalid.", 400)
  }

  for (const id of ids) {
    const file = await verifyUploadedFile(id, config.folderId)
    await googleFetch(`/drive/v3/files/${encodeURIComponent(file.id!)}`, {
      method: "DELETE",
    })
  }
  return { deleted: ids.length }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader("Cache-Control", "no-store")
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST")
    response.status(405).json({ error: "Method not allowed." })
    return
  }

  try {
    requireRegistrationEnabled()
    const config = getConfiguration()
    const origin = requireSameOrigin(request, config.allowedOrigin)
    const body = getRequestBody(request)

    let result: unknown
    switch (body.action) {
      case "verify-human":
        result = await verifyHuman(body, request, config, origin)
        break
      case "start-upload":
        requirePermit(body, config.permitSecret, origin)
        result = await startUpload(body)
        break
      case "upload-chunk":
        requirePermit(body, config.permitSecret, origin)
        result = await uploadChunk(body)
        break
      case "submit":
        requirePermit(body, config.permitSecret, origin)
        result = await submitRegistration(body)
        break
      case "cleanup":
        requirePermit(body, config.permitSecret, origin)
        result = await deleteUploadedFiles(body)
        break
      default:
        throw new RequestError("The registration action is invalid.", 400)
    }

    response.status(200).json(result)
  } catch (error) {
    if (error instanceof RequestError) {
      response.status(error.status).json({ error: error.message })
      return
    }
    console.error(
      "Registration API failed unexpectedly.",
      error instanceof Error ? error.name : "UnknownError"
    )
    response.status(500).json({
      error: "The registration could not be completed. Please try again later.",
    })
  }
}
