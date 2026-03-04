<script setup lang="ts">
	import { mdiAlertCircleOutline, mdiAutorenew } from '@mdi/js'
	import { useAttrs } from 'vue'
	import type { locales as defaultLocales } from './locales'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

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
				<SyIcon
					color="error"
					class="mr-2"
					:icon="errorIcon"
					decorative
				/>
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
					<SyIcon
						:icon="renewIcon"
						decorative
					/>
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
