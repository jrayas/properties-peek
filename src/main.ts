import { Notice, Plugin, setIcon } from "obsidian";
import { frontmatterLineExtension } from "./frontmatter-extension";
import {
	DEFAULT_SETTINGS,
	type PropertiesPeekSettings,
	PropertiesPeekSettingTab,
} from "./settings";

export const BODY_CLASS_HIDDEN = "properties-peek-hidden";
export const BODY_CLASS_HIDE_SOURCE = "properties-peek-hide-source";
export const LOCAL_STORAGE_KEY = "properties-peek-hidden";

export default class PropertiesPeekPlugin extends Plugin {
	settings!: PropertiesPeekSettings;
	settingTab!: PropertiesPeekSettingTab;
	ribbonIconEl: HTMLElement | null = null;
	isHidden = false;
	isPeeking = false;
	private peekTimeoutId: number | null = null;
	private trackedBodies = new Set<HTMLElement>();

	async onload(): Promise<void> {
		await this.loadSettings();
		await this.resolveInitialState();

		// Apply marker classes as early as possible to prevent startup flash
		this.applyDomState();
		this.syncRibbonIcon();

		this.registerEditorExtension(frontmatterLineExtension);

		this.settingTab = new PropertiesPeekSettingTab(this.app, this);
		this.addSettingTab(this.settingTab);

		this.addCommand({
			id: "toggle-visibility",
			name: "Toggle properties visibility",
			callback: () => {
				void this.toggleProperties();
			},
		});

		this.addCommand({
			id: "peek",
			name: "Peek at properties",
			callback: () => {
				this.peekProperties();
			},
		});

		this.addCommand({
			id: "hide",
			name: "Hide properties",
			callback: () => {
				void this.hideProperties();
			},
		});

		this.addCommand({
			id: "show",
			name: "Show properties",
			callback: () => {
				void this.showProperties();
			},
		});

		this.app.workspace.onLayoutReady(() => {
			this.applyDomState();

			this.registerEvent(
				this.app.workspace.on("window-open", (win) => {
					const body = win.doc?.body;
					if (body) {
						this.trackedBodies.add(body);
						this.applyClassesToBody(body);
					}
				}),
			);

			this.registerEvent(
				this.app.workspace.on("layout-change", () => {
					this.applyDomState();
				}),
			);
		});
	}

	onunload(): void {
		this.clearPeekTimer();
		this.isPeeking = false;
		this.removeAllDomClasses();
		if (this.ribbonIconEl) {
			this.ribbonIconEl.remove();
			this.ribbonIconEl = null;
		}
	}

	async onExternalSettingsChange(): Promise<void> {
		await this.loadSettings();
		if (!this.settings.keepStatePerDevice) {
			this.isHidden = this.settings.propertiesHidden;
		}
		this.applyDomState();
		this.syncRibbonIcon();
		this.settingTab?.update();
	}

