export const state = () => ({
  project_checklist: [],
  selected_stage: [],
  doneItems: new Set(),
  openNodes: [],
  loading: true
})

export const getters = {
  getProjectChecklist(state) {
    return state.project_checklist.map((item) => {
      if (item.hasOwnProperty("project_checklists")) {
        item.project_checklists.map((checklist) => {
          checklist.disabled = !item.project_stage[0] || item.project_stage[0].is_started == 0
          checklist.children.map((child) => {
            child.disabled = !item.project_stage[0] || item.project_stage[0].is_started == 0
          })
        })
        return {
          ...item,
          children: item.project_checklists,
          project_checklists: undefined
        }
      } else {
        return item
      }
    })
  },
  getSelectedStage(state) {
    return state.selected_stage.map((item) => ({
      ...item,
      children: item.project_checklists.map((checklist) => ({
        ...checklist,
        done: state.doneItems.has(checklist.id),
        children: checklist.children.map((child) => ({
          ...child,
          done: state.doneItems.has(child.id)
        }))
      }))
    }))
  },
  getOpenNodes(state) {
    return state.openNodes
  },
  getLoading(state) {
    return state.loading
  },
  isDoneItem: (state) => (id) => {
    return state.doneItems.has(id)
  }
}

export const mutations = {
  SET_PROJECT_CHECKLIST(state, project_checklist) {
    state.project_checklist = project_checklist
  },
  UPDATE_CHECKLIST_ITEM(state, { id, done }) {
    if (done) {
      state.doneItems.add(id)
    } else {
      state.doneItems.delete(id)
    }

    const updateItemRecursively = (items) => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, done }
        }
        if (item.children) {
          return { ...item, children: updateItemRecursively(item.children) }
        }
        return item
      })
    }

    state.selected_stage = updateItemRecursively(state.selected_stage)
  },
  SET_INITIAL_DONE_ITEMS(state, project_checklist) {
    state.doneItems.clear()
    const addDoneItems = (items) => {
      items.forEach((item) => {
        if (item.done) {
          state.doneItems.add(item.id)
        }
        if (item.project_checklists) {
          addDoneItems(item.project_checklists)
        }
        if (item.children) {
          addDoneItems(item.children)
        }
      })
    }
    addDoneItems(project_checklist)
  },
  SET_SELECTED_STAGE(state, { stage_id, project_checklist }) {
    state.selected_stage = project_checklist.filter((item) => item.id == stage_id)
  },
  SET_OPEN_NODES(state, nodeIds) {
    state.openNodes = nodeIds
  },
  SET_LOADING(state, status) {
    state.loading = status
  }
}

export const actions = {
  fetchProjectChecklist({ commit }, { project_id, stage_id, contract_id }) {
    commit("SET_LOADING", true)
    return this.$axios
      .get(`project-checklist?project_id=${project_id}&contract_id=${contract_id}`)
      .then((res) => {
        commit("SET_PROJECT_CHECKLIST", res.data.data)
        commit("SET_INITIAL_DONE_ITEMS", res.data.data)
        commit("SET_SELECTED_STAGE", {
          stage_id: stage_id,
          project_checklist: res.data.data
        })
      })
      .finally(() => {
        commit("SET_LOADING", false)
      })
  },
  openNodes({ commit }, nodeIds) {
    commit("SET_OPEN_NODES", nodeIds)
  },
  updateChecklistItem({ commit }, { updatedItem, projectId, contractId }) {
    return this.$axios
      .post("project-checklist/update", {
        project_checklist_id: updatedItem.id,
        project_id: projectId,
        contract_id: contractId,
        done: updatedItem.done
      })
      .then(() => {
        commit("UPDATE_CHECKLIST_ITEM", { id: updatedItem.id, done: updatedItem.done })
      })
  }
}
