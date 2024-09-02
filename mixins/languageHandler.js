export default {
  mounted() {
    this.$nextTick(() => {
      const savedLang = this.$cookies.get("lang") || this.$i18n.defaultLocale
      this.$store.dispatch("updateLanguage", savedLang)
    })
  },
  watch: {
    "$store.state.isRTL": {
      immediate: true,
      handler(newValue) {
        if (this.$vuetify) {
          this.$vuetify.rtl = newValue
        }
      }
    }
  }
}
