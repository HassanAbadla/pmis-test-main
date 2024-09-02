<template>
  <v-layout column>
    <form-wrapper v-if="!error && !loading" :title="title" @submit="submitProgram" :loading="isSubmitting">
      <custom-input
        :label="$t('form.name')"
        v-model="fields.name"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-input
        :label="$t('form.short_name')"
        v-model="fields.short_name"
        :required="true"
        :errors="errors.short_name"
        @clear-errors="clearError('short_name')"
      />
      <custom-input
        :label="$t('form.code')"
        v-model="fields.code"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        :label="$t('form.estimated_cost')"
        v-model="fields.estimated_cost"
        :required="true"
        type="number"
        :errors="errors.estimated_cost"
        @clear-errors="clearError('estimated_cost')"
      />
      <custom-dropdown
        :items="portfolios"
        item-value="id"
        item-text="name"
        :label="$t('form.portfolio')"
        :required="true"
        v-model="fields.portfolio_id"
        :errors="errors.portfolio_id"
        @clear-errors="clearError('portfolio_id')"
      />
      <custom-dropdown
        :items="countries"
        item-value="id"
        item-text="name"
        :label="$t('auth.country_id')"
        :required="true"
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
        :required="true"
        v-model="fields.city_id"
        :errors="errors.city_id"
        @clear-errors="clearError('city_id')"
      />
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <custom-date-picker
            v-model="fields.start_date"
            :label="$t('form.start_date')"
            :errors="errors.start_date"
            @clear-errors="clearError('start_date')"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <custom-date-picker
            v-model="fields.end_date"
            :label="$t('form.end_date')"
            :errors="errors.end_date"
            :start-date="fields.start_date"
            :is-end-date="true"
            @clear-errors="clearError('end_date')"
          />
        </v-col>
      </v-row>
      <custom-text-area
        v-model="fields.description"
        :label="$t('form.description')"
        required
        :errors="errors.description"
        @clear-errors="clearError('description')"
      />
      <custom-checkbox v-model="fields.active" :label="$t('form.active')" />
    </form-wrapper>

    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </v-layout>
</template>

<script>
import { getCitiesByCountryId, getCountries } from "../../api/location-api"
import { getAllPortfolios } from "../../api/portfolios-api"
import { createProgram, getProgramById, updateProgram } from "../../api/programs-api"
import { generateErrorMessage } from "../../helpers/error-helpers"

export default {
  name: "ProgramForm",
  props: { editForm: { type: Boolean, default: false } },
  data() {
    return {
      valid: false,
      loading: false,
      isSubmitting: false,
      fields: {
        name: "",
        short_name: "",
        code: "",
        estimated_cost: "",
        description: "",
        city_id: "",
        portfolio_id: "",
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        active: false,
        lng: 123,
        lat: 456
      },
      country_id: "",
      countries: [],
      cities: [],
      portfolios: [],
      errors: {},
      menu1: false,
      menu2: false,
      error: null
    }
  },
  methods: {
    submitProgram() {
      this.errors = {}
      const payload = { ...this.fields }
      this.isSubmitting = true
      const programId = this.$route.params.id

      const apiToCall = this.editForm ? updateProgram : createProgram
      apiToCall(payload, this.$axios, programId)
        .then(() => {
          this.$router.push(this.localePath("/tenant/programs"))
        })
        .catch((err) => {
          if (err?.response.data) {
            this.errors = err.response.data.errors || {}
          } else {
            console.error(`Error ${this.editForm ? "editing" : "creating"} program:`, err)
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    getProgram() {
      if (this.editForm) {
        this.loading = true
        const programId = this.$route.params.id
        getProgramById(programId, this.$axios)
          .then((res) => {
            const data = res.data.data
            this.fields = {
              ...this.fields,
              name: data.name,
              short_name: data.short_name,
              code: data.code,
              estimated_cost: data.estimated_cost,
              description: data.description,
              city_id: data.city.id,
              portfolio_id: data.portfolio.id,
              start_date: data.start_date,
              end_date: data.end_date,
              active: data.active
            }
            this.country_id = data.city.country.id
          })
          .catch((err) => {
            this.error = generateErrorMessage(err, this.$i18n)
          })
          .finally(() => {
            this.loading = false
          })
      }
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
    fetchPortfolios() {
      getAllPortfolios(this.$axios)
        .then((res) => {
          this.portfolios = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching portfolios:", error)
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
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.program")}`
    }
  },
  watch: {
    country_id(newVal) {
      this.fetchCities(newVal)
    }
  },
  mounted() {
    this.fetchCountries()
    this.fetchPortfolios()
    if (this.editForm) {
      this.getProgram()
    }
  }
}
</script>

<style scoped>
.locationBtn {
  margin-top: 20px;
}
</style>
