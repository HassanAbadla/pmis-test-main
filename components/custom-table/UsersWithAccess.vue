<template>
  <div>
    <v-tooltip v-for="(user, index) in displayedUsers" :key="user.id" top :disabled="false">
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
          v-if="index < 3 || users.length <= 4"
          :color="user.full_access ? 'green' : 'yellow'"
          size="30"
          v-bind="attrs"
          v-on="on"
          :class="['avatar', { 'ml-n2': index !== 0 }]"
          :style="{ zIndex: users.length - index }"
        >
          <img v-if="user.avatar" :src="user.avatar" :alt="user.user" />
          <span v-else class="white--text text-caption font-weight-bold">{{ user.short_name }}</span>
        </v-avatar>
        <v-avatar
          v-else
          size="30"
          v-bind="attrs"
          v-on="on"
          class="avatar-more ml-n2"
          :style="{ zIndex: users.length - index }"
        >
          <span class="white--text text-caption font-weight-bold">+{{ users.length - 3 }}</span>
        </v-avatar>
      </template>
      <span class="text-capitalize">{{ user.user }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "UsersWithAccess",
  props: {
    users: { type: Array, required: true }
  },
  computed: {
    displayedUsers() {
      if (this.users.length > 4) {
        return this.users.slice(0, 3).concat([
          {
            id: "more",
            full_name: `+${this.users.length - 3}`,
            short_name: `+${this.users.length - 3}`
          }
        ])
      }
      return this.users
    }
  }
}
</script>

<style scoped>
.avatar {
  border: 1px solid #fff !important;
  background: purple;
  box-sizing: border-box;
}
.avatar-more {
  border: 1px solid #fff !important;
  background: gray;
  box-sizing: border-box;
}
</style>
