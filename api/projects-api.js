const baseUrl = "projects"

export function getAllProjects($axios) {
  return $axios.get(baseUrl)
}

export function getProjectById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}

export function createProject(payload, $axios) {
  return $axios.post(baseUrl, payload)
}

export function updateProject(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload)
}

export function deleteProject(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}

// CONSTRACTS APIS
const contractsUrl = "contracts"

export function getAllContractsByProjectId(projectId, $axios) {
  return $axios.get(`${baseUrl}/${projectId}/${contractsUrl}`)
}

export function getContractByIdAndProjectId(projectId, contractId, $axios) {
  return $axios.get(`${baseUrl}/${projectId}/${contractsUrl}/${contractId}`)
}

export function createContract(projectId, payload, $axios) {
  return $axios.post(`${baseUrl}/${projectId}/${contractsUrl}`, payload)
}

export function updateContract(projectId, payload, $axios, contractId) {
  return $axios.put(`${baseUrl}/${projectId}/${contractsUrl}/${contractId}`, payload)
}

export function deleteContract(projectId, contractId, $axios) {
  return $axios.delete(`${baseUrl}/${projectId}/${contractsUrl}/${contractId}`)
}
const checklistUrl = "checklist"
export function createContractChecklist(payload, $axios) {
  return $axios.post(`${checklistUrl}/store?`, payload)
}
