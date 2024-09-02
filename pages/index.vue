<template>
  <section id="hero">
    <v-sheet
      dark
      src="https://t3.ftcdn.net/jpg/04/38/61/36/360_F_438613643_ErB3cBJ3eI38XbJE5cJZcOttEcTtfLik.jpg"
      class="fit-window"
      width="100%"
    >
      <div
        style="
          height: 100%;
          width: 100%;
          background-image: url('https://t3.ftcdn.net/jpg/04/38/61/36/360_F_438613643_ErB3cBJ3eI38XbJE5cJZcOttEcTtfLik.jpg');
          background-size: 100%;
        "
      >
        <v-row align="center" style="height: 100%" justify="center">
          <v-col cols="10">
            <v-row align="center" style="height: 100%" justify="center">
              <v-col cols="12" md="6" xl="8">
                <h1 class="display-2 font-weight-bold mb-4">PMIS</h1>
                <h1 class="font-weight-light">
                  {{ $t("home.hero_message1") }}
                  <br />
                  {{ $t("home.hero_message2") }}
                  <br />
                </h1>
                <v-btn rounded outlined large dark @click="$vuetify.goTo('#features')" class="mt-5">
                  {{ $t("home.more_info") }}
                  <v-icon class="ml-2">mdi-arrow-down</v-icon>
                </v-btn>
                <div class="video d-flex align-center py-4">
                  <a @click.stop="dialog = true" class="playBut">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
                      x="0px"
                      y="0px"
                      width="60px"
                      height="60px"
                      viewBox="0 0 213.7 213.7"
                      enable-background="new 0 0 213.7 213.7"
                      xml:space="preserve"
                    >
                      <polygon
                        class="triangle"
                        id="XMLID_18_"
                        fill="none"
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        points="73.5,62.5 148.5,105.8 73.5,149.1 "
                      />

                      <circle
                        class="circle"
                        id="XMLID_17_"
                        fill="none"
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        cx="106.8"
                        cy="106.8"
                        r="103.3"
                      />
                    </svg>
                  </a>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-sheet>
    <v-container fluid id="features" class="mt-2">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row align="center" justify="space-around">
            <v-col cols="12" class="text-center">
              <h1 class="font-weight-light display-1">Title</h1>
              <h3 class="font-weight-light">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
            </v-col>
            <v-col cols="12" sm="4" class="text-center" v-for="(feature, i) in 5" :key="i">
              <v-hover v-slot:default="{ hover }">
                <v-card class="card pt-2" shaped :elevation="hover ? 10 : 4" :class="{ up: hover }">
                  <v-layout justify-center align-center>
                    <v-icon size="50" class="mb-2">mdi-account</v-icon>
                  </v-layout>
                  <v-card-title>
                    <v-spacer />
                    <h3 class="font-weight-bold">Title</h3>
                    <v-spacer />
                  </v-card-title>
                  <v-card-text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div class="svg-border-waves">
      <img src="~@/assets/img/wave2.svg" />
    </div>
  </section>
</template>

<script>
export default {
  layout: "default"
}
</script>

<style>
.fit-window {
  height: calc(100vh);
}
</style>
