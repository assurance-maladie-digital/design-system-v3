<script setup lang="ts">
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import { ref } from 'vue'

	const props = defineProps({
		isOpen: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const opened = ref(props.isOpen)
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="w-100 mb-3 amelipro-disclosure"
	>
		<AmeliproBtn
			:aria-controls="uniqueId"
			:aria-expanded="opened ? 'true' : 'false'"
			class="text-none amelipro-disclosure__btn"
			hover-underline
			text
			type="button"
			:unique-id="`${uniqueId}-open-close-btn`"
			@click="opened = !opened"
		>
			{{ title }}

			<template
				v-if="!opened"
				#icon
			>
				{{ mdiChevronDown }}
			</template>

			<template
				v-else
				#icon
			>
				{{ mdiChevronUp }}
			</template>
		</AmeliproBtn>

		<div
			v-show="opened === true"
			:id="uniqueId"
			class="amelipro-disclosure__content"
		>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

.accordion-btn {
	padding: 0;
	background-color: transparent;
	border: 0;

	&:focus {
		outline: 1px dotted tokens.$ap-grey-darken1;
	}
}
</style>
