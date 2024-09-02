<template>
  <div>
    <v-select
      v-if="select"
      class="mt-4"
      :items="$i18n.locales"
      v-model="$store.state.language"
      @change="changeLanguage"
      item-text="name"
      item-value="code"
      outlined
      :label="$t('language')"
    />
    <div v-else>
      <v-btn text v-if="$store.state.language === 'ar'" @click="changeLanguage('en')" class="font-weight-bold">
        EN
      </v-btn>
      <v-btn text v-if="$store.state.language === 'en'" @click="changeLanguage('ar')">
        <v-icon>mdi-abjad-arabic</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangeLanguage",
  props: {
    select: Boolean
  },
  methods: {
    changeLanguage(lang) {
      this.$store.dispatch("updateLanguage", lang || this.$store.state.language)
    }
  }
}
</script>
