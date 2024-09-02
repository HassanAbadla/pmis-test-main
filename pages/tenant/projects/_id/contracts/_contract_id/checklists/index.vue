<template>
  <v-container>
    <v-row justify="center">
      <v-col max-width="100%" v-if="projectChecklist.length">
        <checklist-tree
          :title="`${contract?.name || 'Contract'} Checklist`"
          :items="projectChecklist"
          :openNodes.sync="openNodesComputed"
          :showAppend="true"
          @item-toggle="handleItemToggle"
        >
          <template #append="{ item }">
            <nuxt-link
              :to="getStageLink(item)"
              v-if="item.project_stage && item.project_stage[0] && item.project_stage[0].is_started == 1"
            >
              <v-icon small v-if="item.title">mdi-open-in-new</v-icon>
            </nuxt-link>
            <v-icon v-if="item.title" @click="openLogDialog(item)" color="green" small>mdi-information-outline</v-icon>
          </template>
        </checklist-tree>
      </v-col>
      <v-col cols="12" md="8" lg="6" v-else-if="!isLoading">
        <v-card>
          <v-card-title primary-title>Your Project does not have an Expo checklist yet</v-card-title>
          <v-card-actions>
            <v-btn
              v-if="fields.project_id"
              nuxt
              :to="
                localePath(`/tenant/projects/${fields.project_id}/contracts/${fields.contract_id}/checklists/create`)
              "
              color="success"
            >
              Create Expo Checklist
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-else>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    <v-dialog v-model="logDialog" max-width="600px">
      <v-card>
        <v-card-title v-if="selected_item">{{ selected_item.title }} Log</v-card-title>
        <v-card-text>- Zeus Gibbs Changed "Ratione ipsam sit" to done Today at 19:25</v-card-text>
        <v-card-text>- Zeus Gibbs Changed "Consequuntur quis rerum " to done Today at 13:00</v-card-text>
        <v-card-text>- Seddik Changed " quis rerum " to done Today at 10:00</v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { getContractByIdAndProjectId } from "../../../../../../../api/projects-api"
import ChecklistTree from "../../../../../../../components/checklist-tree/ChecklistTree.vue"

export default {
  name: "MultipleChecklistsPage",
  components: { ChecklistTree },
  layout: "dashboard-layout",
  middleware: "auth",

  data() {
    return {
      fields: {
        project_id: this.$route.params.id,
        contract_id: this.$route.params.contract_id
      },
      contract: null,
      logDialog: false,
      selected_item: null,
      isLoading: true,
      error: null
    }
  },

  computed: {
    ...mapGetters("projectChecklist", ["getProjectChecklist", "getOpenNodes"]),
    projectChecklist() {
      return this.getProjectChecklist
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
    ...mapActions("projectChecklist", ["fetchProjectChecklist", "updateChecklistItem", "openNodes"]),

    async fetchContract() {
      try {
        this.isLoading = true
        const res = await getContractByIdAndProjectId(
          this.$route.params.id,
          this.$route.params.contract_id,
          this.$axios
        )
        this.contract = res.data.data
        await this.fetchProjectChecklist({
          project_id: this.contract.project_id,
          contract_id: this.contract.id
        })
      } catch (error) {
        console.error("Error fetching contract or checklist:", error)
        this.error = "Failed to load contract or checklist. Please refresh the page."
      } finally {
        this.isLoading = false
      }
    },

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

    getStageLink(item) {
      const projectId = this.$route.params.id
      const contractId = this.$route.params.contract_id
      return `/tenant/projects/${projectId}/contracts/${contractId}/checklists/${item.id}`
    },

    openLogDialog(item) {
      this.selected_item = item
      this.logDialog = true
    }
  },

  mounted() {
    this.fetchContract()
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
