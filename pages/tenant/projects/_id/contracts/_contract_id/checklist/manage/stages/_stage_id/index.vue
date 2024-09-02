<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <checklist-tree
          :title="selectedStageTitle"
          :items="selectedStage"
          :openNodes.sync="openNodesComputed"
          @item-toggle="handleItemToggle"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import ChecklistTree from "../../../../../../../../../../components/checklist-tree/ChecklistTree.vue"

export default {
  components: { ChecklistTree },
  name: "SingleChecklistPage",

  layout: "dashboard-layout",
  middleware: "auth",

  computed: {
    ...mapGetters("projectChecklist", ["getSelectedStage", "getOpenNodes"]),
    selectedStage() {
      return this.getSelectedStage
    },
    selectedStageTitle() {
      return this.selectedStage[0]?.title ? `${this.selectedStage[0].title} Checklist` : "Loading Checklist"
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
    ...mapActions("projectChecklist", ["fetchProjectChecklist", "openNodes"]),

    handleItemToggle(updatedItem) {
      this.$store.commit("projectChecklist/UPDATE_CHECKLIST_ITEM", updatedItem)

      this.$axios
        .post("project-checklist/update", {
          project_checklist_id: updatedItem.id,
          project_id: this.$route.params.id,
          contract_id: this.$route.params.contract_id,
          done: updatedItem.done
        })
        .catch((error) => {
          console.error("Error updating checklist:", error)
        })
    }
  },

  mounted() {
    this.fetchProjectChecklist({
      project_id: this.$route.params.id,
      stage_id: this.$route.params.stage_id,
      contract_id: this.$route.params.contract_id
    })
  }
}
</script>

<style lang="scss" scoped>
.v-treeview-node__content {
  min-height: 20px;
  height: 35px;
}
.v-treeview-node__root {
  width: fit-content;
}
</style>
