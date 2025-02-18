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
			dialog: false,
			isLoading: false,
			emailRules: [
				(value) => !!value || "Required.",
				(value) => (value && value.length >= 3) || "Min 3 characters"
			],
			passwordRules: [
				(value) => !!value || "Required.",
				(value) => (value && value.length >= 10) || "Min 10 characters"
			],
			isFormValid: false,
			hardCodedEmailForDemo: "wizards@gmail.com",
			hardCodedPasswordForDemo: "1738bagels"
		}
	},
	methods: {
		submitLogin() {
			if (!this.isFormValid) {
				return
			}

			this.errorMsg = ""
			if (
				this.hardCodedPasswordForDemo === this.password &&
				this.hardCodedEmailForDemo === this.email
			) {
				this.alertType = "success"
				this.errorMsg = "Welcome Back Master Wizard!"
				this.isLoading = true
				setTimeout(() => {
					this.isAuthenticated = true
					this.$emit("authenticate", this.isAuthenticated)
				}, 1000)
			} else if (this.email === this.password) {
				this.alertType = "warning"
				this.errorMsg = "Your username and password can't be the same!"
			} else {
				this.alertType = "error"
				this.errorMsg = "Login failed! Try again."
			}
		},
		forgotPassword() {
			console.log("here")
		}
	}
}
