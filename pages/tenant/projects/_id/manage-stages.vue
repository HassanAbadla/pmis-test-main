<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="11">
          <v-card elevation-3 color="primary" class="white--text">
            <v-card-title>
              Project Stages
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                dark
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="getProjectStages"
              :search="search"
              hide-default-footer
              disable-pagination
              dense
              class="custom-row-height"
            >
              <template v-slot:item.is_started="{ item }">
                <v-icon v-if="item.is_started == 1" color="green">mdi-checkbox-marked-circle-outline</v-icon>
                <v-icon color="grey" v-else>mdi-radiobox-blank</v-icon>
              </template>

              <template v-slot:item.is_completed="{ item }">
                <v-icon v-if="item.is_completed == 1" color="green">mdi-checkbox-marked-circle-outline</v-icon>
                <v-icon color="grey" v-else>mdi-radiobox-blank</v-icon>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn color="blue" icon text @click="openEditDialog(item)">
                  <v-icon>mdi-circle-edit-outline</v-icon>
                </v-btn>
                <v-btn icon text v-if="item.is_started == 1" nuxt :to="getStageLink(item)" target="_blank">
                  <v-icon>mdi-eye-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:header.actions="{ header }">
                <span>{{ header.text }}</span>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <!-------------------------- DIALOG -------------------------------------->
      <v-dialog v-model="editDialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }"></template>
        <v-card>
          <v-card-title v-if="selected_item.stage && selected_item.stage.title">
            Edit {{ selected_item.stage.title }} ?
          </v-card-title>
          <div>
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="date_picker"
                  outlined
                  v-model="fields.start_date"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fields.start_date" @input="menu1 = false"></v-date-picker>
            </v-menu>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="date_picker"
                  outlined
                  v-model="fields.end_date"
                  label="End Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker :min="fields.start_date" v-model="fields.end_date" @input="menu2 = false"></v-date-picker>
            </v-menu>
            <v-menu
              v-model="menu3"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="date_picker"
                  outlined
                  v-model="fields.estimate_start_date"
                  label="Estimate Start Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fields.estimate_start_date" @input="menu3 = false"></v-date-picker>
            </v-menu>
            <v-menu
              v-model="menu4"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="date_picker"
                  outlined
                  v-model="fields.estimate_end_date"
                  label="Estimate End Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                :min="fields.estimate_start_date"
                v-model="fields.estimate_end_date"
                @input="menu4 = false"
              ></v-date-picker>
            </v-menu>
            <v-switch v-model="fields.is_started" label="Is Started" class="date_picker"></v-switch>
            <v-switch v-model="fields.is_completed" label="Is Completed" class="date_picker"></v-switch>
          </div>
          <v-card-actions>
            <v-btn @click="saveStages" class="white--text text-capitalize" color="primary">Save</v-btn>
            <v-btn @click="editDialog = false" class="white--text text-capitalize" color="primary">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"
import { getProjectById } from "../../../../api/projects-api"

export default {
  layout: "dashboard-layout",
  middleware: "auth",
  data() {
    return {
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      fields: {
        project_id: this.$route.params.id,
        start_date: "",
        end_date: "",
        estimate_start_date: "",
        estimate_end_date: "",
        project_stage: "",
        is_completed: "",
        is_started: ""
      },

      editDialog: false,
      selected_item: [],
      search: "",
      headers: [
        {
          text: "Stage",
          align: "start",
          sortable: true,
          value: "stage.title"
        },
        { text: "Estimate Start Date", value: "estimate_start_date" },
        { text: "Start Date", value: "start_date" },
        { text: "End Date", value: "end_date" },
        { text: "Estimate End Date", value: "estimate_end_date" },
        { text: "Is Completed", value: "is_completed" },
        { text: "Is Started", value: "is_started" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      project_stages: [],
      project: []
    }
  },
  methods: {
    ...mapActions("projectStages", ["fetchProjectStages"]),

    saveStages() {
      ;(this.fields.project_stage = this.selected_item.id), this.$store.dispatch("projectStages/saveStage", this.fields)
      this.editDialog = false
    },

    openEditDialog(item) {
      this.selected_item = item
      this.fields.is_started = item.is_started
      this.fields.is_completed = item.is_completed
      this.fields.start_date = item.start_date
      this.fields.end_date = item.end_date
      this.fields.estimate_start_date = item.estimate_start_date
      this.fields.estimate_end_date = item.estimate_end_date
      this.editDialog = true
    },
    getStageLink(item) {
      // Assuming you have the project ID stored in the route parameters
      const projectId = this.$route.params.id
      return `/stages/project/${projectId}/editStage/${item.stage.id}`
    },
    fetchProject() {
      getProjectById(this.$route.params.id, this.$axios)
        .then((res) => {
          this.project = res.data.data
        })
        .catch((error) => {
          console.error("Error submitting form:", error)
        })
    },
    isStarted(item) {
      console.log(item)
      // this.$store.dispatch("projectStages/changeDone", item.id);
    }
  },
  computed: {
    ...mapGetters("projectStages", ["getProjectStages"])
  },

  mounted() {
    this.fetchProject()
    this.fetchProjectStages({
      project_id: this.$route.params.id
    })
  }
}
</script>

<style lang="scss" scoped>
.custom-row-height tbody tr {
  height: 30px; /* Adjust the height as needed */
}

.date_picker {
  width: 80%;
  margin: auto;
}
</style>
