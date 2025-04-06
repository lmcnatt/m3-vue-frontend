import lessonsService from "../services/lessons.service"
import danceService from "../services/dance.service"

const initialState = { lessonsList: [], dances: [] }

export const lessons = {
	namespaced: true,
	state: initialState,
	actions: {
		getLessons({ commit }) {
			return lessonsService.getLessons().then((lessons) => {
				commit("setLessons", lessons)
				return Promise.resolve(lessons)
			})
		},
		getDances({ commit }) {
			return danceService.getDances().then((dances) => {
				commit("setDances", dances)
				return Promise.resolve(dances)
			})
		},
		createLesson({ commit }, lesson) {
			return lessonsService.createLesson(lesson).then((response) => {
				commit("addLesson", response.lesson)
				return Promise.resolve(response.lesson)
			})
		},
		updateLesson({ commit, getters }, lesson) {
			return lessonsService.updateLesson(lesson).then((response) => {
				response.lesson.index = getters.getLessonStateIndexByLessonId(
					response.lesson.id
				)
				commit("setLesson", response.lesson)
				return Promise.resolve(response.lesson)
			})
		},
		deleteLesson({ commit, getters }, lessonId) {
			return lessonsService.deleteLesson(lessonId).then((response) => {
				commit("removeLesson", lessonId)
				return Promise.resolve(response)
			})
		},
		uploadLessonVideo({ commit, getters }, lesson) {
			return lessonsService.uploadLessonVideo(lesson).then((response) => {
				response.lesson.index = getters.getLessonStateIndexByLessonId(
					response.lesson.id
				)
				commit("updateLessonVideo", response.lesson)
				return Promise.resolve(response.lesson)
			})
		}
	},
	mutations: {
		setLessons(state, lessons) {
			state.lessonsList = lessons
			if (state.dances.length === 0) {
				const dancesMap = new Map()

				for (const lesson of lessons) {
					if (lesson.dance && !dancesMap.has(lesson.dance_id)) {
						dancesMap.set(lesson.dance_id, {
							id: lesson.dance_id,
							dance: lesson.dance.dance
						})
					}
				}

				state.dances = Array.from(dancesMap.values())
			}
		},
		setDances(state, dances) {
			state.dances = dances
		},
		addLesson(state, lesson) {
			state.lessonsList.push(lesson)
		},
		setLesson(state, lesson) {
			state.lessonsList[lesson.index] = lesson
		},
		removeLesson(state, lessonId) {
			const index = state.lessonsList.findIndex(
				(lesson) => lesson.id === lessonId
			)
			if (index !== -1) {
				state.lessonsList.splice(index, 1)
			}
		},
		updateLessonVideo(state, lesson) {
			state.lessonsList[lesson.index].video = lesson.video
		}
	},
	getters: {
		getLessonStateIndexByLessonId: (state) => (lessonId) => {
			return state.lessonsList.findIndex((lesson) => {
				return lesson.id === lessonId
			})
		}
	}
}
