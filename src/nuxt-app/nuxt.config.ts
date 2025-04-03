import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@vueuse/nuxt'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // css: ['~/assets/css/resume.css'],
  css: ['~/assets/css/main.css', '~/assets/css/print.css'],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap' },
      ],
    },
    baseURL: process.env.NODE_ENV === 'development' ? '/' : '/dist/resume_v4/',
  },

  // SSR を無効にしたい場合 (SPA としてのみ利用する場合)
  ssr: false,

  // ルートごとに設定を変更したい場合
  // routeRules: {
  //   // Homepage pre-rendered at build time
  //   '/': { prerender: true },
  //   // Products page generated on demand, revalidates in background, cached until API response changes
  //   '/products': { swr: true },
  //   // Product pages generated on demand, revalidates in background, cached for 1 hour (3600 seconds)
  //   '/products/**': { swr: 3600 },
  //   // Blog posts page generated on demand, revalidates in background, cached on CDN for 1 hour (3600 seconds)
  //   '/blog': { isr: 3600 },
  //   // Blog post page generated on demand once until next deployment, cached on CDN
  //   '/blog/**': { isr: true },
  //   // Admin dashboard renders only on client-side
  //   '/admin/**': { ssr: false },
  //   // Add cors headers on API routes
  //   '/api/**': { cors: true },
  //   // Redirects legacy urls
  //   '/old-page': { redirect: '/new-page' }
  // }
})