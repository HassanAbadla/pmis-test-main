<template>
  <department-form :editForm="true" />
</template>

<script>
import DepartmentForm from "../../../../components/forms/DepartmentForm.vue"
export default {
  name: "EditDepartmentPage",
  layout: "dashboard-layout",
  components: { DepartmentForm }
}
</script>
