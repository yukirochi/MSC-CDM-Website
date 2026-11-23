import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { LockKeyhole, UsersRound } from "lucide-react"
import { Turnstile } from "@marsidev/react-turnstile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import logo from "@/assets/logo/a373d43f-61d3-4ecb-b6ae-4bef2e3d252f-removebg-preview.png"
import { PageShell } from "@/pages/PageShell"

const cvTemplateUrl =
  "https://docs.google.com/document/d/1Of7nIc1rGwZIeBGfLbCot2kwEAa3NYDN/edit"
const letterTemplateUrl =
  "https://docs.google.com/document/d/1ZbEASwcU5v9lzxeVIngLww-7Wo9OZpCcHgvyohmTig8/edit?tab=t.0"
const maxFileSize = 10 * 1024 * 1024

function getPrivacyNoticeUrl(): string | null {
  const value = import.meta.env.VITE_PRIVACY_NOTICE_URL
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.href : null
  } catch {
    return null
  }
}

const programs = [
  "BSIT",
  "BSCpE",
  "BSE",
  "BSBA - HRM",
  "BSED - Science",
  "BEED - ECEd",
  "BEEd",
  "BTLEd - ICT",
]
const yearLevels = ["1ST", "2ND", "3RD", "4TH"]
const skillLevels = ["Beginner", "Intermediate", "Advanced"]
const interestAreas = [
  "Web Development",
  "Backend / APIs",
  "Mobile Development",
  "Cloud (Azure)",
  "AI / Machine Learning",
  "Cybersecurity",
  "Data / Databases",
  "UI/UX Design",
  "DevOps",
  "Game Development",
  "Other",
]
const microsoftTools = [
  "GitHub",
  "VS Code",
  "Azure",
  "Microsoft 365 (Word, Excel, PowerPoint, etc)",
  "Power Platform",
  "Teams",
  "Copilot",
  "None yet",
]
const activities = [
  "Seminars and workshops",
  "Hackathons and projects",
  "Community outreach",
  "Content / social media",
  "Event logistics",
  "Mentoring other students",
  "Other",
]
const committees = [
  "Technical / Projects",
  "Events and Logistics",
  "Communications and Media",
  "Sponsorships and Partnerships",
  "Membership and Records",
  "I just want to become a member for now. But I want to volunteer in the future.",
  "Member",
]
const availabilityOptions = [
  "Weekdays morning",
  "Weekdays afternoon",
  "Both weekdays morning and afternoon",
  "Weekends morning",
  "Weekends afternoon",
  "Both weekends morning and afternoon",
]
const agreements = [
  "I certify that the information I provided is true and correct.",
  "I agree to follow the organization's constitution, code of conduct, and school policies.",
  "I understand that membership is subject to approval by the officers.",
  "I agree to take part in activities as much as my schedule allows.",
]
const applicationSteps = [
  { section: 2, label: "Personal information" },
  { section: 3, label: "Academic information" },
  { section: 4, label: "Technical background" },
  { section: 5, label: "Motivation" },
  { section: 6, label: "Committee" },
  { section: 7, label: "Documents" },
  { section: 8, label: "Agreement" },
  { section: 9, label: "Privacy consent" },
]

type UploadKey = "cv" | "ovrf" | "letter"
type FieldProps = {
  id: string
  label: string
  required?: boolean
  hint?: ReactNode
  className?: string
  children: ReactNode
}

function Field({
  id,
  label,
  required = false,
  hint,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="leading-5">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && (
        <div id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">
          {hint}
        </div>
      )}
    </div>
  )
}

function SectionCard({
  number,
  title,
  description,
  children,
}: {
  number: number
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card className="gap-0 border-border/70 py-0 shadow-sm">
      <CardHeader className="flex flex-row items-start gap-3 border-b border-border/70 px-6 py-5">
        <Badge variant="secondary" className="mt-0.5 min-w-8 justify-center">
          {number}
        </Badge>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="mt-1 leading-5">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
        {children}
      </CardContent>
    </Card>
  )
}

function SelectField({
  id,
  label,
  options,
  required = false,
  hint,
  value,
  onChange,
}: {
  id: string
  label: string
  options: string[]
  required?: boolean
  hint?: ReactNode
  value?: string
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <Field id={id} label={label} required={required} hint={hint}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  )
}

