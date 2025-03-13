<script setup lang="ts">
	import { computed } from 'vue'
	import { useTheme } from 'vuetify'
	import type { RouteRecordRaw } from 'vue-router'

	const props = withDefaults(defineProps<{
		pageTitle?: string
		message?: string
		code?: string
		btnText?: string
		btnLink?: RouteRecordRaw | string
		hideBtn?: boolean
	}>(), {
		pageTitle: 'Accès non autorisé',
		message: 'Cette documentation n\'est accessible qu\'avec le thème CNAM.',
		code: '403',
		btnText: 'Retour à l\'accueil',
		btnLink: '/',
		hideBtn: false,
	})

	const theme = useTheme()
	const currentTheme = computed(() => theme.current.value)
	const primaryColor = computed(() => {
		// Récupérer la couleur primaire du thème actuel
		return currentTheme.value.colors.primary
	})
</script>

<template>
	<div class="custom-error-page-overlay">
		<div class="custom-error-page">
			<div class="error-container">
				<div
					class="error-code"
					:style="{ color: primaryColor }"
				>
					{{ props.code }}
				</div>
				<h2 class="error-title">
					{{ props.pageTitle }}
				</h2>
				<p class="error-message">
					{{ props.message }}
				</p>
				<v-btn
					v-if="!props.hideBtn && props.btnText"
					:to="props.btnLink"
					:color="primaryColor"
					class="mt-6"
				>
					{{ props.btnText }}
				</v-btn>
			</div>
		</div>
	</div>
</template>

<style scoped>
.custom-error-page-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: white;
	z-index: 9999;
	overflow: hidden;
}

.custom-error-page {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	padding: 2rem;
}

.error-container {
	max-width: 600px;
	text-align: center;
}

.error-code {
	font-size: 6rem;
	line-height: 6rem;
	font-weight: 400;
	margin-bottom: 1rem;
}

.error-title {
	font-size: 1.5rem;
	font-weight: bold;
	margin-bottom: 1rem;
}

.error-message {
	margin-bottom: 2rem;
}
</style>
