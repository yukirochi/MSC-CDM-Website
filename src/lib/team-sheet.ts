const teamSheetCsvUrl =
  "https://docs.google.com/spreadsheets/d/1vMLIjppYbIkIQx35aUwupcmJaE6ei1f0_Xx_gqDjvhw/export?format=csv&gid=644543120"

export type TeamMember = {
  name: string
  position: string
  imageUrl: string | null
  description: string | null
  linkedinUrl: string | null
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let insideQuotes = false

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index]

    if (character === '"') {
      if (insideQuotes && csv[index + 1] === '"') {
        field += '"'
        index += 1
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (character === "," && !insideQuotes) {
      row.push(field)
      field = ""
    } else if (character === "\n" && !insideQuotes) {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else if (character !== "\r" || insideQuotes) {
      field += character
    }
  }

  if (insideQuotes) {
    throw new Error("The officers spreadsheet contains an invalid CSV row.")
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

function parseImageUrl(value: string, rowNumber: number): string | null {
  const imageUrl = value.trim()
  if (!imageUrl) return null

  try {
    const url = new URL(imageUrl)
    if (url.protocol !== "https:") throw new Error()

    if (
      url.hostname === "drive.google.com" ||
      url.hostname === "www.drive.google.com"
    ) {
      const fileId =
        url.searchParams.get("id") ??
        url.pathname.match(/^\/file\/d\/([^/]+)/)?.[1]

      if (!fileId) {
        throw new Error()
      }

      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w640`
    }

    return url.href
  } catch {
    throw new Error(
      `The image link on spreadsheet row ${rowNumber} must be a valid HTTPS URL.`
    )
  }
}

function parseLinkedInUrl(value: string, rowNumber: number): string | null {
  const linkedinUrl = value.trim()
  if (!linkedinUrl) return null

  try {
    const url = new URL(linkedinUrl)
    if (
      url.protocol !== "https:" ||
      (url.hostname !== "linkedin.com" &&
        !url.hostname.endsWith(".linkedin.com"))
    ) {
      throw new Error()
    }

    return url.href
  } catch {
    throw new Error(
      `The LinkedIn link on spreadsheet row ${rowNumber} must be a valid HTTPS LinkedIn URL.`
    )
  }
}

export function parseTeamSheet(csv: string): TeamMember[] {
  const rows = parseCsv(csv)
  const headers = rows[0]?.map((header) =>
    header.replace(/^\uFEFF/, "").trim().toLowerCase()
  )

  if (!headers) {
    throw new Error("The officers spreadsheet is empty.")
  }

  const nameIndex = headers.indexOf("name")
  const positionIndex = headers.indexOf("position")
  const imageIndex = headers.indexOf("image link")
  const linkedinIndex = headers.indexOf("linkedin")
  const descriptionIndex = headers.findIndex((header) =>
    ["role description", "description", "desction"].includes(header)
  )

  if (nameIndex < 0 || positionIndex < 0 || imageIndex < 0) {
    throw new Error(
      'The officers spreadsheet needs "Name", "Position", and "Image Link" columns.'
    )
  }

  return rows.slice(1).flatMap((row, index) => {
    const name = row[nameIndex]?.trim() ?? ""
    const position = row[positionIndex]?.trim() ?? ""
    const image = row[imageIndex]?.trim() ?? ""
    const description =
      descriptionIndex < 0 ? "" : row[descriptionIndex]?.trim() ?? ""
    const linkedin = linkedinIndex < 0 ? "" : row[linkedinIndex]?.trim() ?? ""

    if (!name && !position && !image && !description && !linkedin) return []
    if (!name || !position) {
      throw new Error(
        `Spreadsheet row ${index + 2} needs both a name and a position.`
      )
    }

    return [
      {
        name,
        position,
        imageUrl: parseImageUrl(image, index + 2),
        description: description || null,
        linkedinUrl: parseLinkedInUrl(linkedin, index + 2),
      },
    ]
  })
}

export async function fetchTeamMembers(
  signal: AbortSignal
): Promise<TeamMember[]> {
  const response = await fetch(teamSheetCsvUrl, {
    cache: "no-cache",
    credentials: "omit",
    signal,
  })

  if (!response.ok) {
    throw new Error(
      `Could not load the officers spreadsheet (HTTP ${response.status}). Check its sharing settings.`
    )
  }

  return parseTeamSheet(await response.text())
}
