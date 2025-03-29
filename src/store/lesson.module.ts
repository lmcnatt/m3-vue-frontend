import lessonService from "../services/lesson.service"

const initialState = {
	lesson: {
		student1_name: "",
		student2_name: "",
		coach_name: "",
		title: "",
		notes: "",
		dance_style: "",
		lesson_date: "",
		video: ""
	},
	lessons: []
}

export const lesson = {
	namespaced: true,
	state: initialState,
	actions: {
		listMyLessons({ commit }) {
			return lessonService.listMyLessons().then(
				(lessons) => {
					commit("setLessons", lessons)
					return Promise.resolve(lessons)
				},
				(response) => {
					return Promise.resolve(response)
				}
			)
		}
	},
	mutations: {
		setLessons(state, lessons) {
			state.lessons = lessons
		},
		setLesson(state, lesson) {
			state.lesson = lesson
		}
	},
	getters: {
		getLesson: (state) => {
			return state.lesson
		},
		getLessons: (state) => {
			return state.lessons
		}
	}
}
