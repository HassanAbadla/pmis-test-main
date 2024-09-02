<template>
  <div>
    <v-container fluid>
      <custom-table :title="$t('table.portfolio_list')" :headers="headers" :tableConfig="tableConfig" />
    </v-container>
  </div>
</template>

<script>
import { deletePortfolio, getAllPortfolios } from "../../../api/portfolios-api"
import CustomTable from "../../../components/custom-table/CustomTable.vue"

export default {
  components: { CustomTable },
  layout: "dashboard-layout",
  middleware: "auth",
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
          text: this.$t("table.short_name"),
          value: "short_name"
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
          text: this.$t("table.start_date"),
          value: "start_date"
        },
        {
          text: this.$t("table.end_date"),
          value: "end_date"
        },
        {
          text: this.$t("table.actions"),
          value: "actions",
          sortable: false // Add actions column
        }
      ],
      tableConfig: {
        fetch: this.fetchPortfolios,
        delete: this.deletePortfolio,
        accessibleType: "portfolio",
        itemPath: "/tenant/portfolios"
      }
    }
  },
  methods: {
    fetchPortfolios() {
      return getAllPortfolios(this.$axios)
    },
    deletePortfolio(id) {
      return deletePortfolio(id, this.$axios)
    },
    handleItemDeleted(deletedId) {
      this.items = this.items.filter((item) => item.id !== deletedId)
    }
  }
}
</script>

<style scoped></style>
