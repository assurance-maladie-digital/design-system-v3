<script lang="ts" setup>
	import { mdiArrowLeft } from '@mdi/js'
	import { computed } from 'vue'
	import { locales } from './locales'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = withDefaults(defineProps<{
		hideBackIcon?: boolean
		dark?: boolean
		backgroundColor?: string
	}>(), {
		backgroundColor: 'white',
	})

	const isDark = computed(() => props.dark ?? false)
	const iconColor = computed(() => isDark.value ? 'white' : 'colorPrimary')
	const buttonVariant = computed(() => isDark.value ? 'outlined' : 'text')
	const buttonTheme = computed(() => isDark.value ? 'dark' : undefined)
	const buttonColor = computed(() => isDark.value ? 'white' : 'colorPrimary')
	const buttonBgColor = computed(() => isDark.value ? 'transparent' : props.backgroundColor)

	const buttonClasses = computed(() => ({
		'px-0': !isDark.value,
		'pr-1': !isDark.value && !props.hideBackIcon,
	}))

</script>

<template>
	<VBtn
		v-bind="$attrs"
		:variant="buttonVariant"
		:theme="buttonTheme"
		:color="buttonColor"
		:class="['sy-back-btn', 'text-none', buttonClasses]"
		:style="{ backgroundColor: buttonBgColor }"
	>
		<slot name="icon">
			<SyIcon
				v-if="!props.hideBackIcon"
				:icon="mdiArrowLeft"
				decorative
				:color="iconColor"
				:class="{ 'ml-n1': isDark }"
				class="mr-1"
			/>
		</slot>

		<slot>
			{{ locales.label }}
		</slot>
	</VBtn>
</template>

<style lang="scss" scoped>
// Désactiver l'état de hover sur le thème clair
.v-btn:deep() {
	.v-btn__underlay,
	.v-btn__overlay {
		display: none;
	}
}

.sy-back-btn:focus-visible {
	outline: 0;
}

.sy-back-btn:focus-visible::after {
	opacity: 1;
}
</style>
