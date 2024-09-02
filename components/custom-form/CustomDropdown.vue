<template>
  <v-autocomplete
    v-model="modelValue"
    :items="items"
    :label="label"
    :rules="rules"
    :item-text="itemText"
    :item-value="itemValue"
    :error-messages="errors"
    @change="updateValue"
    @focus="clearErrors"
    :disabled="disabled"
    outlined
  />
</template>

<script>
export default {
  name: "CustomDropdown",
  props: {
    items: {
      type: Array,
      required: true
    },
    errors: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: "",
      required: true
    },
    value: {
      type: [String, Number],
      default: ""
    },
    itemText: {
      type: String,
      default: "text"
    },
    itemValue: {
      type: String,
      default: "value"
    },
    disabled: {
      type: Boolean,
      default: false
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
      const requiredValidation = (v) => Boolean(v) || this.$t("validation.required")
      if (this.required) {
        rules.push(requiredValidation)
      }
      return rules
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
