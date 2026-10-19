# Properties Peek — Build, Lint, Debugging & Installation Guide

This guide explains how to build, lint, test, and install **Properties Peek** (`properties-peek`) across desktop and mobile platforms.

---

## 1. Prerequisites

- **Node.js:** v22 LTS (for example `/opt/homebrew/opt/node@22/bin/node` on macOS Apple Silicon).
- **Obsidian:** Version `1.11.4` or newer (tested against Obsidian `1.14.4`).

---

## 2. Building & Linting

Install dependencies:

```sh
npm install
```

### Production Build
Runs the TypeScript type-checker (`tsc -noEmit -skipLibCheck`) and bundles `src/main.ts` into a minified `main.js` targeting `es2021` (for iOS/iPadOS WebKit compatibility):

```sh
npm run build
```

### Development Watch Mode
Watches `src/` and rebuilds `main.js` with inline sourcemaps on every change:

```sh
npm run dev
```

### Linting (ESLint + Stylelint)
Runs both `eslint` (with `eslint-plugin-obsidianmd` recommended rules) and `stylelint` (with `stylelint-no-unsupported-browser-features` targeting Chrome 138 and zero warnings allowed):

```sh
npm run lint
```

---

## 3. Automated Live Obsidian Verification (CDP)

The repository includes an isolated Chrome DevTools Protocol (CDP) test harness in `scripts/` that launches a separate Obsidian instance with its own `--user-data-dir` and scratch vault (`dev/scratch/`), never touching your personal Obsidian profile or vaults.

1. **Create the template test vault (`dev/testvault`):**
   ```sh
   npm run vault:create
   ```
2. **Launch isolated Obsidian with CDP on port `9222`:**
   ```sh
   npm run debug:launch
   ```
   *(To test only the release artefacts `main.js`, `manifest.json`, and `styles.css`, run `npm run debug:launch -- --release`).*
3. **Inspect status, evaluate expressions, reload, or capture screenshots:**
   ```sh
   npm run debug -- status
   npm run debug -- reload
   npm run debug -- eval "app.commands.executeCommandById('properties-peek:toggle-visibility')"
   npm run debug -- screenshot dev/scratch/visible.png
   ```
4. **Stop the isolated Obsidian instance:**
   ```sh
   npm run debug -- stop
   ```

---

## 4. Manual Installation in Your Vault

### Desktop (macOS, Windows, Linux)
1. Run `npm run build` to generate `main.js`.
2. Inside your Obsidian vault, navigate to `.obsidian/plugins/properties-peek/` (create the folder if it does not exist).
3. Copy `main.js`, `manifest.json`, and `styles.css` into `.obsidian/plugins/properties-peek/`.
4. Reload Obsidian, open **Settings → Community plugins**, and enable **Properties Peek**.

### Mobile (iOS, iPadOS, Android)
1. Copy the `.obsidian/plugins/properties-peek/` folder (`main.js`, `manifest.json`, `styles.css`) to your mobile device using Obsidian Sync, iCloud Drive, Syncthing, or another vault synchronisation tool.
2. Open Obsidian on your mobile device, go to **Settings → Community plugins**, and enable **Properties Peek**.
