<template>
  <project-form :editForm="true" />
</template>

<script>
import ProjectForm from "../../../../components/forms/ProjectForm.vue"
export default {
  layout: "dashboard-layout",
  components: { ProjectForm }
}
</script>

<style></style>
