# Design questions and decisions

Things in the Figma file (`CqYtGTafIxJo5rfRSa6AbJ`, page "Around Jobs") that were unclear
or could not be matched exactly with the published tokens. Each item records what the
code does today so a designer can confirm or correct it.

## Tokens and text styles

- **Salary badge text `#07964e` is not a token.** "Around / Jobs / Badge" type Salary
  (1888:42346) uses a raw hex. The code uses `text-success-700` (`green-700`, `#239148`),
  the closest published success colour.
- **Orange badges and banners use the `secondary` scale.** Figma binds "Unverified" and
  the warning banner to `orange/orange-50` and `orange/orange-600`; those primitives are
  exposed as `secondary-50` and `secondary-600`.
- **Max text size is 24px.** The job page title used `display-32`; it now uses
  `heading-semibold` on phones and `display-small-semibold` (24px) from tablet up.

## Map overlays (S01–S05)

- **Panel heights.** S01/S02/S04 panels fill the map height (24px inset); S03 (726px)
  and S05 (544px) are cut at arbitrary heights. Every panel fills the available height
  and scrolls internally.
- **Two Map/List toggles in S03.** The top-right toggle still shows "Map" while the
  panel's toggle shows "List". Both are kept in sync (List is active while the Jobs List
  panel is open); choosing Map in either closes the panel.
- **What counts as a "filter".** S05 shows "Filters (2) · 2 filters applied" with Retail,
  Full-time and On-site selected, so categories are not counted. The badge and the
  removable chips count experience, employment type, work mode, salary and "More filters"
  options only.
- **Salary slider range.** Figma shows "₹10,000 – ₹50,000 / month" with both handles
  inset. The slider spans ₹0–₹60,000 in ₹1,000 steps, and the full span means "no salary
  filter". Jobs with an undisclosed salary still match a salary range unless "Salary
  disclosed" is on.
- **Experience buckets vs badges.** Filters use Fresher / 1–3 / 3–5 / 5+ yrs, while cards
  show ranges like "0–2 yrs". A job matches a bucket when its range overlaps it.
- **"Posted in 24h" vs "Last 7 days".** Treated as mutually exclusive options.
- **"Search this area" (Empty area state).** There is no server search yet, so the button
  flies the map to the nearest matching jobs.
- **Jobs List contents.** The list shows matching jobs inside the visible map area plus
  all matching remote jobs ("Remote jobs are listed but not shown on the map").
- **Employer panel job list.** Shows all open jobs at the employer regardless of map
  filters; the map pin count reflects the filters.
- **"Multiple branches" employer variant** (1889:42132) needs a brand/branch model that
  the sample data doesn't have yet. Not built.
- **Gallery photos.** There are no photos in the design, so the 240px header is a
  grey placeholder with a working counter ("1 / 8", Sample).
- **Job Detail location map.** Figma shows a 120px grey "Map placeholder"; the code
  renders a real non-draggable map with a plain pin, since the photo marker would be
  clipped at that height.
