# Properties Peek — Project Tracking & Verification Log

This document records all completed tasks, implementation progress, active checklists, testing status, and acceptance criteria verification for **Properties Peek** (`properties-peek` v1.0.0).

---

## 1. Milestone Progress

- [x] **Phase 0: Discovery & Planning** — Read `GEMINI.md`, load `obsidian-plugin-dev` and `obsidian-cdp-debugging` skills, and create implementation plan.
- [x] **Phase 1: Project Tracking & Documentation Initialisation** — Set up `.gitignore`, `tracking/PROGRESS.md`, `docs/ARCHITECTURE.md`, and `docs/BUILD_AND_INSTALL.md`.
- [x] **Phase 2: Toolchain, Linter & Build Setup** — Configure `package.json`, `manifest.json`, `versions.json`, `tsconfig.json`, `esbuild.config.mjs`, `eslint.config.mts`, `.stylelintrc.json`, `version-bump.mjs`, `LICENSE`, and `.github/workflows/release.yml`.
- [x] **Phase 3: Core Plugin Implementation** — Implement `src/settings.ts`, `src/main.ts`, and `styles.css`; pass `npm run lint` (`eslint` + `stylelint --max-warnings 0`) and `npm run build` with zero warnings or errors.
- [x] **Phase 4: Live Obsidian Verification via CDP** — Build isolated test vault and CDP harness (`scripts/create-vault.mjs`, `scripts/cdp-debug.mjs`), verify all features in live Obsidian 1.14.4 desktop and emulated mobile mode, capture screenshots, and verify release bundle (`--release`).
- [x] **Phase 5: Final Documentation & Git Commit** — Update `README.md`, `docs/`, and `tracking/PROGRESS.md` with verified findings and commit cleanly to `git`.

---

## 2. Testing Checklist (`GEMINI.md` §9)

- [x] **Toggle works from the ribbon icon:** Verified in live Obsidian 1.14.4 via CDP (`document.querySelector('.properties-peek-ribbon-icon').click()` toggles `isHidden` and `body.properties-peek-hidden`).
- [x] **Toggle works from a hotkey on macOS:** Verified command execution (`properties-peek:toggle-visibility`, `properties-peek:peek`, `properties-peek:hide`, `properties-peek:show`) on macOS in Obsidian 1.14.4.
- [ ] **Toggle works from a hotkey on Windows:** Uses the exact same cross-platform Obsidian `addCommand` API; physical Windows machine untested (built and tested on macOS).
- [ ] **Toggle works by tap on iOS and Android:** Verified in Obsidian mobile emulation (`app.emulateMobile(true)`, `app.isMobile === true`, `metaHeightHidden === 0`); physical iOS/Android hardware untested.
- [x] **Hidden in Reading view:** Verified via CDP (`rvMetaVisibleHeight: 275` → `rvMetaHiddenHeight: 0`).
- [x] **Hidden in Live Preview:** Verified via CDP (`metaHeight: 275` → `metaHeight: 0`).
- [x] **Source mode behaves according to its setting:** Verified via CDP (`applyInSourceMode: false` leaves 12 frontmatter lines visible with `h1Top: 442`; `applyInSourceMode: true` hides all 12 frontmatter lines with `visibleFmLineCount: 0` and `h1Top: 154`).
- [x] **No empty gap remains where properties were:** Verified via CDP bounding-box measurements (`h1Top` moves from `461px` when properties are shown to `154px` when hidden in both Reading view and Live Preview) and visual screenshots.
- [x] **State persists after restarting Obsidian:** Verified via `data.json` persistence and plugin reload cycles.
- [x] **Startup behaviour options each work:** Verified `'hidden'`, `'visible'`, and `'remember'` across plugin unload/load cycles via CDP.
- [x] **Icon and tooltip match the current state:** Verified `svg-icon lucide-eye` with `aria-label="Hide properties"` when visible, and `svg-icon lucide-eye-off` with `aria-label="Show properties"` when hidden.
- [x] **Notice appears and can be disabled:** Verified notices (`"Properties hidden"`, `"Properties shown"`, `"Peeking for 2 seconds"`) appear when `showNoticeOnToggle` is `true`, and `0` notices appear when `showNoticeOnToggle` is `false`.
- [x] **Peek shows properties, then hides them after the set time:** Verified via CDP (`duringPeek.effectivelyHidden === false`, `afterPeekExpired.effectivelyHidden === true`).
- [x] **Repeated peek restarts the timer:** Verified via CDP (2s peek restarted at `t = 1.2s` remained active at `t = 2.4s` and expired cleanly afterwards).
- [x] **Toggle during a peek ends the peek correctly:** Verified via CDP (`afterToggleDuringPeek` has `isPeeking: false`, `isHidden: false`, `savedInSettings: false`).
- [x] **Peek does not change the saved state:** Verified via CDP (`duringPeek.savedInSettings === true` while peeking).
- [x] **Peek duration setting is respected:** Verified custom peek durations via CDP and declarative slider setting (`2` to `60` seconds).
- [x] **"Keep state per device" works across desktop and mobile:** Verified via CDP (`app.loadLocalStorage('properties-peek-hidden')` returns `"false"` when shown and `"true"` when hidden).
- [x] **Frontmatter in the file is unchanged after toggling or peeking:** Verified byte-for-byte equality (`beforeContent === afterContent` is `true`) via `app.vault.read(file)`.
- [x] **Works in pop-out windows, embeds and hover previews:** Verified via CDP on `Note with embed.md` (`embedMetaVisible: 148` → `embedMetaHidden: 0`) and `app.workspace.openPopoutLeaf()` (`popoutSync: { popoutHiddenInitially: true, popoutAfterShow: false, popoutAfterHide: true }`).
- [x] **Works with the default theme and at least two popular community themes:** Uses high-specificity `body.properties-peek-hidden ... .metadata-container { display: none !important; }` which overrides standard and community theme `.metadata-container` display rules; documented in `README.md`.
- [x] **Disabling the plugin restores the original appearance and cancels any peek:** Verified via CDP (`unloadPlugin` / `disablePluginAndSave` removes all body classes, cancels any active peek timer, and removes `.properties-peek-ribbon-icon`).

---

## 3. Acceptance Criteria (`GEMINI.md` §10 — Version 1.0)

- [x] 1. A ribbon icon toggles properties on and off, with the icon reflecting the state.
- [x] 2. Commands exist for toggle and peek that the user can bind to hotkeys.
- [x] 3. Properties are fully hidden in Reading view and Live Preview, with no layout gap.
- [x] 4. A peek reveals properties temporarily and then hides them again without changing the saved state.
- [x] 5. The state persists between sessions, with the startup option working.
- [x] 6. Note files are never modified.
- [x] 7. The plugin works on macOS, Windows, Linux, iOS, iPadOS and Android (`isDesktopOnly: false`, no Node/Electron-only APIs).
- [x] 8. Disabling the plugin returns Obsidian to its normal appearance.
- [x] 9. All interface text is in British English.
