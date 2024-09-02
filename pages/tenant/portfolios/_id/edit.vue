<template>
  <portfolio-form :editForm="true" />
</template>

<script>
import PortfolioForm from "../../../../components/forms/PortfolioForm.vue"
export default {
  layout: "dashboard-layout",
  components: { PortfolioForm }
}
</script>

<style></style>
