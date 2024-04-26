import {Menu, Setting } from "obsidian";
import SettingsProvider from "../provider.js";
import { QuickSetting } from "../quicksettings.js";

export default class PowerSettings extends SettingsProvider {
    powerQuickSettingsMenu: Menu = null as any;
    
    async init(registerQuickSetting: (setting: QuickSetting<void>) => void) {
        
        this.powerQuickSettingsMenu = new Menu()
            .addItem(i => i
                .setIcon('moon')
                .setTitle('Sleep'))
            .addItem(i => i
                .setIcon('power')
                .setTitle('Shut Down'))
            .addItem(i => i
                .setIcon('rotate-ccw')
                .setTitle('Restart'));
        
        registerQuickSetting({
            name: 'power:sleep',
            render: el => {
                new Setting(el)
                    .setName("Sleep")
                    .setDesc("Put the device into sleep mode")
                    .addButton(sleep => sleep.setButtonText("Sleep"))
                    .addExtraButton(button => button
                        .setIcon("chevron-right")
                        .onClick(() => {
                            const pos = button.extraSettingsEl.getBoundingClientRect();
                            
                            return this.powerQuickSettingsMenu.showAtPosition({
                                x: pos.x + pos.width,
                                y: pos.y,
                            });
                        }))
            }
        });
    }    
}