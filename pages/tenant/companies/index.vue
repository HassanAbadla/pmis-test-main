<template>
  <div>
    <v-container fluid>
      <custom-table :title="$t('table.company_list')" :headers="headers" :tableConfig="tableConfig" />
    </v-container>
  </div>
</template>

<script>
import { deleteCompany, getAllCompanies } from "../../../api/companies-api"
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
          sortable: false // Add actions column
        }
      ],
      tableConfig: {
        fetch: this.fetchCompanies,
        delete: this.deleteCompanies,
        accessibleType: "company",
        itemPath: "/tenant/companies"
      }
    }
  },
  methods: {
    fetchCompanies() {
      return getAllCompanies(this.$axios)
    },
    deleteCompanies(id) {
      return deleteCompany(id, this.$axios)
    },
    handleItemDeleted(deletedId) {
      this.items = this.items.filter((item) => item.id !== deletedId)
    }
  }
}
</script>

<style></style>
