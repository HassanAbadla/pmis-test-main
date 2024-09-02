<template>
  <div>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" md="8" lg="6">
          <v-card flat>
            <v-card-title>Create a New Department</v-card-title>
            <v-card-text>
              <v-form lazy-validation v-model="valid">
                <v-text-field
                  :label="$t('department_name')"
                  :rules="[(v) => !!v || $t('validation.required')]"
                  color="primary"
                  prepend-inner-icon="mdi-domain"
                  v-model="fields.name"
                  outlined
                />
                <v-btn :disabled="!valid" class="text-capitalize" color="primary" @click="createDepartment()" block>
                  {{ $t("auth.create") }}
                </v-btn>
              </v-form>
              <div v-if="successMessage" class="success-message">
                {{ successMessage }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: "dashboard-layout",
  middleware: "auth",

  data() {
    return {
      valid: false,
      fields: {
        tenant_id: this.$auth.user.tenant.id,
        name: ""
      },
      successMessage: null
    }
  },
  methods: {
    createDepartment() {
      this.$axios
        .post("department/store?", this.fields)
        .then((response) => {
          this.successMessage = "Department Created "
          setTimeout(() => {
            this.$router.push("/dashboard")
          }, 1000)
        })
        .catch((error) => {
          console.error("Error submitting form:", error)
        })
    }
  }
}
</script>

<style scoped>
.success-message {
  font-size: 2em;
  text-align: center;
  padding: 20px;
  color: #20bb69; /* Change the text color to your desired color */
  border-radius: 5px;
}
</style>
