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
			if (lesson.coach && lesson.coach.id) {
				this.editLesson.coach_id = lesson.coach.id
			}

			// Set the student2_id from the student2 object if it exists
			if (lesson.student2 && lesson.student2.id) {
				this.editLesson.student2_id = lesson.student2.id
			}

			this.editLessonDialog = true
		},
		openCreateLessonDialog() {
			this.newLesson = {
				title: "",
				lesson_date: new Date(),
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_id: 1,
				video: ""
			}

			this.createLessonDialog = true
		},
		closeCreateLessonDialog() {
			this.newLesson = {
				title: "",
				lesson_date: new Date(),
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_id: 1,
				video: ""
			}

			this.createLessonDialog = false
		},

		createLesson() {
			this.lessonIsCreating = true
			this.createLessonErrorMessage = null
			this.$store
				.dispatch("lessons/createLesson", this.newLesson)
				.then(() => {
					this.closeCreateLessonDialog()
					this.lessonIsCreating = false
				})
				.catch((error) => {
					this.createLessonErrorMessage =
						error.response?.data?.message || "Error creating lesson"
					this.lessonIsCreating = false
				})
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
					this.editLessonErrorMessage =
						error.response?.data?.message || "Error updating lesson"
					this.lessonIsUpdating = false
				})
		},

		deleteLesson() {
			this.lessonIsDeleting = true
			this.deleteLessonErrorMessage = null

			// Get the lesson ID for deletion
			const lessonId = this.selectedDeleteLesson.id

			this.$store
				.dispatch("lessons/deleteLesson", lessonId)
				.then(() => {
					this.selectedDeleteLesson = false
					this.lessonIsDeleting = false
					this.deleteLessonDialog = false
				})
				.catch((error) => {
					this.deleteLessonErrorMessage =
						error.response?.data?.message || "Error deleting lesson"
					this.lessonIsDeleting = false
				})
		},

		onExistingLessonVideoChange(e) {
			let video = e.target.files || e.dataTransfer.files
			if (!video.length) return

			this.editLesson.video = video[0]
			this.lessonIsUpdating = true
			this.$store
				.dispatch("lessons/updateLesson", this.editLesson)
				.then(() => {
					this.lessonIsUpdating = false
				})
				.catch((error) => {
					this.editLessonErrorMessage = error.response.data.data
					this.lessonIsUpdating = false
				})
		},

		onNewLessonVideoChange(event) {
			this.newLesson.video = null

			if (!event || !event.target || !event.target.files) return // Safety check

			const video = event.target.files || event.dataTransfer.files
			if (!video.length) return

			this.newLesson.video = video[0]
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
