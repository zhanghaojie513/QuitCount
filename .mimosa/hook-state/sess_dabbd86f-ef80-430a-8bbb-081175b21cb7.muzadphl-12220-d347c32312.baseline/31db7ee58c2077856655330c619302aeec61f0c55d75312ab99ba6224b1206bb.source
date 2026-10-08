# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Refined Preview Decisions

- The refined Web preview is an independent entry at `/refined.html`; the default `/` entry and `src/styles.css` remain the original baseline.
- The refined mobile direction treats the product as a quiet personal health ledger: warm white and pale green surfaces, forest green for primary actions, coral only for risk states, and restrained 8–12px radii.
- Home, Assets, Ledger, and Mine keep four bottom-navigation destinations. Lists and thin separators carry structure; large cards are reserved for focused summaries, forms, and overlays.
- The refined preview reuses the existing App state, seeded data, hash navigation, lucide icons, and demo interactions. It does not introduce a backend, network service, or dependency.
- A high-risk take is committed to inventory and ledger first, then displays a dismissible live risk notice. Dismissing the notice never rolls back a successful record.
- Visual feedback: the refined version must preserve the original preview's warm gradient background, colored stage, and light summary cards; restraint means reducing density and chrome without flattening the visual atmosphere.

## Gate A Visual Variant Decision

- Gate A adds three independent Web preview entries: `balanced.html`, `rich.html`, and `impact.html`.
- All three entries use `src/variants-main.jsx` and the same `src/App.jsx` state, hash navigation, and interactions. Variant styling is isolated in `src/variants.css` with `.variant-balanced`, `.variant-rich`, and `.variant-impact` root scopes.
- Balanced is the default comparison direction: warm and mint surfaces, coral risk states, moderate card treatment, and restrained entrance motion.
- Rich increases visual energy with colorful page themes, stronger summary surfaces, gradient cards, and an animated ledger chart.
- Impact uses a dark, high-contrast treatment with a luminous hero, coral risk emphasis, and more dramatic but short, usable motion.
- `index.html`, `src/main.jsx`, `src/styles.css`, `refined.html`, and `src/refined.css` remain available and unchanged. The three variants share business behavior but use independent entry markup.

## Selected Harmony Sync Direction

- The user selected `balanced.html` for the Harmony implementation: warm paper and mint surfaces, coral risk states, moderate cards, forest-green actions, and restrained motion.
- Harmony synchronization keeps the four destinations and existing local-first behavior. The lung stage may add native breathing rings and low-density particles when they clarify the live burden state.
