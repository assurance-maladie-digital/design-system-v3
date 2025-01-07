<script setup lang="ts">
	import { type MenuItem } from './types'
	import { onMounted, watch } from 'vue'

	const model = defineModel<string | null>()

	defineProps<{
		items: MenuItem[]
	}>()

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
	<ul
		v-if="items.length"
		class="vd-contextual-menu"
	>
		<li
			v-for="{ text, hash, level } in items"
			:key="hash"
		>
			<a
				:href="hash"
				:class="{
					'text-primary active': model === hash,
					'text-medium-emphasis': model !== hash,
					'ps-4': level === 2,
					'ps-6': level === 3,
					'ps-9': level === 4,
					'ps-12': level === 5,
					'ps-14': level === 6,
				}"
				class="d-flex align-center text-decoration-none text-body-1 px-4 py-2"
				@click.prevent.stop="setHash(hash)"
				v-text="text"
			/>
		</li>
	</ul>
</template>

<style lang="scss" scoped>
ul {
	list-style: none;
}

a {
	position: relative;
	transition: none;

	&::before {
		content: '';
		width: 2px;
		background: rgba(0, 0, 0, 0.6);
		position: absolute;
		left: 0;
		height: 100%;
	}

	&::after {
		content: '';
		width: 4px;
		border-radius: 0 2px 2px 0;
		background: currentColor;
		position: absolute;
		left: 0;
		height: 100%;
		opacity: 0;
	}

	&.active::after {
		opacity: 1;
	}
}
</style>
