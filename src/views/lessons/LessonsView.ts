import { mapState } from "vuex"
import { useDisplay } from "vuetify"

export default {
	name: "LessonsView",
	computed: {
		...mapState({
			lessons() {
				return this.$store.state.lessons.lessonsList
			},
			authUser() {
				return this.$store.state.auth.user
			},
			dances() {
				return this.$store.state.lessons.dances
			},
			users() {
				return this.$store.state.user.users
			}
		})
	},
	data() {
		return {
			// Form Data Holders
			editLesson: {},
			selectedDeleteLesson: null,
			newLesson: {
				title: "",
				lesson_date: new Date(),
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_id: 1,
				video: ""
			},
			selectedLesson: null,

			// Messages
			editLessonErrorMessage: null,
			createLessonErrorMessage: null,
			deleteLessonErrorMessage: null,

			// Dialogs
			lessonDialog: false,
			createLessonDialog: false,
			editLessonDialog: false,
			deleteLessonDialog: false,

			// Toggle Buttons
			editVideoChangeDialogBtn: false,

			// Loaders
			lessonIsCreating: false,
			lessonIsUpdating: false,
			lessonIsDeleting: false,
			danceIsLoading: true,
			usersIsLoading: true
		}
	},
	created() {
		this.getLessons()
		this.getDances()
		this.getUsers()
	},
	methods: {
		openLessonDialog(lesson) {
			this.selectedLesson = lesson
			this.lessonDialog = true
		},
		getLessons() {
			this.danceIsLoading = true
			this.$store.dispatch("lessons/getLessons").then(() => {
				this.danceIsLoading = false
			})
		},
		getDances() {
			this.danceIsLoading = true
			this.$store.dispatch("lessons/getDances").then(() => {
				this.danceIsLoading = false
			})
		},
		getUsers() {
			this.usersIsLoading = true
			this.$store.dispatch("user/getAllUsers").then(() => {
				this.usersIsLoading = false
			})
		},
		openDeleteLessonDialog(lesson) {
			this.selectedDeleteLesson = lesson
			this.deleteLessonDialog = true
		},
		openEditLessonDialog(lesson) {
			this.editLesson = lesson
			// Format the date for the input field
			this.editLesson.lesson_date = this.formatDateForInput(lesson.lesson_date)

			// Set the coach_id from the coach object
			// if (lesson.coach && lesson.coach.id) {
			// 	this.editLesson.coach_id = lesson.coach.id
			// }

			// Set the student2_id from the student2 object if it exists
			// if (lesson.student2 && lesson.student2.id) {
			// 	this.editLesson.student2_id = lesson.student2.id
			// }

			this.editLessonDialog = true
		},
		openCreateLessonDialog() {
			this.createLessonDialog = true

			this.newLesson = {
				title: "",
				lesson_date: new Date(),
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_id: 1,
				video: ""
			}
		},
		closeCreateLessonDialog() {
			this.createLessonDialog = false
			this.newLesson = {
				title: "",
				lesson_date: new Date(),
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_id: 1,
				video: ""
			}
		},
		closeEditLessonDialog() {
			this.editLesson = {
				title: "",
				lesson_date: new Date(),
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_id: 1,
				video: ""
			}
			this.editLessonDialog = false
			this.editVideoChangeDialogBtn = false
		},
		createLesson() {
			try {
				this.lessonIsCreating = true
				this.createLessonErrorMessage = null

				// If there's a video, log its size
				if (this.newLesson.video) {
					const fileSize = (this.newLesson.video.size / 1024 / 1024).toFixed(2) // Size in MB
					console.log(
						`Creating lesson with video: ${this.newLesson.video.name}, size: ${fileSize}MB`
					)
				}

				this.$store
					.dispatch("lessons/createLesson", this.newLesson)
					.then(() => {
						console.log("Lesson created successfully")
						this.closeCreateLessonDialog()
						this.lessonIsCreating = false
					})
					.catch((error) => {
						console.error("Lesson creation error:", error)
						// Improved error handling
						const errorMsg =
							error.response && error.response.data
								? error.response.data.response ||
								  error.response.data.message ||
								  JSON.stringify(error.response.data)
								: error.message || "Unknown creation error"

						this.createLessonErrorMessage = errorMsg
						this.lessonIsCreating = false
					})
			} catch (err) {
				console.error("Exception during lesson creation:", err)
				this.createLessonErrorMessage =
					"Error creating lesson: " + (err.message || err)
				this.lessonIsCreating = false
			}
		},
		updateLesson() {
			this.lessonIsUpdating = true
			this.editLessonErrorMessage = null
			this.$store
				.dispatch("lessons/updateLesson", this.editLesson)
				.then(() => {
					this.editLessonDialog = false
					this.editVideoChangeDialogBtn = false
					this.editLesson = {}
					this.lessonIsUpdating = false
				})
				.catch((error) => {
					console.log(error)
					this.editLessonErrorMessage = error.message
					this.lessonIsUpdating = false
				})
		},
		deleteLesson() {
			this.lessonIsDeleting = true
			this.deleteLessonErrorMessage = null
			this.$store
				.dispatch("lessons/deleteLesson", this.selectedDeleteLesson.id)
				.then(() => {
					this.selectedDeleteLesson = false
					this.lessonIsDeleting = false
					this.deleteLessonDialog = false
					this.lessonDialog = false
				})
				.catch((error) => {
					console.log(error)
					this.deleteLessonErrorMessage = error.response.data.response
					this.lessonIsDeleting = false
				})
		},
		onExistingLessonVideoChange(e) {
			try {
				let video = e.target.files || e.dataTransfer.files
				if (!video.length) return

				// Get and log file info for debugging
				const fileSize = (video[0].size / 1024 / 1024).toFixed(2) // Size in MB
				console.log(
					`Uploading video: ${video[0].name}, size: ${fileSize}MB, type: ${video[0].type}`
				)

				// Set video and start upload
				this.editLesson.video = video[0]
				this.lessonIsUpdating = true
				this.$store
					.dispatch("lessons/uploadLessonVideo", this.editLesson)
					.then(() => {
						console.log("Video upload successful")
						this.lessonIsUpdating = false
						this.editLessonDialog = false
					})
					.catch((error) => {
						console.error("Video upload error: ", error)
						// Improved error handling
						const errorMsg =
							error.response && error.response.data
								? error.response.data.response ||
								  error.response.data.message ||
								  JSON.stringify(error.response.data)
								: error.message || "Unknown upload error"

						this.editLessonErrorMessage = errorMsg
						this.lessonIsUpdating = false
					})
			} catch (err) {
				console.error("Exception during video upload:", err)
				this.editLessonErrorMessage =
					"Error preparing video upload: " + (err.message || err)
				this.lessonIsUpdating = false
			}
		},
		onNewLessonVideoChange(event) {
			try {
				this.newLesson.video = null

				if (!event || !event.target || !event.target.files) return // Safety check

				const video = event.target.files || event.dataTransfer.files
				if (!video.length) return

				// Get and log file info for debugging
				const fileSize = (video[0].size / 1024 / 1024).toFixed(2) // Size in MB
				console.log(
					`Selected video for upload: ${video[0].name}, size: ${fileSize}MB, type: ${video[0].type}`
				)

				this.newLesson.video = video[0]
			} catch (err) {
				console.error("Exception during video selection:", err)
				this.createLessonErrorMessage =
					"Error preparing video: " + (err.message || err)
			}
		},
		formatDate(dateString: string) {
			if (!dateString) return ""
			const date = new Date(dateString)
			return date.toLocaleDateString("en-US", {
				// weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric"
			})
		},
		formatDateForInput(dateString: string) {
			if (!dateString) return ""
			const date = new Date(dateString)
			return date.toISOString().split("T")[0]
		}
	}
}
