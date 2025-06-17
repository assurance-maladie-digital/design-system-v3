<script setup lang="ts">
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'

	const props = defineProps({
		text: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['click'])
	const emitClick = () => emit('click', props.uniqueId)
</script>

<template>
	<div
		:id="uniqueId"
		class="d-inline-block amelipro-chips"
	>
		<p class="mb-0 d-inline-block amelipro-chips__text">
			<span class="truncate-text">
				{{ text }}
			</span>
		</p>
		<AmeliproIconBtn
			:btn-label="`supprimer ${text}`"
			class="ml-4 amelipro-chips__btn"
			icon="closeNoCircle"
			icon-color="ap-blue-darken-1"
			icon-hover-color="ap-blue-darken-2"
			large
			:title="`supprimer ${text}`"
			:unique-id="`${uniqueId}-btn`"
			@click="emitClick"
		/>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

	.amelipro-chips {
		padding: 0.875rem 1rem;
		border-radius: 8px;
		background-color: tokens.$ap-blue-lighten3;
	}
</style>
