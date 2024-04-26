import { Setting } from "obsidian";
import SettingsProvider from "../provider.js";
import { QuickSetting } from "../quicksettings.js";

export default class DisplaySettings extends SettingsProvider {
    async init(registerQuickSetting: (setting: QuickSetting<any>) => void) {
        registerQuickSetting({
            name: 'brightness:slider',
            state: 1.0,
            render(el) {
                new Setting(el)
                    .setName("Brightness")                                    
                    .addSlider(slider => slider.setLimits(0, 1, 0.1));
            }
        });
    }
    
}