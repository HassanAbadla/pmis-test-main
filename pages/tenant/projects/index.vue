<template>
  <div>
    <v-container fluid>
      <custom-table :title="$t('table.project_list')" :headers="headers" :tableConfig="tableConfig" />
    </v-container>
  </div>
</template>

<script>
import { getAllProjects, deleteProject } from "../../../api/projects-api"
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
          text: this.$t("table.program"),
          value: "program.name"
        },

        {
          text: this.$t("table.user_access"),
          value: "access",
          sortable: false
        },
        {
          text: this.$t("table.contracts"),
          value: "contracts",
          sortable: false
        },

        {
          text: this.$t("table.actions"),
          value: "actions",
          sortable: false
        }
      ],
      tableConfig: {
        fetch: this.fetchProjects,
        delete: this.deleteProjects,
        accessibleType: "project",
        itemPath: "/tenant/projects"
      }
    }
  },
  methods: {
    fetchProjects() {
      return getAllProjects(this.$axios)
    },
    deleteProjects(id) {
      return deleteProject(id, this.$axios)
    },
    handleItemDeleted(deletedId) {
      this.items = this.items.filter((item) => item.id !== deletedId)
    }
  }
}
</script>

<style scoped></style>
