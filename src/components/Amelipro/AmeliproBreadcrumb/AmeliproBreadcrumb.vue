<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import type { AmeliproBreadcrumbItem } from './types'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		items: {
			type: Array as PropType<AmeliproBreadcrumbItem[]>,
			required: true,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})
	const { xs } = useDisplay()

	const itemsToDisplay = computed<AmeliproBreadcrumbItem[]>(() => {
		let itemsList = props.items.slice(0, (props.items.length - 1))

		if (xs.value) {
			itemsList = [props.items[props.items.length - 2]]
		}

		return itemsList
	})

	const emit = defineEmits(['click'])
	const emitClickEvent = (id: string): void => emit('click', id)
</script>

<template>
	<nav
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		aria-label="Fil d'Ariane"
		class="breadcrumb"
	>
		<ol
			:id="uniqueId ? `${uniqueId}-list` : undefined"
			class="list-style-none d-flex align-center breadcrumb__list"
		>
			<li
				v-for="(item, index) in itemsToDisplay"
				:key="index"
				class="d-flex align-center breadcrumb__item"
			>
				<AmeliproBtn
					class="text-none font-weight-semibold breadcrumb__btn"
					hover-underline
					:href="item.href"
					text
					:to="item.to"
					:unique-id="uniqueId ? `${uniqueId}-btn-${index}` : undefined"
					@click="emitClickEvent(item.id)"
				>
					{{ item.title }}
				</AmeliproBtn>

				<span
					aria-hidden="true"
					class="breadcrumb__separator"
				/>
			</li>

			<li>
				<p
					:id="uniqueId ? `${uniqueId}-current-page` : undefined"
					aria-current="page"
					class="text-none mb-0 breadcrumb__active-page"
				>
					{{ items[items.length - 1].title }}
				</p>
			</li>
		</ol>
	</nav>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.breadcrumb__separator {
	display: block;
	width: 0;
	height: 1.25rem;
	margin: 0 0.5rem;
	border-left: 1px solid apTokens.$ap-grey-darken1;
}
</style>
