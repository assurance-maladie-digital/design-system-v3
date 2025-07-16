<script setup lang="ts">
	import DeepMenu from './DeepMenu.vue'
	import { type DeepMenuItem, type MenuItem } from './types'
	import { computed, onMounted, watch } from 'vue'

	const model = defineModel<string | null>()

	const props = defineProps<{
		ariaLabel: string
		items: MenuItem[]
	}>()

	const organisedItems = computed<DeepMenuItem[]>(() => {
		const newItems: DeepMenuItem[] = []
		let oldCopieItem: DeepMenuItem | undefined = undefined
		for (const item of props.items) {
			const currentDeep = oldCopieItem?.level || 1
			const copieItem: DeepMenuItem = JSON.parse(JSON.stringify(item))
			const level = copieItem.level || 1

			if (level > currentDeep) {
				const diff = level - currentDeep
				if (oldCopieItem && !oldCopieItem.children) {
					oldCopieItem.children = []
				}
				let parent = oldCopieItem

				for (let i = 1; i < diff; i++) {
					const newChild: DeepMenuItem = {
						level: level + i,
						children: [],
					}
					if (parent) {
						newChild.parent = parent
						parent.children!.push(newChild)
					}
					else {
						newItems.push(newChild)
					}
					parent = newChild
				}

				if (parent) {
					copieItem.parent = parent
					parent.children!.push(copieItem)
				}
				else {
					newItems.push(copieItem)
				}
			}
			else if (level === currentDeep) {
				if (level < 2) {
					newItems.push(copieItem)
				}
				else {
					oldCopieItem!.parent!.children!.push(copieItem)
					copieItem.parent = oldCopieItem!.parent
				}
			}
			else if (level < currentDeep) {
				if (level < 2) {
					newItems.push(copieItem)
				}
				else {
					const diff = currentDeep - level
					let parent = oldCopieItem!
					for (let i = 0; i < diff; i++) {
						parent = parent!.parent!
					}

					parent!.children!.push(copieItem)
					copieItem.parent = parent
				}
			}

			oldCopieItem = copieItem
		}

		return newItems
	})

	onMounted(() => {
		if (!model.value && window.location.hash) {
			model.value = window.location.hash
		}
		addEventListener('hashchange', () => {
			model.value = window.location.hash
		})
	})

	watch(
		model,
		(newValue, oldValue) => {
			if (newValue && newValue !== oldValue) {
				setHash(newValue)
			}
		},
		{ immediate: true },
	)

	function setHash(hash: string) {
		if (window.location.hash === hash) {
			return
		}

		window.location.hash = hash
		model.value = hash
	}
</script>

<template>
	<nav
		:aria-label="ariaLabel"
		class="vd-contextual-menu-container"
	>
		<ul
			v-if="items.length"
			class="vd-contextual-menu"
		>
			<DeepMenu
				:items="organisedItems"
				:current-active-hash="model"
				:current-deepth="1"
				@click="setHash"
			/>
		</ul>
	</nav>
</template>

<style lang="scss" scoped>
ul {
	list-style: none;
}
</style>
