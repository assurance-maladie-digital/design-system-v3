<script lang="ts" setup>
	import { ref, computed } from 'vue'
	import { VIcon, VBtn } from 'vuetify/components'
	import { mdiArrowLeft } from '@mdi/js'
	import { locales } from './locales'

	const props = defineProps<{
		hideBackIcon?: boolean
		dark?: boolean
	}>()

	const backIcon = ref(mdiArrowLeft)
	const isDark = computed(() => props.dark ?? false)
	const iconColor = computed(() => isDark.value ? 'white' : 'primary')
	const buttonVariant = computed(() => isDark.value ? 'outlined' : 'text')
	const buttonTheme = computed(() => isDark.value ? 'dark' : 'light')
	const buttonColor = computed(() => isDark.value ? 'white' : 'primary')

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
		:outlined="isDark"
		:class="['vd-back-btn', 'text-none', buttonClasses]"
	>
		<slot name="icon">
			<VIcon
				v-if="!props.hideBackIcon"
				:color="iconColor"
				:class="{ 'ml-n1': isDark }"
				class="mr-1"
			>
				{{ backIcon }}
			</VIcon>
		</slot>

		<slot>
			{{ locales.label }}
		</slot>
	</VBtn>
</template>

<style lang="scss" scoped>
// Désactiver l'état de hover sur le thème clair
.v-btn.v-theme--light:deep() {
  .v-btn__underlay,
  .v-btn__overlay {
    display: none;
  }
}
</style>
