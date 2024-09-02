<template>
  <all-stages />
</template>

<script>
export default {
  layout: "dashboard-layout",
  middleware: "auth"
}
</script>

<style lang="scss">
.v-treeview-node__root {
  min-height: 40px;
}
.v-treeview-node__content {
  min-height: 40px;
}
.treeview {
  width: 300px;
}
</style>
