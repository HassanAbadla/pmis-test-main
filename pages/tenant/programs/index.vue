<template>
  <div>
    <v-container fluid>
      <custom-table :title="$t('table.program_list')" :headers="headers" :tableConfig="tableConfig" />
    </v-container>
  </div>
</template>

<script>
import { getAllPrograms, deleteProgram } from "../../../api/programs-api"
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
          text: this.$t("table.portfolio"),
          value: "portfolio.name"
        },
        {
          text: this.$t("table.description"),
          value: "description"
        },
        {
          text: this.$t("table.user_access"),
          value: "access",
          sortable: false
        },
        {
          text: this.$t("table.city"),
          value: "city.name"
        },
        {
          text: this.$t("table.actions"),
          value: "actions",
          sortable: false // Add actions column
        }
      ],
      tableConfig: {
        fetch: this.fetchPrograms,
        delete: this.deletePrograms,
        accessibleType: "program",
        itemPath: "/tenant/programs"
      }
    }
  },
  methods: {
    fetchPrograms() {
      return getAllPrograms(this.$axios)
    },
    deletePrograms(id) {
      return deleteProgram(id, this.$axios)
    },
    handleItemDeleted(deletedId) {
      this.items = this.items.filter((item) => item.id !== deletedId)
    }
  }
}
</script>

<style scoped></style>
