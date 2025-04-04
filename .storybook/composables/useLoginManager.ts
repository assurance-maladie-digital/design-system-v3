import { ref } from 'vue'

// Shared state across all instances of the composable
const isLoggedIn = ref(false)
// Flag to track if login has been checked already
const hasCheckedLogin = ref(false)

export function useLoginManager() {
	function ensureLoggedIn() {
		// Only check login status once
		if (!hasCheckedLogin.value) {
			const authStatus = localStorage.getItem('storybook-auth')
			isLoggedIn.value = authStatus === 'true'
			hasCheckedLogin.value = true
		}
	}

	function login() {
		isLoggedIn.value = true
		localStorage.setItem('storybook-auth', 'true')
		hasCheckedLogin.value = true
	}

	function logout() {
		isLoggedIn.value = false
		localStorage.removeItem('storybook-auth')
		hasCheckedLogin.value = true
	}

	return {
		ensureLoggedIn,
		login,
		logout,
		isLoggedIn,
	}
}
