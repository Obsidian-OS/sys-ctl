import {App, Plugin, PluginSettingTab} from 'obsidian';

import QuickSettingsPanel from './quicksettings.js';
import SettingsProvider from './provider.js';
import AudioSettings from './providers/audio.js';
import BluetoothSettings from './providers/bluetooth.js';
import DisplaySettings from './providers/display.js';
import LocalisationSettings from './providers/localisation.js';
import NetworkSettings from './providers/network.js';
import PowerSettings from './providers/power.js';

export interface SystemSettings {
    quickSettings: string[];
}

export const default_settings: SystemSettings = {
    quickSettings: ['wifi:toggle', 'bluetooth:toggle', 'power:sleep', 'brightness:slider', 'volume:slider']
};

export default class Sysctl extends Plugin {
    settings: SystemSettings = default_settings;
    providers: SettingsProvider<any>[] = [];

    quickSettings: QuickSettingsPanel = null as any;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SystemSettingsTab(this.app, this));

        this.quickSettings = new QuickSettingsPanel(this.app, this, () => {
        });

        for (const provider of this.providers = [
            new AudioSettings(this),
            new BluetoothSettings(this),
            new DisplaySettings(this),
            new LocalisationSettings(this),
            new NetworkSettings(this),
            new PowerSettings(this),
        ])
            await provider.init((settings, defaultState) => this.quickSettings.registerQuickSetting(settings, defaultState));

        this.addRibbonIcon("sliders-horizontal", "Quick Settings", cb => this.quickSettings.open());
    }

    async loadSettings() {
        this.settings = Object.assign({}, default_settings, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    public executeCommand(cmd: string) {
        (this.app as any as {
            commands: {
                executeCommandById: (command: string) => void
            }
        }).commands.executeCommandById(cmd)
    }
}

export class SystemSettingsTab extends PluginSettingTab {
    constructor(app: App, private plugin: Sysctl) {
        super(app, plugin);
    }

    display() {
        this.containerEl.empty();

        for (const group of this.plugin.providers)
            group.renderPreferences(this.containerEl);
    }
}