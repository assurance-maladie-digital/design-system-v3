<script lang="ts" setup>
	import { ref } from 'vue'
	import UserMenuBtn from '@/components/UserMenuBtn/UserMenuBtn.vue'

	const selected = ref(null)
	const items = ref([
		{ text: 'Administration', value: 'Administration' },
		{ text: 'Profil', value: 'Profil' },
		{ text: 'Paramètres', value: 'Paramètres' },
	])

	const handleLogout = () => {
		alert('User logged out')
	}

	const hideLogOut = ref(false)
	const hideUserIcon = ref(false)
	const isMobileVersion = ref(false)
	const isVuetifyOptions = ref(false)

	const vuetifyOptions = ref({
		menu: { minWidth: '150px', maxWidth: '150px' },
		btn: { variant: 'outlined' },
		icon: { color: 'warning' },
		logoutListItem: { class: 'text-warning' },
		logoutIcon: { color: 'warning' },
	})
</script>

<template>
	<main class="pa-6">
		<UserMenuBtn
			v-model="selected"
			:hide-logout-btn="hideLogOut"
			:hide-user-icon="hideUserIcon"
			:is-mobile-view="isMobileVersion"
			:menu-items="items"
			:vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
			@logout="handleLogout"
		/>

		<v-switch
			v-model="hideLogOut"
			label="Hide logout button"
		/>
		<v-switch
			v-model="hideUserIcon"
			label="Hide user icon"
		/>
		<v-switch
			v-model="isMobileVersion"
			label="Mobile version"
		/>
		<v-switch
			v-model="isVuetifyOptions"
			label="Vuefity options"
		/>
		<p>Selected: {{ selected }}</p>
	</main>
</template>
