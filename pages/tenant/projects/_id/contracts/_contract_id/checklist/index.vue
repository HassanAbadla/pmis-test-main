<template>
  <v-container>
    <v-row justify="center">
      <v-col max-width="100%" v-if="getProjectChecklist.length">
        <checklist-tree
          :title="`${project.title} Checklist`"
          :items="projectChecklist"
          :openNodes.sync="openNodes"
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
      <v-col cols="12" md="8" lg="6" v-else>
        <v-card>
          <v-card-title primary-title>Your Project does not have an Expo checklist yet</v-card-title>
          <v-card-actions>
            <v-btn
              v-if="fields.project_id"
              nuxt
              :to="localePath(`/tenant/projects/${fields.project_id}/contracts/${fields.contract_id}/checklist/create`)"
              color="success"
            >
              Create Expo Checklist
            </v-btn>
          </v-card-actions>
        </v-card>
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
      project: {},
      contract: null,
      logDialog: false,
      selected_item: null,
      openNodes: []
    }
  },

  computed: {
    ...mapGetters("projectChecklist", ["getProjectChecklist", "getOpenNodes"]),
    projectChecklist: {
      get() {
        return this.getProjectChecklist
      },
      set(value) {
        this.$store.commit("projectChecklist/SET_PROJECT_CHECKLIST", value)
      }
    }
  },

  methods: {
    ...mapActions("projectChecklist", ["fetchProjectChecklist"]),

    fetchContract() {
      getContractByIdAndProjectId(this.$route.params.id, this.$route.params.contract_id, this.$axios)
        .then((res) => {
          this.contract = res.data.data
          this.fetchProjectChecklist({
            project_id: this.contract.project_id,
            contract_id: this.contract.id
          })
        })
        .catch((error) => {
          console.error("Error fetching contract:", error)
        })
    },

    handleItemToggle(updatedItem) {
      const updateChecklist = (items) => {
        return items.map((item) => {
          if (item.id === updatedItem.id) {
            return updatedItem
          }
          if (item.children) {
            return { ...item, children: updateChecklist(item.children) }
          }
          return item
        })
      }

      this.projectChecklist = updateChecklist(this.projectChecklist)

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
    },

    getStageLink(item) {
      const projectId = this.$route.params.id
      return `/stages/contract/${projectId}/editStage/${item.id}`
    },

    openLogDialog(item) {
      this.selected_item = item
      this.logDialog = true
    }
  },

  mounted() {
    this.fetchContract()
    this.openNodes = this.getOpenNodes
  },

  watch: {
    openNodes(newValue) {
      this.$store.dispatch("projectChecklist/setOpenNodes", newValue)
    }
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
