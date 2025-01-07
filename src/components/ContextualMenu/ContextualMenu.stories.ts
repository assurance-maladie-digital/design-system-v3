import { fn } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'

import ContextualMenu from './ContextualMenu.vue'
import { ref, watch } from 'vue'

const meta = {
	title: 'Composants/Navigation/ContextualMenu',
	component: ContextualMenu,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		'items': {
			control: 'object',
			description: 'Les éléments du menu',
			table: {
				type: {
					summary: 'Array<{ text: string, hash: string, level?: 1 | 2 | 3 | 4 | 5 | 6 }>',
				},
			},
		},
		'modelValue': {
			description: 'Le hash de l’élément actif',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
				category: 'props',
			},
		},
		'onUpdate:modelValue': {
			description: 'Événement émis lorsqu’un élément est cliqué',
			table: {
				type: {
					summary: 'string',
				},
				category: 'events',
			},
		},
	},
} satisfies Meta<typeof ContextualMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'items': [
			{
				text: 'Titre 1',
				hash: '#example-1',
			},
			{
				text: 'Titre 2',
				hash: '#example-2',
			},
		],
		'modelValue': '#example-1',
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { ContextualMenu },
			setup() {
				const hash = ref<string | null | undefined>()
				watch(() => args.modelValue, (value) => {
					hash.value = value
				}, { immediate: true })
				return { args, hash }
			},
			template: `
				<ContextualMenu
					v-bind="args"
					v-model="hash"
				/>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
		<ContextualMenu 
			:items="items" 
		/>
	</template>
	`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ContextualMenu } from '@cnamts/synapse'

	const items = [
		{
			text: 'Titre 1',
			hash: '#example-1',
		},
		{
			text: 'Titre 2',
			hash: '#example-2',
		},
	]
</script>
	`,
			},
		],
	},
}

export const Usage: Story = {
	args: {
		'items': [{
			text: 'section 1',
			hash: '#section-1',
		}, {
			text: 'section 2',
			hash: '#section-2',
		}, {
			text: 'section 3',
			hash: '#section-3',
		}, {
			text: 'section 4',
			hash: '#section-4',
		}, {
			text: 'section 5',
			hash: '#section-5',
		}],
		'modelValue': '#section-1',
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { ContextualMenu },
			setup() {
				const hash = ref<string | null | undefined>()
				watch(() => args.modelValue, (value) => {
					hash.value = value
				}, { immediate: true })
				return { args, hash }
			},
			template: `
	<div style="display: flex; flex-direction: row; justify-content: space-evenly; padding-top: 20px; padding-bottom: 20px; place-items: center; width: 500px;">
		<div style="width: 200px">
			<ContextualMenu
				v-bind="args"
				v-model="hash"
			/>
		</div>
		<div style="border: 1px solid black; max-height: 500px; overflow-y: auto; scroll-behavior: smooth;">
			<section id="section-1" style="padding: 20px">
				<h2>section 1</h2>
				<p style="max-width: 300px">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-2" style="padding: 20px">
				<h2>section 2</h2>
				<p style="max-width: 300px">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-3" style="padding: 20px">
				<h2>section 3</h2>
				<p style="max-width: 300px">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-4" style="padding: 20px">
				<h2>section 4</h2>
				<p style="max-width: 300px">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-5" style="padding: 20px">
				<h2>section 5</h2>
				<p style="max-width: 300px">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
		</div>
	</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="wrapper">
		<div class="menu">
			<ContextualMenu
				v-model="hash"
				:items
			/>
		</div>
		<div class="content">
			<section id="section-1">
				<h2>section 1</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-2">
				<h2>section 2</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-3">
				<h2>section 3</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-4">
				<h2>section 4</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
			<section id="section-5">
				<h2>section 5</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae eligendi modi, rem consectetur cum labore voluptate nostrum molestiae asperiores dolorum, saepe perspiciatis quisquam provident placeat aut distinctio minima dolor.
					Temporibus consequatur consectetur sequi. Sequi tempora velit soluta? Nam error, nesciunt molestiae provident possimus voluptas tempore porro at officia sint exercitationem dolore debitis eaque temporibus accusantium soluta? In, maxime excepturi.
				</p>
			</section>
		</div>
	</div>
</template>
	`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import ContextualMenu from '@/components/ContextualMenu/ContextualMenu.vue'
	import { ref } from 'vue'

	const items = [{
		text: 'section 1',
		hash: '#section-1',
	}, {
		text: 'section 2',
		hash: '#section-2',
	}, {
		text: 'section 3',
		hash: '#section-3',
	}, {
		text: 'section 4',
		hash: '#section-4',
	}, {
		text: 'section 5',
		hash: '#section-5',
	}]

	const hash = ref<string | null>(null)
</script>
	`,
			},
			{
				name: 'Style',
				code: `<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	place-items: center;
	height: 100dvh;
	width: 500px;
}
.menu {
	width: 200px;
}
.content {
	border: 1px solid black;
	height: 500px;
	overflow-y: auto;
	scroll-behavior: smooth;
}

section {
	padding: 20px;
}

section p {
	max-width: 300px;
}

</style>
	`,
			},
		],
	},
}

export const levels: Story = {
	args: {
		'items': [
			{
				text: 'Level 1',
				hash: '#example-1',
			},
			{
				text: 'Level 2',
				hash: '#example-2',
				level: 2,
			},
			{
				text: 'Level 3',
				hash: '#example-3',
				level: 3,
			},
			{
				text: 'Level 4',
				hash: '#example-4',
				level: 4,
			},
			{
				text: 'Level 5',
				hash: '#example-5',
				level: 5,
			},
			{
				text: 'Level 6',
				hash: '#example-6',
				level: 6,
			},
		],
		'modelValue': '#example-1',
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { ContextualMenu },
			setup() {
				const hash = ref<string | null | undefined>()
				watch(() => args.modelValue, (value) => {
					hash.value = value
				}, { immediate: true })
				return { args, hash }
			},
			template: `
				<ContextualMenu
					v-bind="args"
					v-model="hash"
				/>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
		<ContextualMenu 
			:items="items" 
		/>
	</template>
	`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ContextualMenu } from '@cnamts/synapse'

	const items = [
			{
				text: 'Level 1',
				hash: '#example-1',
			},
			{
				text: 'Level 2',
				hash: '#example-2',
				level: 2,
			},
			{
				text: 'Level 3',
				hash: '#example-3',
				level: 3,
			},
			{
				text: 'Level 4',
				hash: '#example-4',
				level: 4,
			},
			{
				text: 'Level 5',
				hash: '#example-5',
				level: 5,
			},
			{
				text: 'Level 6',
				hash: '#example-6',
				level: 6,
			},
		]
</script>
	`,
			},
		],
	},
}