function CheckboxGroup({
  id,
  name,
  label,
  options,
  required = false,
  className = "",
}: {
  id: string
  name: string
  label: string
  options: string[]
  required?: boolean
  className?: string
}) {
  return (
    <fieldset
      aria-required={required}
      className={`space-y-3 ${className}`}
    >
      <legend className="text-sm font-medium leading-5">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        )}
      </legend>
      <p className="text-xs leading-5 text-muted-foreground">
        Select all that apply.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option, index) => {
          const optionId = `${id}-${index}`
          return (
            <label
              key={option}
              htmlFor={optionId}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
            >
              <input
                id={optionId}
                type="checkbox"
                name={name}
                value={option}
                className="mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
              <span className="text-sm leading-5">{option}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function StepNavigation({
  step,
  totalSteps,
  onBack,
  onContinue,
  submitDisabled = true,
  submitting = false,
  submitLabel = "Submissions are not open yet",
}: {
  step: number
  totalSteps: number
  onBack: () => void
  onContinue: () => void
  submitDisabled?: boolean
  submitting?: boolean
  submitLabel?: string
}) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={step === 0}
      >
        Back
      </Button>
      {step < totalSteps - 1 ? (
        <Button type="button" onClick={onContinue}>
          Continue
        </Button>
      ) : (
        <Button type="submit" disabled={submitDisabled}>
          {!submitDisabled && <LockKeyhole aria-hidden="true" />}
          {submitting
            ? "Submitting..."
            : submitLabel}
        </Button>
      )}
    </div>
  )
}

