<template>
  <v-container>
    <v-layout column>
      <custom-table :title="$t('table.user_list')" :headers="headers" :tableConfig="tableConfig" :hideDelete="true" />
    </v-layout>
  </v-container>
</template>

<script>
import { getUsers } from "../../../api/tenent-api"
import CustomTable from "../../../components/custom-table/CustomTable.vue"

export default {
  components: { CustomTable },
  middleware: "auth",
  layout: "dashboard-layout",
  data() {
    return {
      headers: [
        {
          text: this.$t("table.id"),
          align: "start",
          value: "id"
        },
        {
          text: this.$t("table.full_name"),
          value: "full_name"
        },
        {
          text: this.$t("table.role"),
          value: "role.name"
        },
        {
          text: this.$t("table.email"),
          value: "email"
        },
        {
          text: this.$t("table.actions"),
          value: "actions",
          sortable: false // Add actions column
        }
      ],
      tableConfig: {
        fetch: this.fetchUsers,
        // delete: this.deleteUser,
        itemPath: "/tenant/users"
      }
    }
  },
  methods: {
    fetchUsers() {
      return getUsers(this.$axios)
    }
  }
}
</script>

<style scoped></style>
