<script setup lang="ts">
	import { mdiAlertCircleOutline, mdiAutorenew } from '@mdi/js'
	import { useAttrs } from 'vue'
	import type { locales as defaultLocales } from './locales'

	defineProps<{
		locales: typeof defaultLocales
	}>()

	const attrs = useAttrs()

	const errorIcon = mdiAlertCircleOutline
	const renewIcon = mdiAutorenew
</script>

<template>
	<VSheet max-width="311">
		<VAlert
			color="error"
			variant="text"
			tile
			v-bind="attrs"
		>
			<template #prepend>
				<VIcon
					color="error"
					class="mr-2"
				>
					{{ errorIcon }}
				</VIcon>
			</template>

			<span>
				<slot />
			</span>

			<template #append>
				<VBtn
					color="primary"
					min-width="48px"
					min-height="36px"
					variant="outlined"
				>
					<p class="d-sr-only">
						{{ locales.renew }}
					</p>
					<VIcon>
						{{ renewIcon }}
					</VIcon>
				</VBtn>
			</template>
		</VAlert>
	</VSheet>
</template>

<style scoped lang="scss">
:deep(.v-btn) {
	padding: 0 !important;
}
</style>
