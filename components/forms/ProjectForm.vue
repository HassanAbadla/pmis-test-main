<template>
  <div>
    <form-wrapper v-if="!error && !loading" :title="title" @submit="submitProject" :loading="isSubmitting">
      <v-tabs v-model="tab">
        <v-tab>{{ $t("form.global_info") }}</v-tab>
        <v-tab>{{ $t("form.ids") }}</v-tab>
        <v-tab>{{ $t("form.vrp") }}</v-tab>
        <v-tab>{{ $t("form.timeline") }}</v-tab>
        <v-tab>{{ $t("form.location") }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-input
                  :label="$t('form.name')"
                  v-model="fields.name"
                  :errors="errors.name"
                  @clear-errors="clearError('name')"
                />
                <custom-input
                  :label="$t('form.short_name')"
                  v-model="fields.short_name"
                  :errors="errors.short_name"
                  @clear-errors="clearError('short_name')"
                />
                <custom-dropdown
                  :items="project_types"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.project_type_id')"
                  v-model="fields.project_type_id"
                  :errors="errors.project_type_id"
                  @clear-errors="clearError('project_type_id')"
                />
                <custom-dropdown
                  :items="categories"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.category_id')"
                  v-model="fields.category_id"
                  :errors="errors.category_id"
                  @clear-errors="clearError('category_id')"
                />
                <custom-dropdown
                  v-if="fields.category_id"
                  :items="sub_categories"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.sub_category_id')"
                  v-model="fields.sub_category_id"
                  :errors="errors.sub_category_id"
                  @clear-errors="clearError('sub_category_id')"
                />
                <custom-dropdown
                  :items="departments"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.department_id')"
                  v-model="fields.department_id"
                  :errors="errors.department_id"
                  @clear-errors="clearError('department_id')"
                />
                <custom-dropdown
                  :items="programs"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.program_id')"
                  v-model="fields.program_id"
                  :errors="errors.program_id"
                  @clear-errors="clearError('program_id')"
                />
                <custom-text-area
                  v-model="fields.description"
                  :label="$t('form.description')"
                  outlined
                  :errors="errors.description"
                  @clear-errors="clearError('description')"
                />
                <custom-checkbox v-model="fields.active" :label="$t('form.active')" />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-input
                  :label="$t('form.id_cse')"
                  v-model="fields.id_cse"
                  :errors="errors.id_cse"
                  @clear-errors="clearError('id_cse')"
                />
                <custom-input
                  :label="$t('form.id_MOF')"
                  v-model="fields.id_MOF"
                  :errors="errors.id_MOF"
                  @clear-errors="clearError('id_MOF')"
                />
                <custom-input
                  :label="$t('form.id_etimad')"
                  v-model="fields.id_etimad"
                  :errors="errors.id_etimad"
                  @clear-errors="clearError('id_etimad')"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-input
                  :label="$t('form.vrp_name')"
                  v-model="fields.vrp_name"
                  :errors="errors.vrp_name"
                  @clear-errors="clearError('vrp_name')"
                />
                <custom-input
                  :label="$t('form.vrp_initiative')"
                  v-model="fields.vrp_initiative"
                  :errors="errors.vrp_initiative"
                  @clear-errors="clearError('vrp_initiative')"
                />
                <custom-input
                  :label="$t('form.vrp_uic')"
                  v-model="fields.vrp_uic"
                  :errors="errors.vrp_uic"
                  @clear-errors="clearError('vrp_uic')"
                />
                <custom-checkbox v-model="fields.is_vrp" :label="$t('form.is_vrp')" />
                <custom-checkbox v-model="fields.is_linked" :label="$t('form.is_linked')" />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-dropdown
                  :items="statuses"
                  item-value="name"
                  item-text="name"
                  :label="$t('form.project_status')"
                  v-model="fields.project_status"
                  :errors="errors.project_status"
                  @clear-errors="clearError('project_status')"
                />
                <custom-dropdown
                  :items="phases"
                  item-value="name"
                  item-text="name"
                  :label="$t('form.project_phase')"
                  v-model="fields.project_phase"
                  :errors="errors.project_phase"
                  @clear-errors="clearError('project_phase')"
                />
                <custom-input
                  :label="$t('form.distressed_projects')"
                  v-model="fields.distressed_projects"
                  :errors="errors.distressed_projects"
                  @clear-errors="clearError('distressed_projects')"
                />
                <custom-input
                  :label="$t('form.project_duration')"
                  v-model="fields.project_duration"
                  :errors="errors.project_duration"
                  @clear-errors="clearError('project_duration')"
                />
                <!--------------- Date Pickers ---------------->
                <custom-date-picker
                  v-model="fields.scheduled_initiation_start_date"
                  :label="$t('form.scheduled_initiation_start_date')"
                  :errors="errors.scheduled_initiation_start_date"
                  @clear-errors="clearError('scheduled_initiation_start_date')"
                />
                <custom-date-picker
                  v-model="fields.scheduled_delivery_start_date"
                  :label="$t('form.scheduled_delivery_start_date')"
                  :errors="errors.scheduled_delivery_start_date"
                  @clear-errors="clearError('scheduled_delivery_start_date')"
                />
                <custom-date-picker
                  v-model="fields.scheduled_delivery_end_date"
                  :label="$t('form.scheduled_delivery_end_date')"
                  :errors="errors.scheduled_delivery_end_date"
                  :start-date="fields.scheduled_delivery_start_date"
                  :is-end-date="true"
                  @clear-errors="clearError('scheduled_delivery_end_date')"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col class="locationBtn" cols="12" md="8" lg="5">
              <custom-dropdown
                :items="countries"
                item-value="id"
                item-text="name"
                :label="$t('auth.country_id')"
                @change="fetchCities"
                v-model="country_id"
                :errors="errors.country_id"
                @clear-errors="clearError('country_id')"
              />
              <custom-dropdown
                v-if="country_id"
                :items="cities"
                item-value="id"
                item-text="name"
                :label="$t('auth.city_id')"
                v-model="fields.city_id"
                :errors="errors.city_id"
                @clear-errors="clearError('city_id')"
              />
              <MapComponent :location.sync="location" :polygonPaths.sync="polygonPaths" :addPath="addPath" />
              <v-btn :disabled="!valid" class="text-capitalize mt-6" color="primary" block>
                {{ $t("create_new_project") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </form-wrapper>
    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </div>
</template>

<script>
import MapComponent from "../map/Map.vue"
import { createProject, getProjectById, updateProject } from "../../api/projects-api"

import { getCitiesByCountryId, getCountries } from "../../api/location-api"
import { getAllDepartments } from "../../api/departments-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import { getAllPrograms } from "../../api/programs-api"

export default {
  name: "ProjectForm",
  props: { editForm: { type: Boolean, default: false } },
  components: { MapComponent },
  layout: "dashboard-layout",
  middleware: "auth",

  data() {
    return {
      tab: null,
      location: {
        lat: 24.74253477396743,
        lng: 46.72719751640623
      },
      polygonPaths: [],
      addPath: false,
      valid: false,
      loading: false,
      isSubmitting: false,
      fields: {
        active: false,
        description: "",
        name: "",
        short_name: "",
        department_id: "",
        program_id: "",
        project_type_id: "",
        category_id: "",
        sub_category_id: "",
        city_id: "",
        lat: null,
        lng: null,
        id_cse: "",
        id_MOF: "",
        id_etimad: "",
        vrp_name: "",
        vrp_initiative: "",
        vrp_uic: "",
        is_vrp: false,
        is_linked: false,
        project_status: "",
        distressed_projects: "",
        project_duration: "",
        scheduled_initiation_start_date: "",
        scheduled_delivery_start_date: "",
        scheduled_delivery_end_date: "",
        project_phase: "",
        title: "PLACE HOLDER"
      },
      project_types: [],
      departments: [],
      programs: [],
      categories: [],
      sub_categories: [],
      cities: [],
      countries: [],
      country_id: "",
      scheduled_delivery_end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      scheduled_delivery_start_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      scheduled_initiation_start_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      statuses: [
        {
          id: 1,
          name: "Active"
        },
        {
          id: 2,
          name: "Cancelled"
        },
        {
          id: 3,
          name: "On Hold"
        }
      ],
      phases: [
        {
          id: 1,
          name: "Start"
        },
        {
          id: 2,
          name: "On Execution"
        },
        {
          id: 3,
          name: "Delivery"
        }
      ],
      menu1: false,
      menu2: false,
      menu3: false,
      errors: {},
      error: null
    }
  },
  methods: {
    submitProject() {
      this.errors = {}
      this.fields.lat = this.location.lat
      this.fields.lng = this.location.lng
      const payload = { ...this.fields }
      this.isSubmitting = true
      const projectId = this.$route.params.id

      const apiToCall = this.editForm ? updateProject : createProject
      apiToCall(payload, this.$axios, projectId)
        .then(() => {
          this.$router.push(this.localePath("/tenant/projects"))
        })
        .catch((err) => {
          if (err?.response.data) {
            this.errors = err.response.data.errors || {}
          } else {
            console.error(`Error ${this.editForm ? "editing" : "creating"} project:`, err)
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    getProject() {
      if (this.editForm) {
        this.loading = true
        const projectId = this.$route.params.id
        getProjectById(projectId, this.$axios)
          .then((res) => {
            const data = res.data.data
            this.fields = {
              ...this.fields,
              name: data.name,
              short_name: data.short_name,
              description: data.description,
              department_id: data.department?.id || "",
              program_id: data.program?.id || "",
              project_type_id: data.type?.id || "",
              category_id: data.category?.id || "",
              sub_category_id: data.sub_category?.id || "",
              city_id: data.city?.id || "",
              lat: data.lat,
              lng: data.lng,
              id_cse: data.id_cse,
              id_MOF: data.id_MOF,
              id_etimad: data.id_etimad,
              vrp_name: data.vrp_name,
              vrp_initiative: data.vrp_initiative,
              vrp_uic: data.vrp_uic,
              is_vrp: data.is_vrp,
              is_linked: data.is_linked,
              project_status: data.project_status,
              distressed_projects: data.distressed_projects,
              project_duration: data.project_duration,
              scheduled_initiation_start_date: data.scheduled_initiation_start_date,
              scheduled_delivery_start_date: data.scheduled_delivery_start_date,
              scheduled_delivery_end_date: data.scheduled_delivery_end_date,
              project_phase: data.project_phase,
              active: data.active
            }
            this.country_id = data.city?.country.id || ""
            this.location = { lat: data.lat, lng: data.lng }
          })
          .catch((err) => {
            this.error = generateErrorMessage(err, this.$i18n)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    fetchCategories() {
      this.$axios
        .get("categories")
        .then((res) => {
          this.categories = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching categories:", error)
        })
    },
    fetchSubCategories() {
      if (this.fields.category_id) {
        this.$axios
          .get(`sub-categories?category_id=${this.fields.category_id}`)
          .then((res) => {
            this.sub_categories = res.data.data
          })
          .catch((error) => {
            console.error("Error fetching sub categories:", error)
          })
      } else {
        this.sub_categories = []
      }
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }
    },
    showPosition(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    },
    fetchProjectTypes() {
      this.$axios
        .get("projects_types")
        .then((res) => {
          this.project_types = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching projects_types:", error)
        })
    },
    fetchDepartments() {
      getAllDepartments(this.$axios)
        .then((res) => {
          this.departments = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching departments:", error)
        })
    },
    fetchPrograms() {
      getAllPrograms(this.$axios)
        .then((res) => {
          this.programs = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching programs:", error)
        })
    },
    fetchCountries() {
      getCountries(this.$axios)
        .then((res) => {
          this.countries = res.data
        })
        .catch((error) => {
          console.error("Error fetching countries:", error)
        })
    },
    fetchCities() {
      if (this.country_id) {
        getCitiesByCountryId(this.country_id, this.$axios)
          .then((res) => {
            this.cities = res.data
          })
          .catch((error) => {
            console.error("Error fetching cities:", error)
          })
      } else {
        this.cities = []
      }
    },
    clearError(field) {
      this.errors[field] = []
    }
  },
  computed: {
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.project")}`
    }
  },
  watch: {
    "fields.category_id"(newVal) {
      this.fetchSubCategories(newVal)
    },
    country_id(newVal) {
      this.fetchCities(newVal)
    }
  },
  mounted() {
    this.fetchProjectTypes()
    this.fetchDepartments()
    this.fetchPrograms()
    this.fetchCategories()
    this.fetchCountries()
    if (this.editForm) {
      this.getProject()
    }
  }
}
</script>

<style scoped>
.success-message {
  font-size: 2em;
  text-align: center;
  padding: 20px;
  color: #20bb69; /* Change the text color to your desired color */
  border-radius: 5px;
}
.locationBtn {
  padding-top: 40px;
}
</style>
