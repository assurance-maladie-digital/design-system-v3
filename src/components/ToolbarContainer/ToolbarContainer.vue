<script setup lang="ts">
	import { onMounted, ref } from 'vue'

	const toolbar = ref<HTMLDivElement>()

	let tools: Array<HTMLElement>

	onMounted(() => {
		tools = Array.from(toolbar.value?.querySelectorAll<HTMLElement>('button:not([disabled]), a:not([disabled])') || [])
		tools?.forEach((el) => {
			el.setAttribute('tabindex', '-1')
		})
	})

	function selectNextElement(e: Event & { target: HTMLElement }) {
		const currentIndex = tools.findIndex(tool => tool === e.target)

		const nextIndex = currentIndex < tools.length - 1 ? currentIndex + 1 : 0

		const nextElem = tools.at(nextIndex)

		e.target.setAttribute('tabindex', '-1')
		nextElem?.setAttribute('tabindex', '0')
		nextElem?.focus()
	}

	function selectPrevElement(e: Event & { target: HTMLElement }) {
		let currentIndex = tools.findIndex(tool => tool === e.target)

		const prevIndex = currentIndex > 0 ? currentIndex - 1 : tools.length - 1

		const nextElem = tools.at(prevIndex)

		e.target.setAttribute('tabindex', '-1')
		nextElem?.setAttribute('tabindex', '0')
		nextElem?.focus()
	}

	function selectFirstElement() {
		const firstElement = tools.at(0)
		if (!firstElement) {
			return
		}
		document.activeElement?.setAttribute('tabindex', '-1')
		firstElement.setAttribute('tabindex', '0')
		firstElement.focus()
	}

	function selectLastElement() {
		const lastElement = tools.at(-1)
		if (!lastElement) {
			return
		}
		document.activeElement?.setAttribute('tabindex', '-1')
		lastElement.setAttribute('tabindex', '0')
		lastElement.focus()
	}

	let lastElementFocused: HTMLElement | undefined = undefined

	function setupFocus() {
		// Remove the ability to tab into the toolbar to be able to shift focus to previous focusable element
		toolbar.value?.setAttribute('tabindex', '-1')

		if (lastElementFocused) {
			// If there is a last focused element, restore focus to it
			lastElementFocused.setAttribute('tabindex', '0')
			lastElementFocused.focus()
		}
		else {
			selectFirstElement()
		}
	}

	function saveFocus(e: FocusEvent) {
		// Save the last focused element to restore focus later
		if (e.target !== e.currentTarget) {
			lastElementFocused = e.target as HTMLElement
		}
	}

	function blurToolbar(e: FocusEvent) {
		// When an item of the toolbar is blured it should not be focusable anymore
		(e.target as HTMLElement)?.setAttribute('tabindex', '-1')

		// When the toolbar loses focus, we need to set its focusable
		if (toolbar.value?.contains(e.relatedTarget as HTMLElement)) {
			return
		}
		toolbar.value?.setAttribute('tabindex', '0')
	}
</script>

<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
	<div
		ref="toolbar"
		role="toolbar"
		tabindex="0"
		class="sy-toolbar"
		@keydown.left="selectPrevElement"
		@keydown.right="selectNextElement"
		@keydown.up="selectPrevElement"
		@keydown.down="selectNextElement"
		@keydown.home.prevent="selectFirstElement"
		@keydown.end.prevent="selectLastElement"
		@focus="setupFocus"
		@focus.capture="saveFocus"
		@blur.capture="blurToolbar"
	>
		<slot />
	</div>
</template>

<style>
.sy-toolbar:has(:focus-visible) {
	position: relative;
}

.sy-toolbar:has(:focus-visible)::after {
	content: '';
	display: block;
	position: absolute;
	inset: -6px;
	border-radius: 5px;
	border: 2px solid rgb(var(--v-theme-primary));
}
</style>
