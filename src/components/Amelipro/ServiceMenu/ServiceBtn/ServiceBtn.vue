<script setup lang="ts">
	import AmeliproBtn from '../../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproIconBtn from '../../AmeliproIconBtn/AmeliproIconBtn.vue'
	import { type PropType } from 'vue'
	import type { Service } from './types'

	defineProps({
		iconBgColor: {
			type: String,
			required: true,
		},
		iconHoverBgColor: {
			type: String,
			required: true,
		},
		item: {
			type: Object as PropType<Service>,
			required: true,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const emit = defineEmits(['click'])
	const emitClickEvent = () => emit('click')
</script>

<template>
	<div>
		<AmeliproIconBtn
			v-if="item.icon"
			class="d-flex text-none text-center service-btn"
			:href="item.href"
			:icon="item.icon"
			:icon-bg-color="iconBgColor"
			icon-color="ap-white"
			:icon-hover-bg-color="iconHoverBgColor"
			icon-hover-color="ap-white"
			:ripple="false"
			size="2.5rem"
			:to="item.to"
			:unique-id="uniqueId"
			@click="emitClickEvent"
		>
			<template #append>
				<span
					:id="uniqueId ? `${uniqueId}-text` : undefined"
					class="text-caption service-btn__text"
				>
					{{ item.label }}
				</span>
			</template>
		</AmeliproIconBtn>

		<AmeliproBtn
			v-if="item.imgSrc && !item.icon"
			class="d-flex text-none text-center service-btn"
			color="transparent"
			hover-color="transparent"
			:href="item.href"
			style="white-space: normal;"
			text-color="ap-grey-darken-1"
			:to="item.to"
			:unique-id="uniqueId"
			@click="emitClickEvent"
		>
			<img
				:id="uniqueId ? `${uniqueId}-img` : undefined"
				alt=""
				class="d-block"
				:src="item.imgSrc"
				style="width: 2.5rem; height: 2.5rem; margin: 0 auto;"
			>
			<span
				:id="uniqueId ? `${uniqueId}-text` : undefined"
				class="d-block text-caption"
			>
				{{ item.label }}
			</span>
		</AmeliproBtn>
	</div>
</template>

<style lang="scss" scoped>
	:deep(.v-btn) {
		border-radius: 0 !important;
		padding: 0 !important;

		& .amelipro-custom-btn {
			flex-direction: column !important;
		}
	}

	.v-btn :deep(.v-btn__content) {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 100%;
		white-space: normal;

		& .icon-custom,
		& img {
			margin: 0 0 5px !important;
		}

		& .service-btn__text {
			white-space: break-spaces;
			line-break: auto;
		}
	}
</style>
