<template>
  <split-form>
    <v-container>
      <v-layout column v-if="!successMsg">
        <form-wrapper
          :title="$t('auth.forgot_password')"
          @submit="sendLink"
          :loading="loading"
          :submit-text="$t('auth.send')"
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
            :errors="field.errors"
            @clear-errors="field.errors = []"
            @input="field.inputAction"
          />
          <p class="font-weight-light">{{ $t("auth.send_password_reset_link") }}</p>
        </form-wrapper>
      </v-layout>
      <v-layout v-if="successMsg" column align-center justify-center>
        <h1>{{ $t("auth.sent_password_reset_link") }}</h1>
        <p class="font-weight-medium">
          {{ computedEmail }}
        </p>
        <v-btn color="primary" nuxt :to="localePath('/')">{{ $t("auth.home") }}</v-btn>
      </v-layout>
    </v-container>
  </split-form>
</template>

<script>
import { sendPasswordResetLink } from "../../api/auth"
import { objectFromFields } from "../../helpers/field-helper"

export default {
  data() {
    return {
      loading: false,
      successMsg: "",
      formFields: [
        {
          name: "email",
          type: "email",
          icon: "",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("email")
        }
      ]
    }
  },
  methods: {
    clearError(field) {
      return () => {
        const fieldData = this.formFields.find((attr) => attr.name === field)
        fieldData.errors = []
      }
    },
    sendLink() {
      this.loading = true
      const payload = {
        ...objectFromFields(this.formFields)
      }
      sendPasswordResetLink(payload, this.$axios)
        .then((res) => {
          this.successMsg = res.data.status
        })
        .catch((error) => {
          this.formFields.find((field) => field.name === "email").errors = [error.response.data.message]
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
    computedEmail() {
      return this.formFields.find((field) => field.name === "email").value
    }
  }
}
</script>

<style scoped></style>
