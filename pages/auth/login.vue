<template>
  <split-form>
    <v-alert icon="mdi-alert-circle" text type="error" v-model="notAuthenticate">
      {{ errorMsg }}
    </v-alert>
    <form-wrapper :title="$t('auth.login')" @submit="login" :loading="loading" :submit-text="$t('auth.login')">
      <custom-input
        v-for="field in formFields"
        :key="field.name"
        :label="$t(`auth.${field.name}`)"
        :type="field.type"
        v-model="field.value"
        :icon="field.icon"
        :required="field.required"
        :errors="field.errors"
        @clear-errors="field.errors = []"
        @input="field.inputAction"
      />
      <v-layout align-center justify-space-between>
        <custom-checkbox v-model="rememberMe" :label="$t('auth.remember')" />
        <nuxt-link :to="localePath('/auth/forgot-password')">{{ $t("auth.forgot_password") }}</nuxt-link>
      </v-layout>
    </form-wrapper>
  </split-form>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      valid: false,
      notAuthenticate: false,
      rememberMe: false,
      errorMsg: "",
      formFields: [
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
          icon: "mdi-lock",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("password")
        }
      ]
    }
  },
  mounted() {
    console.log(this.$auth.loggedIn)
  },
  methods: {
    async login() {
      this.loading = true
      const payload = {
        remember_me: this.rememberMe,
        ...Object.fromEntries(this.formFields.map((field) => [field.name, field.value]))
      }
      try {
        await this.$auth.loginWith("local", { data: payload })

        this.$router.push(this.localePath("/dashboard"))
      } catch (error) {
        console.log("Login error:", error.response)
        this.notAuthenticate = true
        this.errorMsg = error.response.data.message
      } finally {
        this.loading = false
      }
    },
    clearError(field) {
      return () => {
        const fieldData = this.formFields.find((attr) => attr.name === field)
        fieldData.errors = []
      }
    }
  }
}
</script>

<style scoped></style>
