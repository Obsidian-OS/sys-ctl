import { Setting } from "obsidian";
import * as lucide from "lucide";

import SettingsProvider from "../provider.js";
import { QuickSetting } from "../quicksettings.js";

export default class NetworkSettings extends SettingsProvider {
    static wifiIcon(enabled: boolean): SVGElement {
        if (enabled)
            return lucide.createElement(lucide.Wifi);
        else
            return lucide.createElement(lucide.WifiOff);
    }
    
    async init(registerQuickSetting: (setting: QuickSetting<boolean>, defaultState: boolean) => void) {
        registerQuickSetting({
            name: 'wifi:toggle',
            render(el, state) {
                new Setting(el)
                    .setName("WiFi")
                    .setDesc("Toggle Wireless Connectivity on or off")
                    .addToggle(toggle => toggle
                        .toggleEl.before(NetworkSettings.wifiIcon(state)))
                    .addExtraButton(button => button
                        .setIcon("chevron-right")
                        .onClick(() => console.log('more')))
            }
        }, false)
    }
}