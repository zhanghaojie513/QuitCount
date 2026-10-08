# Design QA

- Source visual truth path: `C:\Users\haiha\Documents\Codex\2026-06-09\product-design-plugin-product-design-role\outputs\quit-smoking-concept-1-lung-dashboard.png`
- Implementation screenshot path: `C:\Users\haiha\Documents\Codex\2026-06-09\product-design-plugin-product-design-role\work\quit-smoking-prototype\qa\home-final.png`
- Full-view comparison evidence: `C:\Users\haiha\Documents\Codex\2026-06-09\product-design-plugin-product-design-role\work\quit-smoking-prototype\qa\home-comparison.png`
- Viewport: 390 x 844 CSS pixels
- State: Home page, initial inventory, model A1
- Focused region comparison: Not required. The full-view comparison renders the source and implementation at the same readable viewport, including typography, lung asset, metrics, actions, and navigation.

**Findings**

- No actionable P0, P1, or P2 findings remain.
- Typography preserves the source hierarchy: product name, large burden score, summary line, and compact metrics use appropriate optical weights and line heights.
- Spacing and layout rhythm match the source's restrained mobile dashboard. The implementation intentionally replaces the source inventory rows with primary actions and a bottom navigation because the user requested separate feature pages.
- Colors and tokens preserve the pale green base, coral risk tint, dark green action color, and mint status surfaces.
- The implementation uses the same NIH lung image asset as the source visual. Its darker rendering is intentional and driven by the live burden score.
- Copy is adapted from a single-screen concept to the confirmed product structure: Home, Assets, Ledger, and Model.
- Interaction verification passed: taking one cigarette changed the burden score from 42.3 to 47.4, inventory from 17 to 16, and today's count from 4 to 5. Navigation, add-inventory modal, and inventory creation also passed.
- Added daily harm scoring and a post-submit live risk notice. The fifth cigarette is recorded first, then a dismissible notice explains the elevated risk.
- Public evidence anchors: CDC lung cancer risk factor guidance says even a few cigarettes a day or occasional smoking increases lung cancer risk. BMJ 2018 meta-analysis on low cigarette consumption shows one cigarette per day still carries a substantial share of the cardiovascular risk of twenty cigarettes per day.

**Open Questions**

- Medical coefficients remain prototype parameters until authoritative public health datasets and clinical review are selected.
- The "5 cigarettes" threshold is a product intervention threshold, not a medical safety threshold. The UI explicitly says there is no safe cigarette count.

**Implementation Checklist**

- [x] Preserve the selected lung dashboard as the home page.
- [x] Separate inventory, real-cost ledger, and model controls into dedicated pages.
- [x] Implement bottom navigation and independent hash URLs.
- [x] Implement add, take, return, and retire inventory interactions.
- [x] Verify the production build and primary interactions.
- [x] Add day-level harm scoring and a post-submit risk notice when the user crosses the intervention threshold.
- [x] Include evidence-source links on the model page.

**Follow-up Polish**

- P3: Add transition motion between pages and a short lung-color interpolation after inventory events.
- P3: Replace prototype model coefficients with cited, reviewed data definitions.

**Patches Made Since Previous QA Pass**

- Added dedicated Home, Assets, Ledger, and Model pages.
- Added hash navigation, functional inventory actions, add-inventory sheet, and live cost calculations.
- Corrected mobile screenshot normalization for a 390 x 844 comparison.
- Added harm-score banner, evidence box, and a post-submit risk notice for high daily exposure.
- Added a fifth bottom-navigation destination for My, following the asset-management pattern of keeping account and preference controls outside the primary dashboard.
- Added dedicated Settings and Account Sync pages. Account sync is optional because public store listings for 有数 emphasize local/iCloud-style data handling and state that the app does not collect user data.
- Connected the strict-warning setting to the take-cigarette flow and connected prototype sign-in state to the My page.
- Verified the new screens visually at mobile app proportions:
  - `qa/mine-500.png`
  - `qa/settings-500.png`
  - `qa/login-500.png`

**Account Structure Decision**

- My: necessary as the home for personal goals, sync status, model access, settings, and help.
- Settings: necessary because reminders, intervention intensity, export, and privacy are durable user preferences.
- Login: useful only as an optional sync/recovery route. It should not block first use or local recording.
- Bottom navigation: My is primary; Settings and Account Sync remain secondary routes to keep the product focused on the lung dashboard and smoking ledger.

**Navigation And Interaction Refinement**

