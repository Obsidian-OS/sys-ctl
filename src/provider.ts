import Sysctl from "./main.js";
import { QuickSetting } from "./quicksettings.js";

export type RegisterQuickAction = <State>(setting: QuickSetting<State>, defaultState: State) => void;

export default abstract class SettingsProvider<OwnPreferences extends {}> {
    constructor(protected plugin: Sysctl) {
        this.appendOwnPreferencesToPluginSettings();
    }
    
    abstract init(registerQuickSetting: RegisterQuickAction): Promise<void>;

    abstract ownPreferences: OwnPreferences;
    protected abstract renderOwnPreferences(container: HTMLElement): void;

    renderPreferences(container: HTMLElement) {
        if (Object.keys(this.ownPreferences).length > 0) {
            this.renderOwnPreferences(container.createDiv({
                cls: ['settings-group'],
            }));
        }
    }

    appendOwnPreferencesToPluginSettings() {
        Object.assign(this.plugin.settings, this.ownPreferences);
    }
}