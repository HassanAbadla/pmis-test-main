<template>
  <div>
    <v-container>
      <template>
        <v-row justify="center" align="center" class="mt-5">
          <v-hover v-slot="{ hover }">
            <v-avatar size="150">
              <img src="https://api.pmisexpro.com/storage/DglfbBZ2PjaW4Yyjj26H57moLz1xv9Y8uGauqtKt.jpg" alt="Avatar" />
              <v-overlay absolute :value="hover">
                <v-btn large icon color="white" @click="openEditAvatarDialog()">
                  <v-icon>mdi-image-edit</v-icon>
                </v-btn>
              </v-overlay>
            </v-avatar>
          </v-hover>
        </v-row>
      </template>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <!-- profileFormFields -->
              <form-wrapper
                :title="$t('form.profile_information')"
                @submit="saveProfile"
                :loading="isSubmittingProfile"
                :submit-text="$t('form.save')"
              >
                <custom-input
                  v-for="field in profileFormFields"
                  :key="field.name"
                  :name="field.name"
                  :label="$t(`auth.${field.name}`)"
                  :type="field.type"
                  v-model="field.value"
                  :icon="field.icon"
                  :required="field.required"
                  :disabled="field.disabled"
                  :errors="field.errors"
                  @clear-errors="field.errors = []"
                  @input="field.inputAction"
                />
                <!-- show message here -->
              </form-wrapper>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <!-- passwordFormFields -->
              <form-wrapper
                :title="$t('auth.change_password')"
                @submit="changePassword"
                :loading="loading"
                :submit-text="$t('form.save')"
              >
                <p v-if="passwordChangeErrorMessage" class="error-message">{{ passwordChangeErrorMessage.text }}</p>
                <custom-input
                  v-for="field in passwordFormFields"
                  :key="field.name"
                  :name="field.name"
                  :label="$t(`auth.${field.name}`)"
                  :type="field.type"
                  v-model="field.value"
                  :icon="field.icon"
                  :required="field.required"
                  :disabled="field.disabled"
                  :valid-password="field.validPassword"
                  :errors="field.errors"
                  @clear-errors="field.errors = []"
                  @input="field.inputAction"
                />
              </form-wrapper>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="editAvatarDialog" max-width="600px">
        <template v-slot:activator="{}"></template>
        <v-card>
          <v-card-title>Edit Avatar</v-card-title>
          <v-card-text>
            <v-file-input outlined label="File Upload Avatar" v-model="avatarFile"></v-file-input>
          </v-card-text>

          <v-card-actions>
            <v-btn class="white--text text-capitalize" color="primary" @click="confirmAvatarChange">Confirm</v-btn>
            <v-btn class="white--text text-capitalize" color="primary" @click="editAvatarDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <message-display
      v-if="tooManyAttempsError"
      :messageTitle="tooManyAttempsError.title"
      :messageText="tooManyAttempsError.text"
    />
  </div>
</template>

<script>
import { changeUserPassword, updateProfileDetails } from "../../api/user-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import { objectFromFields } from "../../helpers/field-helper"

export default {
  name: "SettingsPage",
  layout: "dashboard-layout",
  middleware: "auth",

  data() {
    return {
      loading: false,
      passwordChangeErrorMessage: "",
      isSubmittingProfile: false,
      editAvatarDialog: false,
      avatarFile: "",
      profileFormFields: [
        {
          name: "full_name",
          type: "text",
          icon: "mdi-account",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("full_name")
        },
        {
          name: "email",
          type: "email",
          icon: "mdi-email",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("email")
        },
        {
          name: "phone",
          type: "text",
          icon: "mdi-phone",
          required: false,
          value: "",
          errors: [],
          validPhone: true,
          inputAction: this.clearError("phone")
        }
      ],
      passwordFormFields: [
        {
          name: "current_password",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "gegthe",
          errors: [],
          inputAction: this.clearError("current_password")
        },
        {
          name: "new_password",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "password1!",
          errors: [],
          validPassword: true,
          inputAction: this.clearError("new_password")
        },
        {
          name: "new_password_confirmation",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "password1!",
          errors: [],
          inputAction: this.clearError("new_password_confirmation")
        }
      ]
    }
  },
  methods: {
    clearError(field) {
      return () => {
        const fieldData =
          this.profileFormFields.find((attr) => attr.name === field) ||
          this.passwordFormFields.find((attr) => attr.name === field)
        fieldData.errors = []
        if (field === "current_password") {
          this.passwordChangeErrorMessage = ""
        }
      }
    },
    saveProfile() {
      this.isSubmittingProfile = true
      const payload = objectFromFields(this.profileFormFields)
      updateProfileDetails(payload, this.$axios)
        .then(() => {
          // Handle success (e.g., show a success message)
          this.$toast.success(this.$t("page.successfully"))
        })
        .catch((error) => {
          // Handle API errors
          if (error.response?.data && error.response.data.errors) {
            const apiErrors = error.response.data.errors
            this.profileFormFields.forEach((field) => {
              if (apiErrors[field.name]) {
                field.errors = apiErrors[field.name]
              }
            })
          }
        })
        .finally(() => {
          this.isSubmittingProfile = false
        })
    },
    changePassword() {
      this.loading = true
      this.passwordChangeErrorMessage = ""
      const payload = objectFromFields(this.passwordFormFields)

      changeUserPassword(payload, this.$axios)
        .then(() => {
          // Handle success (e.g., show a success message)
          this.$toast.success(this.$t("page.password_changed_successfully"))
          // Clear the password fields
          this.passwordFormFields.forEach((field) => (field.value = ""))
        })
        .catch((error) => {
          // Handle API errors
          if (error.response?.data?.errors) {
            const apiErrors = error.response.data.errors
            this.passwordFormFields.forEach((field) => {
              if (apiErrors[field.name]) {
                field.errors = apiErrors[field.name]
              }
            })
          } else if (error.response) {
            console.log(error.response)
            this.passwordChangeErrorMessage = generateErrorMessage(error, this.$i18n)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    openEditAvatarDialog() {
      this.editAvatarDialog = true
    },
    confirmAvatarChange() {
      console.log("Avatar change confirmed")
      // Add your logic to change avatar
    },
    fetchProfile() {
      // array of field names I want to populate
      const userFields = this.profileFormFields.map((field) => field.name)
      // populate each field with fields from user
      userFields.forEach((field) => {
        const userData = this.$auth.user[field]
        const fieldData = this.profileFormFields.find((attr) => attr.name === field)
        if (fieldData) {
          fieldData.value = userData
        }
      })
    }
  },
  mounted() {
    this.fetchProfile()
  }
}
</script>

<style scoped>
.success-message {
  font-size: 2em; /* Adjust the font size as needed */
  text-align: center;
  padding: 20px;
  color: #120505; /* Change the text color to your desired color */
  border-radius: 5px;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}
</style>