function JoinCommunityPage() {
  const [selectedSection, setSelectedSection] = useState("")
  const [motivation, setMotivation] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState("")
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileWidgetKey, setTurnstileWidgetKey] = useState(0)
  const [fileErrors, setFileErrors] = useState<Partial<Record<UploadKey, string>>>(
    {}
  )
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])
  const progressRef = useRef<HTMLDivElement | null>(null)
  const privacyNoticeUrl = getPrivacyNoticeUrl()
  const privacyNoticeApproved =
    import.meta.env.VITE_PRIVACY_NOTICE_APPROVED === "true"
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const isTestMode = import.meta.env.VITE_REGISTRATION_TEST_MODE === "true"
  const registrationOpen =
    (isTestMode ||
      (import.meta.env.VITE_REGISTRATION_ENABLED === "true" &&
        privacyNoticeApproved &&
        privacyNoticeUrl !== null)) &&
    Boolean(turnstileSiteKey)

  function moveToStep(step: number) {
    setCurrentStep(step)
    window.setTimeout(
      () => progressRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0
    )
  }

  function validateStep(
    step: number
  ): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
    const activeStep = stepRefs.current[step]
    if (!activeStep) return null

    activeStep
      .querySelectorAll<HTMLFieldSetElement>('fieldset[aria-required="true"]')
      .forEach((group) => {
        const checkboxes = Array.from(
          group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
        )
        const firstCheckbox = checkboxes[0]
        if (firstCheckbox) {
          firstCheckbox.setCustomValidity(
            checkboxes.some((checkbox) => checkbox.checked)
              ? ""
              : "Select at least one option."
          )
        }
      })

    const controls = Array.from(
      activeStep.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea")
    )
    const invalidControl = controls.find((control) => !control.checkValidity())
    return invalidControl ?? null
  }

  function continueToNextStep() {
    const invalidControl = validateStep(currentStep)
    if (invalidControl) {
      invalidControl.reportValidity()
      return
    }

    moveToStep(Math.min(currentStep + 1, applicationSteps.length - 1))
  }

  async function postRegistrationRequest(
    payload: Record<string, unknown>,
    permit?: string
  ): Promise<Record<string, unknown>> {
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permit ? { ...payload, permit } : payload),
    })
    let result: unknown
    try {
      result = await response.json()
    } catch {
      throw new Error("The submission service returned an unreadable response.")
    }
    if (!response.ok) {
      const message =
        typeof result === "object" &&
        result !== null &&
        "error" in result &&
        typeof result.error === "string"
          ? result.error
          : `Submission failed (HTTP ${response.status}).`
      throw new Error(message)
    }
    if (typeof result !== "object" || result === null || Array.isArray(result)) {
      throw new Error("The submission service returned an invalid response.")
    }
    return result as Record<string, unknown>
  }

  async function uploadFile(
    file: File,
    kind: UploadKey,
    permit: string,
    folderId: string
  ): Promise<string> {
    const mimeType =
      file.type ||
      (file.name.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "application/octet-stream")
    const session = await postRegistrationRequest({
      action: "start-upload",
      kind,
      name: file.name,
      mimeType,
      size: file.size,
      folderId,
    }, permit)
    if (typeof session.uploadUrl !== "string") {
      throw new Error("The upload service did not create an upload session.")
    }

    const uploadChunkSize = 1024 * 1024
    for (let offset = 0; offset < file.size; offset += uploadChunkSize) {
      const bytes = new Uint8Array(
        await file.slice(offset, offset + uploadChunkSize).arrayBuffer()
      )
      let binary = ""
      for (let index = 0; index < bytes.length; index += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
      }

      const result = await postRegistrationRequest({
        action: "upload-chunk",
        uploadUrl: session.uploadUrl,
        mimeType,
        offset,
        totalSize: file.size,
        chunk: btoa(binary),
      }, permit)
      if (offset + bytes.length < file.size && result.complete !== false) {
        throw new Error("The document upload stopped before completion.")
      }
      if (offset + bytes.length === file.size) {
        if (result.complete !== true || typeof result.fileId !== "string") {
          throw new Error("The document upload was not confirmed.")
        }
        return result.fileId
      }
    }
    throw new Error("The document upload did not complete.")
  }

  async function createSubmissionFolder(permit: string): Promise<string> {
    const result = await postRegistrationRequest(
      { action: "create-submission-folder" },
      permit
    )
    if (typeof result.folderId !== "string") {
      throw new Error("The service could not create a private application folder.")
    }
    return result.folderId
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!registrationOpen || isSubmitting) return
    setSubmissionError("")
    setSubmissionSuccess(false)
    if (!turnstileToken) {
      setSubmissionError("Complete the security check before submitting.")
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    for (let step = 0; step < applicationSteps.length; step += 1) {
      const invalidControl = validateStep(step)
      if (invalidControl) {
        moveToStep(step)
        window.setTimeout(() => invalidControl.reportValidity(), 0)
        return
      }
    }

    setIsSubmitting(true)
    const uploadedFileIds: string[] = []
    let submissionFolderId = ""
    let permit = ""
    try {
      const verification = await postRegistrationRequest({
        action: "verify-human",
        captchaToken: turnstileToken,
      })
      if (typeof verification.permit !== "string") {
        throw new Error("The security check could not be verified.")
      }
      permit = verification.permit
      setUploadStatus("Creating a private application folder...")
      submissionFolderId = await createSubmissionFolder(permit)

      const fileEntries: Array<[UploadKey, FormDataEntryValue | null]> =
        isTestMode
          ? [["cv", formData.get("testDocument")]]
          : [
              ["cv", formData.get("cv")],
              ["ovrf", formData.get("ovrf")],
              ["letter", formData.get("letterOfIntent")],
            ]
      const files = fileEntries.map(([kind, value]) => {
        if (!(value instanceof File) || value.size === 0) {
          throw new Error(
            isTestMode
              ? "Choose a dummy PDF document to test the Drive upload."
              : `Choose the required ${kind} document.`
          )
        }
        return [kind, value] as const
      })
      const fileIds: Partial<Record<UploadKey, string>> = {}
      for (const [kind, file] of files) {
        setUploadStatus(`Uploading ${file.name}...`)
        const fileId = await uploadFile(
          file,
          kind,
          permit,
          submissionFolderId
        )
        uploadedFileIds.push(fileId)
        fileIds[kind] = fileId
      }

      setUploadStatus(
        isTestMode ? "Saving test application..." : "Saving your application..."
      )
      const textValue = (name: string) => formData.get(name)?.toString() ?? ""
      const listValue = (name: string) =>
        formData.getAll(name).map((value) => value.toString())
      const result = await postRegistrationRequest({
        action: "submit",
        fullName: textValue("fullName"),
        preferredName: textValue("preferredName"),
        personalEmail: textValue("personalEmail"),
        schoolEmail: textValue("schoolEmail"),
        mobileNumber: textValue("mobileNumber"),
        facebookLink: textValue("facebookLink"),
        homeAddress: textValue("homeAddress"),
        dateOfBirth: textValue("dateOfBirth"),
        emergencyContact: textValue("emergencyContact"),
        studentId: textValue("studentId"),
        program: textValue("program"),
        yearLevel: textValue("yearLevel"),
        section: textValue("section"),
        sectionOther: textValue("sectionOther"),
        graduationYear: textValue("graduationYear"),
        skillLevel: textValue("skillLevel"),
        interestAreas: listValue("interestAreas"),
        microsoftTools: listValue("microsoftTools"),
        githubUsername: textValue("githubUsername"),
        portfolioLink: textValue("portfolioLink"),
        previousCommunity: textValue("previousCommunity"),
        whyJoin: textValue("whyJoin"),
        learningGoals: textValue("learningGoals"),
        contribution: textValue("contribution"),
        activities: listValue("activities"),
        committees: listValue("committees"),
        availability: listValue("availability"),
        membershipAgreements: listValue("membershipAgreements"),
        folderId: submissionFolderId,
        testFileId: isTestMode ? fileIds.cv : "",
        privacyConsent: textValue("privacyConsent") !== "",
        testMode: isTestMode,
        signature: textValue("signature"),
        consentDate: textValue("consentDate"),
        files: fileIds,
      }, permit)

      setSubmissionSuccess(true)
      setUploadStatus("")
      form.reset()
      setSelectedSection("")
      setMotivation("")
      setFileErrors({})
      moveToStep(0)
      if (typeof result.submissionId !== "string") {
        setSubmissionError(
          "Your application was saved, but its confirmation could not be displayed."
        )
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The application could not be submitted."
      setSubmissionError(message)
      setUploadStatus("")
      if (uploadedFileIds.length > 0 || submissionFolderId) {
        try {
          await postRegistrationRequest({
            action: "cleanup",
            fileIds: uploadedFileIds,
            folderId: submissionFolderId,
          }, permit)
        } catch {
          setSubmissionError(
            `${message} The temporary application folder or its files may need to be removed from Drive manually.`
          )
        }
      }
    } finally {
      setIsSubmitting(false)
      setTurnstileToken("")
      setTurnstileWidgetKey((current) => current + 1)
    }
  }

  function validateUpload(
    key: UploadKey,
    isAllowed: (file: File) => boolean,
    formatLabel: string
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0]
      let error: string | undefined

      if (file && file.size > maxFileSize) {
        error = "Choose a file that is 10 MB or smaller."
      } else if (file && !isAllowed(file)) {
        error = `Choose ${formatLabel}.`
      }

      if (error) event.currentTarget.value = ""
      setFileErrors((current) => ({ ...current, [key]: error }))
    }
  }

  const sentenceCount = motivation
    .trim()
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim()).length

  return (
    <PageShell
      eyebrow="Registration"
      title="Join the Community"
      description="Complete the application below to apply for membership in Microsoft Student Community – Colegio de Montalban."
      icon={UsersRound}
      bannerTheme="brand-light"
      bannerLogo={logo}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <Card
          role="status"
          className="gap-3 border-amber-300/70 bg-amber-50/70 py-4 text-amber-950 shadow-none"
        >
          <CardContent className="flex items-start gap-3 px-5">
            <LockKeyhole aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <div>
              <CardTitle className="text-sm">
                {isTestMode
                  ? "TEST MODE — use fake information only"
                  : registrationOpen
                    ? "Applications are open"
                    : "Submissions are not open yet"}
              </CardTitle>
              <CardDescription className="mt-1 leading-5 text-amber-900">
                {isTestMode
                  ? "Test submissions go to the separate Applications_Test tab. Use a name beginning with TEST and an email ending in .invalid. Do not enter real personal information or upload real documents."
                  : registrationOpen
                    ? "Review the privacy notice before completing your application. Your application and documents are submitted securely."
                    : "The privacy consent below is sample text for layout testing only, not an approved notice. Do not enter real personal information; this preview does not send or save entries or files."}
              </CardDescription>
            </div>
          </CardContent>
        </Card>

        <div ref={progressRef} className="scroll-mt-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {applicationSteps[currentStep].label}
              </p>
              <p className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {applicationSteps.length}
              </p>
            </div>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentStep + 1) / applicationSteps.length) * 100)}%
            </span>
          </div>
          <nav aria-label="Application steps" className="relative px-1">
            <div
              role="progressbar"
              aria-label="Application progress"
              aria-valuemin={1}
              aria-valuemax={applicationSteps.length}
              aria-valuenow={currentStep + 1}
              aria-valuetext={`Step ${currentStep + 1} of ${applicationSteps.length}: ${applicationSteps[currentStep].label}`}
              className="absolute left-1 right-1 top-3.5 h-1 rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{
                  width: `${(currentStep / (applicationSteps.length - 1)) * 100}%`,
                }}
              />
            </div>
            <ol className="relative flex justify-between">
              {applicationSteps.map((step, index) => (
                <li key={step.section} className="flex flex-col items-center">
                  <button
                    type="button"
                    aria-label={`Go back to ${step.label}`}
                    aria-current={index === currentStep ? "step" : undefined}
                    disabled={index >= currentStep}
                    onClick={() => moveToStep(index)}
                    className="grid size-7 place-items-center rounded-full border-2 border-border bg-background text-xs font-semibold text-muted-foreground transition-colors enabled:cursor-pointer enabled:hover:border-primary disabled:cursor-default"
                    data-active={index <= currentStep}
                  >
                    <span
                      className={
                        index <= currentStep
                          ? "grid size-full place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {index + 1}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit}
        >
          {submissionError && (
            <p role="alert" className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
              {submissionError}
            </p>
          )}
          {submissionSuccess && (
            <p role="status" className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-900">
              {isTestMode
                ? "Test submission recorded in the Applications_Test tab."
                : "Your application was submitted successfully."}
            </p>
          )}
          {uploadStatus && (
            <p role="status" className="text-sm text-muted-foreground">
              {uploadStatus}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Fields marked <span className="font-semibold text-destructive">*</span>{" "}
            are required. Select all that apply for multi-select questions.
          </p>

          <div ref={(node) => { stepRefs.current[0] = node }} hidden={currentStep !== 0}>
          <SectionCard
            number={2}
            title="Personal Information"
            description="Tell us how to identify and contact you."
          >
            <Field id="fullName" label="Full name (Last, First, Middle)" required>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Last, First, Middle"
                autoComplete="name"
                required
              />
            </Field>
            <Field id="preferredName" label="Nickname / preferred name">
              <Input
                id="preferredName"
                name="preferredName"
                autoComplete="nickname"
              />
            </Field>
            <Field id="personalEmail" label="Email address (personal)" required>
              <Input
                id="personalEmail"
                name="personalEmail"
                type="email"
                autoComplete="email"
                required
              />
            </Field>
            <Field id="schoolEmail" label="Microsoft / school email (if any)">
              <Input
                id="schoolEmail"
                name="schoolEmail"
                type="email"
                autoComplete="email"
              />
            </Field>
            <Field id="mobileNumber" label="Mobile number" required>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                autoComplete="tel"
                required
              />
            </Field>
            <Field
              id="facebookLink"
              label="Facebook / Messenger link (for the community chat)"
              required
              hint="Enter a full link beginning with https://."
            >
              <Input
                id="facebookLink"
                name="facebookLink"
                type="url"
                placeholder="https://..."
                required
              />
            </Field>
            <Field
              id="homeAddress"
              label="Home address (Barangay, Municipality, Province)"
              required
              className="sm:col-span-2"
            >
              <Textarea id="homeAddress" name="homeAddress" required />
            </Field>
            <Field id="dateOfBirth" label="Date of birth (to confirm age)" required>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                autoComplete="bday"
                max={new Date().toISOString().slice(0, 10)}
                required
              />
            </Field>
            <Field
              id="emergencyContact"
              label="Emergency Contact # of relative"
              hint="Optional."
            >
              <Input
                id="emergencyContact"
                name="emergencyContact"
                type="tel"
                autoComplete="tel"
              />
            </Field>
          </SectionCard>
          <StepNavigation
            step={0}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(0)}
            onContinue={continueToNextStep}
          />
          </div>
          <div ref={(node) => { stepRefs.current[1] = node }} hidden={currentStep !== 1}>
          <SectionCard
            number={3}
            title="Academic Information"
            description="Share your current program and academic details."
          >
            <Field id="studentId" label="Student ID number" required>
              <Input
                id="studentId"
                name="studentId"
                inputMode="numeric"
                autoComplete="off"
                required
              />
            </Field>
            <SelectField
              id="program"
              label="Program / Course"
              options={programs}
              required
            />
            <SelectField
              id="yearLevel"
              label="Year level"
              options={yearLevels}
            />
            <SelectField
              id="section"
              label="Section"
              options={["A", "B", "C", "D", "Other"]}
              required
              value={selectedSection}
              onChange={(event) => setSelectedSection(event.target.value)}
            />
            {selectedSection === "Other" && (
              <Field id="sectionOther" label="Specify section" required>
                <Input id="sectionOther" name="sectionOther" required />
              </Field>
            )}
            <Field
              id="graduationYear"
              label="Expected graduation year"
              required
            >
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                inputMode="numeric"
                min={new Date().getFullYear()}
                placeholder="e.g. 2028"
                required
              />
            </Field>
          </SectionCard>
          <StepNavigation
            step={1}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(0)}
            onContinue={continueToNextStep}
          />
          </div>
          <div ref={(node) => { stepRefs.current[2] = node }} hidden={currentStep !== 2}>
          <SectionCard
            number={4}
            title="Technical Background"
            description="No prior experience is required. Tell us what you have tried and what interests you."
          >
            <SelectField
              id="skillLevel"
              label="Self-rated skill level"
              options={skillLevels}
              required
            />
            <CheckboxGroup
              id="interest"
              name="interestAreas"
              label="Areas of interest"
              options={interestAreas}
              required
              className="sm:col-span-2"
            />
            <CheckboxGroup
              id="tool"
              name="microsoftTools"
              label="Microsoft tools you've used"
              options={microsoftTools}
              required
              className="sm:col-span-2"
            />
            <Field id="githubUsername" label="GitHub username (optional)">
              <Input id="githubUsername" name="githubUsername" autoComplete="off" />
            </Field>
            <Field id="portfolioLink" label="LinkedIn or portfolio link (optional)">
              <Input
                id="portfolioLink"
                name="portfolioLink"
                type="url"
                placeholder="https://..."
              />
            </Field>
            <Field
              id="previousCommunity"
              label="Have you joined a developer community or student org before? If yes, which one?"
              className="sm:col-span-2"
            >
              <Textarea id="previousCommunity" name="previousCommunity" />
            </Field>
          </SectionCard>
          <StepNavigation
            step={2}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(1)}
            onContinue={continueToNextStep}
          />
          </div>
          <div ref={(node) => { stepRefs.current[3] = node }} hidden={currentStep !== 3}>
          <SectionCard
            number={5}
            title="Motivation and Participation"
            description="Help us understand what you want to learn and how you would like to take part."
          >
            <Field
              id="whyJoin"
              label="Why do you want to join Microsoft Student Community – Colegio de Montalban?"
              required
              className="sm:col-span-2"
              hint={`Please answer in 3–5 sentences.${motivation ? ` Current count: ${sentenceCount}.` : ""}`}
            >
              <Textarea
                id="whyJoin"
                name="whyJoin"
                required
                value={motivation}
                onChange={(event) => setMotivation(event.target.value)}
                aria-describedby="whyJoin-hint"
              />
            </Field>
            <Field
              id="learningGoals"
              label="What do you hope to learn or gain as a member?"
              required
              className="sm:col-span-2"
            >
              <Textarea id="learningGoals" name="learningGoals" required />
            </Field>
            <Field
              id="contribution"
              label="What can you contribute to the community?"
              required
              className="sm:col-span-2"
            >
              <Textarea id="contribution" name="contribution" required />
            </Field>
            <CheckboxGroup
              id="activity"
              name="activities"
              label="Which activities are you most interested in?"
              options={activities}
              required
              className="sm:col-span-2"
            />
          </SectionCard>
          <StepNavigation
            step={3}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(2)}
            onContinue={continueToNextStep}
          />
          </div>
          <div ref={(node) => { stepRefs.current[4] = node }} hidden={currentStep !== 4}>
          <SectionCard
            number={6}
            title="Find your Committee!"
            description="Choose the committee or membership path that suits you, and tell us when you are usually available."
          >
            <CheckboxGroup
              id="committee"
              name="committees"
              label="Are you interested in joining a committee?"
              options={committees}
              required
              className="sm:col-span-2"
            />
            <CheckboxGroup
              id="availability"
              name="availability"
              label="Availability"
              options={availabilityOptions}
              required
              className="sm:col-span-2"
            />
          </SectionCard>
          <StepNavigation
            step={4}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(3)}
            onContinue={continueToNextStep}
          />
          </div>
          <div ref={(node) => { stepRefs.current[5] = node }} hidden={currentStep !== 5}>
          <SectionCard
            number={7}
            title="Document Requirements"
            description={
              isTestMode
                ? "Choose one dummy PDF to test the Drive upload. Do not use real applicant documents."
                : "All three documents are required. Each upload must be one file no larger than 10 MB."
            }
          >
            {isTestMode && (
              <Field
                id="testDocument"
                label="Dummy PDF for Drive upload test"
                required
                hint="Choose a non-sensitive sample PDF, up to 10 MB."
              >
                <Input
                  id="testDocument"
                  name="testDocument"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  className="h-auto cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                  onChange={(event) =>
                    validateUpload(
                      "cv",
                      (file) =>
                        file.type === "application/pdf" ||
                        file.name.toLowerCase().endsWith(".pdf"),
                      "a PDF file"
                    )(event)
                  }
                />
                {fileErrors.cv && (
                  <p role="alert" className="text-sm text-destructive">
                    {fileErrors.cv}
                  </p>
                )}
              </Field>
            )}
            {!isTestMode && (
              <>
            <Field
              id="cv"
              label="Curriculum Vitae (CV)"
              required
              hint={
                <>
                  Use the provided template.{" "}
                  <a
                    href={cvTemplateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    Open CV template
                  </a>
                  . Upload one PDF, max 10 MB.
                </>
              }
            >
              <Input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,application/pdf"
                required
                className="h-auto cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                onChange={(event) =>
                  validateUpload(
                    "cv",
                    (file) =>
                      file.type === "application/pdf" ||
                      file.name.toLowerCase().endsWith(".pdf"),
                    "a PDF file"
                  )(event)
                }
              />
              {fileErrors.cv && (
                <p role="alert" className="text-sm text-destructive">
                  {fileErrors.cv}
                </p>
              )}
            </Field>
            <Field
              id="ovrf"
              label="Photo of OVRF or COE if you have no OVRF"
              required
              hint="Upload one image, max 10 MB."
            >
              <Input
                id="ovrf"
                name="ovrf"
                type="file"
                accept="image/*"
                required
                className="h-auto cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                onChange={(event) =>
                  validateUpload(
                    "ovrf",
                    (file) => file.type.startsWith("image/"),
                    "an image file"
                  )(event)
                }
              />
              {fileErrors.ovrf && (
                <p role="alert" className="text-sm text-destructive">
                  {fileErrors.ovrf}
                </p>
              )}
            </Field>
            <Field
              id="letterOfIntent"
              label="Letter of Intent"
              required
              className="sm:col-span-2"
              hint={
                <>
                  Make an editable copy of the provided template.{" "}
                  <a
                    href={letterTemplateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    Open Letter of Intent template
                  </a>
                  . Upload one PDF or image, max 10 MB.
                </>
              }
            >
              <Input
                id="letterOfIntent"
                name="letterOfIntent"
                type="file"
                accept=".pdf,application/pdf,image/*"
                required
                className="h-auto cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                onChange={(event) =>
                  validateUpload(
                    "letter",
                    (file) =>
                      file.type === "application/pdf" ||
                      file.type.startsWith("image/") ||
                      /\.(pdf|png|jpe?g|gif|webp|bmp|heic|avif)$/i.test(file.name),
                    "a PDF or image file"
                  )(event)
                }
              />
              {fileErrors.letter && (
                <p role="alert" className="text-sm text-destructive">
                  {fileErrors.letter}
                </p>
              )}
            </Field>
              </>
            )}
          </SectionCard>
          <StepNavigation
            step={5}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(4)}
            onContinue={continueToNextStep}
          />
          </div>
          <div ref={(node) => { stepRefs.current[6] = node }} hidden={currentStep !== 6}>
          <SectionCard
            number={8}
            title="Membership Agreement"
            description="All checkboxes are required."
          >
            <fieldset
              aria-required="true"
              className="space-y-3 sm:col-span-2"
            >
              <legend className="text-sm font-medium">
                Please confirm each statement.
              </legend>
              {agreements.map((statement, index) => (
                <label
                  key={statement}
                  htmlFor={`agreement-${index}`}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <input
                    id={`agreement-${index}`}
                    type="checkbox"
                    name="membershipAgreements"
                    value={statement}
                    required
                    className="mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  />
                  <span className="text-sm leading-5">{statement}</span>
                </label>
              ))}
            </fieldset>
          </SectionCard>
          <StepNavigation
            step={6}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(5)}
            onContinue={continueToNextStep}
          />
          </div>
          <div ref={(node) => { stepRefs.current[7] = node }} hidden={currentStep !== 7}>
          <SectionCard
            number={9}
            title="Data Privacy Consent"
            description="Required under the Data Privacy Act of 2012 (RA 10173)."
          >
            <div className="space-y-3 sm:col-span-2">
              <div className="rounded-lg border border-amber-300/70 bg-amber-50/70 p-4 text-sm leading-6 text-amber-950">
                        {registrationOpen &&
                        !isTestMode &&
                        privacyNoticeUrl &&
                        privacyNoticeApproved ? (
                  <>
                    Read the approved{" "}
                    <a
                      href={privacyNoticeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      privacy notice
                    </a>{" "}
                    before providing personal information and documents.
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="font-semibold">
                      {isTestMode
                        ? "TEST MODE — SAMPLE NOTICE, NOT LEGAL CONSENT"
                        : "SAMPLE PRIVACY NOTICE — DRAFT ONLY, NOT APPROVED"}
                    </p>
                    <p>
                      For preview only: Microsoft Student Community – Colegio
                      de Montalban would use the information and documents in
                      this application to review membership requests and contact
                      applicants. Access would be limited to authorized
                      community organizers. Application records and uploaded
                      documents are intended to be stored in restricted Google
                      Sheets and Drive; Cloudflare Turnstile is used for
                      automated-abuse prevention.
                    </p>
                    <p>
                      Before collecting real applications, the organization
                      must specify its approved retention period and privacy
                      contact, and explain how applicants may request access,
                      correction, withdrawal, or deletion of their information.
                      Replace this sample with the organization-approved notice.
                    </p>
                    <p className="font-medium">
                      {isTestMode
                        ? "For this test only, use a full name starting with TEST, an email ending in .invalid, and dummy document files. Test data is written to the separate Applications_Test tab."
                        : "Do not submit real personal information or documents while this sample notice is displayed."}
                    </p>
                  </div>
                )}
              </div>
              <label
                htmlFor="privacyConsent"
                className={`flex items-start gap-3 rounded-lg border border-border p-3 ${
                  registrationOpen ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                <input
                  id="privacyConsent"
                  type="checkbox"
                  name="privacyConsent"
                  value={isTestMode ? "Test acknowledgement" : "I agree"}
                  required
                  disabled={!registrationOpen}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span className="text-sm leading-5">
                  {isTestMode
                    ? "I understand this is a test and I am using fake information and documents only."
                    : "I have read the privacy notice and consent to the collection and use of my application information for membership review."}
                </span>
              </label>
            </div>
            <Field
              id="signature"
              label="Signature or typed full name"
              required
            >
              <Input id="signature" name="signature" autoComplete="name" required />
            </Field>
            <Field
              id="consentDate"
              label="Date"
              required
              hint="Use MM/DD/YYYY format."
            >
              <Input
                id="consentDate"
                name="consentDate"
                type="text"
                inputMode="numeric"
                placeholder="MM/DD/YYYY"
                pattern="(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{4}"
                required
              />
            </Field>
          </SectionCard>
          {registrationOpen && turnstileSiteKey && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm text-muted-foreground">
                Complete the security check before submitting.
              </p>
              <Turnstile
                key={turnstileWidgetKey}
                siteKey={turnstileSiteKey}
                options={{ action: "registration" }}
                onSuccess={(token) => {
                  setTurnstileToken(token)
                  setSubmissionError("")
                }}
                onExpire={() => setTurnstileToken("")}
                onError={() => {
                  setTurnstileToken("")
                  setSubmissionError("The security check could not load. Try again.")
                }}
              />
            </div>
          )}
          <StepNavigation
            step={7}
            totalSteps={applicationSteps.length}
            onBack={() => moveToStep(6)}
            onContinue={continueToNextStep}
            submitDisabled={
              !registrationOpen || isSubmitting || !turnstileToken
            }
            submitting={isSubmitting}
            submitLabel={
              !registrationOpen
                ? "Submissions are not open yet"
                : turnstileToken
                  ? isTestMode
                    ? "Submit test application"
                    : "Submit application"
                  : "Complete security check"
            }
          />
          <p className="mt-3 text-sm text-muted-foreground">
            {isTestMode
              ? "TEST MODE: entries are isolated from real applications. Use fake values and files only."
              : registrationOpen
                ? "Your application and documents will be sent to the restricted registration records."
              : "Nothing entered here is sent or saved. The form will be enabled after the approved privacy notice and secure submission endpoint are ready."}
          </p>
          </div>
        </form>
      </div>
    </PageShell>
  )
}

export default JoinCommunityPage
