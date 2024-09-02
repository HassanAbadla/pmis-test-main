<template>
  <company-form :editForm="true" />
</template>

<script>
import CompanyForm from "../../../../components/forms/CompanyForm.vue"
export default {
  name: "EditCompanyPage",
  layout: "dashboard-layout",
  components: { CompanyForm }
}
</script>

<style>
/*  */
</style>
