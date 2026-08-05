<script lang="ts" setup>
	import { mdiArrowLeft } from '@mdi/js'
	import { computed } from 'vue'
	import { locales as defaultLocales } from './locales'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	const props = withDefaults(defineProps<{
		hideBackIcon?: boolean
		dark?: boolean
		color?: string
		backgroundColor?: string
		locales?: DeepPartial<typeof defaultLocales>
	}>(), {
		backgroundColor: 'white',
		locales: () => ({}),
		color: undefined,
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const isDark = computed(() => props.dark ?? false)
	const color = computed(() => props.color || (isDark.value ? 'white' : 'primary'))
	const buttonTheme = computed(() => isDark.value ? 'dark' : undefined)
	const buttonBgColor = computed(() => isDark.value ? 'transparent' : props.backgroundColor)

</script>

<template>
	<VBtn
		v-bind="$attrs"
		variant="outlined"
		:theme="buttonTheme"
		:color="color"
		:class="['sy-back-btn', 'text-none']"
		:style="{ backgroundColor: buttonBgColor }"
	>
		<slot name="icon">
			<SyIcon
				v-if="!props.hideBackIcon"
				:icon="mdiArrowLeft"
				decorative
				:color="color"
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

	&.v-theme--dark {
		border-color: rgb(var(--v-theme-onPrimary));
		color: rgb(var(--v-theme-onPrimary));
	}
}
</style>