- Removed Model from the bottom navigation. The bottom bar now keeps only Home, Assets, Ledger, and My.
- Model remains available from My > Hazard Model And Evidence, which better matches an asset-management app hierarchy: evidence and coefficients are personal/data utilities, not a high-frequency tab.
- Help And About is implemented as a modal, not a new page. It carries version updates and suggestions/feedback without adding a low-frequency route.
- Account Sync now supports turning sync off after signing in.
- Quit Goal now opens an editable goal sheet and writes the daily target back to My and Home.
- Home Take One now opens a cigarette selection sheet. The default cigarette from Assets is shown first, while every take can still choose another stock item.
- Product reasoning: a pure default-take button is fastest but risky when users hold multiple brands; a selection sheet is a better prototype default because it prevents accidental cost/harm attribution while preserving the default item as the first choice.

**Verification Added**

- Product-flow QA script: `qa/verify-product-flow.mjs`
- Verified:
  - Bottom nav labels are Home, Assets, Ledger, My.
  - Model is absent from bottom nav and opens from My.
  - Home take action opens the selection sheet and can take stock.
  - Goal editing updates the visible target.
  - Help modal opens and accepts feedback.
  - Sync can be enabled and then disabled.
- Settings QA update: the strict-warning switch toggles the post-submit risk notice after the take-selection flow; take feedback now calls the vibration API once per take when enabled.
- Risk-notice commit rule: the selected cigarette is counted and inventory is deducted before the notice appears. Dismissing the notice never rolls back the successful record.
- Daily review reminder has been upgraded from a visual switch to a functional reminder:
  - The switch writes a persistent `quitSmoking.dailyReviewReminder` localStorage record.
  - Enabled state stores the next 21:30 reminder time; disabled state stores `enabled:false` and clears the next reminder.
  - The app schedules an in-app daily review modal and attempts a system notification when browser permission is granted.
  - QA trigger verified that the daily review modal opens with today's cigarette count, labelled tar, true cost, target status, harm score, and a link to the Ledger.

final result: passed

## Refined Preview QA

- Independent preview entry: `refined.html`.
- Refined visual styles: `src/refined.css`, scoped to `.refined-root` so the original entry remains available.
- 390px screenshots: `qa/refined-home-390.png`, `qa/refined-assets-390.png`, `qa/refined-ledger-390.png`, `qa/refined-mine-390.png`, `qa/refined-warning-390.png`.
- 320px and 500px responsive runs completed with the same four-page navigation and interaction assertions.
- Refined flow script: `qa/verify-refined-flow.mjs`.
- The refined direction uses thin separators and list rows for structure, reserves surfaces for focused summaries and overlays, reduces copy density, and keeps coral limited to risk states.
- Browser flow passed: four bottom-navigation items, secondary-page back navigation, take-sheet ordering, post-submit notice, inventory update, goal edit, feedback submission, and local sync demo.
- Visual feedback pass: restored the original warm gradient background, colored lung stage, light summary cards, rounded surfaces, and compact two-column home actions; reduced stage height on the home page so the undo action remains visible above the navigation bar.

## Gate A Visual Variant Decision

- Gate A keeps the baseline and refined previews available while adding independent `balanced.html`, `rich.html`, and `impact.html` Web entries.
- The variants share `src/App.jsx` for all business state and interaction behavior. `src/variants-main.jsx` selects the entry variant and `src/variants.css` scopes visual differences to the variant root classes.
- Balanced uses enhanced warm, mint, and coral surfaces with moderate cards and motion.
- Rich uses more colorful page-level themes, stronger cards, gradients, and chart emphasis.
- Impact uses a dark, high-contrast hero with dramatic but usable breathing and entrance motion.
- Gate A visual QA must cover each variant's four primary nav items, main pages, secondary pages, take and return flow, goal editing, settings, help/feedback, sync, the post-submit risk notice, and screenshot capture. The capture script is `qa/verify-visual-variants.mjs`.

## Selected Direction / Harmony Gate B

- The user selected `balanced.html` for the Harmony implementation.
- Balanced evidence was regenerated at 320px, 390px, and 500px after adding a stable screenshot wait for entrance motion. All three viewports passed the shared navigation, take/return, secondary-page, goal, settings, help, feedback, and local sync assertions.
- Harmony keeps the balanced palette and four-page information architecture. The native lung stage adds a restrained breathing glow, two expanding rings, and three low-density particles; the effect remains behind the real NIH lung image and is cleaned up when the page disappears.
