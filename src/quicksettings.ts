import {App, Modal, Notice } from "obsidian";

import Sysctl from "./main.js";
import StateManager from "@j-cake/jcake-utils/state";

export interface QuickSetting<State> {
    name: string,
    render(el: HTMLElement, state: StatefulQuickSetting<State>): void,
}

export type StatefulQuickSetting<State> = QuickSetting<State> & { getState(): State, setState(state: Partial<State>): void, onChange(handler: (state: State) => void): void };

export default class QuickSettingsPanel extends Modal {
    quickSettings: Record<string, StatefulQuickSetting<any>> = {};
    
    constructor(app: App, private plugin: Sysctl, private afterClose: () => void) {
        super(app);
    }
    
    async onOpen() {
        this.contentEl.createEl("h1", { text: "Quick Settings" });
        
        this.contentEl.createDiv({ cls: 'quicksettings-container' }, div => {
            for (const setting of this.plugin.settings.quickSettings)
                if (setting in this.quickSettings)
                    this.quickSettings[setting].render(div, this.quickSettings[setting]);
                else
                    console.warn(`Setting '${setting}' does not seem to be registered`);
        });
    }
    
    registerQuickSetting<State>(quickSetting: QuickSetting<State>, defaultState: State) {
        if (quickSetting.name in this.quickSettings)
            throw new Error(`QuickSetting '${quickSetting.name}' is already defined`);

        const requiresStateMgr = (x: any): x is Partial<object> => typeof x == 'object';

        const stateManager = {
            state: requiresStateMgr(defaultState) ? new StateManager(defaultState) :  defaultState
        };

        const stateChange: ((state: State) => void)[] = [];
        
        this.quickSettings[quickSetting.name] = Object.assign(quickSetting, stateManager.state instanceof StateManager ? {
            getState: stateManager.state.get.bind(stateManager.state),
            setState: stateManager.state.setState.bind(stateManager.state),
            onChange: stateManager.state.onStateChange.bind(stateManager.state)
        } : {
            getState: () => stateManager.state,
            setState: (state: State) => {
                stateManager.state = state;
                stateChange.forEach(i => i(state));
            },
            onChange: (handler: (state: State) => void) => stateChange.push(handler)
        }) as StatefulQuickSetting<State>;
    }

    onClose() {
        this.contentEl.empty();
    }
}