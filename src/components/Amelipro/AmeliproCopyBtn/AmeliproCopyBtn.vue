<script setup lang="ts">
	import { ref } from 'vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'

	const props = defineProps({
		textToCopy: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['click'])
	const displayMsg = ref(false)
	const clickFn = () => {
		navigator.clipboard.writeText(props.textToCopy)
		displayMsg.value = true
		emit('click', `${props.uniqueId}-copy-btn`)
		setTimeout(() => (displayMsg.value = false), 2000)
	}
</script>

<template>
	<div
		:id="uniqueId"
		class="amelipro-copy-btn-wrapper"
	>
		<AmeliproIconBtn
			btn-label="Copier le texte"
			class="ml-4 amelipro-copy-btn"
			icon="copy"
			icon-color="ap-blue-darken-1"
			icon-hover-color="ap-blue-darken-2"
			large
			title="Copier le texte"
			:unique-id="`${uniqueId}-copy-btn`"
			@click="clickFn"
		/>

		<p
			v-if="displayMsg"
			:id="`${uniqueId}-validation-msg`"
			class="validation-msg mb-0"
			role="alert"
		>
			Texte&nbsp;copié
		</p>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	.amelipro-copy-btn-wrapper {
		position: relative;
		display: inline-block;
	}

	.validation-msg {
		position: absolute;
		top: -10px;
		right: 30px;
		padding: 8px 16px;
		max-width: 200px;
		background: apTokens.$ap-white;
		border: 1px solid apTokens.$ap-grey-lighten3;
		border-radius: apTokens.$card-radius;
		z-index: 10;
	}
</style>
