import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tartila Brand Scales
        emerald: {
          50: "#F0FDF4",
          100: "#DCFCEC",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        teal: {
          50: "#E0F2FE",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#0CA678",
          900: "#0F6B5E",
        },
        coral: {
          50: "#FFF8F5",
          100: "#FFE8E0",
          200: "#FFD1C5",
          300: "#FFB8A1",
          400: "#FF9966",
          500: "#FF6B6B",
          600: "#E63946",
          700: "#F15A24",
          800: "#DC2626",
          900: "#A80F0F",
        },

        // ============================================================
        // USTADZ PANEL DESIGN TOKENS (Professional Neo-Brutalism)
        // Chapter 4: Design Tokens dan Color System
        // ============================================================

        // Primary Colors
        primary: {
          DEFAULT: "#134E4A", // Identitas utama, heading, teks penting
          action: "#0D9488",  // Tombol utama, navigasi aktif
          light: "#CCFBF1",   // Background aktif dan highlight lembut
          dark: "#0F766E",
        },

        // Accent Colors
        accent: {
          yellow: "#FEF08A", // Highlight dan perhatian
          coral: "#FF6B6B",  // Aksi penting dan peringatan
        },

        // Neutral Colors
        neutral: {
          bg: "#F8FAFC",        // Latar utama
          surface: "#FFFFFF",   // Card dan panel
          secondary: "#F1F5F9", // Header tabel dan area sekunder
          border: "#DCE5E3",    // Border standar
          "border-strong": "#134E4A", // Border aksen Neo-Brutalism
          text: "#183B38",      // Teks utama
          muted: "#64748B",     // Deskripsi dan info tambahan
          disabled: "#94A3B8",  // Elemen nonaktif
        },

        // Status / Semantic Colors
        status: {
          success: {
            bg: "#DCFCE7",
            text: "#166534",
            border: "#86EFAC",
          },
          warning: {
            bg: "#FEF3C7",
            text: "#92400E",
            border: "#FDE68A",
          },
          danger: {
            bg: "#FEE2E2",
            text: "#B91C1C",
            border: "#FECACA",
          },
          info: {
            bg: "#DBEAFE",
            text: "#1D4ED8",
            border: "#BFDBFE",
          },
          completed: {
            bg: "#CCFBF1",
            text: "#0F766E",
            border: "#99F6E4",
          },
          neutral: {
            bg: "#F1F5F9",
            text: "#475569",
            border: "#CBD5E1",
          },
        },

        // Contextual Semantic Names (Struktur, Progres, Aksi, Penilaian)
        structure: {
          DEFAULT: "#93C5FD",
          light: "#DBEAFE",
          dark: "#1D4ED8",
          subtle: "#EFF6FF",
          border: "#1E40AF",
        },
        progress: {
          DEFAULT: "#A7F3D0",
          light: "#D1FAE5",
          dark: "#0D9488",
          subtle: "#F0FDF4",
          border: "#047857",
        },
        action: {
          DEFAULT: "#FDE047",
          light: "#FEF9C3",
          dark: "#CA8A04",
          subtle: "#FEFCE8",
          border: "#A16207",
        },
        assessment: {
          DEFAULT: "#FBCFE8",
          light: "#FCE7F3",
          dark: "#DB2777",
          subtle: "#FDF2F8",
          border: "#9D174D",
        },

        // Ustadz Namespace Tokens (Backward Compatibility & Direct Access)
        ustadz: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          "surface-subtle": "#F1F5F9",
          border: "#134E4A",
          "border-subtle": "#DCE5E3",
          accent: {
            DEFAULT: "#0D9488",
            soft: "#CCFBF1",
            dark: "#0F766E",
          },
          text: {
            DEFAULT: "#183B38",
            muted: "#64748B",
          },
          muted: "#64748B",
          danger: {
            DEFAULT: "#B91C1C",
            soft: "#FEE2E2",
          },
          skeleton: "#E2E8F0",
          structure: "#93C5FD",
          progress: "#A7F3D0",
          action: "#FDE047",
          assessment: "#FBCFE8",
        },

        background: "#F8FAFC",
        card: "#FFFFFF",
        border: "#DCE5E3",
      },

      // ============================================================
      // TYPOGRAPHY (Chapter 5: Plus Jakarta Sans & Hierarki)
      // ============================================================
      fontSize: {
        caption: [
          "clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem)",
          { lineHeight: "1.4", letterSpacing: "0.025em" },
        ],
        "body-sm": [
          "clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem)",
          { lineHeight: "1.5" },
        ],
        body: [
          "clamp(0.9375rem, 0.9rem + 0.25vw, 1rem)",
          { lineHeight: "1.5" },
        ],
        heading: [
          "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)",
          { lineHeight: "1.2", fontWeight: "800" },
        ],
        "heading-sm": [
          "clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)",
          { lineHeight: "1.25", fontWeight: "800" },
        ],
        "heading-lg": [
          "clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)",
          { lineHeight: "1.15", fontWeight: "900" },
        ],
        "heading-xl": [
          "clamp(1.75rem, 1.5rem + 1vw, 2.25rem)",
          { lineHeight: "1.1", fontWeight: "900" },
        ],
      },

      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
