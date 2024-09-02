<template>
  <div>
    <v-container fluid>
      <custom-table :title="$t('table.contracts')" :headers="headers" :tableConfig="tableConfig" />
    </v-container>
  </div>
</template>

<script>
import { deleteContract, getAllContractsByProjectId } from "../../../../../api/projects-api"
import CustomTable from "../../../../../components/custom-table/CustomTable.vue"

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
          text: this.$t("table.description"),
          value: "description"
        },
        {
          text: this.$t("table.user_access"),
          value: "access",
          sortable: false
        },
        {
          text: this.$t("table.actions"),
          value: "actions",
          sortable: false
        }
      ]
    }
  },
  computed: {
    projectId() {
      return this.$route.params.id
    },
    tableConfig() {
      return {
        fetch: this.fetchContracts,
        delete: this.removeContract,
        accessibleType: "contract",
        itemPath: `/tenant/projects/${this.projectId}/contracts`
      }
    }
  },
  methods: {
    fetchContracts() {
      return getAllContractsByProjectId(this.projectId, this.$axios)
    },
    removeContract(contractId) {
      return deleteContract(this.projectId, contractId, this.$axios)
    },
    handleItemDeleted(deletedId) {
      this.items = this.items.filter((item) => item.id !== deletedId)
    }
  }
}
</script>

<style scoped></style>
