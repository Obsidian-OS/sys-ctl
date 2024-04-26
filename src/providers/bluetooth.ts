import { Setting } from "obsidian";
import * as lucide from "lucide";

import SettingsProvider, {RegisterQuickAction} from "../provider.js";
import { QuickSetting } from "../quicksettings.js";

export type BluetoothState = 'disabled' | 'enabled' | 'searching' | 'connected';

export default class BluetoothSettings extends SettingsProvider<{}> {
    ownPreferences = {}

    protected renderOwnPreferences(container: HTMLElement) {}

    static bluetoothIcon(state: BluetoothState): SVGElement {
        return {
            disabled: lucide.createElement(lucide.BluetoothOff),
            enabled: lucide.createElement(lucide.Bluetooth),
            searching: lucide.createElement(lucide.BluetoothSearching),
            connected: lucide.createElement(lucide.BluetoothConnected),
        }[state];
    }
    
    async init(registerQuickSetting: RegisterQuickAction) {
        registerQuickSetting<BluetoothState>({
            name: 'bluetooth:toggle',
            render(el, state) {
                const bluetoothIcon = document.createElement('span');
                bluetoothIcon.replaceChildren(BluetoothSettings.bluetoothIcon(state.getState()));
                state.onChange(state => bluetoothIcon.replaceChildren(BluetoothSettings.bluetoothIcon(state)));

                new Setting(el)
                    .setName("Bluetooth")
                    .setDesc("Toggle Bluetooth on or off")                                    
                    .addToggle(toggle => toggle
                        .onChange(cb => state.setState(cb ? 'enabled' : 'disabled'))
                        .toggleEl.before(bluetoothIcon))
                    .addExtraButton(button => button
                        .setIcon("chevron-right")                                        
                        .onClick(() => console.log('more')))
            }
        }, 'disabled');
    }
}