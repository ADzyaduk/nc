// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Disable @nuxt/fonts (Fontsource API) — avoids "Could not fetch from api.fontsource.org" when offline/unreachable
  ui: {
    fonts: false,
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  // Supabase: url/key должны быть при сборке (в Docker передать через build-args / build env).
  // secretKey подхватится при запуске контейнера из SUPABASE_SECRET_KEY.
  supabase: {
    url: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.NUXT_SUPABASE_URL,
    key: process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.NUXT_SUPABASE_KEY,
    secretKey: process.env.SUPABASE_SECRET_KEY || process.env.NUXT_SUPABASE_SECRET_KEY,
    redirect: false,
    useSsrCookies: false,
  },

  // i18n config
  i18n: {
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'ru',
    strategy: 'no_prefix',
    langDir: '../i18n/locales',
    detectBrowserLanguage: false, // We detect from Telegram
  },

  runtimeConfig: {
    // Секреты только на сервере
    telegramBotToken:
      process.env.NUXT_TELEGRAM_BOT_TOKEN ||
      process.env.TELEGRAM_BOT_TOKEN ||
      '',
    openrouterApiKey:
      process.env.NUXT_OPENROUTER_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      '',
    openrouterModelId:
      process.env.NUXT_OPENROUTER_MODEL_ID ||
      process.env.OPENROUTER_MODEL_ID ||
      'mistralai/mistral-7b-instruct',
    // Supabase (секретный ключ только на сервере; при старте можно переопределить через NUXT_SUPABASE_SECRET_KEY)
    supabase: {
      secretKey:
        process.env.NUXT_SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SECRET_KEY ||
        '',
    },
    // Публичные — доступны на клиенте; при старте можно переопределить через NUXT_PUBLIC_SUPABASE_*
    public: {
      supabase: {
        url:
          process.env.NUXT_PUBLIC_SUPABASE_URL ||
          process.env.NUXT_SUPABASE_URL ||
          process.env.SUPABASE_URL ||
          '',
        key:
          process.env.NUXT_PUBLIC_SUPABASE_KEY ||
          process.env.NUXT_SUPABASE_KEY ||
          process.env.SUPABASE_KEY ||
          '',
      },
    },
  },

  // SPA mode — Telegram Mini App doesn't benefit from SSR
  ssr: false,

  app: {
    head: {
      title: 'Natal Chart',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#0f0a1e' },
      ],
      script: [
        { src: 'https://telegram.org/js/telegram-web-app.js' },
      ],
    },
  },
})