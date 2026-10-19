# GEMINI.md — Properties Peek (Obsidian Plugin)

This document serves as the primary context, specification, and operational rulebook for AI agents and developers working on the **Properties Peek** Obsidian plugin.

---

## 0. Agent & Repository Rules

1. **Documentation (`docs/`):**
   - Maintain a `docs/` directory so developers can clearly understand **how** code, architecture, and features were generated and designed.
   - Document technical decisions, state flow, CSS selector strategies, and build/installation instructions inside `docs/`.
2. **Project Tracking (`tracking/`):**
   - Maintain a `tracking/` directory to record all currently ongoing tasks, implementation progress, active checklists, testing status, and acceptance criteria verification.
   - Update `tracking/` whenever starting, modifying, or completing work items.
3. **Version Control (`git`):**
   - Ensure the repository is initialised with `git init` and keep changes cleanly tracked.
4. **Language & Localisation:**
   - **British English** must be used for all user-facing text, notices, tooltips, settings labels, descriptions, and documentation (for example: *colour*, *customise*, *behaviour*).
5. **Safety & Architecture Constraints:**
   - **Never modify note files.** Hiding properties must be purely visual via a CSS marker class on the document body.
   - **Cross-platform compatibility:** Must work identically across macOS, Windows, Linux, iOS, iPadOS, and Android (`"isDesktopOnly": false`). Avoid Node-only or desktop-only APIs.
   - **Non-destructive:** Do not alter Obsidian's built-in *"Properties in document"* setting. Disabling or unloading the plugin must cleanly remove all markers, timers, and UI elements.

---

## 1. Overview

- **Plugin name:** Properties Peek
- **Plugin ID:** `properties-peek`
- **Purpose:** Let the user hide the Properties (YAML frontmatter) block in notes completely, so notes look as if they have no properties. The user can switch it back on with one tap or key press, or take a quick temporary "peek" at the properties before they hide again.
- **Platforms:** Cross-platform: macOS, Windows, Linux, iOS, iPadOS and Android.
- **Language:** British English for all user-facing text (for example "colour", "customise", "behaviour").

### Problem statement
Obsidian's built-in setting (Settings → Editor → Properties in document → Hidden) hides properties, but:
- there is no ribbon icon for it,
- there is no one-key toggle,
- there is no quick way to glance at properties and have them hide again,
- it must be changed through the settings menu each time.

This plugin removes that friction on desktop and mobile.

---

## 2. Goals and non-goals

### Goals
- One-click toggle from the ribbon.
- A command-palette command that can be bound to any hotkey.
- A temporary "peek" that reveals properties for a short time, then hides them again.
- Properties hidden in **both** Reading view and Live Preview (editing mode).
- The hidden state is purely visual. No note content is ever modified.
- The chosen state persists across restarts.
- Works the same way on desktop and mobile.

### Non-goals
- Editing, creating or deleting properties.
- Per-property or per-folder filtering (possible later, see section 11).
- Changing how Obsidian stores or parses frontmatter.
- Publishing to the community directory in the first version.

---

## 3. Feature list

### 3.1 Ribbon icon
- A single icon in the ribbon.
- **Icon states:**
  - Properties visible: an `"eye"` icon.
  - Properties hidden: an `"eye-off"` icon.
- The icon updates immediately when the state changes.
- **Tooltip text (desktop):** `"Hide properties"` when visible, `"Show properties"` when hidden.
- Clicking or tapping toggles the state.
- The user can hide the icon through Obsidian's own ribbon settings, so no extra setting is required for this (though a toggle is also provided in plugin settings; see section 4).

### 3.2 Commands and hotkeys
- **"Toggle properties visibility":** switches between hidden and visible.
- **"Peek at properties":** temporarily reveals properties, then hides them again automatically (see 3.3).
- Optional explicit commands: **"Hide properties"** and **"Show properties"**.
- No default hotkeys are assigned, which avoids conflicts. The user assigns them in Settings → Hotkeys.
- Hotkeys are stored per device by Obsidian, so macOS (Cmd), Windows (Ctrl) and iPad keyboards can each use different shortcuts.

