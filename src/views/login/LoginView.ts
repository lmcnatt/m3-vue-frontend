export default {
	name: "LoginView",
	emits: ["authenticate"],
	data: function () {
		return {
			isAuthenticated: false,
			alertType: "error",
			errorMsg: "",
			password: "",
			email: "",
			forgotEmail: "",
			passwordResetDialog: false,
			submitForgotPasswordLoading: false,
			registerDialog: false,
			isLoading: false,
			isRegisterFormValid: false,
			passwordResetFormIsValid: false,
			registerFormIsLoading: false,
			forgotEmailRules: {
				forgotEmail: [
					(value) => !!value || "Required.",
					(value) => (value && value.length >= 3) || "Min 3 characters"
				]
			},
			loginRules: {
				email: [
					(value) => !!value || "Required.",
					(value) => (value && value.length >= 3) || "Min 3 characters"
				],
				password: [
					(value) => !!value || "Required.",
					(value) => (value && value.length >= 8) || "Min 8 characters"
				]
			},
			register: {
				email: "",
				name: "",
				password: "",
				c_password: ""
			},
			registerRules: {
				email: [
					(value) => !!value || "Required.",
					(value) => (value && value.length >= 3) || "Min 3 characters"
				],
				name: [
					(value) => !!value || "Required.",
					(value) => (value && value.length >= 3) || "Min 3 characters"
				],
				password: [
					(value) => !!value || "Required.",
					(value) => (value && value.length >= 8) || "Min 8 characters"
				],
				c_password: [
					(value) => !!value || "Type confirm password.",
					(value) =>
						value === this.register.password ||
						"The password confirmation does not match."
				]
			},
			isFormValid: false
		}
	},
	methods: {
		submitLogin() {
			if (!this.isFormValid) {
				return
			}
			const user = {
				email: this.email,
				password: this.password
			}
			this.errorMsg = ""
			this.isLoading = true
			this.$store.dispatch("auth/login", user).then(
				() => {
					setTimeout(() => {
						window.location.reload()
					}, 2000)
				},
				(error) => {
					this.isLoading = false
					this.errorMsg =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString()
				}
			)
		},
		submitForgotPassword() {
			this.submitForgotPasswordLoading = true
			this.$store.dispatch("auth/forgotPassword", this.forgotEmail).then(
				() => {
					alert("Success!")
					this.submitForgotPasswordLoading = false
					this.passwordResetDialog = false
				},
				(error) => {
					this.submitForgotPasswordLoading = false
				}
			)
		},
		submitRegister() {
			if (!this.isRegisterFormValid) {
				return
			}

			const register = {
				name: this.register.name,
				email: this.register.email,
				password: this.register.password,
				c_password: this.register.c_password
			}

			this.registerFormIsLoading = true
			this.$store.dispatch("auth/register").then(
				() => {
					alert("Success!")
					this.registerFormIsLoading = false
					this.registerDialog = false
				},
				(error) => {
					this.registerFormIsLoading = false
					alert("Error!")
				}
			)
		}
	}
}
