import { createServer } from "node:http"
import { randomBytes } from "node:crypto"
import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { OAuth2Client } from "google-auth-library"

const prompt = createInterface({ input: stdin, output: stdout })
const clientId = (await prompt.question("Google OAuth Desktop client ID: ")).trim()
const clientSecret = (await prompt.question("Google OAuth client secret: ")).trim()
prompt.close()

if (!clientId || !clientSecret) {
  throw new Error("Both OAuth client values are required.")
}

const state = randomBytes(32).toString("base64url")
let resolveCode
let rejectCode
const authorizationCode = new Promise((resolve, reject) => {
  resolveCode = resolve
  rejectCode = reject
})

const server = createServer((request, response) => {
  const callbackUrl = new URL(request.url ?? "/", "http://127.0.0.1")
  if (callbackUrl.pathname !== "/oauth2callback") {
    response.writeHead(404).end("Not found")
    return
  }
  if (callbackUrl.searchParams.get("state") !== state) {
    response.writeHead(400).end("OAuth state did not match. You can close this tab.")
    return
  }

  const error = callbackUrl.searchParams.get("error")
  if (error) {
    response.writeHead(400).end("Google authorization was denied. You can close this tab.")
    rejectCode(new Error(`Google authorization was denied (${error}).`))
    return
  }

  const code = callbackUrl.searchParams.get("code")
  if (!code) {
    response.writeHead(400).end("Google did not return an authorization code.")
    rejectCode(new Error("Google did not return an authorization code."))
    return
  }

  response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })
  response.end("Google authorization complete. You can close this tab.")
  resolveCode(code)
})

await new Promise((resolve, reject) => {
  server.once("error", reject)
  server.listen(0, "127.0.0.1", resolve)
})

const address = server.address()
if (!address || typeof address === "string") {
  server.close()
  throw new Error("Could not start the local OAuth callback server.")
}

const redirectUri = `http://127.0.0.1:${address.port}/oauth2callback`
const oauthClient = new OAuth2Client(clientId, clientSecret, redirectUri)
const { codeVerifier, codeChallenge } =
  await oauthClient.generateCodeVerifierAsync()
const authorizationUrl = oauthClient.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
  state,
  code_challenge: codeChallenge,
  code_challenge_method: "S256",
})

const timeout = setTimeout(
  () => rejectCode(new Error("OAuth authorization timed out after five minutes.")),
  5 * 60 * 1000
)

try {
  console.log("\nOpen this URL and authorize the Google account that owns or can edit the registration files:\n")
  console.log(authorizationUrl)
  const code = await authorizationCode
  const { tokens } = await oauthClient.getToken({ code, codeVerifier })
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Revoke this app's access in your Google Account and run the setup again."
    )
  }

  console.log("\nAdd these as server-side Vercel environment variables. Do not put them in VITE_ variables or share them in chat:\n")
  console.log(`GOOGLE_OAUTH_CLIENT_ID=${clientId}`)
  console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${clientSecret}`)
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`)
} finally {
  clearTimeout(timeout)
  server.close()
}
