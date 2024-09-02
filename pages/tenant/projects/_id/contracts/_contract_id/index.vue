<template>
  <v-container>
    <v-layout column>
      <v-card v-if="contract">
        <v-card-title>{{ contract?.name }}</v-card-title>
        <v-card-text>
          <label-value-display :label="$t('page.start_date')" :value="contract?.start_date" />
          <label-value-display :label="$t('page.end_date')" :value="contract?.end_date" />
          <label-value-display :label="$t('page.company')" :value="contract?.company?.name" />
          <label-value-display :label="$t('page.status')" :value="contract?.status?.name" />
          <label-value-display :label="$t('page.disipline')" :value="contract?.disipline?.name" />
          <label-value-display :label="$t('page.type')" :value="contract?.type?.name" />
          <v-subheader>{{ $t("page.user_access") }}</v-subheader>
          <ul>
            <li v-for="user in contract.master_access" :key="user.id">
              {{ user?.user }} ({{ user?.full_access ? "Full" : "Partial" }})
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn nuxt :to="localePath(`/tenant/projects/${projectId}/contracts/${contractId}/edit`)" color="primary">
            {{ $t("page.edit") }}
          </v-btn>
          <v-btn
            color="warning"
            nuxt
            :to="localePath(`/tenant/projects/${projectId}/contracts/${contractId}/checklists`)"
          >
            {{ $t("page.checklists") }}
          </v-btn>
          <v-btn
            color="warning"
            nuxt
            :to="localePath(`/tenant/projects/${projectId}/contracts/${contractId}/checklists/manage`)"
          >
            {{ `${$t("page.manage")} ${$t("page.checklists")}` }}
          </v-btn>
          <!-- <v-btn color="error" @click="showDeleteModal = true">{{ $t("page.delete") }}</v-btn> -->
        </v-card-actions>
        <!-- <delete-items-modal
          :show="showDeleteModal"
          :items="[contract]"
          :close="closeDeleteModal"
          :config="deleteConfig"
        /> -->
      </v-card>
      <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
    </v-layout>
  </v-container>
</template>

<script>
import { getContractByIdAndProjectId } from "../../../../../../api/projects-api"
// import DeleteItemsModal from "../../../../../../components/custom-table/DeleteItemsModal.vue"
import LabelValueDisplay from "../../../../../../components/display-page/LabelValueDisplay.vue"
import { generateErrorMessage } from "../../../../../../helpers/error-helpers.js"

export default {
  name: "ContractPage",
  layout: "dashboard-layout",
  components: {
    // DeleteItemsModal,
    LabelValueDisplay
  },
  data() {
    return {
      contract: null,
      error: null,
      loading: false,
      // showDeleteModal: false
      projectId: this.$route.params.id,
      contractId: this.$route.params.contract_id
      // deleteConfig: {
      //   delete: (id) => deleteContract(id, this.$axios),
      //   path: `/tenant/projects${this.projectId}/contracts`
      // }
    }
  },
  methods: {
    fetchContract() {
      getContractByIdAndProjectId(this.projectId, this.contractId, this.$axios)
        .then((res) => {
          this.contract = res.data.data
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.fetchContract()
  }
}
</script>

<style></style>
