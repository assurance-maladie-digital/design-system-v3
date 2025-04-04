<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { SyTextField, PasswordField } from '@/components'

	const credentials = {
		admin: 'admin123',
	}

	const username = ref('')
	const password = ref('')
	const isAuthenticated = ref(false)
	const errorMessage = ref('')
	const isLoading = ref(false)
	const rememberMe = ref(false)
	const isPaTheme = ref(false)

	const title = computed(() => isPaTheme.value ? 'Login Portail Agent' : 'Login CNAM')

	onMounted(() => {
		// Check if user is already authenticated
		const authStatus = localStorage.getItem('storybook-auth')
		const savedUsername = localStorage.getItem('storybook-username')
		const savedTheme = localStorage.getItem('storybook-theme')

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
				<p>Veuillez vous connecter pour accéder au Design System</p>
			</div>
			<form
				class="login-form"
				@submit.prevent="handleLogin"
			>
				<div class="form-group mb-3">
					<SyTextField
						id="username"
						v-model="username"
						type="text"
						label="Identifiant"
						placeholder="Saisissez votre identifiant"
						:show-success-messages="false"
						required
					/>
				</div>
				<div class="form-group">
					<PasswordField
						id="password"
						v-model="password"
						label="Mot de passe"
						placeholder="Saisissez votre mot de passe"
						:show-success-messages="false"
						required
					/>
				</div>
				<div class="form-group remember-me">
					<VCheckbox
						v-model="rememberMe"
						label="Se souvenir de moi"
						color="primary"
					/>
				</div>
				<div
					v-if="errorMessage"
					class="error-message mb-3 d-flex justify-center text-error"
				>
					{{ errorMessage }}
				</div>
				<div class="d-flex justify-center">
					<VBtn
						type="submit"
						color="primary"
						class="login-button"
						:disabled="isLoading"
						:loading="isLoading"
					>
						Se connecter
					</VBtn>
				</div>
			</form>
		</div>
	</div>
	<div v-else>
		<div
			class="logout-container"
			:class="{ 'theme-pa': isPaTheme, 'theme-cnam': !isPaTheme }"
		>
			<div class="user-info">
				<span class="user-name">{{ username }}</span>
				<VBtn
					color="primary"
					class="logout-button"
					@click="handleLogout"
				>
					Déconnexion
				</VBtn>
			</div>
		</div>
		<slot />
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(236 236 236);
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

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-header h2 {
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
}
.theme-cnam > h2 {
  color: #0c419a;
}

.theme-pa > h2 {
  color: #000091;
}

.logout-container {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
