<!-- components/CustomDatePicker.vue -->
<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <custom-input
        :value="formattedValue"
        :label="label"
        :errors="computedErrors"
        icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        @focus="clearErrors"
        :onClick="on.click"
      />
    </template>
    <v-date-picker v-model="dateValue" @input="updateDate"></v-date-picker>
  </v-menu>
</template>

<script>
import { isEndDateValid, formatDateForDisplay } from "../../helpers/date-helpers"

export default {
  name: "CustomDatePicker",

  props: {
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      required: true
    },
    errors: {
      type: Array,
      default: () => []
    },
    startDate: {
      type: String,
      default: null
    },
    isEndDate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menu: false,
      dateValue: this.value,
      localErrors: []
    }
  },
  computed: {
    formattedValue() {
      return this.value ? formatDateForDisplay(this.value) : ""
    },
    computedErrors() {
      return [...this.errors, ...this.localErrors]
    }
  },
  methods: {
    updateDate(newDate) {
      this.menu = false
      this.validateDate(newDate)
      this.$emit("input", newDate)
    },
    clearErrors() {
      this.localErrors = []
      this.$emit("clear-errors")
    },
    validateDate(date) {
      this.localErrors = []
      if (this.isEndDate && this.startDate) {
        if (!isEndDateValid(this.startDate, date)) {
          this.localErrors.push(this.$t("error.end_date"))
        }
      }
    }
  },
  watch: {
    value(newValue) {
      this.dateValue = newValue
      this.validateDate(newValue)
    },
    startDate() {
      this.validateDate(this.value)
    }
  }
}
</script>
