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
}

const lessonsService = new LessonsService()
export default lessonsService
