<script setup lang="ts">
	import { type PropType, computed, ref } from 'vue'
	import AmeliproBtn from '../../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproDropdownMenuBtn from './AmeliproDropdownMenuBtn/AmeliproDropdownMenuBtn.vue'
	import AmeliproIcon from '../../AmeliproIcon/AmeliproIcon.vue'
	import type { DropdownItem } from './types'
	import type { IndexedObject } from '../../types'

	const props = defineProps({
		items: {
			type: Array as PropType<DropdownItem[]>,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		menuWidth: {
			type: String,
			default: '100%',
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const isOpen = ref(false)
	const hover = ref(false)
	const focus = ref(false)

	const activeItemLabel = computed<string | undefined>(() => {
		return props.items?.filter(item => item.active)?.map(item => item.label)[0]
	})

	const menuStyle = computed<IndexedObject>(() => {
		return { width: props.menuWidth }
	})

	const setFocus = (id: string): void => {
		const element = document.getElementById(id)

		if (element !== null && element !== undefined) {
			element.focus()
		}
	}

	const openCloseMenu = (): void => {
		if (isOpen.value) {
			closeMenu()
		}
		else {
			openMenu()
		}
	}

	const openMenu = (focusLastItem?: boolean): void => {
		isOpen.value = true
		setTimeout(() => {
			if (focusLastItem) {
				setFocus(`${props.uniqueId}-btn-${props.items.length - 1}`)
			}
			else {
				setFocus(`${props.uniqueId}-btn-0`)
			}
		}, 0)
	}

	const closeMenu = (): void => {
		if (isOpen.value) {
			isOpen.value = false
			setFocus(`${props.uniqueId}-btn`)
		}
	}

	const pressUp = (index: number): void => {
		if (index === 0) {
			setFocus(`${props.uniqueId}-btn-${props.items.length - 1}`)
		}
		else if (index > 0) {
			setFocus(`${props.uniqueId}-btn-${index - 1}`)
		}
	}

	const pressDown = (index: number): void => {
		if (index === props.items.length - 1) {
			setFocus(`${props.uniqueId}-btn-0`)
		}
		else if (index < props.items.length - 1) {
			setFocus(`${props.uniqueId}-btn-${index + 1}`)
		}
	}

	const pressCharacter = (index: number, firstChar: string): void => {
		if (firstChar.length > 1) {
			return
		}

		const firstCharLC = firstChar.toLowerCase()
		const labelFirstChars = props.items.map(item => item.label.charAt(0).toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, ''))

		let start = index + 1
		if (start >= props.items.length) {
			start = 0
		}

		let resultIndex = labelFirstChars.indexOf(firstCharLC, start)

		if (resultIndex === -1) {
			resultIndex = labelFirstChars.indexOf(firstCharLC, 0)
		}

		if (resultIndex > -1) {
			setFocus(`${props.uniqueId}-btn-${resultIndex}`)
		}
	}
</script>

<template>
	<div
		:id="uniqueId"
		v-click-outside="closeMenu"
		class="dropdown-menu"
		:style="menuStyle"
	>
		<AmeliproBtn
			:aria-controls="`${uniqueId}-menu`"
			:aria-expanded="isOpen === true ? 'true' : 'false'"
			aria-haspopup="true"
			class="w-100 text-none text-h6 font-weight-bold dropdown-menu__open-btn"
			color="ap-white"
			hover-color="ap-grey-lighten-4"
			text-color="ap-grey-darken-1"
			:unique-id="`${uniqueId}-btn`"
			@click="openCloseMenu()"
			@focus="focus = true"
			@blur="focus = false"
			@keyup.down="openMenu()"
			@keyup.up="openMenu(true)"
			@mouseenter="hover = true"
			@mouseleave="hover = false"
		>
			<span
				:id="`${uniqueId}-btn-text`"
				class="w-100 text-left text-h6 font-weight-bold"
			>
				<span class="d-sr-only">
					Page active :&nbsp;
				</span>

				{{ activeItemLabel }}
			</span>

			<AmeliproIcon
				ref="ameliproIcon"
				:icon="isOpen ? 'triangleUp' : 'triangleDown'"
				icon-color="ap-grey-darken-1"
				size="8px"
				style="margin-top: -18px;"
				:unique-id="`${uniqueId}-icon`"
			/>
		</AmeliproBtn>

		<ul
			v-show="isOpen"
			:id="`${uniqueId}-menu`"
			:aria-label="label"
			class="ap-white list-style-none dropdown-menu__list"
			role="menu"
		>
			<li
				v-for="(item, index) in items"
				:key="index"
				class="dropdown-menu__item"
				role="none"
			>
				<AmeliproDropdownMenuBtn
					:href="item.href"
					:label="item.label"
					:to="item.to"
					:unique-id="`${uniqueId}-btn-${index}`"
					@down="pressDown(index)"
					@end="setFocus(`${uniqueId}-btn-${items.length - 1}`)"
					@esc="closeMenu()"
					@home="setFocus(`${uniqueId}-btn-0`)"
					@letters="pressCharacter(index, $event)"
					@up="pressUp(index)"
				/>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.dropdown-menu {
	position: relative;
}

.dropdown-menu__open-btn {
	border: 1px solid apTokens.$ap-grey !important;

	& :deep(.v-btn__content) {
		justify-content: space-between;
		align-items: center;

		& .amelipro-custom-btn {
			width: 100%;
			justify-content: space-between;
		}
	}
}

.dropdown-menu__list {
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	border: 1px solid apTokens.$ap-grey !important;
	z-index: 10;
}
</style>
