<template>
  <v-container>
    <v-layout column>
      <v-card v-if="company">
        <v-card-title>{{ company.name }}</v-card-title>
        <v-card-text>
          <!-- NEXT display company fields once getCompanyById is created and update create form -->
          <!-- <label-value-display :label="$t('form.description')" :value="company.description" /> -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editCompany">{{ $t("page.edit") }}</v-btn>
          <v-btn color="error" @click="showDeleteModal = true">{{ $t("page.delete") }}</v-btn>
        </v-card-actions>
        <delete-items-modal
          :show="showDeleteModal"
          :items="[company]"
          :close="closeDeleteModal"
          :config="deleteConfig"
        />
      </v-card>
      <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
    </v-layout>
  </v-container>
</template>

<script>
import { getCompanyById, deleteCompany } from "../../../../api/companies-api"
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
      company: null,
      error: null,
      loading: false,
      showDeleteModal: false,
      companyId: this.$route.params.id,
      deleteConfig: {
        delete: (id) => deleteCompany(id, this.$axios),
        path: "/tenant/companies"
      }
    }
  },
  methods: {
    fetchCompany() {
      this.loading = true
      getCompanyById(this.companyId, this.$axios)
        .then((res) => {
          this.company = res.data.data
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editCompany() {
      this.$router.push(this.localePath(`/tenant/companies/${this.companyId}/edit`))
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    },
    onItemDeleted() {
      this.$router.push(this.localePath("/tenant/companies"))
    }
  },
  mounted() {
    this.fetchCompany()
  }
}
</script>

<style scoped></style>
