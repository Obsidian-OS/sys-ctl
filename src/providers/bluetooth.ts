import { Setting } from "obsidian";
import * as lucide from "lucide";

import SettingsProvider from "../provider.js";
import { QuickSetting } from "../quicksettings.js";

export type BluetoothState = 'disabled' | 'enabled' | 'searching' | 'connected';

export default class BluetoothSettings extends SettingsProvider {
    static bluetoothIcon(state: BluetoothState): SVGElement {
        return {
            disabled: lucide.createElement(lucide.BluetoothOff),
            enabled: lucide.createElement(lucide.Bluetooth),
            searching: lucide.createElement(lucide.BluetoothSearching),
            connected: lucide.createElement(lucide.BluetoothConnected),
        }[state];
    }
    
    async init(registerQuickSetting: (setting: QuickSetting<BluetoothState>, defaultState: BluetoothState) => void) {
        registerQuickSetting({
            name: 'bluetooth:toggle',
            render(el, state) {
                new Setting(el)
                    .setName("Bluetooth")
                    .setDesc("Toggle Bluetooth on or off")                                    
                    .addToggle(toggle => toggle
                        .toggleEl.before(BluetoothSettings.bluetoothIcon(state)))
                    .addExtraButton(button => button
                        .setIcon("chevron-right")                                        
                        .onClick(() => console.log('more')))
            }
        }, 'disabled');
    }
}