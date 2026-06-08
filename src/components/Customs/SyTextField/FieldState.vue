<script setup lang="ts">
	import { mdiAlertOutline, mdiCheck, mdiAlertCircle } from '@mdi/js'
	import { computed } from 'vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = defineProps<{
		state?: 'default' | 'error' | 'success' | 'warning'
	}>()

	const validationIcon = computed(() => {
		if (props.state === 'error') return mdiAlertCircle
		if (props.state === 'warning') return mdiAlertOutline
		if (props.state === 'success') return mdiCheck
		return null
	})

	const className = computed(() => {
		if (props.state === 'error') return 'error-icon'
		if (props.state === 'warning') return 'warning-icon'
		if (props.state === 'success') return 'success-icon'
		return null
	})
</script>
<template>
	<SyIcon
		v-if="validationIcon"
		:icon="validationIcon"
		:class="className"
		class="field-state-icon"
		decorative
	/>
</template>
<style scoped lang="scss">
.field-state-icon :deep(.v-icon__svg) {
	opacity: var(--v-medium-emphasis-opacity);
}

.success-icon :deep(.v-icon__svg) {
	fill: rgb(var(--v-theme-onSuccessVariant)) !important;
}

.warning-icon :deep(.v-icon__svg) {
	fill: rgb(var(--v-theme-onWarningVariant)) !important;
}

.error-icon :deep(.v-icon__svg) {
	fill: rgb(var(--v-theme-error)) !important;
	opacity: 1;
}
</style>
