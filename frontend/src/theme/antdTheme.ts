import type { ThemeConfig } from "antd";
import { luxuryTokens } from "./tokens";

/**
 * Ant Design Theme Configuration for JEWELO
 * Blends AntD components seamlessly with high-end jewellery aesthetics.
 */
export const antdLuxuryTheme: ThemeConfig = {
  token: {
    colorPrimary: luxuryTokens.colors.gold.base, // #C5A880
    colorInfo: luxuryTokens.colors.gold.dark,
    colorSuccess: luxuryTokens.colors.emerald.base,
    colorWarning: "#C59B27",
    colorError: luxuryTokens.colors.ruby.base,
    colorTextBase: "#1A1A1A",
    colorBgBase: "#FFFFFF",
    fontFamily: luxuryTokens.typography.fontBody,
    borderRadius: 8,
    wireframe: false,
    controlHeight: 38,
    fontSize: 13,
  },
  components: {
    Table: {
      headerBg: "#FAF7F2",
      headerColor: "#1A1A1A",
      headerSortActiveBg: "#F3EEE4",
      headerSortHoverBg: "#F5F0E8",
      rowHoverBg: "#FBF9F5",
      borderColor: "#EAE4DC",
      headerBorderRadius: 8,
      fontSize: 13,
    },
    Button: {
      colorPrimary: luxuryTokens.colors.gold.base,
      colorPrimaryHover: luxuryTokens.colors.gold.accent,
      colorPrimaryActive: luxuryTokens.colors.gold.dark,
      defaultBorderColor: "#EAE4DC",
      defaultColor: "#1A1A1A",
      fontWeight: 600,
      controlHeight: 38,
      borderRadius: 8,
    },
    Input: {
      colorBorder: "#EAE4DC",
      hoverBorderColor: luxuryTokens.colors.gold.base,
      activeBorderColor: luxuryTokens.colors.gold.dark,
      colorBgContainer: "#FFFFFF",
      borderRadius: 8,
      controlHeight: 38,
    },
    Select: {
      colorBorder: "#EAE4DC",
      colorPrimaryHover: luxuryTokens.colors.gold.base,
      controlHeight: 38,
      borderRadius: 8,
      optionSelectedBg: luxuryTokens.colors.gold.lightest,
      optionSelectedColor: luxuryTokens.colors.gold.darker,
    },
    Modal: {
      contentBg: "#FFFFFF",
      headerBg: "#FFFFFF",
      titleColor: "#1A1A1A",
      titleFontSize: 18,
      borderRadiusLG: 12,
    },
    Drawer: {
      colorBgElevated: "#FFFFFF",
      borderRadiusSM: 12,
    },
    Pagination: {
      itemActiveBg: luxuryTokens.colors.gold.lightest,
      colorPrimary: luxuryTokens.colors.gold.base,
      colorPrimaryHover: luxuryTokens.colors.gold.dark,
      borderRadius: 6,
    },
    Badge: {
      colorPrimary: luxuryTokens.colors.gold.base,
    },
    Rate: {
      colorFillContent: "#E5E7EB",
      colorPrimary: luxuryTokens.colors.gold.base,
    },
    Card: {
      colorBgContainer: "#FFFFFF",
      colorBorderSecondary: "#EAE4DC",
      borderRadiusLG: 12,
    },
    Tabs: {
      colorPrimary: luxuryTokens.colors.gold.base,
      colorPrimaryHover: luxuryTokens.colors.gold.dark,
      colorPrimaryActive: luxuryTokens.colors.gold.darker,
      itemSelectedColor: luxuryTokens.colors.gold.darker,
      inkBarColor: luxuryTokens.colors.gold.base,
    },
    Tag: {
      borderRadiusSM: 4,
      defaultBg: "#FAF7F2",
      defaultColor: "#705A34",
    },
  },
};

export const antdLuxuryDarkTheme: ThemeConfig = {
  token: {
    colorPrimary: luxuryTokens.colors.gold.base,
    colorInfo: luxuryTokens.colors.gold.light,
    colorSuccess: "#34D399",
    colorWarning: "#FBBF24",
    colorError: "#F87171",
    colorTextBase: "#F3F4F6",
    colorBgBase: luxuryTokens.colors.onyx.obsidian,
    fontFamily: luxuryTokens.typography.fontBody,
    borderRadius: 8,
    wireframe: false,
    controlHeight: 38,
    fontSize: 13,
  },
  components: {
    Table: {
      headerBg: luxuryTokens.colors.onyx.charcoal,
      headerColor: "#F3F4F6",
      rowHoverBg: "#1C1C1C",
      borderColor: "#2B2B2B",
      fontSize: 13,
    },
    Button: {
      colorPrimary: luxuryTokens.colors.gold.base,
      defaultBg: luxuryTokens.colors.onyx.charcoal,
      defaultBorderColor: "#2B2B2B",
      defaultColor: "#F3F4F6",
      controlHeight: 38,
      borderRadius: 8,
    },
    Input: {
      colorBorder: "#2B2B2B",
      hoverBorderColor: luxuryTokens.colors.gold.base,
      colorBgContainer: luxuryTokens.colors.onyx.charcoal,
      borderRadius: 8,
      controlHeight: 38,
    },
    Modal: {
      contentBg: luxuryTokens.colors.onyx.charcoal,
      headerBg: luxuryTokens.colors.onyx.charcoal,
    },
    Drawer: {
      colorBgElevated: luxuryTokens.colors.onyx.charcoal,
    },
  },
};
