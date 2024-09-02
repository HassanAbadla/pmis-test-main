<template>
  <v-container>
    <v-layout column>
      <v-card v-if="user">
        <v-card-title>{{ user.full_name }}</v-card-title>
        <v-card-text>
          <label-value-display :label="$t('page.email')" :value="user?.email" />
          <label-value-display :label="$t('page.phone')" :value="user?.phone" />
          <label-value-display :label="$t('page.role')" :value="user?.role?.name" />
          <v-divider></v-divider>
          <v-subheader>{{ $t("page.permissions") }}</v-subheader>
          <ul>
            <li v-for="permission in user.full_permissions" :key="permission.id">{{ permission.name }}</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editUser">{{ $t("page.edit") }}</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-if="treeData">
        <v-card-title>{{ $t("page.data_access") }}</v-card-title>
        <v-card-text>
          <v-treeview :items="treeData" open-all activatable item-key="id" return-object>
            <template v-slot:prepend="{ item }">
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
            </template>
          </v-treeview>
        </v-card-text>
        <v-card-actions>
          <!-- <v-btn color="error" @click="showDeleteModal = true">{{ $t("page.delete") }}</v-btn> -->
        </v-card-actions>
      </v-card>

      <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
    </v-layout>
  </v-container>
</template>

<script>
import { getUserById } from "../../../../api/tenent-api"
import { constructTreeView } from "../../../../helpers/tree-helper"
import MessageDisplay from "@/components/MessageDisplay.vue"
import LabelValueDisplay from "../../../../components/display-page/LabelValueDisplay.vue"
import { generateErrorMessage } from "../../../../helpers/error-helpers"

export default {
  layout: "dashboard-layout",
  components: {
    MessageDisplay,
    LabelValueDisplay
  },
  data() {
    return {
      user: null,
      treeData: null,
      error: null,
      loading: false,
      userId: this.$route.params.id
    }
  },
  methods: {
    fetchUser() {
      this.loading = true
      getUserById(this.userId, this.$axios)
        .then((res) => {
          this.user = res.data.data
          // res.data.data.tree can look something like below, Please display in a nice way

          // Use constructTreeView to format tree structure
          this.treeData = constructTreeView(this.user.tree)
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editUser() {
      this.$router.push(this.localePath(`/tenant/users/${this.userId}/edit`))
    }
  },

  mounted() {
    this.fetchUser()
  }
}
</script>

<style scoped></style>
