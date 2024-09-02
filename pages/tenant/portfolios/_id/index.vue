<template>
  <v-container>
    <v-layout column>
      <v-card v-if="portfolio">
        <v-card-title>{{ portfolio?.name }}</v-card-title>
        <v-card-text>
          <!-- <label-value-display :label='' :value='' /> -->
          <label-value-display :label="$t('page.description')" :value="portfolio?.description" />
          <label-value-display
            :label="$t('page.location')"
            :value="`${portfolio?.city?.name} ${portfolio?.city?.country?.name}`"
          />
          <label-value-display :label="$t('page.start_date')" :value="portfolio?.start_date" />
          <label-value-display :label="$t('page.end_date')" :value="portfolio?.end_date" />

          <v-divider></v-divider>
          <v-subheader>{{ $t("page.programs") }}</v-subheader>
          <ul>
            <li v-for="program in portfolio.programs" :key="program.id">
              {{ program?.name }} ({{ program?.description }})
            </li>
          </ul>
          <v-subheader>{{ $t("page.user_access") }}</v-subheader>
          <ul>
            <li v-for="user in portfolio.master_access" :key="user.id">
              {{ user?.user }} ({{ user?.full_access ? "Full" : "Partial" }})
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editPortfolio">{{ $t("page.edit") }}</v-btn>
          <v-btn color="error" @click="showDeleteModal = true">{{ $t("page.delete") }}</v-btn>
        </v-card-actions>
        <!-- Delete Modal -->
        <delete-items-modal
          :show="showDeleteModal"
          :items="[portfolio]"
          :close="closeDeleteModal"
          :config="deleteConfig"
        />
      </v-card>

      <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
    </v-layout>
  </v-container>
</template>

<script>
import { getPortfolioById, deletePortfolio } from "../../../../api/portfolios-api"
import DeleteItemsModal from "../../../../components/custom-table/DeleteItemsModal.vue"
import LabelValueDisplay from "../../../../components/display-page/LabelValueDisplay.vue"
import { generateErrorMessage } from "../../../../helpers/error-helpers"

export default {
  layout: "dashboard-layout",
  components: {
    DeleteItemsModal,
    LabelValueDisplay
  },
  data() {
    return {
      portfolio: null,
      error: null,
      loading: false,
      showDeleteModal: false,
      portfolioId: this.$route.params.id,
      deleteConfig: {
        delete: (id) => deletePortfolio(id, this.$axios),
        path: "/tenant/portfolios"
      }
    }
  },
  methods: {
    fetchPortfolio() {
      this.loading = true
      getPortfolioById(this.portfolioId, this.$axios)
        .then((res) => {
          this.portfolio = res.data.data
        })
        .catch((err) => {
          this.error = generateErrorMessage(err, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editPortfolio() {
      this.$router.push(this.localePath(`/tenant/portfolios/${this.portfolioId}/edit`))
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    }
  },
  mounted() {
    this.fetchPortfolio()
  }
}
</script>

<style scoped></style>
