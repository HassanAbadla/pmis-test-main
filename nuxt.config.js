import colors from "vuetify/es5/util/colors"

export default {
  ssr: false,

  head: {
    titleTemplate: "%s - Pmis",
    title: "Pmis",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  css: ["~/assets/droid.css"],

  plugins: ["plugins/toast.js", "plugins/axios.js", "plugins/gmap.js", "~/plugins/global-components.js"],

  components: true,

  buildModules: ["@nuxtjs/vuetify"],

  modules: ["@nuxtjs/axios", "@nuxtjs/pwa", "@nuxtjs/i18n", "cookie-universal-nuxt", "@nuxtjs/auth-next"],

  i18n: {
    baseUrl: "/",
    parsePages: false,
    seo: false,
    defaultLocale: "en",
    strategy: "no_prefix",
    locales: [
      {
        code: "ar",
        name: "Arabic",
        iso: "ar-SA",
        file: "ar.js",
        dir: "rtl"
      },
      {
        code: "en",
        name: "English",
        iso: "en-US",
        file: "en.js",
        dir: "ltr"
      }
    ],
    lazy: true,
    langDir: "lang/",
    vueI18n: { fallbackLocale: "en" },
    detectBrowserLanguage: false,
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: "lang",
    //   alwaysRedirect: true,
    //   fallbackLocale: "en"
    // },
    onLanguageSwitched: (previous, current) => {
      if (process.client) {
        const DATE = new Date()
        DATE.setTime(DATE.getTime() + 365 * 24 * 3600 * 1000)
        document.cookie = "lang=" + current + "; path=/; expires=" + DATE.toUTCString()
      }
    }
  },

  axios: {
    baseURL: "https://api.saudiexpro.com/api"
  },

  pwa: {
    manifest: {
      lang: "en"
    }
  },

  vuetify: {
    rtl: true,
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#7843e9",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: "#7843e9",
          secondary: "#474E68"
        }
      },
      typography: {
        fontFamily: "fantasy"
      }
    }
  },

  auth: {
    redirect: {
      login: "/auth/login",
      home: "/"
    },
    watchLoggedIn: true,

    strategies: {
      local: {
        token: {
          property: "token",
          maxAge: 60 * 60 * 24 * 10
        },
        endpoints: {
          login: {
            url: "https://api.saudiexpro.com/api/login",
            method: "post",
            propertyName: "token"
          },
          logout: true,
          user: {
            url: "user",
            method: "get",
            propertyName: "user",
            autoFetch: true
          }
        }
      }
    },
    rewriteRedirects: false
  },

  build: {
    extend() {
      transpile: [/^gmap-vue($|\/)/]
    }
  }
}
