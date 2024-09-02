<template>
  <v-layout column align-center justify-center fill-height>
    <h1>{{ $t("error.wrong") }}</h1>
    <p>{{ message }}</p>
    <p>
      {{ $t("error.code") }}
      <span>{{ statusCode }}</span>
    </p>

    <v-btn color="primary" :to="localePath('/')">{{ $t("error.home") }}</v-btn>
  </v-layout>
</template>

<script>
export default {
  name: "EmptyLayout",
  // layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred"
    }
  },
  computed: {
    statusCode() {
      return this.error.statusCode || $t("error.unknown")
    },
    message() {
      return this.error.message || ""
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
