<script setup lang="ts">
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'

	defineProps<{
		prependIcon?: string
	}>()

</script>

<template>
	<button
		class="captcha-btn text-primary"
		type="button"
	>
		<SyIcon
			v-if="prependIcon"
			size="x-small"
			:icon="prependIcon"
			decorative
		/>
		<slot />
	</button>
</template>

<style scoped lang="scss">
	.captcha-btn {
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		font-weight: 700;
		font-size: 0.875rem;
	}
</style>
