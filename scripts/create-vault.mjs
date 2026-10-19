import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const vaultDir = path.join(rootDir, "dev", "testvault");

function ensureDir(dirPath) {
	fs.mkdirSync(dirPath, { recursive: true });
}

function writeNote(relPath, content) {
	const full = path.join(vaultDir, relPath);
	ensureDir(path.dirname(full));
	fs.writeFileSync(full, content, "utf8");
}

function buildTestVault() {
	ensureDir(vaultDir);

	writeNote(
		"Note with properties.md",
		[
			"---",
			"title: Project architecture overview",
			"status: in-progress",
			"priority: high",
			"created: 2026-10-19",
			"tags:",
			"  - architecture",
			"  - obsidian",
			"  - British-English",
			"aliases:",
			"  - Architecture note",
			"---",
			"# Project architecture overview",
			"",
			"This note contains YAML frontmatter properties at the top of the document.",
			"",
			"## Section 1: Behaviour check",
			"",
			"When **Properties Peek** hides properties, the frontmatter block above disappears completely with no empty layout gap.",
			"",
		].join("\n"),
	);

	writeNote(
		"Note without properties.md",
		[
			"# Note without properties",
			"",
			"This note has no YAML frontmatter at all.",
			"",
			"Toggling or peeking at properties leaves this note completely unchanged.",
			"",
		].join("\n"),
	);

	writeNote(
		"Note with embed.md",
		[
			"---",
			"category: testing",
			"review: complete",
			"---",
			"# Note with embedded note",
			"",
			"Below is an embedded note that also has properties:",
			"",
			"![[Note with properties]]",
			"",
			"And a standard internal link for hover preview testing: [[Note with properties]].",
			"",
		].join("\n"),
	);

	const obsidianDir = path.join(vaultDir, ".obsidian");
	const pluginDir = path.join(obsidianDir, "plugins", "properties-peek");
	ensureDir(pluginDir);

	fs.writeFileSync(
		path.join(obsidianDir, "community-plugins.json"),
		JSON.stringify(["properties-peek"], null, 2) + "\n",
		"utf8",
	);

	fs.writeFileSync(
		path.join(obsidianDir, "app.json"),
		JSON.stringify(
			{
				alwaysUpdateLinks: true,
				nativeMenus: false,
				propertiesInDocument: "visible",
			},
			null,
			2,
		) + "\n",
		"utf8",
	);

	for (const asset of ["main.js", "manifest.json", "styles.css"]) {
		const src = path.join(rootDir, asset);
		if (fs.existsSync(src)) {
			fs.copyFileSync(src, path.join(pluginDir, asset));
		}
	}

	console.log(`Test vault created at: ${vaultDir}`);
}

buildTestVault();
