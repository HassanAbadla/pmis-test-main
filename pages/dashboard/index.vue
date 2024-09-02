<template>
  <div>
    <v-container>
      <v-row justify="center" align-content="center" class="mb-4">
        <v-col cols="12" md="4">
          <nuxt-link class="text-decoration-none" :to="localePath('/tenant/projects')">
            <v-card class="mx-auto text-center" color="cyan" dark>
              <v-card-text>
                <div class="text-h4 font-weight-thin">Projects</div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-center">
                <v-btn block text>You Have (XX) Projects</v-btn>
              </v-card-actions>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="12" md="4">
          <nuxt-link class="text-decoration-none" :to="localePath('/tenant/portfolios')">
            <v-card class="mx-auto text-center" color="syan" dark>
              <v-card-text>
                <div class="text-h4 font-weight-thin">Portfolios</div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-center">
                <v-btn block text>You Have (XX) Portfolios</v-btn>
              </v-card-actions>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="12" md="4">
          <nuxt-link class="text-decoration-none" :to="localePath('/tenant/programs')">
            <v-card class="mx-auto text-center" color="primary" dark>
              <v-card-text>
                <div class="text-h4 font-weight-thin">Programs</div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-center">
                <v-btn block text>You Have (XX) Programs</v-btn>
              </v-card-actions>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-4" />
      <v-row class="mt-4">
        <v-col cols="12" md="4" v-for="color in ['cyan', 'amber', 'red']" :key="color">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet class="v-sheet--offset mx-auto" :color="color" elevation="12" max-width="calc(100% - 32px)">
              <v-sparkline :labels="labels" :value="value" color="white" line-width="2" padding="16"></v-sparkline>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="text-h6 font-weight-light mb-2">Working Example</div>
              <div class="subheading font-weight-light grey--text">Last Campaign Performance</div>
              <v-divider class="my-2"></v-divider>
              <v-icon class="mr-2" small>mdi-clock</v-icon>
              <span class="text-caption grey--text font-weight-light">last registration 26 minutes ago</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid></v-container>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  layout: "dashboard-layout",
  middleware: "auth",

  data: () => ({
    labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
    value: [200, 675, 410, 390, 310, 460, 250, 240]
  })
}
</script>
