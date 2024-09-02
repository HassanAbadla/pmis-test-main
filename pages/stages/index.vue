<template>
  <div>
    <v-container class="mx-0">
      <v-row class="mt-4 ml-4 mb-5">
        <h1>All Stages</h1>
      </v-row>
      <v-divider class="mb-5"></v-divider>

      <v-layout>
        <v-col v-for="stage in stages" :key="stage.id">
          <v-card flat>
            <div outlined color="#26c6da" class="px-0 d-flex align-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-sheet
                    v-bind="attrs"
                    v-on="on"
                    :class="{
                      'gate-style': stage.is_gate,
                      'expo-title-div': true,
                      'mx-auto': true,
                      'd-flex': true,
                      'justify-content-center': true,
                      'align-items-center': true
                    }"
                    elevation="5"
                    block
                    dark
                    x-large
                    :color="stage.is_gate ? 'red' : 'blue'"
                  >
                    {{ shortenedText(stage.title) }}
                  </v-sheet>
                </template>
                <span>{{ stage.title }}</span>
              </v-tooltip>
            </div>
            <v-card
              hover="true"
              v-for="project in stage.projects"
              :key="project.id"
              class="mx-auto mb-3 mt-4"
              max-width="344"
            >
              <div outlined color="#26c6da" class="px-0 d-flex align-center">
                <v-tooltip bottom open-delay="100">
                  <template v-slot:activator="{ on, attrs }">
                    <v-sheet
                      hover
                      rounded
                      v-bind="attrs"
                      v-on="on"
                      :class="{
                        'expo-title-div': true,
                        'mx-auto': true,
                        'd-flex': true,
                        'justify-content-center': true,
                        'align-items-center': true
                      }"
                      elevation="5"
                      block
                    >
                      {{ shortenedText(project.title) }}
                    </v-sheet>
                  </template>
                  <v-card>
                    <v-card-title>
                      {{ project.title }}
                    </v-card-title>
                    <v-card-text>
                      {{ project.description }}
                    </v-card-text>
                  </v-card>
                </v-tooltip>
              </div>
            </v-card>
          </v-card>
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  layout: "dashboard-layout",
  middleware: "auth",

  data() {
    return {
      stages: [],
      color: ""
    }
  },
  methods: {
    fetchStages() {
      this.$axios
        .get("actual-stages")
        .then((res) => {
          this.stages = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching stages:", error)
        })
    }
  },
  computed: {
    shortenedText() {
      return (inputString) => {
        if (inputString.length <= 10) {
          return inputString
        } else {
          return inputString.substring(0, 7) + "..."
        }
      }
    }
  },
  mounted() {
    this.fetchStages()
  }
}
</script>
<style scoped>
.expo-title-div {
  width: 60px;
  height: 60px;
  padding: 6px;
  flex-wrap: wrap;
  font-size: 11px;
  align-content: center;
  justify-content: center;
  word-break: break-all;
}
.gate-style {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}
.col {
  max-width: 80px;
  padding: 0px;
}
</style>
