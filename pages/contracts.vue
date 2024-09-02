<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-app-bar color="transparent" flat>
          <v-btn nuxt to="/dashboard/createContract" class="mx-auto" color="primary">
            <v-icon dark>mdi-plus</v-icon>
            New Contract
          </v-btn>
        </v-app-bar>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" lg="3" v-for="contract in project.contracts" :key="contract.id">
          <v-card outlined class="mx-auto">
            <v-card-title>Description: {{ contract.desrciption }}</v-card-title>
            <v-card-text>Company: {{ contract.company.name }}</v-card-text>
            <v-card-text>This Contract Ends: {{ contract.end_date }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="text-capitalize" nuxt :to="`/contracts/${contract.id}`" color="primary">
                Contract Detais
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
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
      project: {},
      contract: [],
      reveal: false
    }
  },
  methods: {
    fetchProject() {
      this.$axios
        .get("project?project_id=" + this.$route.params.id)
        .then((res) => {
          this.project = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching projects:", error)
        })
    }
  },
  mounted() {
    this.fetchProject()
  }
}
</script>

<style lang="scss" scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
