<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-card class="mx-auto" max-width="100%">
          <v-toolbar color="primary" dark class="mb-5">
            <v-toolbar-title>Create Project Checklists</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn @click="submitChecklist" text>
              SAVE
              <v-icon>mdi-content-save-move</v-icon>
            </v-btn>
          </v-toolbar>

          <v-treeview class="treeview" color="primary" :items="project_checklist">
            <template v-slot:prepend="{ item }">
              <v-switch
                v-if="!item.code"
                v-model="fields.checklist_ids"
                :value="item.id"
                @change="handleChildrenSelection(item)"
              />
              <v-switch
                v-else
                v-model="parent_checklist_ids"
                :value="item.id"
                @change="handleChildrenSelection(item)"
              />
            </template>

            <template v-slot:label="{ item }">
              <span v-if="item.title">{{ item.title }}</span>
              <span v-if="item.description">{{ item.description }}</span>
            </template>
          </v-treeview>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "dashboard-layout",
  middleware: "auth",
  data() {
    return {
      fields: {
        checklist_ids: [], // Array to store selected items
        project_id: null,
        contract_id: null // Array to store selected items
      },
      parent_checklist_ids: [],
      project: [], // Array to store selected items
      contract: null,
      project_checklist: [] // Fetched from the API
    }
  },

  methods: {
    fetchStagesCheck() {
      this.$axios
        .get("stages/checklist")
        .then((res) => {
          this.items = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching stages:", error)
        })
    },
    fetchProjectChecklist() {
      this.$axios
        .get("stages/checklist")
        .then((res) => {
          this.project_checklist = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching stages:", error)
        })
    },

    fetchContract() {
      this.$axios
        .get("contract?contract_id=" + this.$route.params.id)
        .then((res) => {
          this.contract = res.data.data
        })
        .catch((error) => {
          console.error("Error submitting form:", error)
        })
    },
    submitChecklist() {
      this.fields.project_id = this.contract.project_id
      this.fields.contract_id = this.contract.id
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
            this.fields.checklist_ids.push(child.id)
          } else {
            // If the parent is deselected, deselect the child
            this.fields.checklist_ids = this.fields.checklist_ids.filter((id) => id !== child.id)
          }

          // Recursively handle children of the child
          this.handleChildrenSelection(child)
        })
      }
    }
  },

  mounted() {
    //this.fetchStagesCheck();
    this.fetchContract()
    this.fetchProjectChecklist()
  }
}
</script>
<style lang="scss">
.v-treeview-node__content {
  min-height: 20px;
  height: 35px;
}
.treeview {
  width: 300px;
}
</style>
