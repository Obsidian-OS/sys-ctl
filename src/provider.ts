import Sysctl from "./main.js";
import { QuickSetting } from "./quicksettings.js";

export default abstract class SettingsProvider {
    constructor(private plugin: Sysctl) {}
    
    abstract init(registerQuickSetting: (setting: QuickSetting<any>) => void): Promise<void>;
}