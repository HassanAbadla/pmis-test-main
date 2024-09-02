<template>
  <v-container>
    <v-layout column>
      <v-card v-if="program">
        <v-card-title>{{ program?.name }}</v-card-title>
        <v-card-text>
          <label-value-display :label="$t('page.short_name')" :value="program?.short_name" />
          <label-value-display
            :label="$t('page.location')"
            :value="`${program?.city?.name}, ${program?.city?.country?.name}`"
          />
          <label-value-display :label="$t('page.description')" :value="program?.description" />
          <label-value-display :label="$t('page.code')" :value="program?.code" />
          <label-value-display :label="$t('page.active')" :value="program?.active" />
          <label-value-display :label="$t('page.estimated_cost')" :value="program?.estimated_cost" />
          <label-value-display :label="$t('page.portfolio')" :value="program?.portfolio?.name" />

          <v-divider></v-divider>
          <v-subheader>{{ $t("page.projects") }}</v-subheader>
          <ul>
            <li v-for="project in program.projects" :key="project.id">
              {{ project?.name }} ({{ project?.description }})
            </li>
          </ul>
          <v-subheader>{{ $t("page.user_access") }}</v-subheader>
          <ul>
            <li v-for="user in program.master_access" :key="user.id">
              {{ user?.user }} ({{ user?.full_access ? "Full" : "Partial" }})
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editProgram">{{ $t("page.edit") }}</v-btn>
          <v-btn color="error" @click="showDeleteModal = true">{{ $t("page.delete") }}</v-btn>
        </v-card-actions>
        <!-- Delete Modal -->
        <delete-items-modal
          :show="showDeleteModal"
          :items="[program]"
          :close="closeDeleteModal"
          :config="deleteConfig"
        />
      </v-card>

      <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
    </v-layout>
  </v-container>
</template>

<script>
import { getProgramById, deleteProgram } from "../../../../api/programs-api"
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
      program: null,
      error: null,
      loading: false,
      showDeleteModal: false,
      programId: this.$route.params.id,
      deleteConfig: {
        delete: (id) => deleteProgram(id, this.$axios),
        path: "/tenant/programs"
      }
    }
  },
  methods: {
    fetchProgram() {
      this.loading = true
      getProgramById(this.programId, this.$axios)
        .then((res) => {
          this.program = res.data.data
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editProgram() {
      this.$router.push(this.localePath(`/tenant/programs/${this.programId}/edit`))
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    },
    onItemDeleted() {
      this.$router.push(this.localePath("/tenant/programs"))
    }
  },
  mounted() {
    this.fetchProgram()
  }
}
</script>

<style scoped></style>