	async loadSettings(): Promise<void> {
		const rawData =
			(await this.loadData()) as Partial<PropertiesPeekSettings> | null;
		this.settings = {
			...DEFAULT_SETTINGS,
			...(rawData ?? {}),
		};
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async updateSetting<K extends keyof PropertiesPeekSettings>(
		key: K,
		value: PropertiesPeekSettings[K],
	): Promise<void> {
		this.settings[key] = value;

		if (key === "keepStatePerDevice") {
			if (value === true) {
				// Seed device-local storage with the current state
				this.app.saveLocalStorage(
					LOCAL_STORAGE_KEY,
					this.isHidden ? "true" : "false",
				);
			} else {
				// Sync current state back to shared vault data
				this.settings.propertiesHidden = this.isHidden;
			}
		}

		await this.saveSettings();
		this.applyDomState();
		this.syncRibbonIcon();
	}

	isEffectivelyHidden(): boolean {
		return this.isHidden && !this.isPeeking;
	}

	async toggleProperties(): Promise<void> {
		if (this.isPeeking) {
			// Running toggle during a peek ends the peek and leaves properties visible
			this.clearPeekTimer();
			this.isPeeking = false;
			this.isHidden = false;
			await this.persistHiddenState(false);
			this.applyDomState();
			this.syncRibbonIcon();
			this.notify("Properties shown");
			return;
		}

		this.isHidden = !this.isHidden;
		await this.persistHiddenState(this.isHidden);
		this.applyDomState();
		this.syncRibbonIcon();
		this.notify(this.isHidden ? "Properties hidden" : "Properties shown");
	}

	async hideProperties(): Promise<void> {
		this.clearPeekTimer();
		this.isPeeking = false;
		this.isHidden = true;
		await this.persistHiddenState(true);
		this.applyDomState();
		this.syncRibbonIcon();
		this.notify("Properties hidden");
	}

	async showProperties(): Promise<void> {
		this.clearPeekTimer();
		this.isPeeking = false;
		this.isHidden = false;
		await this.persistHiddenState(false);
		this.applyDomState();
		this.syncRibbonIcon();
		this.notify("Properties shown");
	}

	peekProperties(): void {
		if (!this.isHidden) {
			this.notify("Properties are already visible");
			return;
		}

		this.clearPeekTimer();
		this.isPeeking = true;
		this.applyDomState();
		this.syncRibbonIcon();

		const durationSeconds = Math.min(
			60,
			Math.max(2, this.settings.peekDuration),
		);
		this.notify(`Peeking for ${durationSeconds} seconds`);

		this.peekTimeoutId = window.setTimeout(() => {
			this.peekTimeoutId = null;
			this.isPeeking = false;
			this.applyDomState();
			this.syncRibbonIcon();
		}, durationSeconds * 1000);
	}

	private async resolveInitialState(): Promise<void> {
		const behaviour = this.settings.startupBehaviour;
		if (behaviour === "hidden") {
			this.isHidden = true;
			await this.persistHiddenState(true);
		} else if (behaviour === "visible") {
			this.isHidden = false;
			await this.persistHiddenState(false);
		} else {
			this.isHidden = this.readPersistedHiddenState();
		}
	}

	private readPersistedHiddenState(): boolean {
		if (this.settings.keepStatePerDevice) {
			const localValue = this.app.loadLocalStorage(
				LOCAL_STORAGE_KEY,
			) as unknown;
			if (localValue === "true" || localValue === true) {
				return true;
			}
			if (localValue === "false" || localValue === false) {
				return false;
			}
		}
		return Boolean(this.settings.propertiesHidden);
	}

	private async persistHiddenState(hidden: boolean): Promise<void> {
		if (this.settings.keepStatePerDevice) {
			this.app.saveLocalStorage(
				LOCAL_STORAGE_KEY,
				hidden ? "true" : "false",
			);
		} else {
			this.settings.propertiesHidden = hidden;
			await this.saveSettings();
		}
	}

	private clearPeekTimer(): void {
		if (this.peekTimeoutId !== null) {
			window.clearTimeout(this.peekTimeoutId);
			this.peekTimeoutId = null;
		}
	}

	private notify(message: string): void {
		if (this.settings.showNoticeOnToggle) {
			new Notice(message);
		}
	}

	syncRibbonIcon(): void {
		if (!this.settings.showRibbonIcon) {
			if (this.ribbonIconEl) {
				this.ribbonIconEl.remove();
				this.ribbonIconEl = null;
			}
			return;
		}

		const effectivelyHidden = this.isEffectivelyHidden();
		const iconName = effectivelyHidden ? "eye-off" : "eye";
		const tooltipText = effectivelyHidden
			? "Show properties"
			: "Hide properties";

		if (!this.ribbonIconEl) {
			this.ribbonIconEl = this.addRibbonIcon(
				iconName,
				tooltipText,
				() => {
					void this.toggleProperties();
				},
			);
			this.ribbonIconEl.addClass("properties-peek-ribbon-icon");
		} else {
			setIcon(this.ribbonIconEl, iconName);
			this.ribbonIconEl.setAttribute("aria-label", tooltipText);
		}
	}

	applyDomState(): void {
		this.collectDocumentBodies();
		for (const body of this.trackedBodies) {
			this.applyClassesToBody(body);
		}
	}

	private collectDocumentBodies(): void {
		if (typeof document !== "undefined" && document.body) {
			this.trackedBodies.add(document.body);
		}
		this.app.workspace?.iterateAllLeaves((leaf) => {
			const ownerBody = leaf.view?.containerEl?.ownerDocument?.body;
			if (ownerBody) {
				this.trackedBodies.add(ownerBody);
			}
		});
	}

	private applyClassesToBody(body: HTMLElement): void {
		const effectivelyHidden = this.isEffectivelyHidden();
		body.classList.toggle(BODY_CLASS_HIDDEN, effectivelyHidden);
		body.classList.toggle(
			BODY_CLASS_HIDE_SOURCE,
			effectivelyHidden && this.settings.applyInSourceMode,
		);
	}

	private removeAllDomClasses(): void {
		this.collectDocumentBodies();
		for (const body of this.trackedBodies) {
			body.classList.remove(BODY_CLASS_HIDDEN, BODY_CLASS_HIDE_SOURCE);
		}
		this.trackedBodies.clear();
	}
}
