import { Setting } from "obsidian";
import * as lucide from 'lucide';

import SettingsProvider from "../provider.js";
import { QuickSetting } from "../quicksettings.js";

export default class AudioSettings extends SettingsProvider {
    
    static getVolumeIcon(volume: number): SVGElement {
        return [
            lucide.createElement(lucide.VolumeX),
            lucide.createElement(lucide.Volume),
            lucide.createElement(lucide.Volume1),
            lucide.createElement(lucide.Volume2),
        ][Math.floor(4 * volume)];
    }
    
    async init(registerQuickSetting: (setting: QuickSetting<number>) => void) {
        registerQuickSetting({
            name: 'volume:slider',
            render(el, volume) {
                new Setting(el)
                    .setName("Volume")
                    .setDesc("Set system volume")                                    
                    .addSlider(slider => {
                        slider.setLimits(0, 1, 0.1);
                        slider.sliderEl.before(AudioSettings.getVolumeIcon(volume))
                    });
            }
        });
    }
}