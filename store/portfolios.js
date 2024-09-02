import { createPortfolio, getAllPortfolios } from "../api/portfolios-api"

export const state = () => ({
  portfolios: [],
  loading: true
})

export const getters = {
  getPortfolios(state) {
    return state.portfolios
  },
  getLoading(state) {
    return state.loading
  }
}

export const mutations = {
  storePortfolios(state, data) {
    state.portfolios = data
  },
  switchLoading(state, status) {
    state.loading = status
  }
}

export const actions = {
  fetchPortfolios({ commit }) {
    commit("switchLoading", true)
    getAllPortfolios(this.$axios)
      .then((res) => {
        if (res.data.status == "success") {
          commit("storePortfolios", res.data.data)
        }
      })
      .catch((error) => {
        console.error("Error fetching portfolios:", error)
      })
      .finally(() => {
        commit("switchLoading", false)
      })
  },

  createThenFetchPortfolios({ dispatch }, { payload }) {
    return createPortfolio(payload, this.$axios)
      .then((response) => {
        // Ensure success status is checked before dispatching fetchPortfolios
        if (response.status === 200) {
          return dispatch("fetchPortfolios")
        } else {
          // If response status is not 200, reject the promise
          return Promise.reject(new Error("Failed to create portfolio"))
        }
      })
      .catch((error) => {
        console.error("Error updating database:", error)
        // Explicitly reject the promise to handle it in the component
        return Promise.reject(error)
      })
  }
}
