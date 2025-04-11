import axios from "axios"
import API_URL from "./env"
import authHeader from "./auth-header"

class DanceService {
	getDances() {
		return axios
			.get(API_URL + "dances", { headers: authHeader() })
			.then((response) => {
				return response.data.data
			})
	}
}

const danceService = new DanceService()
export default danceService
