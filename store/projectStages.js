export const state = () => ({
  project_stages: []
})

export const getters = {
  getProjectStages(state) {
    return state.project_stages
  }
}

export const mutations = {
  SET_INITIAL_PROJECT_STAGES(state, project_stages) {
    state.project_stages = project_stages
  },
  SET_PROJECT_STAGES(state, stage) {
    const updatedArray = state.project_stages.map((item) => {
      if (item.id === stage.project_stage) {
        // Replace properties with the ones from the second object
        return {
          ...item,
          end_date: stage.end_date,
          estimate_end_date: stage.estimate_end_date,
          estimate_start_date: stage.estimate_start_date,
          is_completed: stage.is_completed,
          is_started: stage.is_started,
          start_date: stage.start_date
        }
      }
      return item
    })

    return (state.project_stages = updatedArray)
  }
}

export const actions = {
  fetchProjectStages(context, { project_id, contract_id, stage_id }) {
    this.$axios.get("project-stages?project_id=" + project_id + "&contract_id=" + contract_id).then((res) => {
      context.commit("SET_INITIAL_PROJECT_STAGES", res.data.data)
    })
  },
  saveStage(context, stage) {
    // console.log('rrrrrrrrrrrrrrrrr', stage)
    this.$axios.post("project-stages/update", stage).then((res) => {
      context.commit("SET_PROJECT_STAGES", stage)
    })
  }
}