### 3.3 Peek behaviour
- Only has an effect while properties are hidden. If they are already visible, the command does nothing, or shows a notice.
- Reveals properties for a set time (default 5 seconds, configurable from 2 to 60 seconds).
- Hides them again automatically when the time runs out, then returns to the hidden state.
- Running the peek command again during a peek restarts the timer.
- Running the toggle command during a peek ends the peek and leaves properties visible.
- Peek never changes the saved state. After a peek, the saved state is still "hidden".

### 3.4 Hiding behaviour
- When hidden, the Properties block disappears in:
  - Reading view,
  - Live Preview,
  - Source mode (optional, see settings).
- The note layout closes up with no empty gap where the block was.
- When shown, Obsidian's normal Properties display is restored exactly as the user's own settings define it.
- Frontmatter remains in the file and stays available to Dataview, Bases, search, graph and all other plugins.
- The Properties side panel is unaffected unless the user chooses otherwise.

### 3.5 Persistence
- The last chosen state (hidden or visible) is saved and restored on startup.
- The state is stored in the plugin's own data file inside the vault.
- A "startup behaviour" setting can override the remembered state (see section 4).
- Because the data file lives in the vault, syncing the vault carries the state to other devices. A setting controls whether state is shared or kept per device (see section 4).

### 3.5a Feedback
- A brief on-screen notice when toggled or when a peek starts, for example `"Properties hidden"`, `"Properties shown"` or `"Peeking for 5 seconds"`.
- The notice can be turned off in settings.

### 3.6 Compatibility with the built-in setting
- The plugin must **not** change Obsidian's own "Properties in document" setting.
- It layers on top of whatever the user has configured. Disabling the plugin restores the original appearance fully.

---

## 4. Settings page

| Setting | Type | Default | Description |
|---|---|---|---|
| Show ribbon icon | Toggle | On | Adds or removes the ribbon icon |
| Show notice on toggle | Toggle | On | Displays a short message when the state changes |
| Startup behaviour | Dropdown | Remember last state | Options: Remember last state, Always hidden, Always visible |
| Peek duration | Slider | 5 seconds | How long a peek lasts (2 to 60 seconds) |
| Apply in Source mode | Toggle | Off | Also hide raw frontmatter in Source mode |
| Keep state per device | Toggle | Off | When on, desktop and mobile remember their own state rather than sharing one through vault sync |

Settings text uses British English and plain, short descriptions.

---

## 5. User flows

1. **First run:** the user enables the plugin. The ribbon icon appears with the eye icon, and properties are visible as normal.
2. **Hide via ribbon:** the user clicks or taps the icon. Properties vanish across all open notes, the icon changes to eye-off, and a notice appears.
3. **Peek via hotkey or command:** the user runs "Peek at properties". Properties appear for the configured time, then hide again by themselves.
4. **Show via hotkey:** the user presses their toggle shortcut. Properties return and stay visible, and the icon changes back.
5. **Restart:** Obsidian reopens. The plugin applies the saved or configured startup state before notes finish rendering, to avoid a flash of visible properties.
6. **Disable plugin:** the user switches it off in Community plugins. All hiding is removed and the ribbon icon disappears.

---

## 6. Platform notes

### Desktop (macOS, Windows, Linux)
- Ribbon icon with hover tooltip.
- Hotkeys assigned per device in Settings → Hotkeys.
- Pop-out windows follow the same state.

### Mobile and tablet (iOS, iPadOS, Android)
- The ribbon icon is reached through the mobile ribbon menu. Confirm the exact path during testing.
- Commands are available through the command palette, and can be added to the mobile toolbar by the user.
- iPads with a keyboard can use hotkeys as on desktop.
- No feature may depend on hover. Everything must work with a tap.
- Tap targets and notices must be readable on small screens.
- The manifest must **not** be marked desktop-only.

---

## 7. Technical approach

- The plugin applies a single marker on the application's main body when hiding is active. A bundled stylesheet hides the properties block whenever that marker is present.
- Toggling means adding or removing the marker, which is instant and applies to every open pane at once.
- A peek temporarily removes the marker and uses a timer to restore it. The timer must be cancelled cleanly on plugin unload, on toggle and on repeat peeks.
- No note files are read, written or parsed, which keeps the plugin fast and safe, including on mobile.
- The ribbon icon and commands are registered through Obsidian's standard plugin interfaces so they are cleaned up automatically on unload.
- Settings and the saved state are stored through Obsidian's standard plugin data storage.
- Avoid desktop-only features and Node-only modules so the same build runs on every platform.

