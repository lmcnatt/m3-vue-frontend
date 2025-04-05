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
			danceStyles() {
				return this.$store.state.lessons.danceStyles
			},
			dances() {
				return this.$store.state.lessons.dances
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
				lesson_date: "",
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_style_id: 1,
				dance_id: 1,
				video: ""
			},

			// Messages
			editLessonErrorMessage: null,
			createLessonErrorMessage: null,

			// Dialogs
			createLessonDialog: false,
			editLessonDialog: false,
			deleteLessonDialog: false,

			// Toggle Buttons
			editVideoChangeDialogBtn: false,

			// Loaders
			lessonIsCreating: false,
			lessonIsUpdating: false,
			lessonIsDeleting: false
		}
	},
	created() {
		this.getLessons()
	},
	methods: {
		openLessonDialog(lesson) {
			this.selectedLesson = lesson
			this.lessonDialog = true
		},
		getLessons() {
			this.$store.dispatch("lessons/getLessons").then(() => {
				this.isLoadingLessons = false

				// Ensure we have a list of users for the dropdowns
				if (this.allUsers.length === 0) {
					this.extractUsersFromLessons()
				}
			})
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
		},
		openDeleteLessonDialog(lesson) {
			this.selectedDeleteLesson = lesson
			this.deleteLessonDialog = true
		},
		openEditLessonDialog(lesson) {
			this.editLesson = lesson
			// Format the date for the input field
			this.editLesson.lesson_date = this.formatDateForInput(lesson.lesson_date)

			// Set the coach_id and student2_id for the selects
			this.editLesson.coach_id = lesson.coach.id
			if (lesson.student2) {
				this.editLesson.student2_id = lesson.student2.id
			} else {
				this.editLesson.student2_id = null
			}

			// Set available dances based on dance style
			this.onDanceStyleChange(this.editLesson.dance_style)

			this.editLessonDialog = true
		},
		openCreateLessonDialog() {
			this.newLesson = {
				title: "",
				lesson_date: "",
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_style_id: 1,
				dance_id: 1,
				video: ""
			}

			this.createLessonDialog = true
		},
		closeCreateLessonDialog() {
			this.newLesson = {
				title: "",
				lesson_date: "",
				notes: "",
				coach_id: "",
				student2_id: "",
				dance_style_id: 1,
				dance_id: 1,
				video: ""
			}

			this.createLessonDialog = false
		},
		closeEditLessonDialog() {
			this.editLessonDialog = false
			this.editLesson = {}
		},
		closeDeleteLessonDialog() {
			this.deleteLessonDialog = false
			this.selectedDeleteLesson = null
		},

		createLesson() {},

		updateLesson() {},

		deleteLesson() {},

		extractUsersFromLessons() {
			// Extract unique users from the lessons
			if (this.lessons && this.lessons.length > 0) {
				const usersMap = new Map()

				this.lessons.forEach((lesson) => {
					// Add coach
					if (lesson.coach && !usersMap.has(lesson.coach.id)) {
						usersMap.set(lesson.coach.id, lesson.coach)
					}

					// Add student1
					if (lesson.student1 && !usersMap.has(lesson.student1.id)) {
						usersMap.set(lesson.student1.id, lesson.student1)
					}

					// Add student2 if exists
					if (lesson.student2 && !usersMap.has(lesson.student2.id)) {
						usersMap.set(lesson.student2.id, lesson.student2)
					}
				})

				this.allUsers = Array.from(usersMap.values())
			}
		},
		onDanceStyleChange(danceStyle) {
			// Update available dances based on the selected dance style
			if (danceStyle && this.danceMap[danceStyle]) {
				this.availableDances = this.danceMap[danceStyle]

				// If current dance is not in the available dances, reset it
				if (
					this.editingLesson &&
					this.availableDances.indexOf(this.editingLesson.dance) === -1
				) {
					this.editingLesson.dance = null
				}
			} else {
				this.availableDances = []
				if (this.editingLesson) {
					this.editingLesson.dance = null
				}
			}
		},
		onVideoChange(e) {
			const video = e.target.files || e.dataTransfer.files
			if (!video.length) return

			this.isUploadingVideo = true

			// Create a FormData object to send the video
			const formData = new FormData()
			formData.append("video", video[0])
			formData.append("lesson_id", this.editingLesson.id)

			// Call the API to upload the video
			this.$store
				.dispatch("lessons/uploadLessonVideo", formData)
				.then((response) => {
					// Update the editingLesson with the new video URL
					this.editingLesson.video = response.video
					this.isUploadingVideo = false
				})
				.catch((error) => {
					console.error("Error uploading video:", error)
					alert("Error uploading video. Please try again.")
					this.isUploadingVideo = false
				})
		},
		removeVideo() {
			if (!this.editingLesson.video) return

			this.isUploadingVideo = true

			// Call the API to delete the video
			this.$store
				.dispatch("lessons/deleteLessonVideo", this.editingLesson.id)
				.then(() => {
					// Update the editingLesson
					this.editingLesson.video = null
					this.isUploadingVideo = false
				})
				.catch((error) => {
					console.error("Error removing video:", error)
					alert("Error removing video. Please try again.")
					this.isUploadingVideo = false
				})
		},
		saveLesson() {
			this.isSavingLesson = true

			// Prepare the data for the API
			const lessonData = {
				id: this.editingLesson.id,
				title: this.editingLesson.title,
				dance_style: this.editingLesson.dance_style,
				dance: this.editingLesson.dance,
				lesson_date: this.editingLesson.lesson_date,
				notes: this.editingLesson.notes,
				coach_id: this.editingLesson.coach_id,
				student2_id: this.editingLesson.student2_id
			}

			// Call the API to save the lesson
			this.$store
				.dispatch("lessons/editLesson", lessonData)
				.then((response) => {
					// Update the selected lesson with the updated data
					this.selectedLesson = response

					// Refresh the lesson list
					this.getLessons()

					// Close the edit dialog
					this.editLessonDialog = false
					this.editingLesson = null
					this.isSavingLesson = false
				})
				.catch((error) => {
					console.error("Error saving lesson:", error)
					alert("Error saving lesson. Please try again.")
					this.isSavingLesson = false
				})
		}
	}
}
