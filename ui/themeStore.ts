import { zustandMmkvStorage } from "@/store/storage";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum ThemeSettingType {
	System = "system",
	Light = "light",
	Dark = "dark",
}

interface ThemeSettingsState {
	selectedThemeSettings: ThemeSettingType;
	setSelectedThemeSettings: (setting: ThemeSettingType) => void;
	resetSettings: () => void;
}

export const initialThemeSettingsState: Pick<
	ThemeSettingsState,
	"selectedThemeSettings"
> = {
	selectedThemeSettings: ThemeSettingType.System,
};

export const useThemeStore = create<ThemeSettingsState>()(
	persist(
		(set) => ({
			...initialThemeSettingsState,
			setSelectedThemeSettings: (setting) =>
				set({ selectedThemeSettings: setting }),
			resetSettings: () => set(initialThemeSettingsState),
		}),
		{
			name: "theme-settings", // unique name
			storage: createJSONStorage(() => zustandMmkvStorage),
			version: 1,

			//partialize: (state) => ({ counter: state.counter }),
		},
	),
);

export function useSelectedColorScheme(): "light" | "dark" {
	const currentThemeSetting = useThemeStore.getState().selectedThemeSettings;
	const isDarkMode = useColorScheme() === "dark";
	if (currentThemeSetting !== ThemeSettingType.System) {
		return currentThemeSetting === ThemeSettingType.Dark ? "dark" : "light";
	}

	const systemTheme = "light"//isDarkMode ? "dark" : "light";
	return systemTheme;
}
