<template>
  <div>
    <form-wrapper v-if="!error" :title="title" @submit="submitContract" :loading="isSubmitting">
      <!-- <custom-input
        :label="$t('name')"
        v-model="fields.name"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      /> -->
      <custom-dropdown
        :items="companies"
        item-value="id"
        item-text="name"
        :label="$t('auth.company_name')"
        v-model="fields.company_id"
        :errors="errors.company_id"
        @clear-errors="clearError('company_id')"
      />
      <custom-dropdown
        :items="projects"
        item-value="id"
        item-text="name"
        :label="$t('project_name')"
        v-model="fields.project_id"
        :errors="errors.project_id"
        :disabled="true"
        @clear-errors="clearError('project_id')"
      />
      <custom-dropdown
        :items="contract_disiplines"
        item-value="id"
        item-text="name"
        :label="$t('contract_desiplines')"
        v-model="fields.contract_disipline_id"
        :errors="errors.contract_disipline_id"
        @clear-errors="clearError('contract_disipline_id')"
      />
      <custom-dropdown
        :items="contract_status"
        item-value="id"
        item-text="name"
        :label="$t('contract_status')"
        v-model="fields.contract_status_id"
        :errors="errors.contract_status_id"
        @clear-errors="clearError('contract_status_id')"
      />
      <custom-dropdown
        :items="contract_types"
        item-value="id"
        item-text="name"
        :label="$t('contract_type')"
        v-model="fields.contract_type_id"
        :errors="errors.contract_type_id"
        @clear-errors="clearError('contract_type_id')"
      />

      <!--------------- DATE PICKER ----------------------->
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
            outlined
            v-model="fields.start_date"
            :label="$t('start_date')"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            :error-messages="errors.start_date"
            @focus="clearError('start_date')"
          ></v-text-field>
        </template>
        <v-date-picker v-model="fields.start_date" @input="menu2 = false"></v-date-picker>
      </v-menu>
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
            outlined
            v-model="fields.end_date"
            :label="$t('end_date')"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            :error-messages="errors.end_date"
            @focus="clearError('end_date')"
          ></v-text-field>
        </template>
        <v-date-picker v-model="fields.end_date" @input="menu1 = false"></v-date-picker>
      </v-menu>
      <custom-text-area
        v-model="fields.description"
        :label="$t('description')"
        :errors="errors.description"
        @clear-errors="clearError('description')"
      />
    </form-wrapper>
    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </div>
</template>

<script>
import { getAllCompanies } from "../../api/companies-api"
import { getContractDisciplines, getContractStatus, getContractTypes } from "../../api/contract-api"
import { createContract, getProjectById, updateContract, getContractByIdAndProjectId } from "../../api/projects-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  components: { MessageDisplay },
  name: "ContractForm",
  props: {
    editForm: {
      type: Boolean,
      default: false
    }
  },
  layout: "dashboard-layout",
  middleware: "auth",

  data() {
    return {
      valid: false,
      loading: false,
      isSubmitting: false,
      error: null,
      fields: {
        name: "",
        company_id: "",
        project_id: "",
        contract_disipline_id: "",
        contract_status_id: "",
        contract_type_id: "",
        start_date: "",
        end_date: "",
        description: ""
      },
      errors: {},
      companies: [],
      contract_disiplines: [],
      contract_types: [],
      contract_status: [],
      projects: [],
      menu1: false,
      menu2: false,
      start_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
    }
  },
  computed: {
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.contract")}`
    }
  },
  methods: {
    submitContract() {
      this.isSubmitting = true
      const projectId = this.$route.params.id
      const contractId = this.$route.params.contract_id
      const apiToCall = this.editForm ? updateContract : createContract
      const payload = { ...this.fields }
      apiToCall(projectId, payload, this.$axios, contractId)
        .then(() => {
          this.$router.push(this.localePath(`/tenant/projects/${projectId}/contracts`))
        })
        .catch((error) => {
          if (error?.response.data) {
            this.errors = error.response.data.errors || {}
          } else {
            console.error(`Error ${this.editForm ? "editing" : "creating"} contract:`, error)
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    fetchContract() {
      if (this.editForm) {
        const projectId = this.$route.params.id
        const contractId = this.$route.params.contract_id
        getContractByIdAndProjectId(projectId, contractId, this.$axios)
          .then((res) => {
            const data = res.data.data
            this.fields = {
              name: data.name,
              company_id: data.company.id,
              project_id: data.project_id,
              contract_disipline_id: data.disipline.id,
              contract_status_id: data.status.id,
              contract_type_id: data.type.id,
              start_date: data.start_date,
              end_date: data.end_date,
              description: data.description
            }
          })
          .catch((error) => {
            this.error = generateErrorMessage(error, this.$i18n)
          })
      }
    },

    fetchCompanies() {
      getAllCompanies(this.$axios)
        .then((res) => {
          this.companies = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching companies:", error)
        })
    },

    fetchProject() {
      getProjectById(this.$route.params.id, this.$axios)
        .then((res) => {
          this.projects = [res.data.data]
          this.fields.project_id = this.projects[0].id
        })
        .catch((error) => {
          console.error("Error fetching projects:", error)
        })
    },
    fetchDisiplines() {
      getContractDisciplines(this.$axios)
        .then((res) => {
          this.contract_disiplines = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching contract_disiplines:", error)
        })
    },
    fetchContractStatus() {
      getContractStatus(this.$axios)
        .then((res) => {
          this.contract_status = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching contract_status:", error)
        })
    },
    fetchContractTypes() {
      getContractTypes(this.$axios)
        .then((res) => {
          this.contract_types = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching contract_types:", error)
        })
    },
    clearError(field) {
      this.errors[field] = []
    }
  },

  mounted() {
    this.fetchCompanies()
    this.fetchProject()
    this.fetchDisiplines()
    this.fetchContractStatus()
    this.fetchContractTypes()
    if (this.editForm) {
      this.fetchContract()
    }
  }
}
</script>

<style scoped>
/*  */
</style>