- **Expired / Closed footers.** Figma shows disabled grey buttons ("Applications
  closed" / "Position closed"); these use `bg-grey-100` + `text-text-disabled`.
- **Loading / error states** have no trigger in a static prototype. They can be
  previewed with `/?view=list&state=loading` and `/?view=list&state=error`, and loading
  shows while a search is being applied.

## Login and Complete Profile

- **Auth is mocked.** Phone + OTP happens in the browser (`src/lib/auth-store.ts`); the
  Sample OTP is `123456` and is shown under the OTP boxes. Three wrong attempts lock
  the code until "Resend OTP".
- **Logged-out avatar.** Figma only shows the "N" avatar. Logged out, the top bar shows
  a "Log in" button in that slot; logged in, the avatar shows the user's initial and
  opens a small account menu (not in Figma).
- **What needs login.** Apply, save job and save employer open the Login popup with a
  reason line, then finish the action after login. Saved items and applications are
  per user, so logged out the app shows none.
- **When Complete Profile shows.** Right after the first login if there is no name yet.
  "Skip for now" (or closing) doesn't ask again; it can be reopened from the account
  menu.
- **Resume upload.** Only the file name is kept (on the device). There's no upload
  endpoint yet.
- **"Verify" button.** It stays disabled until all six digits are entered; Figma shows
  it enabled with three digits.

## My applications and Saved

- **Desktop frames are 1440 wide.** The list + 400px preview layout (and the 3-column
  Saved grid) start at 1280px (`min-[80rem]:`, `breakpoints.split`). Between 768 and
  1280 the list is a single column and tapping a card opens the preview as a popup,
  because a 400px preview next to the list doesn't fit beside the sidebar at tablet
  width. Phones get the same popup as a bottom sheet.
- **Status groups.** Chips are All, Applied, Viewed, Shortlisted, Interview and Closed.
  "Closed" collects applications the employer turned down ("Not selected", red pill)
  and applications whose job closed or expired (grey "Closed" pill). Figma doesn't
  show either pill.
- **Selected card border.** Figma uses a 2px brand border; the code draws a 1px
  border plus a 1px ring so the card doesn't shift when it's selected.
- **Stepper on phones.** The four labels don't fit a 412px card, so below a 320px card
  width only the current step keeps its visible label (the rest stay for screen
  readers).
- **Update dots.** Figma shows brand dots for employer updates and a grey dot for
  "Application sent"; the code follows that and uses a red dot for "Not selected".
- **Preview description.** Figma shows a one-line role summary; the code shows the job
  summary clamped to three lines.
- **Message employer** opens a mock message popup ("Sample chat"); nothing is sent.
  It's hidden when the application or the job is closed.
- **Map thumbnail.** A grey 120px placeholder as in Figma; it links to the employer
  on the map.
- **Saved filters.** "Nearby" = within 4 km of the searched location (Shankar Nagar).
  "Recently added" = saved in the last 3 days, so the store now keeps a saved date.
  "Expiring soon" = applications close within 7 days.
- **Saved tile actions.** "Apply" turns into "View application" when already applied,
  and into the disabled closed/expired button for jobs that stopped hiring.
- **Logged out.** Both pages show a login prompt in the empty-state layout (not in
  Figma).

## Mobile pass (M00–M20)

- **Tab bar.** M00 shows four tabs around a raised "+" button. The "+" goes to Post a
  job. Profile is a fifth destination that only exists on phones; on tablet and desktop
  it lives in the account menu.
- **Search.** The phone search bar sits on the map (M00), so the desktop top bar is
  hidden below 768px. M00's "24 jobs near Pandri" uses the searched area instead
  ("near Shankar Nagar"), matching the desktop location pill.
- **Sheets.** Employer opens as a half sheet that drags up to full (M01). Job detail
  and Filters open full height and cover the tab bar (M02, M04). The list sheet keeps
  the tab bar (M03). Dragging the handle down closes a sheet.
- **Tablet chips.** Next to an open panel there isn't room for the six category chips,
  so they scroll sideways in one row from 768px up. On phones they wrap, as in M00.
- **Login and Complete profile** are full-screen pages on phones (M05–M07) and stay as
  centred popups from 768px up. Back on the OTP screen goes to "Change number".
- **Apply flow.** M08–M14 become a real route (`/apply/[jobSlug]`) at every size: full
  screen on phones, a 560px card beside the sidebar from 768px. The job pages, map
  panel and Saved tiles all link to it. Figma doesn't show a desktop apply flow.
- **Apply fields.** Phone is the login number and read-only. Email is optional (Figma
  doesn't mark it). Total experience is free text so "Fresher" works. Highest
  education is a native select. Skill chips come from the job's skills plus any added
  with "+ Add".
- **Apply review.** "Edit" jumps to that step, and its button reads "Save and review"
  to return. Submitting fails with a banner when the browser is offline (mock error
  state, not in Figma).
- **Resume size.** A profile resume has no real file, so the review and resume card
  show a sample 240 KB.
- **My applications on phones.** Cards switch to M15's compact layout with a
  four-segment bar. Tapping a card below 1280px opens `/applications/[jobSlug]` (M16)
  instead of the preview popup. "View application" links there at every size.
- **Status chips on phones.** M15 and M18 disagree (M15 has status chips with counts,
  M18 has All/Active/Closed tabs and "Submitted"/"Interviewing" pills). The code keeps
  one set: the desktop chips and pill labels and colours, with "Withdrawn" added as a
  grey pill in the Closed group. M16's orange "Under review" pill also uses the
  standard Viewed pill.
- **Application timeline.** M16's five steps end in "Decision", which shows "Not
  selected", "Withdrawn" or "Job closed" when relevant. Sample dates get "(Sample)".
- **Withdraw.** The application stays in the list as "Withdrawn" (M18), and the job can
  be applied to again. The success banner shows once after withdrawing. The resume
  "View" opens a note, since the Sample app keeps no file.
- **Profile (M20).** The name is whatever the person entered; Figma's "Sample ·" prefix
  is not added to it. The resume row says "saved on this device" because no updated
  date is stored (Figma says "updated 3w ago"). Job preferences also stores categories,
  which M20 shows and Complete profile does not ask for. Notifications and Language are
  sample dialogs. Help includes a mailto link. Phones still use this column. Desktop
  now follows the later P01–P05 frames instead.

## Finalized job-seeker web (Nov 2026)

- **Search placeholder.** The brief asked for "Search jobs, companies, or skills...".
  S00, S04, S16 and the profile frames all say "Search places, restaurants, events, offers...".
  The frames win.
- **Profile name.** Every job-seeker surface uses "Nishan Kumar Mondal", including
  the basic-info form, resume filename and LinkedIn URL.
- **Sidebar.** Desktop nav is Jobs, Applied, Saved, Profile. "Post a job" moved to the
  top bar and only shows while logged out (S00). Logged-in frames omit it.
- **Location menu (S04).** Selected row uses `bg-primary-50`. The frame's fill is `#edf2ff`,
  which is not a token, so the row stays on the primary-50 token. Row radius is `rounded-md`
  (12px). The frame uses 10px, which is not a radius token.
- **Filter count.** Categories are not counted. S04 and S06 with Retail, Full-time and
  On-site show Filters 2 (`?category=Retail&type=FULL_TIME&mode=ON_SITE`). Category chips
  stay in their own row. S00 and S03 open with the Retail chip selected.
- **Account menu destinations.** Profile settings opens `/profile`. Job alerts opens `/alerts`.
  The frames do not include a job-alerts screen, so that page is only the empty state
  "You don't have any job alerts yet." Help & support uses `mailto:support@around.jobs`.
- **Saved jobs (S17).** Four cards show "Expiring soon" (the first four). The header
  counts those badges. The six cards are the frame's Site Supervisor / Raipur Builder
  set. Nearby is the first three cards and Recently added is the first two. The salary
  line stays on one line at 1280.
- **P02e second education** uses the filled Add education dialog (Diploma, Government
  Polytechnic, Raipur), because that frame was the source for the extra card.
- **P03c third experience** is Civil Engineering Intern at Public Works Department, Raipur.
- **P03f, P02 upload error, P05 remove-photo, and P03b field errors** use the sentences
  from the finalized frames.
- **P05-02 to P05-04** show `/images/profile-photo.jpg`.
- **S01 / S02** use the Raipur Builder employer panel and Civil Engineer detail
  (`/?company=raipur-builder`, `/?job=civil-engineer`). The live October jobs stay on
  the map and on mobile sheets.
- **S03 / S06** desktop lists use the frame cards. "(Sample)" is stripped from
  "Raipur Builder". The list says 24 jobs and shows the five cards in the frame.
- **S17** cards are Site Supervisor at Raipur Builder. Layer names in Figma
  (Barista, Sales associate, and so on) do not match the visible titles, so the
  visible titles win. Four of the six cards show the expiring badge.
- **Map.** Leaflet markers and the cluster count are live data, not the static
  frame (cluster 12, labels that still say Sample in Figma). The basemap is Esri
  World Street Map (coloured streets, keyless, any domain). Zoom is capped at the
  last real tile (17); 18+ is Esri's "map data not yet available" placeholder.
  CARTO Voyager and Positron stamp "API KEY REQUIRED". Stadia Alidade Smooth is
  used only when `NEXT_PUBLIC_STADIA_API_KEY` is set and no tile URL override is.
- **Salary green.** The salary badge uses `text-success-700` (`Badge type="salary"`).
  Figma paints that label `#07964e`, which is not a token.
- **Job detail variants** (fetched): applied (1889:42721) banner "You applied on 12 Oct 2026"
  and button "View application"; closed (1896:12936) banner "This job is closed. The employer
  is no longer hiring for this role." and button "Position closed"; remote (1896:12970)
  salary "Salary not disclosed", mode and area "Remote", address and map placeholder kept,
  button "Apply now". The closed symbol is a Store Sales Associate panel; the Civil Engineer
  route keeps that banner and button on the Civil Engineer body. Expired stays
  "This job is no longer accepting applications." / "Applications closed".
- **Empty employer** (1889:42351): "No open jobs right now" / "This employer has no active
  openings. Save them to see new jobs here."
- **Building marker** (1896:13455) is the pill with the building glyph, count and orange
  anchor, shown on `/states`. It is not the company photo pin.
- **Resume "too large"** (2105:25466, re-checked): the node does contain
  "File is larger than 5 MB. Upload a smaller file." The line stays. The filename in
  Figma is Resume_Rahul_Sharma.pdf; the seeker name stays Nishan Kumar Mondal.
- **P02c / P02f.** Add certification (filled, including Credential URL) is
  `/profile?section=skills&dialog=add-certification`. Edit education is
  `/profile?section=skills&dialog=edit-education`.
- **P05-04** closes the photo dialog, shows the uploaded avatar, and the toast
  "Profile photo updated successfully." **P05-07** (`photo=removed`) opens
  Change profile photo. **S05** keeps the Filters button and docks the panel above it.
- **Map tiles.** Default is Esri World Street Map. `NEXT_PUBLIC_STADIA_API_KEY` still
  switches the basemap to Stadia Alidade Smooth.
- **Apply and applications (S11–S15)** were not restyled.
