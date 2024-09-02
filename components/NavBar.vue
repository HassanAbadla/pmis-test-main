<!-- components/Navbar.vue -->
<template>
  <v-app-bar flat app>
    <v-toolbar-title>
      <nuxt-link class="text-decoration-none" :to="localePath('/')">PMIS</nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <change-language />
    <v-btn class="mx-2 rounded-0" color="primary" outlined v-if="!$auth.loggedIn" :to="localePath('/register')">
      {{ $t("auth.register") }}
    </v-btn>
    <v-btn class="mx-2 rounded-0" v-if="!$auth.loggedIn" color="primary" :to="localePath('/auth/login')">
      {{ $t("auth.login") }}
    </v-btn>
    <div v-else>
      <v-btn text :to="localePath('/dashboard')">My dashboard</v-btn>
      <v-btn text @click="$auth.logout()">Logout</v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      drawer: false
    }
  }
}
</script>

<style>
/* header.v-sheet.theme--light.v-toolbar.v-toolbar--flat.v-app-bar.v-app-bar--fixed.v-app-bar--is-scrolled.transparent {
  background: white !important;
} */
</style>
