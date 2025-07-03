<script setup lang="ts">
	import { mdiEye, mdiEyeOff, mdiChevronUp, mdiChevronDown, mdiTableEdit } from '@mdi/js'
	import { computed, ref } from 'vue'
	import { locales } from '../locales'
	import { watch } from 'vue'
	import type { DataTableHeaders } from '../types'
	import { sortHeaders } from './sortHeaders'

	const headers = defineModel<DataTableHeaders[]>(
		'headers',
		{
			required: true,
		},
	)

	const items = ref<HTMLElement[] | null>(null)

	// Ensure that all headers have an order defined
	watch(
		headers,
		() => {
			if (headers.value.find(header => header.order === undefined)) {
				headers.value.forEach((header, index) => {
					if (header.order === undefined) {
						header.order = index + 1
					}
				})
			}
		},
		{ immediate: true, deep: true },
	)

	const visibleColumnsCount = computed(() => {
		return headers.value.reduce(
			(acc, header) => acc + (header.hidden ? 0 : 1),
			0,
		) || 0
	})

	let waitTransition = false
	let appearItemId = ref<number>()
	function right(header: DataTableHeaders) {
		if (waitTransition) {
			return
		}
		waitTransition = true
		const newHeaders = JSON.parse(JSON.stringify(headers.value)) as DataTableHeaders[]
		const nextHeader = newHeaders.find(h => h.order === header.order! + 1)
		const currentHeader = newHeaders.find(h => h.order === header.order!)

		const nextHeaderElement = items.value?.find(el => el['$attrs']['data-id'] === nextHeader!.key)
		nextHeaderElement!['$el'].classList.add('fade-out')

		const currentHeaderElement = items.value?.find(el => el['$attrs']['data-id'] === currentHeader!.key)
		currentHeaderElement!['$el'].classList.add('to-bottom')

		setTimeout(() => {
			if (nextHeader) {
				nextHeader.order = header.order
			}
			if (currentHeader) {
				currentHeader.order = header.order! + 1
			}
			appearItemId.value = nextHeader!.order
			headers.value = newHeaders

			setTimeout(() => {
				appearItemId.value = undefined
				waitTransition = false
			}, 200)
		}, 300)
	}

	function left(header: DataTableHeaders) {
		if (waitTransition) {
			return
		}
		waitTransition = true
		const newHeaders = JSON.parse(JSON.stringify(headers.value)) as DataTableHeaders[]
		const previousHeader = newHeaders.find(h => h.order === header.order! - 1)
		const currentHeader = newHeaders.find(h => h.order === header.order!)

		const previousHeaderElement = items.value?.find(el => el['$attrs']['data-id'] === previousHeader!.key)
		previousHeaderElement!['$el'].classList.add('fade-out')

		const currentHeaderElement = items.value?.find(el => el['$attrs']['data-id'] === currentHeader!.key)
		currentHeaderElement!['$el'].classList.add('to-top')

		// update the order of the previous header
		setTimeout(() => {
			if (previousHeader) {
				previousHeader.order = header.order
			}
			if (currentHeader) {
				currentHeader.order = header.order! - 1
			}
			appearItemId.value = previousHeader!.order
			headers.value = newHeaders

			setTimeout(() => {
				appearItemId.value = undefined
				waitTransition = false
			}, 200)
		}, 300)
	}
	const orderedHeaders = ref<DataTableHeaders[]>([])
	watch(
		headers,
		() => {
			orderedHeaders.value = sortHeaders(headers.value)
		},
		{ immediate: true, deep: true },
	)

	// Generate unique IDs for components - use fixed IDs instead of dynamic ones
	const columnsMenuId = 'organize-columns-menu'
	const columnsTitleId = 'organize-columns-title'
	const getHeaderId = (title: string) => `header-${title}`

</script>

<template>
	<div
		v-if="headers && headers.length > 0"
		class="ml-3"
	>
		<VMenu
			:id="columnsMenuId"
			:close-on-content-click="false"
			location="end"
			attach="body"
		>
			<template #activator="{ props }">
				<VBtn
					:title="locales.reorganizeColumns"
					variant="outlined"
					color="primary"
					v-bind="props"
					aria-haspopup="menu"
					:aria-controls="columnsMenuId"
				>
					<VIcon size="large">
						{{ mdiTableEdit }}
					</VIcon>
				</VBtn>
			</template>
			<VCard min-width="300">
				<VCardTitle :id="columnsTitleId">
					{{ locales.reorganizeColumnsTitle }}
				</VCardTitle>
				<VList
					:aria-labelledby="columnsTitleId"
				>
					<VListItem
						v-for="(header, index) in orderedHeaders"
						ref="items"
						:key="`${header!.key!}${index}`"
						:data-id="header!.key"
						:class="{
							'fade-in': appearItemId === header.order,
						}"
					>
						<div class="d-flex ga-8 justify-space-between align-center w-100">
							<div class="d-flex align-center flex-row-reverse">
								<div :id="getHeaderId(header!.title as string)">
									{{ header!.title }}
								</div>
								<VBtn
									:title="header.hidden ? locales.showColumn(header.title as string) : locales.hideColumn(header.title as string)"
									elevation="0"
									variant="text"
									color="primary"
									width="45"
									min-width="45"
									class="mr-2"
									:disabled="visibleColumnsCount <= 1 && !header.hidden"
									@click="() => {
										header.hidden = !header.hidden
									}"
								>
									<VIcon>
										{{ header.hidden ? mdiEyeOff : mdiEye }}
									</VIcon>
								</VBtn>
							</div>
							<div class="d-flex ga-2 pa-2">
								<VBtnGroup
									variant="text"
									tile
									active-color="primary"
									slim
									density="compact"
								>
									<VBtn
										:title="locales.moveColumnLeft(header.title as string)"
										:disabled="index === 0"
										width="45"
										min-width="45"
										color="primary"
										@click="left(header)"
									>
										<VIcon
											size="x-large"
										>
											{{ mdiChevronUp }}
										</VIcon>
									</VBtn>
									<VBtn
										:title="locales.moveColumnRight(header.title as string)"
										:disabled="index === headers!.length - 1"
										width="45"
										min-width="45"
										color="primary"
										@click="right(header)"
									>
										<VIcon
											size="x-large"
										>
											{{ mdiChevronDown }}
										</VIcon>
									</VBtn>
								</VBtnGroup>
							</div>
						</div>
					</VListItem>
				</VList>
			</VCard>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
.fade-out {
	opacity: 0;
	transition: opacity 0.2s ease-out;
}

.fade-in {
	animation: fade-in 0.2s ease-out forwards;
}

.to-top {
	transition: transform 0.2s 0.1s ease-out;
	transform: translateY(-100%);
}

.to-bottom {
	transition: transform 0.2s 0.1s ease-out;
	transform: translateY(100%);
}

@keyframes fade-in {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>
