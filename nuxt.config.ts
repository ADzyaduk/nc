// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  // Supabase config
  supabase: {
    redirect: false, // Telegram auth, not Supabase auth
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

  // Runtime config for secrets
  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    openrouterModelId: process.env.OPENROUTER_MODEL_ID || 'mistralai/mistral-7b-instruct',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
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