### Planned files
- `manifest.json` (plugin name, unique ID, version, minimum Obsidian version, author, `isDesktopOnly: false`)
- `src/main.ts` / `main.js` (main plugin logic)
- `styles.css` (stylesheet containing the hiding rules)
- `README.md` (user documentation)
- `docs/` (developer documentation explaining how code was generated and structured)
- `tracking/` (ongoing work, testing checklists, and milestone tracking)

### Targets
- Minimum Obsidian version: confirm against the current release when building, since the Properties UI changed across versions.

---

## 7a. Build and install notes

1. Install Node.js.
2. Start from Obsidian's official sample plugin template.
3. Build the plugin to produce the compiled main file (`main.js`).
4. Copy the plugin folder into the vault's plugins directory (inside the hidden `.obsidian` folder).
5. In Obsidian, enable it under Settings → Community plugins.
6. For development, reload Obsidian (or use a hot-reload helper plugin) after each change.
7. To test on mobile, sync the vault (with its plugin folder) to the device, or use a beta installer.

---

## 8. Edge cases and rules

- **Notes with no properties:** nothing to hide, so no visual change.
- **Theme or snippet conflicts:** some themes restyle properties. The hiding rule must be strong enough to win over common themes, and the README should note that heavily customised themes may need testing.
- **Other plugins that render properties** (for example Dataview or Bases output): these are not frontmatter blocks and are not hidden.
- **Canvas, embeds and popovers:** hiding should also apply to embedded notes and hover previews. If this proves unreliable, document it as a known limitation.
- **Flash on startup:** apply the saved state as early as possible in load.
- **Multiple windows:** pop-out windows should follow the same state.
- **Peek timer:** must never leave properties stuck visible or hidden after unload, a note switch or a repeated command.
- **Sync conflicts:** if the saved state differs between devices, the most recent write wins. The "keep state per device" setting avoids this.
- **Plugin unload:** always remove the marker, cancel any peek timer and remove the ribbon icon cleanly.

---

## 9. Testing checklist

- [ ] Toggle works from the ribbon icon.
- [ ] Toggle works from a hotkey on macOS.
- [ ] Toggle works from a hotkey on Windows.
- [ ] Toggle works by tap on iOS and Android.
- [ ] Hidden in Reading view.
- [ ] Hidden in Live Preview.
- [ ] Source mode behaves according to its setting.
- [ ] No empty gap remains where properties were.
- [ ] State persists after restarting Obsidian.
- [ ] Startup behaviour options each work.
- [ ] Icon and tooltip match the current state.
- [ ] Notice appears and can be disabled.
- [ ] Peek shows properties, then hides them after the set time.
- [ ] Repeated peek restarts the timer.
- [ ] Toggle during a peek ends the peek correctly.
- [ ] Peek does not change the saved state.
- [ ] Peek duration setting is respected.
- [ ] "Keep state per device" works across desktop and mobile.
- [ ] Frontmatter in the file is unchanged after toggling or peeking.
- [ ] Works in pop-out windows, embeds and hover previews.
- [ ] Works with the default theme and at least two popular community themes.
- [ ] Disabling the plugin restores the original appearance and cancels any peek.

---

## 10. Acceptance criteria (version 1.0)

1. A ribbon icon toggles properties on and off, with the icon reflecting the state.
2. Commands exist for toggle and peek that the user can bind to hotkeys.
3. Properties are fully hidden in Reading view and Live Preview, with no layout gap.
4. A peek reveals properties temporarily and then hides them again without changing the saved state.
5. The state persists between sessions, with the startup option working.
6. Note files are never modified.
7. The plugin works on macOS, Windows, Linux, iOS, iPadOS and Android.
8. Disabling the plugin returns Obsidian to its normal appearance.
9. All interface text is in British English.

---

## 11. Future ideas

- Hide only selected properties (a user-defined list of property names).
- Hide properties only on notes matching a folder, tag or CSS class.
- A per-note override through a special property or CSS class.
- A status bar indicator showing the current state (desktop).
- A "hold to peek" interaction on desktop.
- Submission to the community plugin directory with a full README and screenshots.
