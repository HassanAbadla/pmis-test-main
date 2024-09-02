<template>
  <v-layout class="pt-1 pb-1 flex-border" @click="toggleMenu">
    <users-with-access :users="usersWithAccess" />
    <user-menu :isMenuOpen="isMenuOpen" :access="access" />
  </v-layout>
</template>

<script>
import { giveDataAccess, removeDataAccess } from "../../api/tenent-api"
import UserMenu from "./UserMenu.vue"
import UsersWithAccess from "./UsersWithAccess.vue"

export default {
  name: "ManageAccess",
  components: { UserMenu, UsersWithAccess },
  props: {
    tableConfig: { type: Object, required: true },
    accessibleId: { type: Number, required: true },
    usersWithAccess: { type: Array, required: true }
  },
  data() {
    return {
      isMenuOpen: false,
      access: {
        give: this.giveAccess,
        remove: this.removeAccess,
        users: this.usersWithAccess
      }
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    giveAccess(userId, fullAccess) {
      const payload = {
        accessible_id: this.accessibleId,
        accessible_type: this.tableConfig.accessibleType,
        user_id: userId,
        full_access: fullAccess
      }
      giveDataAccess(payload, this.$axios)
        .then((res) => {
          const updatedUser = res.data.data
          const userIndex = this.usersWithAccess.findIndex((user) => user.user_id === updatedUser.user_id)

          if (userIndex !== -1) {
            // Update existing user
            this.$set(this.usersWithAccess, userIndex, updatedUser)
          } else {
            // Add new user
            // skipcq: JS-0611
            this.usersWithAccess.push(updatedUser)
          }
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    removeAccess(userId) {
      const payload = {
        accessible_id: this.accessibleId,
        accessible_type: this.tableConfig.accessibleType,
        user_id: userId
      }
      removeDataAccess(payload, this.$axios)
        .then(() => {
          const userIndex = this.usersWithAccess.findIndex((user) => user.user_id === userId)
          if (userIndex !== -1) {
            // skipcq: JS-0611
            this.usersWithAccess.splice(userIndex, 1)
          }
        })
        .catch((error) => {
          console.log(error.response)
        })
    }
  }
}
</script>

<style scoped>
.layout {
  cursor: pointer;
  border: 1px solid rgb(213, 208, 208);
  flex-wrap: nowrap;
  border-radius: 5px;
  padding: 2px;
}
</style>
