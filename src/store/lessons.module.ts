import lessonsService from "../services/lessons.service"

const initialState = { lessonsList: [], danceStyles: [], dances: [] }

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
				response.index = getters.getLessonStateIndexByLessonId(
					response.lesson.id
				)
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
			state.danceStyles = []
			state.dances = []

			const danceStylesMap = new Map()
			const dancesMap = new Map()

			for (const lesson of lessons) {
				if (lesson.dance_style && !danceStylesMap.has(lesson.dance_style_id)) {
					danceStylesMap.set(lesson.dance_style_id, {
						id: lesson.dance_style_id,
						name: lesson.dance_style.style
					})
				}
				if (lesson.dance && !dancesMap.has(lesson.dance_id)) {
					dancesMap.set(lesson.dance_id, {
						id: lesson.dance_id,
						name: lesson.dance.dance
					})
				}
			}

			state.danceStyles = Array.from(danceStylesMap.values())
			state.dances = Array.from(dancesMap.values())
		},
		updateLesson(state, updatedLesson) {
			const index = state.lessonsList.findIndex(
				(lesson) => lesson.id === updatedLesson.id
			)
			if (index !== -1) {
				state.lessonsList.splice(index, 1, updatedLesson)
			}
		},
		addLesson(state, lesson) {
			state.lessonsList.push(lesson)
		},
		setLesson(state, lesson) {
			state.lessonsList[lesson.index] = lesson
		},
		removeLesson(state, lesson) {
			state.lessonsList.splice(lesson.index + 1, 1)
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
