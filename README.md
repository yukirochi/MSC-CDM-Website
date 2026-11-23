# React + TypeScript + shadcn/ui

Vite app using React, TypeScript, Tailwind CSS v4, and shadcn/ui component aliases.

## Development

```sh
npm install
npm run dev
```

## Add shadcn/ui components

```sh
npx shadcn@latest add card
```

The button component is already installed and can be imported with
`import { Button } from "@/components/ui/button"`.

## Team roster

The Our Team page fetches its roster from the public officers spreadsheet as
CSV whenever the page loads. Keep the headers `Name`, `Position`, `Image Link`,
and `Role Description`; the description header may also be `Description` or
`Desction`. Add profile URLs in the optional `LinkedIn` column to enable the
profile buttons; blank entries show disabled buttons.
Spreadsheet edits appear on a page refresh without a site rebuild. The sheet
must allow anyone with its link to view it. Google Drive photo links are
converted to thumbnail requests and are not shown as clickable links.

## Registration submissions

Registration records and documents use a separate, restricted spreadsheet and
Drive folder. Do not put applicant data in the public officers spreadsheet.
The registration API creates an `Applications` tab and its header row if they
are missing. If the tab already has a header row, it must exactly match the
API's expected columns; submissions fail rather than writing into mismatched
columns. Uploaded files remain private in the configured Drive folder, and the
sheet stores their Drive file IDs.

The Vercel API uses server-side OAuth. Enable the Google Sheets API and Google
Drive API in the same Google Cloud project as the OAuth client. The account
authorized by OAuth must be able to edit the private registration spreadsheet
and upload folder. Keep general access restricted; do not make either resource
public.

The default spreadsheet and folder IDs are the private registration resources
provided for this integration. The corresponding environment variables below
are optional overrides.

Create an OAuth consent screen, enable the Drive and Sheets APIs, and add the
Drive and Sheets scopes used by this integration. Create an OAuth client ID of
type **Desktop app**.
For an External consent screen in Testing status, add the Google account that
will authorize the integration as a test user. From the repository root, run
`node scripts\google-oauth-setup.mjs`, enter the client ID and secret, open the
printed URL, and authorize the account that owns or can edit the registration
spreadsheet and Drive folder. The script prints a refresh token and the
environment-variable names to configure. Keep the output private. This
one-time authorization is for the site backend; applicants do not sign in with
Google.
For local development, put the generated variables in the ignored `.env.local`
as well as the needed Vercel environment scopes.

Set these Vercel environment variables for the API:

| Variable | Value |
| --- | --- |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth client ID; server-side only, never prefix with `VITE_` |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth client secret; store as a Vercel Secret |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | Refresh token from the local setup script; store as a Vercel Secret |
| `REGISTRATION_SHEET_ID` | ID of the private registration spreadsheet |
| `REGISTRATION_DRIVE_FOLDER_ID` | ID of its restricted uploads folder |
| `REGISTRATION_SHEET_TAB` | Optional tab name; defaults to `Applications` |
| `REGISTRATION_TEST_SHEET_TAB` | Optional test tab name; defaults to `Applications_Test` |
| `REGISTRATION_TEST_DRIVE_FOLDER_ID` | Optional separate folder for test uploads |
| `REGISTRATION_ALLOWED_ORIGIN` | Exact website origin, e.g. `https://example.org` |
| `REGISTRATION_TOKEN_SECRET` | Random secret of at least 32 characters |
| `REGISTRATION_ENABLED` | Set to `true` only when submissions are approved |
| `REGISTRATION_PRIVACY_NOTICE_APPROVED` | Set to `true` only after the actual notice is approved |
| `REGISTRATION_TEST_MODE` | Set to `true` temporarily to test with fake data |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |

Generate `REGISTRATION_TOKEN_SECRET` locally with
`node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.
Create a Cloudflare Turnstile widget for the production hostname and use its
site key and secret key in the variables above.

If the Google OAuth consent screen is External and remains in Testing status,
Google may expire refresh tokens after seven days. For a persistent deployment,
publish the consent screen and complete any verification Google requires for
the Drive and Sheets scopes.

For a live production launch, set `VITE_REGISTRATION_ENABLED=true` and
`VITE_PRIVACY_NOTICE_URL` to the approved HTTPS privacy notice, and
`VITE_TURNSTILE_SITE_KEY` to the public site key for a Turnstile widget
configured for the production hostname. Set `VITE_PRIVACY_NOTICE_APPROVED=true`
only after the actual notice is approved. These `VITE_` values are public;
never put credentials in them. The form remains disabled by default. The browser
uploads documents in 1 MB chunks so each request stays within Vercel's
request-size limit; each file is limited to 10 MB.

For a controlled spreadsheet test, set both `REGISTRATION_TEST_MODE=true` and
`VITE_REGISTRATION_TEST_MODE=true`, then redeploy. The test page asks for one
message, a test acknowledgement, and one dummy PDF. It appends a synthetic row
to the separate `Applications_Test` tab, saves the message in the `Motivation`
column, uploads the PDF with a `TEST-` filename prefix, and saves its Drive file
ID in the test row. Set `REGISTRATION_TEST_DRIVE_FOLDER_ID` to use a separate
test folder; otherwise, the configured registration folder is used. Keep
`REGISTRATION_ENABLED` and both notice-approval flags unset. Turnstile and the
Google OAuth variables are still required. Remove test rows and files when
finished, then turn off both test-mode variables.

Do not enable submissions until the privacy notice and consent language are
approved, the production origin and credentials are configured, and the
Turnstile widget is configured. Test the submission flow with non-sensitive
sample data before opening applications. Ensure the approved notice explains
the collection and handling of applicant information, Google Drive/Sheets
storage, and the Cloudflare Turnstile check.

The registration page's current sample privacy notice is for layout review and
test mode only. It is not approval to collect real applicant information. Both
server and website approval flags must remain unset until the organization
replaces it with its approved notice.

## Facebook embed

The homepage uses Facebook's Page Plugin to embed the public Page timeline.
It does not require a Meta app or access token. Facebook controls the embedded
feed's appearance, and the Page must be public and unrestricted for the timeline
to display. Visitors' browser privacy settings or content blockers may also
prevent the embed from loading. See the
[Page Plugin documentation](https://developers.facebook.com/docs/plugins/page-plugin/).
