<template>
  <div>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" md="8" lg="6">
          <v-card flat>
            <v-card-title>Create New Company</v-card-title>
            <v-card-text>
              <v-form lazy-validation v-model="valid">
                <v-text-field
                  :label="$t('auth.company_name')"
                  :rules="[(v) => !!v || $t('validation.required')]"
                  color="primary"
                  prepend-inner-icon="mdi-domain"
                  v-model="fields.name"
                  outlined
                />
                <!-- <v-text-field v-if="false" outlined v-model="fields.tenant">
                </v-text-field> -->

                <v-autocomplete
                  :items="company_types"
                  item-value="id"
                  item-text="name"
                  :label="$t('company_type')"
                  v-model="fields.company_type_id"
                  prepend-inner-icon="mdi-domain"
                  outlined
                />
                <v-autocomplete
                  :items="company_grades"
                  item-value="id"
                  item-text="name"
                  :label="$t('company_grade')"
                  v-model="fields.company_grade_id"
                  prepend-inner-icon="mdi-domain"
                  outlined
                />

                <v-btn :disabled="!valid" class="text-capitalize" color="primary" @click="createCompany()" block>
                  {{ $t("auth.create") }}
                </v-btn>
              </v-form>
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
        name: "",
        // tenant: this.$auth.user.tenant.company_name,
        company_type_id: "",
        company_grade_id: ""
      },
      company_types: [],
      company_grades: []
    }
  },
  methods: {
    createCompany() {
      this.$axios
        .post("company/store?", this.fields)
        .then((response) => {})
        .catch((error) => {
          console.error("Error submitting form:", error)
        })
    },

    fetchCompanyTypes() {
      this.$axios
        .get("companies/types")
        .then((res) => {
          this.company_types = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching company types:", error)
        })
    },

    fetchCompanyGrades() {
      this.$axios
        .get("companies/grades")
        .then((res) => {
          this.company_grades = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching company grades:", error)
        })
    }
  },

  mounted() {
    this.fetchCompanyTypes()
    this.fetchCompanyGrades()
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
.locationBtn {
  padding-top: 40px;
}
</style>
