import {
	App,
	PluginSettingTab,
	type SettingDefinitionItem,
} from "obsidian";
import type PropertiesPeekPlugin from "./main";

export type StartupBehaviour = "remember" | "hidden" | "visible";

export interface PropertiesPeekSettings {
	showRibbonIcon: boolean;
	showNoticeOnToggle: boolean;
	startupBehaviour: StartupBehaviour;
	peekDuration: number;
	applyInSourceMode: boolean;
	keepStatePerDevice: boolean;
	propertiesHidden: boolean;
}

export const DEFAULT_SETTINGS: PropertiesPeekSettings = {
	showRibbonIcon: true,
	showNoticeOnToggle: true,
	startupBehaviour: "remember",
	peekDuration: 5,
	applyInSourceMode: false,
	keepStatePerDevice: false,
	propertiesHidden: false,
};

export class PropertiesPeekSettingTab extends PluginSettingTab {
	constructor(
		app: App,
		private plugin: PropertiesPeekPlugin,
	) {
		super(app, plugin);
	}

	getControlValue<K extends keyof PropertiesPeekSettings>(
		key: K,
	): PropertiesPeekSettings[K] {
		return this.plugin.settings[key];
	}

	async setControlValue<K extends keyof PropertiesPeekSettings>(
		key: K,
		value: PropertiesPeekSettings[K],
	): Promise<void> {
		await this.plugin.updateSetting(key, value);
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: "Show ribbon icon",
				desc: "Adds or removes the ribbon icon.",
				control: {
					type: "toggle",
					key: "showRibbonIcon",
					defaultValue: DEFAULT_SETTINGS.showRibbonIcon,
				},
			},
			{
				name: "Show notice on toggle",
				desc: "Displays a short message when the state changes.",
				control: {
					type: "toggle",
					key: "showNoticeOnToggle",
					defaultValue: DEFAULT_SETTINGS.showNoticeOnToggle,
				},
			},
			{
				name: "Startup behaviour",
				desc: "Choose whether properties start hidden, visible, or restore the last state.",
				control: {
					type: "dropdown",
					key: "startupBehaviour",
					defaultValue: DEFAULT_SETTINGS.startupBehaviour,
					options: {
						remember: "Remember last state",
						hidden: "Always hidden",
						visible: "Always visible",
					},
				},
			},
			{
				name: "Peek duration",
				desc: "How long a peek lasts (2 to 60 seconds).",
				control: {
					type: "slider",
					key: "peekDuration",
					min: 2,
					max: 60,
					step: 1,
					defaultValue: DEFAULT_SETTINGS.peekDuration,
					displayFormat: (value: number) => `${value} s`,
				},
			},
			{
				name: "Apply in source mode",
				desc: "Also hide raw frontmatter in source mode.",
				control: {
					type: "toggle",
					key: "applyInSourceMode",
					defaultValue: DEFAULT_SETTINGS.applyInSourceMode,
				},
			},
			{
				name: "Keep state per device",
				desc: "When on, desktop and mobile remember their own state rather than sharing one through vault sync.",
				control: {
					type: "toggle",
					key: "keepStatePerDevice",
					defaultValue: DEFAULT_SETTINGS.keepStatePerDevice,
				},
			},
		];
	}
}
