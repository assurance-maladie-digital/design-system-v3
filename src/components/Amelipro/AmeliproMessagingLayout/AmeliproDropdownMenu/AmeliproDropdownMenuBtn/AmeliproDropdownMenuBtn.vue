<script setup lang="ts">
	import { type PropType, ref } from 'vue'
	import AmeliproBtn from '../../../AmeliproBtn/AmeliproBtn.vue'
	import type { RouteLocationRaw } from 'vue-router'

	defineProps({
		href: {
			type: String,
			default: undefined,
		},
		label: {
			type: String,
			required: true,
		},
		to: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const focus = ref(false)

	type TEventList = 'down' | 'end' | 'esc' | 'home' | 'up'
	const emit = defineEmits(['letters', 'down', 'end', 'esc', 'home', 'up'])
	const emitEvent = (eventName: TEventList): void => {
		emit(eventName)
	}

	const emitLettersEvent = (event: KeyboardEvent): void => {
		const key = event.key.toLowerCase()
		const keyLength = String(key).length
		const letters = /^[a-z]+$/

		if (key.match(letters) && keyLength === 1) {
			emit('letters', key)
		}
	}
</script>

<template>
	<AmeliproBtn
		class="w-100 text-none text-left dropdown-menu__btn"
		:color="focus ? 'ap-grey-lighten-4' : 'ap-white'"
		hover-color="ap-grey-lighten-4"
		:href="href"
		role="menuitem"
		:tabindex="focus ? '0' : '-1'"
		text-color="ap-grey-darken-1"
		:to="to"
		:unique-id="uniqueId"
		@blur="focus = false"
		@focus="focus = true"
		@keyup="emitLettersEvent($event)"
		@keyup.down="emitEvent('down')"
		@keyup.end="emitEvent('end')"
		@keyup.esc="emitEvent('esc')"
		@keyup.home="emitEvent('home')"
		@keyup.up="emitEvent('up')"
	>
		{{ label }}
	</AmeliproBtn>
</template>

<style lang="scss" scoped>
	a:hover {
		text-decoration: none !important;
	}

	.dropdown-menu__btn {
		border-radius: 0 !important;

		& :deep(.v-btn__content) {
			justify-content: flex-start;

			& .amelipro-custom-btn {
				width: 100%;
				justify-content: flex-start;
			}
		}
	}
</style>
