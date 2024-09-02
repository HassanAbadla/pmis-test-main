<template>
  <split-form>
    <form-wrapper
      v-if="!successMessage && !invalidToken"
      :title="$t('auth.register')"
      @submit="submitRequest"
      :loading="loading"
      :submit-text="$t('auth.submit_request')"
    >
      <!-- formFields -->
      <custom-input
        v-for="field in formFields"
        :key="field.name"
        :name="field.name"
        :label="$t(`auth.${field.name}`)"
        :type="field.type"
        v-model="field.value"
        :icon="field.icon"
        :required="field.required"
        :disabled="field.disabled"
        :errors="field.errors"
        @clear-errors="field.errors = []"
        @input="field.inputAction"
      />
      <!-- formDropdowns -->
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
      <!-- formPasswords -->
      <custom-input
        v-for="field in formPasswords"
        :key="field.name"
        :name="field.name"
        :label="$t(`auth.${field.name}`)"
        :type="field.type"
        v-model="field.value"
        :icon="field.icon"
        :required="field.required"
        :validPassword="field.validPassword"
        :disabled="field.disabled"
        :errors="field.errors"
        @clear-errors="field.errors = []"
        @input="field.inputAction"
      />
    </form-wrapper>
    <v-layout column align-center justify-center v-if="successMessage" class="success-message">
      <h1>{{ $t("auth.password_reset_success") }}</h1>
      <p>{{ successMessage }}</p>
      <v-btn nuxt :to="localePath('auth.home')" color="primary">Home Page</v-btn>
    </v-layout>
    <v-container v-if="invalidToken && !loading">
      <v-layout column align-center justify-center fill-height>
        <h1>{{ $t("error.expired_link") }}</h1>
        <v-btn nuxt :to="localePath('/')" color="primary">{{ $t("error.home") }}</v-btn>
      </v-layout>
    </v-container>
  </split-form>
</template>

<script>
import { registerTenent, getTenent } from "../../api/tenent-api"

export default {
  data() {
    return {
      overlay: false,
      valid: false,
      loading: true,
      invalidToken: true,
      formFields: [
        {
          name: "company_name",
          type: "text",
          icon: "mdi-domain",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("company_name")
        },
        {
          name: "email",
          type: "email",
          icon: "mdi-at",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("email")
        },
        {
          name: "domain_name",
          type: "text",
          icon: "mdi-web",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("domain_name")
        },
        {
          name: "phone",
          type: "text",
          icon: "mdi-phone",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("phone")
        },
        {
          name: "full_name",
          type: "text",
          icon: "mdi-account-tie",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("full_name")
        }
      ],
      formPasswords: [
        {
          name: "password",
          type: "password",
          icon: "mdi-lock",
          required: true,
          validPassword: true,
          value: "",
          errors: [],
          inputAction: this.clearError("password")
        },
        {
          name: "password_confirmation",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("password_confirmation")
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
          changeAction: this.clearError("country_id"),
          disabled: true
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
          disabled: true
        }
      ],
      successMessage: null
    }
  },
  methods: {
    fetchTenant() {
      this.loading = true
      getTenent(this.$route.query.token, this.$axios)
        .then((res) => {
          const tenantData = res.data.data
          this.invalidToken = false
          this.formFields.forEach((field) => {
            field.value = tenantData[field.name]
          })
          this.formDropdowns.forEach((dropdown) => {
            if (dropdown.name === "country_id") {
              dropdown.value = tenantData.city ? tenantData.city.country.id : ""
              dropdown.items = [tenantData.city.country]
            }
            if (dropdown.name === "city_id") {
              dropdown.value = tenantData.city ? tenantData.city.id : ""
              dropdown.items = [tenantData.city]
            }
          })
        })
        .catch((error) => {
          console.error("Error fetching tenant data:", error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitRequest() {
      this.loading = true
      const payload = {
        remember_me: false,
        token: this.$route.query.token,
        password: this.formPasswords.find((field) => field.name === "password").value,
        password_confirmation: this.formPasswords.find((field) => field.name === "password_confirmation").value
      }

      registerTenent(payload, this.$axios)
        .then((response) => {
          this.$auth
            .loginWith("local", {
              data: { email: this.formFields.find((field) => field.name === "email").value, password: payload.password }
            })
            .then(() => {
              this.$router.push(this.localePath("/dashboard"))
            })
          this.successMessage = this.$t("auth.registration_completed_message")
        })
        .catch((error) => {
          // console.error("Error submitting form:", error)
          const errorData = error.response.data.errors
          this.formFields.forEach((field) => {
            if (errorData[field.name]) {
              field.errors = errorData[field.name]
            }
          })

          this.formPasswords.forEach((field) => {
            if (errorData[field.name]) {
              field.errors = errorData[field.name]
            }
          })

          this.formDropdowns.forEach((field) => {
            if (errorData[field.name]) {
              field.errors = errorData[field.name]
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
          this.formFields.find((attr) => attr.name === field) ||
          this.formDropdowns.find((attr) => attr.name === field) ||
          this.formPasswords.find((attr) => attr.name === field)
        fieldData.errors = []
      }
    }
  },
  mounted() {
    this.fetchTenant()
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
