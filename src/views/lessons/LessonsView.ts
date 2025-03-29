import { mapState } from "vuex"
import { useDisplay } from "vuetify"

export default {
	name: "LessonsView",
	data() {
		return {
			lessonDialog: false,
			selectedLesson: null,
			isLoadingLessons: true
		}
	},
	computed: {
		...mapState({
			lessons() {
				return this.$store.state.lessons.lessonsList
			}
		})
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
			this.$store.dispatch("lessons/listMyLessons").then(() => {
				this.isLoadingLessons = false
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
		}
	}
}
