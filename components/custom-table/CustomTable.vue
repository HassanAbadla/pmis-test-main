<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="allHeaders"
      :items="computedItems"
      :search="search"
      :sort-by="defaultSortKey"
      class="elevation-1"
      :loading="loading"
      :loading-text="$t('table.loading')"
      :show-select="!hideDelete"
      item-key="id"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <!-- Search Bar -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('table.search')"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <!-- Delete Selected Btn -->
          <v-btn
            v-if="!hideDelete"
            color="error"
            dark
            class="mb-2 mr-2"
            @click="openDeleteModal(selected)"
            :disabled="!selected.length"
          >
            {{ $t("table.delete_selected") }}
          </v-btn>
          <!-- Create Btn -->
          <router-link :to="localePath(`${tableConfig.itemPath}/create`)">
            <v-btn color="primary" dark class="mb-2">{{ $t("table.create") }}</v-btn>
          </router-link>
        </v-toolbar>
      </template>
      <!-- Contracts Column -->
      <!-- skipcq: JS-0641 -->
      <template v-slot:item.contracts="{ item }">
        <span>{{ item.contractCount }}</span>
        <router-link v-if="!hideEdit" :to="localePath(`${tableConfig.itemPath}/${item.id}/contracts`)">
          <v-icon small>mdi-file-sign</v-icon>
        </router-link>
      </template>
      <!-- Access Column -->
      <!-- skipcq: JS-0641 -->
      <template v-slot:item.access="{ item }">
        <manage-access :tableConfig="tableConfig" :accessibleId="item.id" :usersWithAccess="item.master_access" />
      </template>
      <!-- Action Column -->
      <!-- skipcq: JS-0641 -->
      <template v-slot:item.actions="{ item }">
        <router-link v-if="!hideView" :to="localePath(`${tableConfig.itemPath}/${item.id}`)">
          <v-icon small class="mr-2">mdi-eye</v-icon>
        </router-link>
        <router-link v-if="!hideEdit" :to="localePath(`${tableConfig.itemPath}/${item.id}/edit`)">
          <v-icon small class="mr-2">mdi-pencil</v-icon>
        </router-link>
        <v-icon v-if="!hideDelete" small @click.stop="openDeleteModal([item])">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">{{ $t("table.refresh") }}</v-btn>
      </template>
    </v-data-table>
    <!-- Delete Modal -->
    <delete-items-modal
      :show="showDeleteModal"
      :items="itemsToDelete"
      :config="tableConfig"
      :close="closeDeleteModal"
      @item-deleted="handleItemDeleted"
      @items-deleted="handleItemsDeleted"
    />
  </div>
</template>

<script>
import DeleteItemsModal from "./DeleteItemsModal.vue"
import ManageAccess from "./ManageAccess.vue"

export default {
  name: "CustomTable",
  components: { ManageAccess, DeleteItemsModal },
  props: {
    title: { type: String, required: true },
    headers: { type: Array, required: true },
    tableConfig: { type: Object, required: true },
    hideEdit: { type: Boolean, default: false },
    hideView: { type: Boolean, default: false },
    hideDelete: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: true,
      showDeleteModal: false,
      items: [],
      selected: [],
      itemsToDelete: [],
      defaultSortKey: "",
      search: ""
    }
  },
  created() {
    this.initialize()
  },
  computed: {
    allHeaders() {
      if (!this.hideDelete) {
        return [
          {
            text: "Select",
            value: "data-table-select",
            sortable: false
          },
          ...this.headers
        ]
      }
      return this.headers
    },
    computedItems() {
      return this.items.map((item) => ({
        ...item,
        contractCount: item.contracts ? item.contracts.length : 0
      }))
    }
  },
  methods: {
    initialize() {
      this.loading = true
      this.tableConfig
        .fetch()
        .then((res) => {
          this.items = res.data.data
          console.log("Table Items ->", this.items)
        })
        .catch((error) => {
          console.log("ERRORS->", error)
        })
        .finally(() => {
          this.loading = false
        })

      if (this.headers.length > 0) {
        this.defaultSortKey = this.headers[0].value
      }
    },
    openDeleteModal(items) {
      this.itemsToDelete = Array.isArray(items) ? items : [items]
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.itemsToDelete = []
      this.$nextTick(() => {
        this.selected = []
      })
    },
    handleItemDeleted(deletedId) {
      this.items = this.items.filter((item) => item.id !== deletedId)
      this.selected = this.selected.filter((item) => item.id !== deletedId)
    },
    handleItemsDeleted(deletedIds) {
      this.items = this.items.filter((item) => !deletedIds.includes(item.id))
      this.selected = this.selected.filter((item) => !deletedIds.includes(item.id))
    }
  }
}
</script>

<style>
th {
  cursor: pointer;
}
</style>
