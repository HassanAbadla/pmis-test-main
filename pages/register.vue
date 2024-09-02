<template>
  <split-form>
    <form-wrapper
      v-if="!successMessage"
      :title="$t('auth.register')"
      @submit="submitRequest"
      :loading="loading"
      :submit-text="$t('auth.submit_request')"
    >
      <custom-input
        v-for="field in formFields"
        :key="field.name"
        :name="field.name"
        :label="$t(`auth.${field.name}`)"
        :type="field.type"
        v-model="field.value"
        :icon="field.icon"
        :required="field.required"
        :validPhone="field.validPhone"
        :disabled="field.disabled"
        :errors="field.errors"
        @clear-errors="field.errors = []"
        @input="field.inputAction"
      />

      <custom-dropdown
        v-for="dropdown in formDropdowns"
        :key="dropdown.name"
        :name="dropdown.name"
        :label="$t(`auth.${dropdown.name}`)"
        :items="dropdown.items"
        v-model="dropdown.value"
        :item-text="dropdown.itemText"
        :item-value="dropdown.itemValue"
        :icon="dropdown.icon"
        :required="dropdown.required"
        :disabled="dropdown.disabled"
        :errors="dropdown.errors"
        @clear-errors="dropdown.errors = []"
        @change="dropdown.changeAction"
      />

      <!-- Attachments -->
      <!-- <v-file-input
        v-model="files"
        color="primary"
        counter
        :label="$t('auth.attachments')"
        multiple
        placeholder="Select your files"
        outlined
        :show-size="1000"
      >
        <template v-slot:selection="{ index, text }">
          <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>
            {{ text }}
          </v-chip>
          <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
            +{{ files.length - 2 }} File(s)
          </span>
        </template>
      </v-file-input> -->
    </form-wrapper>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </split-form>
</template>

<script>
import { objectFromFields } from "@/helpers/field-helper"
import { createTenent } from "../api/tenent-api"
import { getCitiesByCountryId, getCountries } from "../api/location-api"

export default {
  middleware: "guest",
  data() {
    return {
      overlay: false,
      valid: false,
      loading: false,
      formFields: [
        {
          name: "company_name",
          type: "text",
          icon: "mdi-domain",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("company_name")
        },
        {
          name: "email",
          type: "email",
          icon: "mdi-at",
          required: true,
          value: "",
          errors: [],
          inputAction: this.extractDomain
        },
        {
          name: "domain_name",
          type: "text",
          icon: "mdi-web",
          required: false,
          value: "",
          errors: [],
          inputAction: this.clearError("domain_name"),
          disabled: true
        },
        {
          name: "phone",
          type: "",
          icon: "mdi-phone",
          required: true,
          validPhone: true,
          value: "",
          errors: [],
          inputAction: this.clearError("phone")
        },
        {
          name: "full_name",
          type: "text",
          icon: "mdi-account-tie",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("full_name")
        }
      ],
      formDropdowns: [
        {
          name: "country_id",
          items: [],
          required: true,
          value: "",
          errors: [],
          itemText: "name",
          itemValue: "id",
          changeAction: this.fetchCities
        },
        {
          name: "city_id",
          items: [],
          required: true,
          value: "",
          errors: [],
          itemText: "name",
          itemValue: "id",
          changeAction: this.clearError("city_id"),
          disabled: true // Initially disabled
        }
      ],
      successMessage: null,
      files: []
    }
  },
  computed: {
    selectedCountry() {
      return this.formDropdowns.find((dropdown) => dropdown.name === "country_id").value
    }
  },
  watch: {
    selectedCountry(newVal) {
      this.fetchCities()
    }
  },
  methods: {
    extractDomain() {
      const emailField = this.formFields.find((field) => field.name === "email")
      const domainField = this.formFields.find((field) => field.name === "domain_name")

      if (emailField.value) {
        domainField.value = emailField.value.split("@")[1]
        emailField.errors = []
      }
    },
    fetchCountries() {
      getCountries(this.$axios)
        .then((res) => {
          const countryDropdown = this.formDropdowns.find((dropdown) => dropdown.name === "country_id")
          countryDropdown.items = res.data
        })
        .catch((error) => {
          console.error("Error fetching countries:", error)
        })
    },
    fetchCities() {
      const countryDropdown = this.formDropdowns.find((dropdown) => dropdown.name === "country_id")
      const cityDropdown = this.formDropdowns.find((dropdown) => dropdown.name === "city_id")
      if (countryDropdown.value) {
        getCitiesByCountryId(countryDropdown.value, this.$axios)
          .then((res) => {
            cityDropdown.items = res.data
            cityDropdown.disabled = false // Enable the city dropdown when cities are fetched
          })
          .catch((error) => {
            console.error("Error fetching cities:", error)
          })
      } else {
        cityDropdown.items = []
        cityDropdown.disabled = true // Disable the city dropdown
      }
    },
    submitRequest() {
      this.loading = true
      const payload = {
        ...objectFromFields(this.formFields),
        ...objectFromFields(this.formDropdowns)
      }

      createTenent(payload, this.$axios)
        .then((response) => {
          this.successMessage = this.$t("auth.registration_sent_message")
        })
        .catch((error) => {
          const errorData = error.response.data.errors

          this.formFields.forEach((field) => {
            if (errorData[field.name]) {
              field.errors = errorData[field.name]
            }
          })
          this.formDropdowns.forEach((dropdown) => {
            if (errorData[dropdown.name]) {
              dropdown.errors = errorData[dropdown.name]
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    clearError(field) {
      return () => {
        const fieldData =
          this.formFields.find((attr) => attr.name === field) || this.formDropdowns.find((attr) => attr.name === field)
        fieldData.errors = []
      }
    }
  },
  mounted() {
    this.fetchCountries()
  }
}
</script>

<style scoped>
.success-message {
  font-size: 2em; /* Adjust the font size as needed */
  text-align: center;
  padding: 20px;
  color: #120505; /* Change the text color to your desired color */
  border-radius: 5px;
}
</style>
