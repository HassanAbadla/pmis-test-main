<template>
  <v-card flat class="checklist-tree">
    <v-card-title class="primary white--text py-4">
      {{ title }}
    </v-card-title>

    <v-card-text>
      <v-row v-if="maxDepth > 1" class="mb-4">
        <v-col cols="12">
          <v-btn-toggle v-model="activeLevel" mandatory>
            <v-btn
              v-for="level in maxDepth"
              :key="level"
              :value="level"
              :disabled="level > 1 && openNodes.length === 0"
              @click="toggleLevel(level)"
              text
            >
              Level {{ level }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <v-treeview :open="openNodes" color="primary" :items="items" hoverable activatable transition dense>
        <template #prepend="{ item }">
          <v-checkbox
            v-if="'done' in item"
            :input-value="isDoneItem(item.id)"
            @change="toggleItemDone(item)"
            dense
            hide-details
            class="mt-0 pt-0"
          />
          <v-icon v-else :color="getIconColor(item)" small class="mr-2">
            {{ item.children && item.children.length > 0 ? "mdi-folder" : "mdi-folder-outline" }}
          </v-icon>
        </template>
        <template #label="{ item }">
          <span :class="{ 'font-weight-bold': item.children && !('done' in item), 'text--secondary': !item.children }">
            {{ item.title || item.description }}
          </span>
        </template>
        <template v-if="showAppend" #append="{ item }">
          <slot name="append" :item="item"></slot>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "ChecklistTree",
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    openNodes: {
      type: Array,
      required: true
    },
    showAppend: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeLevel: 1
    }
  },
  computed: {
    ...mapGetters("projectChecklist", ["isDoneItem"]),
    maxDepth() {
      return this.calculateMaxDepth(this.items) - 1 // Subtract 1 to exclude root level
    }
  },
  methods: {
    calculateMaxDepth(data) {
      if (!data || data.length === 0) {
        return 0
      }

      const getDepth = (item) => {
        if (!item) {
          return 0
        }
        if (!item.children || item.children.length === 0) {
          return 1
        }
        return 1 + Math.max(...item.children.map(getDepth))
      }

      const depths = data.map(getDepth)
      return Math.max(...depths)
    },
    toggleLevel(level) {
      const currentOpenIds = this.openNodes
      const allIds = this.extractAllNodeIds(this.items, level)

      let newOpenNodes = null
      if (currentOpenIds.length >= allIds.length) {
        // If current level or higher is open, close this level and above
        newOpenNodes = level > 1 ? this.extractAllNodeIds(this.items, level - 1) : []
      } else {
        // Open up to this level
        newOpenNodes = allIds
      }

      this.$emit("update:openNodes", newOpenNodes)
    },
    extractAllNodeIds(data, maxDepth) {
      if (!data || data.length === 0) return []

      const ids = []

      const extract = (item, currentDepth) => {
        if (currentDepth <= maxDepth) {
          ids.push(item.id)
          if (item.children) {
            item.children.forEach((child) => extract(child, currentDepth + 1))
          }
        }
      }

      data.forEach((item) => extract(item, 1))

      return ids
    },
    toggleItemDone(item) {
      this.$emit("item-toggle", { ...item, done: !this.isDoneItem(item.id) })
    },
    getIconColor(item) {
      return item.project_stage && item.project_stage[0] && item.project_stage[0].is_started === 1 ? "primary" : "grey"
    }
  }
}
</script>

<style lang="scss" scoped>
.checklist-tree {
  .v-treeview {
    &-node {
      &__root {
        min-height: 40px;
      }
      &__content {
        margin-left: 8px;
      }
      &__label {
        margin-left: 4px;
      }
    }
  }
  .v-input--selection-controls {
    margin-top: 0;
    padding-top: 0;
  }
  .v-btn-toggle {
    .v-btn {
      height: 36px;
    }
  }
}
</style>
