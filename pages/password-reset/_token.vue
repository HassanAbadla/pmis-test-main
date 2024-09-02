<template>
  <v-container>
    <v-layout v-if="!apiMessage && isValidToken" column>
      <form-wrapper
        :title="$t('auth.reset_password')"
        @submit="submit"
        :loading="loading"
        :submit-text="$t('auth.submit')"
      >
        <custom-input
          v-for="field in fields"
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
    </v-layout>
    <v-layout v-if="apiMessage" column align-center justify-center>
      <h1>{{ isError ? $t("error.wrong") : $t("auth.password_reset_success") }}</h1>
      <p class="font-weight-medium">{{ apiMessage }}</p>
      <v-btn color="primary" nuxt :to="localePath('/')">{{ $t("auth.home") }}</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { checkTokenValidity } from "../../api/auth"
import { resetPassword } from "../../api/auth"
import { objectFromFields } from "../../helpers/field-helper"

export default {
  data() {
    return {
      loading: false,
      apiMessage: "",
      isError: false,
      isValidToken: false,
      token: "",
      email: "",
      fields: [
        {
          name: "email",
          type: "email",
          icon: "mdi-at",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("email")
        },
        {
          name: "password",
          type: "password",
          icon: "",
          required: true,
          validPassword: true,
          value: "",
          errors: [],
          inputAction: this.clearError("password")
        },
        {
          name: "password_confirmation",
          type: "password",
          icon: "",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("password_confirmation")
        }
      ]
    }
  },

  methods: {
    clearError(field) {
      return () => {
        const fieldData = this.fields.find((attr) => attr.name === field)
        fieldData.errors = []
      }
    },
    submit() {
      this.loading = true
      const payload = { token: this.token, ...objectFromFields(this.fields) }

      resetPassword(payload, this.$axios)
        .then((res) => {
          this.apiMessage = res.data.status
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.errors) {
            Object.keys(error.response.data.errors).forEach((key) => {
              const field = this.fields.find((f) => f.name === key)
              if (field) {
                field.errors = error.response.data.errors[key]
              }
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    checkToken(payload) {
      this.loading = true
      checkTokenValidity(payload, this.$axios)
        .then((res) => {
          this.isValidToken = true
        })
        .catch((error) => {
          this.apiMessage = error.response.data.status
          this.isError = true
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.email = this.$route.query.email
    this.token = this.$route.params.token
    this.checkToken({ email: this.email, token: this.token })

    const emailField = this.fields.find((field) => field.name === "email")
    if (emailField) {
      emailField.value = this.email
    }
  }
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>
