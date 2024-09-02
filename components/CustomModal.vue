<template>
  <v-dialog v-model="localShow">
    <slot :close="closeModal" />
  </v-dialog>
</template>

<script>
export default {
  name: "CustomModal",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      localShow: this.show
    }
  },
  watch: {
    show(val) {
      this.localShow = val
    }
  },
  methods: {
    closeModal() {
      this.localShow = false
      this.$emit("close")
    }
  }
}
</script>

<style scoped></style>
