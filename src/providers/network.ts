import {Setting} from "obsidian";
import * as lucide from "lucide";

import SettingsProvider, {RegisterQuickAction} from "../provider.js";

export default class NetworkSettings extends SettingsProvider<{}> {
    ownPreferences = {}

    protected renderOwnPreferences(container: HTMLElement): void {

    }

    static wifiIcon(enabled: boolean): SVGElement {
        if (enabled)
            return lucide.createElement(lucide.Wifi);
        else
            return lucide.createElement(lucide.WifiOff);
    }

    async toggleWifi() {

    }

    async init(registerQuickSetting: RegisterQuickAction) {
        registerQuickSetting<boolean>({
            name: 'wifi:toggle',
            render(el, state) {
                const wifiIcon = document.createElement('span');
                wifiIcon.replaceChildren(NetworkSettings.wifiIcon(state.getState()));
                state.onChange(state => wifiIcon.replaceChildren(NetworkSettings.wifiIcon(state)));

                new Setting(el)
                    .setName("WiFi")
                    .setDesc("Toggle Wireless Connectivity on or off")
                    .addToggle(toggle => toggle
                        .onChange(cb => state.setState(cb))
                        .toggleEl.before(wifiIcon))
                    .addExtraButton(button => button
                        .setIcon("chevron-right")
                        .onClick(() => console.log('more')))
            }
        }, false)
    }
}