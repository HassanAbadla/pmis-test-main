<template>
  <div>
    <v-container fluid>
      <custom-table :title="$t('table.department_list')" :headers="headers" :tableConfig="tableConfig" />
    </v-container>
  </div>
</template>

<script>
import { deleteDepartment, getAllDepartments } from "../../../api/departments-api"
import CustomTable from "../../../components/custom-table/CustomTable.vue"

export default {
  components: { CustomTable },
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
          text: this.$t("table.name"),
          value: "name"
        },
        {
          text: this.$t("table.actions"),
          value: "actions",
          sortable: false
        }
      ],
      tableConfig: {
        fetch: this.fetchDepartments,
        delete: this.deleteDepartments,
        accessibleType: "department",
        itemPath: "/tenant/departments"
      }
    }
  },
  methods: {
    fetchDepartments() {
      return getAllDepartments(this.$axios)
    },
    deleteDepartments(id) {
      return deleteDepartment(id, this.$axios)
    },
    handleItemDeleted(deletedId) {
      this.items = this.items.filter((item) => item.id !== deletedId)
    }
  }
}
</script>

<style></style>
