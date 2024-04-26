import SettingsProvider, {RegisterQuickAction} from "../provider.js";
import {Setting} from "obsidian";
import * as lucide from "lucide";

export default class DisplaySettings extends SettingsProvider<{}> {
    ownPreferences = {}

    protected renderOwnPreferences(container: HTMLElement) {}

    static brightnessIcon(volume: number): SVGElement {
        return [
            lucide.createElement(lucide.SunDim),
            lucide.createElement(lucide.SunMedium),
            lucide.createElement(lucide.Sun),
        ][Math.round(2 * volume)];
    }

    async init(registerQuickSetting: RegisterQuickAction) {
        registerQuickSetting<number>({
            name: 'brightness:slider',
            render(el, state) {
                const brightnessIcon = document.createElement('span');
                brightnessIcon.replaceChildren(DisplaySettings.brightnessIcon(state.getState()));
                state.onChange(state => brightnessIcon.replaceChildren(DisplaySettings.brightnessIcon(state)));

                new Setting(el)
                    .setName("Brightness")
                    .setDesc("Set display brightness")
                    .addSlider(slider => {
                        slider
                            .setValue(state.getState())
                            .onChange(cb => state.setState(cb))
                            .setLimits(0, 1, 0.1)
                            .sliderEl.before(brightnessIcon);

                        slider.sliderEl.addEventListener('input', function (_) {
                            return state.setState(Number(this.value));
                        });
                    });
            }
        }, 0.6);
    }
}