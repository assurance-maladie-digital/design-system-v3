<script setup lang="ts">
	import { computed } from 'vue'
	import { useTheme, useDisplay } from 'vuetify'
	import { mdiClose, mdiMenu } from '@mdi/js'

	const theme = useTheme()
	const display = useDisplay()

	const model = defineModel<boolean>()

	const btnStyle = computed(() => ({
		backgroundColor: model.value ? '#fff' : theme.current.value.colors.primary,
		color: model.value ? theme.current.value.colors.primary : '#fff',
	}))
</script>

<template>
	<button
		class="header-menu-btn mr-4"
		:style="btnStyle"
		@click="() => (model = !model)"
	>
		<VIcon size="48">
			{{ model ? mdiClose : mdiMenu }}
		</VIcon>
		<span v-if="display.mdAndUp.value">Menu</span>
	</button>
</template>
