# Properties Peek

Hide the Properties (YAML frontmatter) block in notes completely with a single click or hotkey, or take a quick temporary "peek" at your properties before they hide again automatically.

---

## Features

- **One-click ribbon toggle:** Quickly switch properties between visible (`eye` icon) and hidden (`eye-off` icon) across all open panes and pop-out windows.
- **Temporary peek:** Reveal properties for a configurable duration (default 5 seconds, from 2 to 60 seconds) while keeping your saved state hidden.
- **Purely visual & non-destructive:** Note files are never modified. Your frontmatter remains intact for Dataview, Bases, search, graph view, and other plugins, and Obsidian's built-in *Properties in document* setting is never altered.
- **Works across views:** Hides properties seamlessly with zero layout gap in **Reading view**, **Live Preview**, embedded notes, hover previews, and optionally **Source mode**. The dedicated Properties side-panel remains unaffected.
- **Flexible persistence:** Remember your last chosen state across restarts, force properties to start always hidden or always visible, or keep state separate per device when syncing your vault between desktop and mobile.
- **Cross-platform:** Works on macOS, Windows, Linux, iOS, iPadOS, and Android.

---

## Commands & Hotkeys

Open **Settings → Hotkeys** and filter by **Properties Peek** to assign your preferred keyboard shortcuts (stored per device by Obsidian) or add commands to the mobile toolbar:

| Command | Behaviour |
|---|---|
| **Toggle properties visibility** | Switches between hidden and visible. If run during an active peek, ends the peek and leaves properties visible. |
| **Peek at properties** | Temporarily reveals hidden properties for the configured duration, then hides them again automatically. Running it again during a peek restarts the timer. |
| **Hide properties** | Explicitly hides properties (and cancels any active peek). |
| **Show properties** | Explicitly reveals properties (and cancels any active peek). |

---

## Settings

| Setting | Default | Description |
|---|---|---|
| **Show ribbon icon** | On | Adds or removes the ribbon icon. |
| **Show notice on toggle** | On | Displays a short on-screen message when toggling or peeking. |
| **Startup behaviour** | Remember last state | Choose between *Remember last state*, *Always hidden*, or *Always visible* when Obsidian opens. |
| **Peek duration** | 5 seconds | How long a temporary peek lasts (2 to 60 seconds). |
| **Apply in source mode** | Off | Also hide raw YAML frontmatter lines in source mode. |
| **Keep state per device** | Off | When enabled, desktop and mobile remember their own visibility state rather than sharing one through vault sync. |

---

## Compatibility & Edge Cases

- **Themes & CSS snippets:** Works out of the box with the default theme and popular community themes. Heavily customised themes or snippets that override `.metadata-container` with custom display rules may warrant testing.
- **Dataview & Bases:** Inline query blocks rendered by Dataview or Bases are not YAML frontmatter blocks and remain visible.
- **Unloading or disabling:** Disabling the plugin immediately removes all CSS markers, cancels any active peek timer, and restores your original appearance.

---

## Installation

### Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release (or build from source with `npm install && npm run build`).
2. Copy those three files into `<your-vault>/.obsidian/plugins/properties-peek/`.
3. Reload Obsidian and enable **Properties Peek** under **Settings → Community plugins**.

---

## Privacy & Disclosures

- **Network use:** None. Properties Peek runs entirely offline.
- **File access:** None. No note files or files outside the vault are ever modified.
- **Telemetry & accounts:** None.

---

## Licence

Released under the [Zero-Clause BSD (0BSD) Licence](LICENSE).
