import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-02-16",
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages",
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/assets/*"],
        },
      },
    },
    compatibilityDate: "2025-02-16",
    compatibilityFlags: ["nodejs_compat"],
  },

  modules: [
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@pinia/nuxt"
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  hub: {
    db: "sqlite",
    cache: true,
  },

  runtimeConfig: {
    oauth: {
      google: {
        clientId: "",
        clientSecret: "",
      },
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      name: "expense-session",
      cookie: {
        sameSite: "lax",
      }
    },
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "https://spendwise-dh4.pages.dev"
    },
  },

  app: {
    head: {
      title: "Expense Tracker - Personal Finance Management",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Track your expenses and manage your budget with ease" },
      ],
    },
  },
});
