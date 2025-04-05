import axios from "axios"
import API_URL from "./env"
import authHeader from "./auth-header"

class LessonsService {
	listMyLessons() {
		return axios
			.get(API_URL + "lessons", { headers: authHeader() })
			.then((response) => {
				return response.data.data
			})
	}

	editLesson(lessonData) {
		return axios
			.put(API_URL + `lessons/${lessonData.id}`, lessonData, {
				headers: authHeader()
			})
			.then((response) => {
				return response.data.data
			})
	}

	uploadLessonVideo(formData) {
		return axios
			.post(API_URL + "lessons/video/upload", formData, {
				headers: {
					...authHeader(),
					"Content-Type": "multipart/form-data"
				}
			})
			.then((response) => {
				return response.data.data
			})
	}

	deleteLessonVideo(lessonId) {
		return axios
			.delete(API_URL + `lessons/${lessonId}/video`, {
				headers: authHeader()
			})
			.then((response) => {
				return response.data.data
			})
	}
}

const lessonsService = new LessonsService()
export default lessonsService
