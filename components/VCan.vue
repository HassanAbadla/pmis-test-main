<template>
  <div v-if="$auth.loggedIn">
    <div v-if="can(permission)">
      <slot />
    </div>
    <div v-if="!can(permission) && showMessage">
      <h1 class="text-center">403 You don't have permission</h1>
      <v-layout class="mt-5">
        <v-spacer />
        <v-btn color="primary" outlined nuxt :to="localePath('/dashboard')">Back to Dashboard</v-btn>
        <v-spacer />
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  name: "vCan",

  props: {
    permission: {
      type: String
    },
    showMessage: {
      type: Boolean
    }
  },
  data() {
    return {
      permissions: []
    }
  },
  mounted() {
    // get permissions from api
    this.permissions = this.$auth.user.permissions
  },
  methods: {
    can(permission) {
      return this.permissions.includes(permission)
    }
  }
}
</script>
