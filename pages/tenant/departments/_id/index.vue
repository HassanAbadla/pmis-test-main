<template>
  <v-container>
    <v-layout column>
      <v-card v-if="department">
        <v-card-title>{{ department.name }}</v-card-title>
        <v-card-text>
          <!-- Display department fields -->

          <label-value-display :label="$t('form.name')" :value="department.name" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editDepartment">{{ $t("page.edit") }}</v-btn>
          <v-btn color="error" @click="showDeleteModal = true">{{ $t("page.delete") }}</v-btn>
        </v-card-actions>
        <delete-items-modal
          :show="showDeleteModal"
          :items="[department]"
          :close="closeDeleteModal"
          :config="deleteConfig"
        />
      </v-card>
      <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
    </v-layout>
  </v-container>
</template>

<script>
import { getDepartmentById, deleteDepartment } from "../../../../api/departments-api"
import DeleteItemsModal from "../../../../components/custom-table/DeleteItemsModal.vue"
import LabelValueDisplay from "../../../../components/display-page/LabelValueDisplay.vue"
import { generateErrorMessage } from "../../../../helpers/error-helpers"

export default {
  name: "DepartmentDisplayPage",
  layout: "dashboard-layout",
  components: {
    DeleteItemsModal,
    LabelValueDisplay
  },
  data() {
    return {
      department: null,
      error: null,
      loading: false,
      showDeleteModal: false,
      departmentId: this.$route.params.id,
      deleteConfig: {
        delete: (id) => deleteDepartment(id, this.$axios),
        path: "/tenant/departments"
      }
    }
  },
  methods: {
    fetchDepartment() {
      this.loading = true
      getDepartmentById(this.departmentId, this.$axios)
        .then((res) => {
          this.department = res.data.data
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editDepartment() {
      this.$router.push(this.localePath(`/tenant/departments/${this.departmentId}/edit`))
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    },
    onItemDeleted() {
      this.$router.push(this.localePath("/tenant/departments"))
    }
  },
  mounted() {
    this.fetchDepartment()
  }
}
</script>
