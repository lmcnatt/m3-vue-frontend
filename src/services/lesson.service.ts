import axios from "axios"
import API_URL from "./env"
import authHeader from "./auth-header"

class LessonService {
	listMyLessons() {
		return axios
			.get(API_URL + "lesson", { headers: authHeader() })
			.then((response) => {
				return response.data.data
			})
	}
}

const lessonService = new LessonService()
export default lessonService
