<script setup lang="ts">
	import { type PropType, computed, useSlots } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
	import type { RouteLocationRaw } from 'vue-router'
	import { useDisplay } from 'vuetify'

	defineProps({
		alternateButtonLabel: {
			type: String,
			default: 'Modifier',
		},
		confirmButtonLabel: {
			type: String,
			default: 'Transmettre',
		},
		confirmHref: {
			type: String,
			default: undefined,
		},
		confirmTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		modifyHref: {
			type: String,
			default: undefined,
		},
		modifyTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		printHref: {
			type: String,
			default: undefined,
		},
		printTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		transmissionActions: {
			type: Boolean,
			default: true,
		},
		transmissionCardTitle: {
			type: String,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const { xs } = useDisplay()
	const slots = useSlots()

	const hasActions = computed((): boolean => Boolean(slots.actions))
	const emit = defineEmits(['click:print', 'click:modify', 'click:confirm'])
	const emitPrintEvent = (): void => emit('click:print')
	const emitModifyEvent = (): void => emit('click:modify')
	const emitConfirmEvent = (): void => emit('click:confirm')
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="w-100 amelipro-transmission"
	>
		<div class="w-100 amelipro-transmission__wrapper">
			<AmeliproCard
				:card-title="transmissionCardTitle"
				classes="mb-6 amelipro-transmission__card"
				:unique-id="uniqueId ? `${uniqueId}-card` : undefined"
			>
				<template
					v-if="$slots.default"
					#default
				>
					<slot name="default" />
				</template>
			</AmeliproCard>
		</div>

		<div
			v-if="transmissionActions || !hasActions"
			:id="uniqueId ? `${uniqueId}-action-wrapper` : undefined"
			class="d-flex align-center amelipro-transmission__actions"
			:class="xs ? 'flex-column' : 'justify-space-between'"
		>
			<div class="amelipro-transmission__actions__left">
				<AmeliproBtn
					class="text-none mb-4 amelipro-transmission__print-btn"
					hover-underline
					:href="printHref"
					text
					:to="printTo"
					:unique-id="uniqueId ? `${uniqueId}-print-btn` : undefined"
					@click="emitPrintEvent"
				>
					Imprimer sans transmettre
				</AmeliproBtn>
			</div>

			<div
				class="d-flex amelipro-transmission__actions__right"
				:class="xs ? 'flex-column justify-center w-100 ' : 'justify-end'"
			>
				<AmeliproBtn
					bordered
					class="amelipro-transmission__alternate-btn"
					:class="xs ? 'w-100 mb-4' : ' mr-2 '"
					color="ap-white"
					hover-color="ap-blue-lighten-3"
					:href="modifyHref"
					text-color="ap-blue-darken-1"
					:to="modifyTo"
					:unique-id="uniqueId ? `${uniqueId}-alternate-btn` : undefined"
					@click="emitModifyEvent"
				>
					{{ alternateButtonLabel }}
				</AmeliproBtn>

				<AmeliproBtn
					class="amelipro-transmission__confirm-btn"
					:class="{ 'w-100 mb-4': xs }"
					:href="confirmHref"
					:to="confirmTo"
					:unique-id="uniqueId ? `${uniqueId}-confirm-btn` : undefined"
					@click="emitConfirmEvent"
				>
					{{ confirmButtonLabel }}
				</AmeliproBtn>
			</div>
		</div>

		<slot name="actions" />
	</div>
</template>
