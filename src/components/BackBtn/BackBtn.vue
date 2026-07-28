<script lang="ts" setup>
	import { mdiArrowLeft } from '@mdi/js'
	import { locales } from './locales'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = (defineProps<{
		hideBackIcon?: boolean
		dark?: boolean
	}>())

</script>

<template>
	<VBtn
		v-bind="$attrs"
		variant="outlined"
		:class="[
			'sy-back-btn',
			'text-none',

			{ 'sy-back-btn--dark': dark },
		]"
	>
		<slot name="icon">
			<SyIcon
				v-if="!props.hideBackIcon"
				:icon="mdiArrowLeft"
				decorative
				class="mr-1"
			/>
		</slot>

		<slot>
			{{ locales.label }}
		</slot>
	</VBtn>
</template>

<style lang="scss" scoped>
.sy-back-btn {
	border-color: rgb(var(--v-theme-primary));
	color: rgb(var(--v-theme-primary));

	&--dark {
		border-color: rgb(var(--v-theme-onPrimary));
		color: rgb(var(--v-theme-onPrimary));
	}
}
</style>
