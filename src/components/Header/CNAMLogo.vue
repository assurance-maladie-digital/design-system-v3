<script lang="ts" setup>
	import { useDisplay, useTheme } from 'vuetify'
	import Logo from './logos/Logo.vue'
	import LogoMobile from './logos/Logo-mobile.vue'

	withDefaults(defineProps<{
		ariaLabel?: string
		serviceTitle?: string
		serviceSubtitle?: string
	}>(), {
		ariaLabel: 'L\'Assurance Maladie : Agir ensemble, protéger chacun | ameli.fr (retour à l\'accueil) pour les assurés',
		serviceTitle: 'L\'Assurance Maladie : Agir ensemble, protéger chacun',
		serviceSubtitle: undefined,
	})

	const slot = defineSlots<{
		serviceTitle?(): void
	}>()

	console.log('slot', slot.serviceTitle)

	const theme = useTheme()
	const display = useDisplay()
</script>

<template>
	<div class="logo">
		<Logo
			v-if="display.mdAndUp.value"
			:aria-label
		/>
		<LogoMobile
			v-else
			:aria-label
		/>

		<slot
			v-if="slot?.serviceTitle"
			name="serviceTitle"
		/>
		<div v-else-if="serviceTitle">
			{{ serviceTitle }}
			<span v-if="serviceSubtitle">{{ serviceSubtitle }}</span>
		</div>
	</div>
</template>

<style>
.logo {
	height: 52px;
}
</style>
