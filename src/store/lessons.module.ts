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
		}
	},
	mutations: {
		setLessons(state, lessons) {
			state.lessonsList = lessons
		}
	}
}
