import lessonsService from "../services/lessons.service"

const initialState = { lessonsList: [] }

export const lessons = {
	namespaced: true,
	state: initialState,
	actions: {
		listMyLessons({ commit }) {
			return lessonsService.listMyLessons().then((lessons) => {
				commit("setLessons", lessons)
				return Promise.resolve(lessons)
			})
		},
		editLesson({ commit }, lessonData) {
			return lessonsService.editLesson(lessonData).then((updatedLesson) => {
				commit("updateLesson", updatedLesson)
				return Promise.resolve(updatedLesson)
			})
		},
		uploadLessonVideo({ commit }, formData) {
			return lessonsService.uploadLessonVideo(formData).then((response) => {
				return Promise.resolve(response)
			})
		},
		deleteLessonVideo({ commit }, lessonId) {
			return lessonsService.deleteLessonVideo(lessonId).then((response) => {
				return Promise.resolve(response)
			})
		}
	},
	mutations: {
		setLessons(state, lessons) {
			state.lessonsList = lessons
		},
		updateLesson(state, updatedLesson) {
			const index = state.lessonsList.findIndex(
				(lesson) => lesson.id === updatedLesson.id
			)
			if (index !== -1) {
				state.lessonsList.splice(index, 1, updatedLesson)
			}
		}
	}
}
