<template>
  <tenant-user-form :editForm="true" />
</template>

<script>
import TenantUserForm from "../../../../components/forms/TenantUserForm.vue"
export default {
  layout: "dashboard-layout",
  components: { TenantUserForm }
}
</script>

<style></style>
