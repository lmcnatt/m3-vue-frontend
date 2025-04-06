export default function authHeader(type: "multipart" | null = null) {
	const userStr = localStorage.getItem("user")
	let user = userStr ? JSON.parse(userStr) : null

	if (user && user.token) {
		if (type === "multipart") {
			return {
				Authorization: "Bearer " + user.token,
				"Content-Type": "multipart/form-data"
			}
		}
		return { Authorization: "Bearer " + user.token }
	} else {
		return {}
	}
}
