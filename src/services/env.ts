let API_URL = "http://54.165.180.0:8000/api/"
if (import.meta.env.MODE === "development") {
	API_URL = "http://127.0.0.1:8000/api/"
}
export default API_URL
