import { createStore } from "vuex"
import { auth } from "./auth.module"
import { user } from "./user.module"
import { lessons } from "./lessons.module"

const store = createStore({
	modules: {
		auth,
		user,
		lessons
	}
})

export default store
