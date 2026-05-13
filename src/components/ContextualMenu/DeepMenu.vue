<script setup lang="ts">
	import type { DeepMenuItem } from './types'

	defineProps<{
		currentActiveHash?: string | null
		currentDeepth: number
		items: DeepMenuItem[]
	}>()

	defineEmits<{
		(e: 'click', hash: string)
	}>()
</script>

<template>
	<li
		v-for="item in items"
		:key="`${item.hash} ${currentDeepth}`"
	>
		<a
			v-if="item.hash"
			:href="item.hash"
			class="d-flex align-center text-decoration-none text-body-1 ps-4 pe-4 py-2"
			:aria-current="currentActiveHash === item.hash"
			:class="{
				'text-primary active': currentActiveHash === item.hash,
				'text-medium-emphasis': currentActiveHash !== item.hash,
				'ps-6': currentDeepth === 2,
				'ps-8': currentDeepth === 3,
				'ps-10': currentDeepth === 4,
				'ps-12': currentDeepth === 5,
				'ps-14': currentDeepth === 6,
			}"
			@click.prevent.stop="$emit('click', item.hash)"
		>
			{{ item.text }}
		</a>
		<ul v-if="item.children">
			<DeepMenu
				:current-deepth="currentDeepth + 1"
				:items="item.children"
				:current-active-hash
				@click="$emit('click', $event)"
			/>
		</ul>
	</li>
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
		background: rgb(0 0 0 / 60%);
		position: absolute;
		left: 0;
		height: 100%;
	}

	&::after {
		content: '';
		width: 4px;
		border-radius: 0 2px 2px 0;
		background: currentcolor;
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
