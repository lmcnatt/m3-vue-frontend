let API_URL = "http://54.165.180.0:8888/api/"
if (import.meta.env.MODE === "development") {
	API_URL = "http://127.0.0.1:8000/api/"
}

// Used for direct server file access
export const BASE_URL =
	import.meta.env.MODE === "development"
		? "http://127.0.0.1:8000/"
		: "http://54.165.180.0:8888/"

export default API_URL
