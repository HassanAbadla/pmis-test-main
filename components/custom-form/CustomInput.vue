<template>
  <v-text-field
    v-model="modelValue"
    :id="label"
    :label="label"
    :placeholder="label"
    @input="updateValue"
    @focus="clearErrors"
    :rules="rules"
    :type="computedType"
    :prepend-inner-icon="computedInnerIcon"
    :append-icon="computedOuterIcon"
    @click:append="togglePasswordVisibility"
    @click="onClick"
    color="primary"
    outlined
    :readonly="readonly"
    :disabled="disabled"
    :error-count="errorCount"
    :error-messages="errors"
  />
</template>

<script>
export default {
  name: "CustomInput",
  props: {
    label: {
      type: String,
      default: "",
      required: true
    },
    type: {
      type: String,
      default: "text"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    // skipcq: JS-0682
    icon: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => []
    },
    validPassword: {
      type: Boolean,
      default: false
    },
    validPhone: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPassword: false
    }
  },
  computed: {
    modelValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit("input", newValue)
      }
    },
    rules() {
      const rules = []
      const requiredField = (v) => Boolean(v) || this.$t("validation.required")
      const validEmail = (v) => /.+@.+\..+/.test(v) || this.$t("validation.email")
      const validPassword = (v) =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(v) || this.$t("validation.password")
      const validPhone = (v) =>
        /^(\+966|0)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{3})[-.\s]?([0-9]{3,4})$/.test(v) || this.$t("validation.phone")

      // const validPhoneNumberFormats = [
      //   "+9661234567890",
      //   "+966 123 456 7890",
      //   "+966-123-456-7890",
      //   "+966.123.456.7890",
      //   "01234567890",
      //   "0 123 456 7890",
      //   "0-123-456-7890",
      //   "0.123.456.7890",
      //   "1234567890",
      //   "123 456 7890",
      //   "123-456-7890",
      //   "123.456.7890",
      //   "+966-123-456-789",
      //   "+966 123 456 789",
      //   "+966.123.456.789",
      //   "0 123 456 789",
      //   "0-123-456-789",
      //   "0.123.456.789",
      //   "123 456 789",
      //   "123-456-789",
      //   "123.456.789"
      // ]

      if (this.required) {
        rules.push(requiredField)
      }
      if (this.type === "email") {
        rules.push(validEmail)
      }

      if (this.type === "password" && this.validPassword) {
        rules.push(validPassword)
      }
      if (this.validPhone) {
        rules.push(validPhone)
      }

      return rules
    },
    computedInnerIcon() {
      if (this.icon) {
        return this.icon
      }

      let icon = "mdi-text"

      if (this.type === "password") {
        icon = "mdi-lock"
      }
      if (this.type === "email") {
        icon = "mdi-at"
      }

      return icon
    },
    computedOuterIcon() {
      if (this.type === "password") {
        return this.showPassword ? "mdi-eye" : "mdi-eye-off"
      }
      return ""
    },
    errorCount() {
      if (this.errors.length === 0) {
        return 2
      }
      return this.errors.length
    },
    computedType() {
      if (this.type === "password") {
        return this.showPassword ? "text" : "password"
      }

      return this.type || "text"
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("input", event)
    },
    clearErrors() {
      this.$emit("clear-errors")
    },
    togglePasswordVisibility() {
      if (this.type === "password") {
        this.showPassword = !this.showPassword
      }
    }
  }
}
</script>
