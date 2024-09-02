<template>
  <v-container>
    <v-layout v-if="!fetchUserError && !loading" column>
      <form-wrapper :title="title" @submit="submitRequest" :loading="isSubmitting || isLoadingRoles">
        <custom-input
          v-for="field in formFields"
          :key="field.name"
          :name="field.name"
          :label="$t(`auth.${field.name}`)"
          :type="field.type"
          v-model="field.value"
          :icon="field.icon"
          :required="field.required"
          :disabled="editForm"
          :errors="field.errors"
          @clear-errors="clearError(field.name)"
          @input="clearError(field.name)"
        />
        <v-radio-group v-model="selectedRoleId" @change="selectRole" row>
          <custom-radio v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
        </v-radio-group>
        <custom-checkbox
          v-for="permission in permissionsToDisplay"
          :key="permission.id"
          :label="permission.name"
          v-model="permission.selected"
          @change="toggleCheckbox(permission.id)"
        />
        <v-alert v-if="permissionsError" type="error">
          {{ permissionsError }}
        </v-alert>
      </form-wrapper>
    </v-layout>
    <message-display
      v-if="fetchUserError"
      :messageTitle="fetchUserError.title"
      :messageText="fetchUserError.text"
      :code="fetchUserError.code"
    />
  </v-container>
</template>

<script>
import { getRoles } from "../../api/roles-api"
import { createUser, getUserById, changeUserRole } from "../../api/tenent-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import { objectFromFields } from "../../helpers/field-helper"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  name: "TenantUserForm",
  components: { MessageDisplay },
  layout: "dashboard-layout",
  props: { editForm: { type: Boolean, default: false } },
  data() {
    return {
      loading: false,
      isLoadingRoles: true,
      isSubmitting: false,
      formFields: [
        {
          name: "full_name",
          type: "text",
          icon: "",
          required: true,
          value: "",
          errors: []
        },
        {
          name: "email",
          type: "email",
          icon: "",
          required: true,
          value: "",
          errors: []
        }
      ],
      permissionsGranted: [],
      roles: [],
      selectedRoleId: null,
      permissionsToDisplay: [],
      permissionsError: null,
      fetchUserError: null
    }
  },
  computed: {
    title() {
      if (this.editForm) {
        return `${this.$t("form.edit")} ${this.$t("form.user_permissions")}`
      } else {
        return `${this.$t("form.create")} ${this.$t("form.user")}`
      }
    }
  },
  methods: {
    submitRequest() {
      this.isSubmitting = true
      this.errors = {}
      this.permissionsError = null
      const payload = {
        user_role_id: this.selectedRoleId,
        permissions: this.permissionsGranted,
        ...objectFromFields(this.formFields)
      }
      const apiCall = this.editForm ? changeUserRole : createUser
      const userId = this.$route.params.id
      apiCall(payload, this.$axios, userId)
        .then(() => {
          this.$router.push(this.localePath("/tenant/users"))
        })
        .catch((error) => {
          if (error.response?.data) {
            const errorData = error.response.data.errors
            this.formFields.forEach((field) => {
              if (errorData[field.name]) {
                field.errors = errorData[field.name]
              }
            })
            if (errorData.permissions) {
              this.permissionsError = errorData.permissions[0]
            }
          } else {
            console.error(`Error ${this.editForm ? "editing" : "creating"} user:`, error)
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    fetchUser() {
      if (this.editForm) {
        this.loading = true
        const userId = this.$route.params.id
        getUserById(userId, this.$axios)
          .then((res) => {
            const data = res.data.data
            console.log("Fetched User Data:", data)
            this.formFields = this.formFields.map((field) => ({
              ...field,
              value: data[field.name] || ""
            }))
            this.selectedRoleId = data.role.id
            this.permissionsGranted = data.full_permissions.map((permission) => permission.id)
            this.permissionsToDisplay = data.full_permissions.map((permission) => ({
              ...permission,
              selected: this.permissionsGranted.includes(permission.id)
            }))
          })
          .catch((error) => {
            console.log("Error fetching user:", error)
            this.fetchUserError = generateErrorMessage(error, this.$i18n)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    fetchRoles() {
      this.isLoadingRoles = true
      getRoles(this.$axios)
        .then((res) => {
          const addSelectedKeyToRolesPermissions = res.data.data.map((role) => {
            const updatedPermissions = role.permissions.map((permission) => {
              return { ...permission, selected: false }
            })
            role.permissions = updatedPermissions
            return role
          })

          this.roles = addSelectedKeyToRolesPermissions
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.isLoadingRoles = false
        })
    },
    toggleCheckbox(permissionId) {
      const index = this.permissionsGranted.indexOf(permissionId)
      if (index > -1) {
        this.permissionsGranted.splice(index, 1)
      } else {
        this.permissionsGranted.push(permissionId)
      }
    },
    selectRole(roleId) {
      this.selectedRoleId = roleId
      this.permissionsError = null
    },
    clearError(field) {
      const fieldData = this.formFields.find((attr) => attr.name === field)
      if (fieldData) {
        fieldData.errors = []
      }
      if (field === "permissions") {
        this.permissionsError = null
      }
    }
  },
  watch: {
    selectedRoleId(newRoleId) {
      const role = this.roles.find((r) => r.id === newRoleId)
      if (role) {
        this.permissionsGranted = role.permissions.map((permission) => permission.id)
        this.permissionsToDisplay = role.permissions
      }
    },
    permissionsGranted(newPermissions) {
      this.permissionsToDisplay = this.permissionsToDisplay.map((permission) => ({
        ...permission,
        selected: newPermissions.includes(permission.id)
      }))
    }
  },
  mounted() {
    this.fetchRoles()
    if (this.editForm) {
      this.fetchUser()
    }
  }
}
</script>
