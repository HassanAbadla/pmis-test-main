<template>
  <v-app>
    <nav-bar />
    <v-main>
      <toast-notification />
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import languageHandler from "../mixins/languageHandler"

export default {
  name: "default-layout",
  mixins: [languageHandler]
}
</script>
