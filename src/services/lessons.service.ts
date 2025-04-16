import axios from "axios"
import API_URL from "./env"
import authHeader from "./auth-header"

class LessonsService {
	getLessons() {
		return axios
			.get(API_URL + "lessons", { headers: authHeader() })
			.then((response) => {
				return response.data.data
			})
	}

	createLesson(lesson) {
		let formData = new FormData()
		formData.append("title", lesson.title)
		formData.append("lesson_date", lesson.lesson_date)
		formData.append("notes", lesson.notes)
		formData.append("coach_id", lesson.coach_id)
		formData.append("student2_id", lesson.student2_id)
		formData.append("dance_id", lesson.dance_id)
		formData.append("video", lesson.video)

		return axios
			.post(API_URL + "lessons", formData, {
				headers: authHeader("multipart")
			})
			.then((response) => {
				return response.data.data
			})
	}

	updateLesson(lesson) {
		return axios
			.put(API_URL + `lessons/${lesson.id}`, lesson, {
				headers: authHeader()
			})
			.then((response) => {
				console.log(response)
				return response.data.data
			})
	}

	deleteLesson(lessonId) {
		return axios
			.delete(API_URL + `lessons/${lessonId}`, {
				headers: authHeader()
			})
			.then((response) => {
				return response.data.data
			})
	}
	uploadLessonVideo(lesson) {
		let formData = new FormData()
		console.log("Uploading video file:", lesson.video) // Check file object
		formData.append("video", lesson.video)
		return axios
			.post(API_URL + `lessons/${lesson.id}/update_lesson_video`, formData, {
				headers: authHeader("multipart")
			})
			.then((response) => {
				return response.data.data
			})
			.catch((error) => {
				console.error("Upload request failed:", error.response || error)
				throw error
			})
	}
}

const lessonsService = new LessonsService()
export default lessonsService
