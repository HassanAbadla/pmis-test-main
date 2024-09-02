<template>
  <v-container>
    <v-layout column>
      <v-card v-if="project">
        <v-card-title>{{ project?.name }}</v-card-title>
        <v-card-text>
          <label-value-display :label="$t('page.short_name')" :value="project.short_name" />
          <label-value-display :label="$t('page.type')" :value="project.type?.name" />
          <label-value-display :label="$t('page.description')" :value="project?.description" />
          <label-value-display
            :label="$t('page.location')"
            :value="project.city ? `${project.city?.name}, ${project?.city.country.name}` : 'N/A'"
          />
          <label-value-display :label="$t('page.lat')" :value="project?.lat" />
          <label-value-display :label="$t('page.lng')" :value="project?.lng" />
          <label-value-display :label="$t('page.id_MOF')" :value="project?.id_MOF" />
          <label-value-display :label="$t('page.id_etimad')" :value="project?.id_etimad" />
          <label-value-display :label="$t('page.sub_category')" :value="project?.sub_category?.name" />
          <label-value-display :label="$t('page.vrp')" :value="project?.vrp" />
          <label-value-display :label="$t('page.project_status')" :value="project?.project_status" />
          <label-value-display :label="$t('page.project_phase')" :value="project?.project_phase" />
          <label-value-display :label="$t('page.distressed_projects')" :value="project?.distressed_projects" />
          <label-value-display :label="$t('page.project_duration')" :value="project?.project_duration" />
          <label-value-display
            :label="$t('page.scheduled_initiation_start_date')"
            :value="project?.scheduled_initiation_start_date"
          />
          <label-value-display
            :label="$t('page.scheduled_delivery_end_date')"
            :value="project?.scheduled_delivery_end_date"
          />
          <label-value-display :label="$t('page.program')" :value="project?.program?.name" />

          <label-value-display :label="$t('page.category')" :value="project?.category?.name" />

          <v-divider></v-divider>
          <v-subheader>{{ $t("page.contracts") }}</v-subheader>
          <ul>
            <li v-for="contract in project.contracts" :key="contract.id">({{ contract.description }})</li>
          </ul>

          <v-subheader>{{ $t("page.user_access") }}</v-subheader>
          <ul>
            <li v-for="user in project.master_access" :key="user.id">
              {{ user?.user }} ({{ user?.full_access ? "Full" : "Partial" }})
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editProject">{{ $t("page.edit") }}</v-btn>
          <v-btn color="error" @click="showDeleteModal = true">{{ $t("page.delete") }}</v-btn>
        </v-card-actions>
        <!-- Delete Modal -->

        <delete-items-modal
          :show="showDeleteModal"
          :items="[project]"
          :close="closeDeleteModal"
          :config="deleteConfig"
        />
      </v-card>

      <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
    </v-layout>
  </v-container>
</template>

<script>
import { getProjectById, deleteProject } from "../../../../api/projects-api"
import DeleteItemsModal from "../../../../components/custom-table/DeleteItemsModal.vue"
import LabelValueDisplay from "../../../../components/display-page/LabelValueDisplay.vue"
import { generateErrorMessage } from "../../../../helpers/error-helpers"

export default {
  layout: "dashboard-layout",
  components: {
    DeleteItemsModal,
    LabelValueDisplay
  },
  data() {
    return {
      project: null,
      error: null,
      loading: false,
      showDeleteModal: false,
      projectId: this.$route.params.id,
      deleteConfig: {
        delete: (id) => deleteProject(id, this.$axios),
        path: "/tenant/projects"
      }
    }
  },
  methods: {
    fetchProject() {
      this.loading = true
      getProjectById(this.projectId, this.$axios)
        .then((res) => {
          this.project = res.data.data
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editProject() {
      this.$router.push(this.localePath(`/tenant/projects/${this.projectId}/edit`))
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    }
  },
  mounted() {
    this.fetchProject()
  }
}
</script>

<style scoped></style>
