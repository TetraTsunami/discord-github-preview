import { Activity } from "discord.js";

export interface ColorTheme {
  background: string;
  secondaryBackground: string;
  tertiaryBackground: string;
  text: string;
  secondaryText: string;
}

export interface ActivityDisplay {
  height: number;
  matches: (activity: Activity) => boolean;
  render: (activity: Activity, colors: ColorTheme, y: number) => Promise<string>;
}

export interface CardOptions {
  overrideBannerUrl: string | null;
  aboutMe: string | null;
  hideDecoration: boolean;
  hideSpotify: boolean;
  themeType: "dark" | "light" | "custom" | "nitroDark" | "nitroLight";
  nitroColor1: string;
  nitroColor2: string;
  customColors?: ColorTheme;
}
