import cp from 'node:child_process';
import {Menu, Notice, Setting} from "obsidian";
import * as lucide from 'lucide';

import SettingsProvider, {RegisterQuickAction} from "../provider.js";

export interface PowerPreferences {
    suspendCommand: string,
    shutdownCommand: string,
    rebootCommand: string
}

export const defaultPreferences: PowerPreferences = {
    suspendCommand: `loginctl suspend`,
    shutdownCommand: `loginctl poweroff`,
    rebootCommand: `loginctl reboot`
};

export default class PowerSettings extends SettingsProvider<PowerPreferences> {
    powerQuickSettingsMenu: Menu = null as any;
    ownPreferences: PowerPreferences = defaultPreferences;
    
    async init(registerQuickSetting: RegisterQuickAction) {
        this.plugin.addCommand({
            id: 'suspend',
            name: 'Suspend',
            icon: 'moon',
            callback() {
                new Notice("Not Suspending, but we got the memo!");
                // cp.execFile('systemctl', ['suspend'], {}, (err, _, stderr) => {
                //     if (err)
                //         new Notice(`Failed to suspend: '${stderr}'`);
                // });
            }
        });

        await this.powerControlQuickActions(registerQuickSetting);
    }

    renderOwnPreferences(container: HTMLElement) {
        container.createEl('h2', {
            text: 'Power Controls'
        });

        const callout = container.createDiv({ cls: 'callout', attr: {
                'data-callout-metadata': "",
                'data-callout-fold': "",
                'data-callout': "warning"
            } });
        const calloutTitle = callout.createDiv({ cls: 'callout-title' });
        const calloutIcon = calloutTitle.createDiv({});

        calloutIcon.replaceChildren(lucide.createElement(lucide.ShieldAlert));
        calloutTitle.createDiv({ text: "Warning!", cls: 'callout-title-inner' });

        callout.createDiv({
            cls: 'callout-content',
            text: `The following options are dangerous. They are executed as shell code directly on your system. Under no circumstances should you put code here you don't understand.`
        });

        new Setting(container)
            .setName("Suspend Command")
            .setDesc("Which command should be invoked to suspend (sleep) the system")
            .addText(text => text
                .setValue(this.ownPreferences.suspendCommand)
                .onChange(cmd => this.ownPreferences.suspendCommand = cmd)
                .inputEl.addClass('code'));

        new Setting(container)
            .setName("Shutdown Command")
            .setDesc("Which command should be invoked to shut down the system")
            .addText(text => text
                .setValue(this.ownPreferences.shutdownCommand)
                .onChange(cmd => this.ownPreferences.shutdownCommand = cmd)
                .inputEl.addClass('code'));

        new Setting(container)
            .setName("Reboot Command")
            .setDesc("Which command should be invoked to reboot the system")
            .addText(text => text
                .setValue(this.ownPreferences.rebootCommand)
                .onChange(cmd => this.ownPreferences.rebootCommand = cmd)
                .inputEl.addClass('code'));
    }

    async powerControlQuickActions(registerQuickSetting: RegisterQuickAction) {
        this.powerQuickSettingsMenu = new Menu()
            .addItem(i => i
                .setIcon('moon')
                .setTitle('Suspend')
                .onClick(_ => this.plugin.executeCommand('obsidian-os/sysctl:suspend')))
            .addItem(i => i
                .setIcon('power')
                .setTitle('Shut Down'))
            .addItem(i => i
                .setIcon('rotate-ccw')
                .setTitle('Restart'));

        registerQuickSetting<void>({
            name: 'power:sleep',
            render: el => {
                new Setting(el)
                    .setName("Suspend")
                    .setDesc("Put the device into sleep mode")
                    .addButton(sleep => sleep
                        .setButtonText("Suspend")
                        .onClick(_ => this.plugin.executeCommand('obsidian-os/sysctl:suspend')))
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
        }, void 0);
    }
}