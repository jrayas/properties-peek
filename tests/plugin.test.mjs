import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

test("manifest.json adheres to Obsidian community plugin rules and GEMINI.md spec", () => {
	const manifest = JSON.parse(
		fs.readFileSync(path.join(rootDir, "manifest.json"), "utf8"),
	);
	assert.equal(manifest.id, "properties-peek");
	assert.equal(manifest.name, "Properties Peek");
	assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
	assert.equal(manifest.isDesktopOnly, false);
	assert.ok(manifest.description.length > 0 && manifest.description.length <= 250);
	assert.ok(manifest.description.endsWith("."));
	assert.ok(!/obsidian/i.test(manifest.id));
	assert.ok(!/obsidian/i.test(manifest.name));
});

test("versions.json maps current manifest version to minAppVersion", () => {
	const manifest = JSON.parse(
		fs.readFileSync(path.join(rootDir, "manifest.json"), "utf8"),
	);
	const versions = JSON.parse(
		fs.readFileSync(path.join(rootDir, "versions.json"), "utf8"),
	);
	assert.equal(versions[manifest.version], manifest.minAppVersion);
});

test("styles.css defines hiding rules without !important or :has()", () => {
	const css = fs.readFileSync(path.join(rootDir, "styles.css"), "utf8");
	assert.ok(css.includes("body.properties-peek-hidden"));
	assert.ok(css.includes("--metadata-display-reading: none"));
	assert.ok(css.includes("--metadata-display-editing: none"));
	assert.ok(css.includes(".markdown-preview-view .metadata-container"));
	assert.ok(css.includes(".markdown-source-view .metadata-container"));
	assert.ok(css.includes(".markdown-embed .metadata-container"));
	assert.ok(css.includes(".hover-popover .metadata-container"));
	assert.ok(css.includes("body.properties-peek-hidden.properties-peek-hide-source"));
	assert.ok(css.includes(".cm-line.properties-peek-frontmatter-line"));
	assert.ok(!css.includes("!important"));
	assert.ok(!css.includes(":has("));
});

test("src/settings.ts and src/main.ts use British English and required commands/settings", () => {
	const settingsSrc = fs.readFileSync(
		path.join(rootDir, "src", "settings.ts"),
		"utf8",
	);
	const mainSrc = fs.readFileSync(
		path.join(rootDir, "src", "main.ts"),
		"utf8",
	);

	// British English spelling check
	assert.ok(settingsSrc.includes("Startup behaviour"));
	assert.ok(!settingsSrc.includes("Startup behavior"));

	// Required settings keys
	for (const key of [
		"showRibbonIcon",
		"showNoticeOnToggle",
		"startupBehaviour",
		"peekDuration",
		"applyInSourceMode",
		"keepStatePerDevice",
	]) {
		assert.ok(settingsSrc.includes(key), `Missing setting key: ${key}`);
	}

	// Required command names & tooltips
	assert.ok(mainSrc.includes("Toggle properties visibility"));
	assert.ok(mainSrc.includes("Peek at properties"));
	assert.ok(mainSrc.includes("Hide properties"));
	assert.ok(mainSrc.includes("Show properties"));
});
