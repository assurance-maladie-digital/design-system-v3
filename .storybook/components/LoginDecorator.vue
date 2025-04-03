<script setup>
	import { ref, computed, onMounted, watch } from 'vue'

	// Customizable credentials - in a real app, these would be managed securely
	const credentials = {
		admin: 'admin123',
		designer: 'design2025',
		developer: 'dev2025',
	}

	// State variables
	const username = ref('')
	const password = ref('')
	const showPassword = ref(false)
	const isAuthenticated = ref(false)
	const errorMessage = ref('')
	const isLoading = ref(false)
	const rememberMe = ref(false)
	const isPaTheme = ref(false)

	// Computed properties
	const title = computed(() => isPaTheme.value ? 'Portail Agent Design System' : 'CNAM Design System')

	// Toggle password visibility
	const togglePasswordVisibility = () => {
		showPassword.value = !showPassword.value
		const passwordInput = document.getElementById('password')
		if (passwordInput) {
			passwordInput.type = showPassword.value ? 'text' : 'password'
		}
	}

	// Toggle theme
	const toggleTheme = () => {
		isPaTheme.value = !isPaTheme.value
		localStorage.setItem('storybook-login-theme', isPaTheme.value ? 'pa' : 'cnam')
	}

	// Watch for theme changes and update document theme
	watch(isPaTheme, (newValue) => {
		if (typeof window !== 'undefined') {
			const rootElement = document.documentElement
			rootElement.classList.remove('theme-cnam', 'theme-pa')
			rootElement.classList.add(`theme-${newValue ? 'pa' : 'cnam'}`)
		}
	})

	onMounted(() => {
		// Check if user is already authenticated
		const authStatus = localStorage.getItem('storybook-auth')
		const savedUsername = localStorage.getItem('storybook-username')
		const savedTheme = localStorage.getItem('storybook-login-theme')

		if (authStatus === 'true' && savedUsername) {
			isAuthenticated.value = true
			username.value = savedUsername
		}

		if (savedTheme) {
			isPaTheme.value = savedTheme === 'pa'
		}

		// Apply theme on mount
		if (typeof window !== 'undefined') {
			const rootElement = document.documentElement
			rootElement.classList.remove('theme-cnam', 'theme-pa')
			rootElement.classList.add(`theme-${isPaTheme.value ? 'pa' : 'cnam'}`)
		}
	})

	const handleLogin = async () => {
		isLoading.value = true
		errorMessage.value = ''

		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 800))

		// Check credentials
		if (credentials[username.value] === password.value) {
			isAuthenticated.value = true

			if (rememberMe.value) {
				localStorage.setItem('storybook-auth', 'true')
				localStorage.setItem('storybook-username', username.value)
			}
			else {
				// Session storage only lasts for the current session
				sessionStorage.setItem('storybook-auth', 'true')
				sessionStorage.setItem('storybook-username', username.value)
				// Clear any previous localStorage auth
				localStorage.removeItem('storybook-auth')
				localStorage.removeItem('storybook-username')
			}

			errorMessage.value = ''
		}
		else {
			errorMessage.value = 'Identifiant ou mot de passe incorrect'
		}

		isLoading.value = false
	}

	const handleLogout = () => {
		isAuthenticated.value = false
		localStorage.removeItem('storybook-auth')
		localStorage.removeItem('storybook-username')
		sessionStorage.removeItem('storybook-auth')
		sessionStorage.removeItem('storybook-username')
		username.value = ''
		password.value = ''
		rememberMe.value = false
	}
</script>

<template>
	<div
		v-if="!isAuthenticated"
		class="login-overlay"
	>
		<div
			class="login-container"
			:class="{ 'theme-pa': isPaTheme, 'theme-cnam': !isPaTheme }"
		>
			<div class="login-header">
				<h2>{{ title }}</h2>
				<p>Veuillez vous connecter pour accéder au design system</p>
			</div>
			<form
				class="login-form"
				@submit.prevent="handleLogin"
			>
				<div class="form-group">
					<label for="username">Identifiant</label>
					<input
						id="username"
						v-model="username"
						type="text"
						placeholder="Saisissez votre identifiant"
						required
						:class="{ 'input-error': errorMessage }"
					>
				</div>
				<div class="form-group">
					<label for="password">Mot de passe</label>
					<input
						id="password"
						v-model="password"
						type="password"
						placeholder="Saisissez votre mot de passe"
						required
						:class="{ 'input-error': errorMessage }"
					>
					<div
						class="password-toggle"
						@click="togglePasswordVisibility"
					>
						<span v-if="showPassword">Masquer</span>
						<span v-else>Afficher</span>
					</div>
				</div>
				<div class="form-group remember-me">
					<input
						id="remember"
						v-model="rememberMe"
						type="checkbox"
					>
					<label for="remember">Se souvenir de moi</label>
				</div>
				<div
					v-if="errorMessage"
					class="error-message"
				>
					{{ errorMessage }}
				</div>
				<button
					type="submit"
					class="login-button"
					:disabled="isLoading"
				>
					<span
						v-if="isLoading"
						class="loader"
					/>
					<span v-else>Se connecter</span>
				</button>
			</form>
			<div class="theme-toggle">
				<button
					class="theme-button"
					@click="toggleTheme"
				>
					{{ isPaTheme ? 'Thème CNAM' : 'Thème PA' }}
				</button>
			</div>
		</div>
	</div>
	<div v-else>
		<div
			class="logout-container"
			:class="{ 'theme-pa': isPaTheme, 'theme-cnam': !isPaTheme }"
		>
			<div class="user-info">
				<span class="user-name">{{ username }}</span>
				<button
					class="logout-button"
					@click="handleLogout"
				>
					Déconnexion
				</button>
			</div>
		</div>
		<slot />
	</div>
</template>

<style>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(231, 236, 245, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.login-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 32px;
  width: 100%;
  max-width: 420px;
  transition: all 0.3s ease;
}

.login-container.theme-pa {
  border-top: 4px solid #000091;
}

.login-container.theme-cnam {
  border-top: 4px solid #0c419a;
}

.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-header h2 {
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
}

.theme-cnam .login-header h2 {
  color: #0c419a;
}

.theme-pa .login-header h2 {
  color: #000091;
}

.login-header p {
  color: #545859;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.form-group label {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  padding: 12px 16px;
  border: 1px solid #ced9eb;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #0c419a;
  box-shadow: 0 0 0 3px rgba(12, 65, 154, 0.1);
}

.theme-pa .form-group input:focus {
  border-color: #000091;
  box-shadow: 0 0 0 3px rgba(0, 0, 145, 0.1);
}

.input-error {
  border-color: #d32f2f !important;
}

.password-toggle {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #0c419a;
  cursor: pointer;
  user-select: none;
}

.theme-pa .password-toggle {
  color: #000091;
}

.remember-me {
  flex-direction: row !important;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
}

.login-button {
  background-color: #0c419a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 14px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.theme-pa .login-button {
  background-color: #000091;
}

.login-button:hover {
  background-color: #0a347b;
}

.theme-pa .login-button:hover {
  background-color: #00006d;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
  padding: 4px 0;
}

.theme-toggle {
  margin-top: 24px;
  text-align: center;
}

.theme-button {
  background: none;
  border: none;
  color: #0c419a;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px 8px;
}

.theme-pa .theme-button {
  color: #000091;
}

.logout-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.logout-button {
  background-color: #0c419a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-pa .logout-button {
  background-color: #000091;
}

.logout-button:hover {
  background-color: #0a347b;
}

.theme-pa .logout-button:hover {
  background-color: #00006d;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
