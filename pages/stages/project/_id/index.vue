<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col max-width="100%" v-if="getProjectChecklist.length">
          <v-toolbar>
            <v-checkbox class="top-checkbox" label="First Level" @click="openNodes1"></v-checkbox>
            <v-checkbox
              class="top-checkbox"
              v-if="getOpenNodes.length > 0"
              label="Second Level"
              @click="openNodes2"
            ></v-checkbox>
          </v-toolbar>
          <v-card class="mx-auto" max-width="100%" flat>
            <v-toolbar color="primary" dark class="mb-5">
              <v-toolbar-title>{{ project.title }} Checklist</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-treeview :open="getOpenNodes" width="auto" class="treeview" color="primary" :items="getProjectChecklist">
              <template v-slot:append="{ item }">
                <nuxt-link
                  :to="getStageLink(item)"
                  v-if="item.project_stage && item.project_stage[0] && item.project_stage[0].is_started == 1"
                >
                  <v-icon small v-if="item.title">mdi-open-in-new</v-icon>
                </nuxt-link>
                <v-icon v-if="item.title" @click="openLogDialog(item)" color="green" small>
                  mdi-information-outline
                </v-icon>
              </template>
              <template v-slot:prepend="{ item }">
                <v-checkbox
                  v-if="!item.title"
                  dense
                  :disabled="item.disabled"
                  v-model="getDoneChecklistIds"
                  :value="item.id"
                  @click="checked(item)"
                />
                <v-icon
                  v-else
                  :color="!item.project_stage[0] || item.project_stage[0].is_started == 0 ? 'grey' : 'blue'"
                >
                  mdi-circle-slice-8
                </v-icon>
              </template>

              <template v-slot:label="{ item }">
                <span v-if="item.title">{{ item.title }}</span>
                <span v-if="item.description">{{ item.description }}</span>
              </template>
            </v-treeview>
          </v-card>
        </v-col>
        <v-col cols="12" md="8" lg="6" v-else>
          <v-card>
            <v-card-title primary-title>Your Project do not have A Expo checklist yet</v-card-title>
            <v-card-actions>
              <v-btn nuxt :to="'/stages/project/' + this.$route.params.id + '/createChecklist'" color="success">
                Create Expo Checklist
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="logDialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }"></template>
        <v-card>
          <v-card-title v-if="selected_item">{{ selected_item.title }} Log</v-card-title>
          <v-card-text>- Zeus Gibbs Changed "Ratione ipsam sit" to done Today at 19:25</v-card-text>
          <v-card-text>- Zeus Gibbs Changed "Consequuntur quis rerum " to done Today at 13:00</v-card-text>
          <v-card-text>- Seddik Changed " quis rerum " to done Today at 10:00</v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  layout: "dashboard-layout",
  middleware: "auth",
  data() {
    return {
      fields: {
        project_checklist_id: "", // Array to store selected items
        project_id: this.$route.params.id, // Array to store selected items
        done: null // Array to store selected items
      },
      checklist_ids: [], // Array to store selected items
      parent_checklist_ids: [],
      project: [], // Array to store selected items
      project_checklist: [], // Fetched from the API
      logDialog: false,
      selected_item: null
    }
  },

  methods: {
    ...mapActions("projectChecklist", ["fetchProjectChecklist"]),
    fetchProject() {
      this.$axios
        .get("project?project_id=" + this.$route.params.id)
        .then((res) => {
          this.project = res.data.data
        })
        .catch((error) => {
          console.error("Error submitting form:", error)
        })
    },
    submitChecklist() {
      this.fields.project_id = this.$route.params.id

      this.$axios
        .post("checklist/store?", this.fields)
        .then((response) => {})
        .catch((error) => {
          console.error("Error submitting form:", error)
        })
    },

    handleChildrenSelection(Item) {
      if (Item.children && Item.children.length > 0) {
        Item.children.forEach((child) => {
          // Update the selected state for each child
          if (this.parent_checklist_ids.includes(Item.id)) {
            // If the parent is selected, select the child
            this.checklist_ids.push(child.id)
          } else {
            // If the parent is deselected, deselect the child
            this.checklist_ids = this.checklist_ids.filter((id) => id !== child.id)
          }

          // Recursively handle children of the child
          this.handleChildrenSelection(child)
        })
      }
    },
    checked(item) {
      this.fields.project_checklist_id = item.id
      if (this.getDoneChecklistIds.includes(item.id)) {
        this.fields.done = false
      } else {
        this.fields.done = true
      }
      this.$store.dispatch("projectChecklist/changeDone", item.id)
      this.$axios
        .post("project-checklist/update", this.fields)
        .then((response) => {})
        .catch((error) => {
          console.error("Error submitting form:", error)
        })
    },
    openNodes1() {
      this.$store.dispatch(
        "projectChecklist/openNodes1",
        [1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 18, 9, 19, 10]
      )
    },
    extractProjectChecklistIds(data) {
      const checklistIds = []

      data.forEach((item) => {
        if (item.hasOwnProperty("project_checklists") && Array.isArray(item.children)) {
          item.children.forEach((checklist) => {
            if (checklist.hasOwnProperty("id")) {
              checklistIds.push(checklist.id)
            }

            // Check if the checklist has children
            if (checklist.hasOwnProperty("children") && Array.isArray(checklist.children)) {
              checklist.children.forEach((child) => {
                if (child.hasOwnProperty("id")) {
                  checklistIds.push(child.id)
                }
              })
            }
          })
        }
      })

      return checklistIds
    },
    openNodes2() {
      const opened_ids = this.extractProjectChecklistIds(this.getProjectChecklist)
      this.$store.dispatch("projectChecklist/openNodes2", opened_ids)
    },
    getStageLink(item) {
      // Assuming you have the project ID stored in the route parameters
      const projectId = this.$route.params.id
      return `/stages/project/${projectId}/editStage/${item.id}`
    },
    openLogDialog(item) {
      this.selected_item = item
      this.logDialog = true
    }
  },
  computed: {
    ...mapGetters("projectChecklist", ["getProjectChecklist", "getDoneChecklistIds", "getOpenNodes"])
  },
  mounted() {
    this.fetchProjectChecklist({
      project_id: this.$route.params.id
    })
    this.fetchProject()
    // this.checklist_ids = this.getDoneChecklistIds;
  }
}
</script>
<style lang="scss">
.v-treeview-node__content {
  min-height: 20px;
  height: 35px;
}
.v-treeview-node__root {
  width: fit-content;
}
.top-checkbox {
  margin-top: 24px !important;
  margin-left: 11px !important;
}
</style>
