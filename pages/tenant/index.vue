<template>
  <v-container fluid>
    <v-layout column>
      <v-btn nuxt :to="localePath('/tenant/users')">Manage Users</v-btn>
      <v-btn nuxt :to="localePath('/tenant/portfolios')">Manage portfolios</v-btn>
      <v-btn nuxt :to="localePath('/tenant/programs')">Manage programs</v-btn>
      <v-btn nuxt :to="localePath('/tenant/projects')">Manage projects</v-btn>
      <v-btn nuxt :to="localePath('/tenant/companies')">Manage Companies</v-btn>
      <v-btn nuxt :to="localePath('/tenant/departments')">Manage Departments</v-btn>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  layout: "dashboard-layout",
  middleware: "auth",
  data() {
    return {}
  }
}
</script>

<style></style>
