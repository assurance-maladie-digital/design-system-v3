<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
	import AmeliproPaginationBtn from './AmeliproPaginationBtn/AmeliproPaginationBtn.vue'
	import type { PaginationTypes } from './types'

	const props = defineProps({
		activePageDefault: {
			type: Number,
			default: 1,
		},
		items: {
			type: Array as () => PaginationTypes[],
			default: () => [],
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const emit = defineEmits(['click'])
	const activePage = ref(props.activePageDefault)
	const pageTotal = ref(props.items.length)
	const chevronLeft = mdiChevronLeft
	const chevronRight = mdiChevronRight

	watch(() => props.items.length, () => {
		pageTotal.value = props.items.length
	})

	const middlePartItems = computed<PaginationTypes[]>(() => {
		if (props.items.length <= 5) {
			return props.items.slice(1, props.items.length - 1)
		}

		if (props.items.length > 5 && activePage.value <= 3) {
			return props.items.slice(1, 3)
		}

		if (props.items.length > 5 && activePage.value > 3 && activePage.value > pageTotal.value - 3) {
			return props.items.slice(-3, -1)
		}

		return [props.items[activePage.value - 1]]
	})

	const emitClickEvent = () => emit('click', activePage.value)

	const onClick = (targetPage: number): void => {
		if (targetPage > 0 && targetPage <= pageTotal.value) {
			activePage.value = targetPage
		}
		emitClickEvent()
	}
</script>

<template>
	<nav
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		aria-label="pagination"
		class="d-flex justify-center align-center amelipro-pagination"
	>
		<ol
			:id="uniqueId ? `${uniqueId}-list` : undefined"
			class="list-style-none d-flex amelipro-pagination__list"
		>
			<li class="amelipro-pagination__item">
				<AmeliproPaginationBtn
					:href="items[0] ? items[0].href : undefined"
					:is-active="activePage === 1"
					:to="items[0] ? items[0].to : undefined"
					:unique-id="uniqueId ? `${uniqueId}-first` : undefined"
					@click="onClick(1)"
				>
					{{ !items[0] ? undefined : items[0].key }}
				</AmeliproPaginationBtn>
			</li>

			<li
				v-if="items.length > 5 && activePage > 3"
				class="amelipro-pagination__item"
			>
				<AmeliproPaginationBtn
					key="previous"
					:href="items[activePage - 2] ? items[activePage - 2].href : undefined"
					title="page précédente"
					:to="items[activePage - 2] ? items[activePage - 2].to : undefined"
					:unique-id="uniqueId ? `${uniqueId}-previous` : undefined"
					@click="onClick(activePage - 1)"
				>
					<template #icon>
						{{ chevronLeft }}
					</template>
				</AmeliproPaginationBtn>
			</li>

			<li
				v-for="(item, index) in middlePartItems"
				:key="index"
				class="amelipro-pagination__item"
			>
				<AmeliproPaginationBtn
					:href="item.href"
					:is-active="activePage === item.key"
					:to="item.to"
					:unique-id="uniqueId ? `${uniqueId}-middle-${index}` : undefined"
					@click="onClick(item.key)"
				>
					{{ item.key }}
				</AmeliproPaginationBtn>
			</li>

			<li
				v-if="items.length > 5 && activePage <= (items.length - 3)"
				class="amelipro-pagination__item"
			>
				<AmeliproPaginationBtn
					key="next"
					:href="activePage < pageTotal && items[activePage] ? items[activePage].href : undefined"
					title="page suivante"
					:to="activePage < pageTotal && items[activePage] ? items[activePage].to : undefined"
					:unique-id="uniqueId ? `${uniqueId}-next` : undefined"
					@click="onClick(activePage + 1)"
				>
					<template #icon>
						{{ chevronRight }}
					</template>
				</AmeliproPaginationBtn>
			</li>

			<li class="amelipro-pagination__item">
				<AmeliproPaginationBtn
					:href="items[items.length - 1] ? items[items.length - 1].href : undefined"
					:is-active="activePage === pageTotal"
					:to="items[items.length - 1] ? items[items.length - 1].to : undefined"
					:unique-id="uniqueId ? `${uniqueId}-last` : undefined"
					@click="onClick(pageTotal)"
				>
					{{ items[items.length - 1] ? items[items.length - 1].key : undefined }}
				</AmeliproPaginationBtn>
			</li>
		</ol>
	</nav>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	ol {
		border: 1px solid apTokens.$ap-grey-lighten3;
	}

	li:not(:last-child) {
		border-right: 1px solid apTokens.$ap-grey-lighten3;
	}

	:deep(.amelipro-icon) {
		position: relative !important;
	}
</style>
