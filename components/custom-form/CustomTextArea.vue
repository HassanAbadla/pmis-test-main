<template>
  <v-textarea
    v-model="modelValue"
    :id="label"
    :label="label"
    :placeholder="label"
    @input="updateValue"
    @focus="clearErrors"
    :rules="rules"
    color="primary"
    outlined
    :disabled="disabled"
    :error-count="errorCount"
    :error-messages="errors"
  />
</template>

<script>
export default {
  name: "CustomTextArea",
  props: {
    label: {
      type: String,
      default: "",
      required: true
    },
    value: {
      type: [String, Number],
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => []
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

      if (this.required) {
        rules.push(requiredField)
      }

      return rules
    },
    errorCount() {
      if (this.errors.length === 0) {
        return 2
      }
      return this.errors.length
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("input", event)
    },
    clearErrors() {
      this.$emit("clear-errors")
    }
  }
}
</script>
