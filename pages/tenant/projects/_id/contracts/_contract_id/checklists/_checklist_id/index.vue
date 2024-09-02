<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
        <checklist-tree
          v-else-if="selectedStage && selectedStage.length > 0"
          :title="selectedStageTitle"
          :items="selectedStage"
          :openNodes.sync="openNodesComputed"
          @item-toggle="handleItemToggle"
        />
        <v-alert v-else type="warning">No checklist found for this stage.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import ChecklistTree from "../../../../../../../../components/checklist-tree/ChecklistTree.vue"

export default {
  components: { ChecklistTree },
  name: "SingleChecklistPage",

  layout: "dashboard-layout",
  middleware: "auth",

  data() {
    return {
      error: null,
      isLoading: true
    }
  },

  computed: {
    ...mapGetters("projectChecklist", ["getSelectedStage", "getOpenNodes"]),
    selectedStage() {
      return this.getSelectedStage
    },
    selectedStageTitle() {
      return this.selectedStage && this.selectedStage[0]?.title
        ? `${this.selectedStage[0].title} Checklist`
        : "Checklist"
    },
    openNodesComputed: {
      get() {
        return this.getOpenNodes
      },
      set(value) {
        this.openNodes(value)
      }
    }
  },

  methods: {
    ...mapActions("projectChecklist", ["fetchProjectChecklist", "openNodes", "updateChecklistItem"]),

    handleItemToggle(updatedItem) {
      this.updateChecklistItem({
        updatedItem,
        projectId: this.$route.params.id,
        contractId: this.$route.params.contract_id
      }).catch((error) => {
        console.error("Error updating checklist:", error)
        this.error = "Failed to update checklist item. Please try again."
      })
    },

    async fetchData() {
      try {
        this.isLoading = true
        this.error = null
        await this.fetchProjectChecklist({
          project_id: this.$route.params.id,
          stage_id: this.$route.params.checklist_id,
          contract_id: this.$route.params.contract_id
        })
      } catch (error) {
        console.error("Error fetching project checklist:", error)
        this.error = "Failed to load checklist. Please refresh the page."
      } finally {
        this.isLoading = false
      }
    }
  },

  mounted() {
    this.fetchData()
  }
}
</script>
