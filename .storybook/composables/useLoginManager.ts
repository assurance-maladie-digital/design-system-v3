import { ref } from 'vue'

const isLoggedIn = ref(false)

export function useLoginManager() {
	function ensureLoggedIn() {
		const authStatus = localStorage.getItem('storybook-auth')
		isLoggedIn.value = authStatus === 'true';
	}

	function login() {
		isLoggedIn.value = true
		localStorage.setItem('storybook-auth', 'true')
	}

	function logout() {
		isLoggedIn.value = false
		localStorage.removeItem('storybook-auth')
	}

	return {
		ensureLoggedIn,
		login,
		logout,
		isLoggedIn,
	}
}
