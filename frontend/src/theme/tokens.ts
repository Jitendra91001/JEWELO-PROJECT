/**
 * JEWELO Luxury Jewellery Design System Tokens
 * Emulates the sophistication of high-end Maisons (Cartier, Tiffany & Co., Van Cleef & Arpels).
 */

export const luxuryTokens = {
  colors: {
    // Primary Metallic Gold Palette
    gold: {
      lightest: "#FAF5ED",
      lighter: "#EFE6D5",
      light: "#DFD0B8",
      base: "#C5A880",       // Signature Champagne Gold
      accent: "#B89668",
      dark: "#997D4D",       // Burnished Antique Gold
      darker: "#705A34",
      metallic: "linear-gradient(135deg, #DFD0B8 0%, #C5A880 50%, #997D4D 100%)",
      glow: "0 0 20px rgba(197, 168, 128, 0.25)",
    },

    // Obsidian & Onyx - Luxury Deep Neutrals
    onyx: {
      pure: "#000000",
      obsidian: "#121212",   // Ultra-deep luxury black
      charcoal: "#1A1A1A",   // Card background in dark mode
      slate: "#242424",      // Border and card surface
      muted: "#333333",
    },

    // Ivory & Alabaster - Pristine Light Backgrounds
    ivory: {
      pure: "#FFFFFF",
      cream: "#FDFCF7",      // Soft luxury warm canvas
      alabaster: "#FAF7F2",  // Secondary light surface
      whisper: "#F4EFEA",    // Subtle light card surface
      border: "#EAE4DC",     // Hairline border in light mode
    },

    // Pearlescent Rose Gold Palette
    roseGold: {
      light: "#F5E6E8",
      base: "#E8B4B8",
      dark: "#C98A90",
    },

    // Platinum & Fine Silver Palette
    platinum: {
      bright: "#F8F9FA",
      silver: "#E5E7EB",
      metallic: "#D1D5DB",
      steel: "#9CA3AF",
    },

    // Emerald & Gemstone Accents (Subtle, Muted)
    emerald: {
      subtle: "#E8F3ED",
      base: "#2D5A43",
      deep: "#1B3B2B",
    },

    // Crimson & Ruby Accents
    ruby: {
      subtle: "#FDF2F2",
      base: "#9B2C2C",
      deep: "#742A2A",
    },

    // Sapphire Accents
    sapphire: {
      subtle: "#EFF6FF",
      base: "#1E3A8A",
      deep: "#172554",
    },
  },

  typography: {
    fontDisplay: "'Playfair Display', Georgia, 'Times New Roman', serif",
    fontBody: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    tracking: {
      tighter: "-0.04em",
      tight: "-0.02em",
      normal: "0em",
      wide: "0.04em",
      wider: "0.08em",
      widest: "0.15em",
      luxury: "0.22em",     // Distinctive luxury uppercase kicker tracking
    },
  },

  borders: {
    hairline: "1px solid rgba(197, 168, 128, 0.28)",
    hairlineLight: "1px solid #EAE4DC",
    hairlineDark: "1px solid #292929",
    goldBorder: "1px solid #C5A880",
    radius: {
      none: "0px",
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      full: "9999px",
    },
  },

  shadows: {
    none: "none",
    hairline: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    subtle: "0 4px 20px -2px rgba(18, 18, 18, 0.04)",
    elevated: "0 10px 30px -4px rgba(18, 18, 18, 0.08)",
    goldGlow: "0 4px 24px rgba(197, 168, 128, 0.18)",
  },

  transitions: {
    luxury: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    fast: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  },
};
