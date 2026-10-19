import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";
import { getFrontMatterInfo } from "obsidian";

export const FRONTMATTER_LINE_CLASS = "properties-peek-frontmatter-line";

const frontmatterLineDecoration = Decoration.line({
	attributes: { class: FRONTMATTER_LINE_CLASS },
});

function buildFrontmatterDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const doc = view.state.doc;
	if (doc.length < 6) {
		return builder.finish();
	}

	const firstLine = doc.line(1);
	if (firstLine.text.trim() !== "---") {
		return builder.finish();
	}

	const headText = doc.sliceString(0, Math.min(doc.length, 16384));
	const info = getFrontMatterInfo(headText);
	if (!info.exists || info.contentStart <= 0) {
		return builder.finish();
	}

	const endOffset = Math.min(doc.length, info.contentStart);
	let pos = 0;
	while (pos < endOffset && pos <= doc.length) {
		const line = doc.lineAt(pos);
		builder.add(line.from, line.from, frontmatterLineDecoration);
		if (line.to + 1 <= pos) {
			break;
		}
		pos = line.to + 1;
	}

	return builder.finish();
}

export const frontmatterLineExtension = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildFrontmatterDecorations(view);
		}

		update(update: ViewUpdate): void {
			if (update.docChanged) {
				this.decorations = buildFrontmatterDecorations(update.view);
			}
		}
	},
	{
		decorations: (instance) => instance.decorations,
	},
);
