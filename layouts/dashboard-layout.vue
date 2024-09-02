<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <side-bar />
    </v-navigation-drawer>
    <v-app-bar flat app>
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="$vuetify.breakpoint.smAndUp"></v-app-bar-nav-icon>

      <nuxt-link class="text-decoration-none" to="/tenant">
        <v-avatar size="32" color="red" class="mr-2" v-if="$auth">
          <img v-if="$auth.user.tenant && $auth.user.tenant.logo" :src="$auth.user.tenant.logo" alt="Logo" />
          <span v-else class="white--text text-h8">
            {{ capitalizedInitials }}
          </span>
        </v-avatar>
        <span class="font-weight-bold">
          {{ $auth.user.tenant.company_name }}
        </span>
      </nuxt-link>
      <v-spacer />
      <change-language />
      <v-btn class="text-capitalize" text color="primary" to="/dashboard/settings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn class="text-capitalize" text color="red" @click="logout">
        <v-icon>mdi-logout</v-icon>
        {{ $t("auth.logout") }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <toast-notification />
      <breadcrumbs />
      <Nuxt />
    </v-main>

    <v-footer app>
      <span>PMIS &copy; {{ new Date().getFullYear() }} - Version: 1.8</span>
    </v-footer>
  </v-app>
</template>

<script>
import languageHandler from "~/mixins/languageHandler"
export default {
  name: "dashboard-layout",
  mixins: [languageHandler],

  data() {
    return {
      drawer: false
    }
  },

  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push(this.localePath("/"))
      })
    }
  },

  computed: {
    capitalizedInitials() {
      const words = this.$auth.user.tenant.company_name.split(" ")
      const initials = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase())
      return initials.join("")
    }
  },
}
</script>
