<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { IndexedObject } from '../types'
	import type { RouteLocationRaw } from 'vue-router'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		cardTitle: {
			type: String,
			default: undefined,
		},
		contentText: {
			type: String,
			default: undefined,
		},
		contentTitle: {
			type: String,
			default: undefined,
		},
		contentTitleColor: {
			type: String,
			default: 'ap-grey-darken-1',
		},
		failure: {
			type: Boolean,
			default: false,
		},
		imgMinWidth: {
			type: String,
			default: '100',
		},
		imgUrl: {
			type: String,
			default: undefined,
		},
		imgWidth: {
			type: String,
			default: '32px',
		},
		retryBtn: {
			type: Boolean,
			default: false,
		},
		transmissionHref: {
			type: String,
			default: undefined,
		},
		transmissionTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const style = computed<IndexedObject>(() => ({ color: convertToHex(props.contentTitleColor) }))
	const emit = defineEmits(['click:transmission'])
	const emitTransmissionClickEvent = (): void => emit('click:transmission')
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="w-100 amelipro-callback"
	>
		<AmeliproCard
			:card-title="cardTitle"
			classes="amelipro-callback__card"
			:unique-id="uniqueId ? `${uniqueId}-card` : undefined"
		>
			<template #default>
				<div
					:id="uniqueId ? `${uniqueId}-card-main-content` : undefined"
					class="d-flex flex-column flex-sm-row align-center w-100 amelipro-callback__card__main-content"
				>
					<div class="d-flex w-100">
						<img
							v-if="imgUrl"
							:id="uniqueId ? `${uniqueId}-card-main-content-img` : undefined"
							alt=""
							class="mx-4 amelipro-callback__img"
							:max-width="imgWidth"
							:min-width="imgMinWidth"
							:src="imgUrl"
							:width="imgWidth"
						>

						<AmeliproIcon
							v-else
							class="mx-4 amelipro-callback__img"
							:icon="failure ? 'croix' : 'check'"
							:icon-bg-color="failure ? 'ap-error' : 'ap-success'"
							icon-color="ap-white"
							:size="imgWidth"
							:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
						/>

						<slot name="defaultContent">
							<div
								v-if="contentTitle || contentText"
								class="d-flex flex-column ml-2 amelipro-callback__content"
							>
								<span
									:id="uniqueId ? `${uniqueId}-card-main-content-title` : undefined"
									:aria-level="3"
									class="mb-2 font-weight-semibold text-h6 amelipro-callback__title"
									role="heading"
									:style="style"
								>
									{{ contentTitle }}
								</span>

								<slot name="text">
									<p
										:id="uniqueId ? `${uniqueId}-card-main-content-text` : undefined"
										class="amelipro-callback__text"
									>
										{{ contentText }}
									</p>
								</slot>
							</div>
						</slot>
					</div>

					<AmeliproBtn
						v-if="retryBtn"
						bordered
						class="mt-4 mt-sm-0 amelipro-callback__retry-btn"
						color="ap-white"
						hover-color="ap-blue-lighten-3"
						:href="transmissionHref"
						rounded
						text-color="ap-blue-darken-1"
						:to="transmissionTo"
						:unique-id="uniqueId ? `${uniqueId}-retry-btn` : undefined"
						@click="emitTransmissionClickEvent"
					>
						Réessayer
					</AmeliproBtn>
				</div>

				<slot name="contentBottom" />
			</template>
		</AmeliproCard>
		<div
			v-if="$slots.cardActions"
			:id="uniqueId ? `${uniqueId}-action-container` : undefined"
			class="mt-4 amelipro-callback__actions"
		>
			<slot name="cardActions" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

	.amelipro-callback__retry-btn {
		margin-left: 0;

		@media #{apTokens.$media-up-sm} {
			margin-left: 1rem;
		}
	}
</style>
