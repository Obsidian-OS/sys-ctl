import SettingsProvider, {RegisterQuickAction} from "../provider.js";

export default class UpdatesSettings extends SettingsProvider<{}> {
    ownPreferences = {}

    protected renderOwnPreferences(container: HTMLElement) {}

    async init(registerQuickSetting: RegisterQuickAction) {

    }
}