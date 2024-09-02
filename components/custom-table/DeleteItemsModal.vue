<template>
  <custom-modal :show="show" @close="close">
    <!-- skipcq: JS-0679 -->
    <template v-slot="{ close }">
      <v-card>
        <v-card-title class="text-h5">{{ $t("table.delete") }}</v-card-title>
        <v-card-text>{{ deleteMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="close">{{ $t("table.cancel") }}</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete" :disabled="isDeleting">
            {{ $t("table.delete") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </custom-modal>
</template>

<script>
export default {
  name: "DeleteItemsModal",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    close: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDeleting: false
    }
  },
  watch: {
    show(newVal) {
      if (!newVal) {
        this.$emit("close")
      }
    }
  },
  methods: {
    async confirmDelete() {
      this.isDeleting = true
      try {
        if (this.isMultipleDelete) {
          await Promise.all(this.items.map((item) => this.config.delete(item.id)))
          this.$emit(
            "items-deleted",
            this.items.map((item) => item.id)
          )
        } else if (this.items.length === 1) {
          await this.config.delete(this.items[0].id)
          this.$emit("item-deleted", this.items[0].id)
        }
        this.close()

        if (this.config?.path && !this.isMultipleDelete && this.items.length === 1) {
          this.$router.push(this.localePath(this.config.path))
        }
      } catch (error) {
        console.error("Error deleting item(s):", error)
      } finally {
        this.isDeleting = false
      }
    }
  },
  computed: {
    isMultipleDelete() {
      return this.items.length > 1
    },
    computedName() {
      if (this.isMultipleDelete || this.items.length === 0) return ""
      const item = this.items[0]
      return item ? item.full_name || item.name || item.id : ""
    },
    deleteMessage() {
      if (this.isMultipleDelete) {
        return this.$t("table.delete_selected_message", { count: this.items.length })
      }
      return this.$t("table.delete_message", { name: this.computedName })
    }
  }
}
</script>
