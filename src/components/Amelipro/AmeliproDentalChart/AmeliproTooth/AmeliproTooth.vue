<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue'
	import type { IndexedObject } from '../../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		decayed: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		filled: {
			type: Boolean,
			default: false,
		},
		hasSavedState: {
			type: Boolean,
			default: false,
		},
		milkTooth: {
			type: Boolean,
			default: false,
		},
		missing: {
			type: Boolean,
			default: false,
		},
		modified: {
			type: Boolean,
			default: false,
		},
		toothNumber: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const btnTitle = computed(() => {
		let title = `dent ${props.toothNumber}`

		if (props.missing) {
			title += ' absente'
		}
		else {
			if (props.decayed) {
				title += ' cariée'
			}

			if (props.filled) {
				title += ' obturée'
			}
		}
		return title
	})

	const computedStyles = computed(() => {
		const styles: IndexedObject = {}
		if (((props.decayed || props.filled || props.missing) && !props.modified) || (!props.hasSavedState && props.modified)) {
			styles.border = `1px solid ${convertToHex('ap-blue-darken-1')}`
		}
		else if (props.modified && props.hasSavedState) {
			styles.border = `1px dashed ${convertToHex('ap-pink')}`
		}
		return styles
	})

	const emit = defineEmits(['click'])
	const emitClickEvent = (): void => {
		emit('click')
	}

	const svgUrl = ref('')

	onMounted(async () => {
		const module = await import(`@/assets/amelipro/img/dental-chart-img/tooth-${props.toothNumber}.svg`)
		if (module.default !== null && module.default !== undefined) {
			svgUrl.value = module.default
		}
	})
</script>

<template>
	<button
		:id="uniqueId"
		class="d-inline-flex py-2 flex-column align-center tooth-btn"
		:disabled="disabled"
		:style="computedStyles"
		:title="btnTitle"
		@click="emitClickEvent"
	>
		<span class="d-sr-only">
			{{ btnTitle }}
		</span>

		<span
			:id="`${uniqueId}-number`"
			aria-hidden="true"
			class="font-weight-semibold"
		>
			{{ toothNumber }}
		</span>

		<img
			:id="`${uniqueId}-img`"
			alt=""
			:src="svgUrl"
		>

		<span
			:id="`${uniqueId}-status`"
			:class="milkTooth ? 'text-uppercase' : undefined"
		>
			<span
				v-if="decayed && !missing"
				aria-hidden="true"
				class="text-body-1"
				:class="milkTooth ? 'text-uppercase' : undefined"
			>
				c
			</span>

			<span
				v-if="missing"
				aria-hidden="true"
				class="text-body-1"
				:class="milkTooth ? 'text-uppercase' : undefined"
			>
				a
			</span>

			<span
				v-if="filled && !missing"
				aria-hidden="true"
				class="text-body-1"
				:class="milkTooth ? 'text-uppercase' : undefined"
			>
				o
			</span>
		</span>
	</button>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	.tooth-btn {
		border-radius: 8px;
		max-width: 100%;
		min-height: 100%;

		&:hover {
			background-color: apTokens.$ap-blue-lighten4;
		}

		& img {
			max-width: 90%;
			margin: 8px 0;

			@media (width <= 1239.999px) {
				width: 2.5rem;
			}

			@media (width >= 1240px) {
				width: 3.125rem;
			}
		}

		&:disabled {
			&:hover {
				background-color: transparent;
			}

			cursor: default;
		}
	}
</style>
