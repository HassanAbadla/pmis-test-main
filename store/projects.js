export const state = () => ({
  projects: [],
  loading: true
})

export const getters = {
  getProjects(state) {
    return state.projects
  },
  getLoading(state) {
    return state.loading
  }
}

export const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  switchLoading(state, status) {
    state.loading = status
  }
}

export const actions = {
  fetchProjects(context) {
    this.$axios.get("projects").then((res) => {
      context.commit("SET_PROJECTS", res.data.data)
    })
  }
}
