import { Setting } from "obsidian";
import * as lucide from 'lucide';

import SettingsProvider, {RegisterQuickAction} from "../provider.js";
import { QuickSetting } from "../quicksettings.js";

export default class AudioSettings extends SettingsProvider<{}> {
    ownPreferences = {}

    protected renderOwnPreferences(container: HTMLElement) {}

    static volumeIcon(volume: number): SVGElement {
        return [
            lucide.createElement(lucide.VolumeX),
            lucide.createElement(lucide.Volume),
            lucide.createElement(lucide.Volume1),
            lucide.createElement(lucide.Volume2),
        ][Math.ceil(3 * volume)];
    }
    
    async init(registerQuickSetting: RegisterQuickAction) {
        registerQuickSetting<number>({
            name: 'volume:slider',
            render(el, state) {
                const volumeIcon = document.createElement('span');
                volumeIcon.replaceChildren(AudioSettings.volumeIcon(state.getState()));
                state.onChange(state => volumeIcon.replaceChildren(AudioSettings.volumeIcon(state)));

                new Setting(el)
                    .setName("Volume")
                    .setDesc("Set system volume")                                    
                    .addSlider(slider => {
                        slider
                            .setValue(state.getState())
                            .onChange(cb => state.setState(cb))
                            .setLimits(0, 1, 0.1)
                            .sliderEl.before(volumeIcon);

                        slider.sliderEl.addEventListener('input', function (_) {
                            return state.setState(Number(this.value));
                        });
                    });
            }
        }, 0.6);
    }
}