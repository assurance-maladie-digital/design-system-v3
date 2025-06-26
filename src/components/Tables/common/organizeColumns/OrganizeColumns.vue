<script setup lang="ts">
	import { mdiEye, mdiEyeOff, mdiTableArrowLeft, mdiTableArrowRight, mdiTableEdit } from '@mdi/js'
	import { computed, ref } from 'vue'
	import { locales } from '../locales'
	import type { SyHeaders } from '../types'
	import { watch } from 'vue'

	const headers = defineModel<SyHeaders>('headers')

	const item = ref<HTMLElement[] | null>(null)

	// Ensure that all headers have an order defined
	watch(
		headers,
		() => {
			if (headers.value?.find(header => header.order === undefined)) {
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
		return headers.value?.reduce(
			(acc, header) => acc + (header.hidden ? 0 : 1),
			0,
		) || 0
	})

	let waitTransition = false
	let appearItemId = ref<number>()
	function right(header: SyHeaders[number]) {
		if (waitTransition) {
			return
		}
		waitTransition = true
		const newHeaders = JSON.parse(JSON.stringify(headers.value))
		const nextHeader = newHeaders?.find(h => h.order === header.order! + 1)
		const currentHeader = newHeaders?.find(h => h.order === header.order!)

		const nextHeaderElement = item.value?.find(el => el['$attrs']['data-id'] === nextHeader.key)
		nextHeaderElement!['$el'].classList.add('fade-out')

		const currentHeaderElement = item.value?.find(el => el['$attrs']['data-id'] === currentHeader!.key)
		currentHeaderElement!['$el'].classList.add('to-bottom')

		setTimeout(() => {
			if (nextHeader) {
				nextHeader.order = header.order!
			}
			if (currentHeader) {
				currentHeader.order = header.order! + 1
			}
			appearItemId.value = nextHeader.order
			headers.value = newHeaders

			setTimeout(() => {
				appearItemId.value = undefined
				waitTransition = false
			}, 200)
		}, 300)
	}

	function left(header: SyHeaders[number]) {
		if (waitTransition) {
			return
		}
		waitTransition = true
		const newHeaders = JSON.parse(JSON.stringify(headers.value))
		const previousHeader = newHeaders?.find(h => h.order === header.order! - 1)
		const currentHeader = newHeaders?.find(h => h.order === header.order!)

		const previousHeaderElement = item.value?.find(el => el['$attrs']['data-id'] === previousHeader!.key)
		previousHeaderElement!['$el'].classList.add('fade-out')

		const currentHeaderElement = item.value?.find(el => el['$attrs']['data-id'] === currentHeader!.key)
		currentHeaderElement!['$el'].classList.add('to-top')

		// update the order of the previous header
		setTimeout(() => {
			if (previousHeader) {
				previousHeader.order = header.order!
			}
			if (currentHeader) {
				currentHeader.order = header.order! - 1
			}
			appearItemId.value = previousHeader.order
			headers.value = newHeaders

			setTimeout(() => {
				appearItemId.value = undefined
				waitTransition = false
			}, 200)
		}, 300)
	}
	const orderedHeaders = ref<SyHeaders>([])
	watch(
		headers,
		() => {
			orderedHeaders.value = headers.value.toSorted((a, b) => {
				return (a.order || 0) - (b.order || 0)
			})
		},
		{ immediate: true, deep: true },
	)

</script>

<template>
	<div class="mr-auto ml-3">
		<VMenu
			:close-on-content-click="false"
			location="end"
		>
			<template #activator="{ props }">
				<VBtn
					:title="locales.reorganizeColumns"
					variant="outlined"
					v-bind="props"
					:active="visibleColumnsCount > 0"
				>
					<VIcon size="large">
						{{ mdiTableEdit }}
					</VIcon>
				</VBtn>
			</template>
			<VCard min-width="300">
				<VCardTitle>
					{{ locales.reorganizeColumnsTitle }}
				</VCardTitle>
				<VList>
					<VListItem
						v-for="(header, index) in orderedHeaders"
						ref="item"
						:key="`${header!.key!}${index}`"
						:data-id="header!.key"
						:class="{
							'fade-in': appearItemId === header.order,
						}"
					>
						<div class="d-flex ga-8 justify-space-between align-center w-100">
							<div class="d-flex align-center flex-row-reverse">
								<div :id="`header-${header!.title}`">
									{{ header!.title }}
								</div>
								<VBtn
									:title="header.hidden ? locales.showColumn(header.title as string) : locales.hideColumn(header.title as string)"
									elevation="0"
									variant="plain"
									size="small"
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
									variant="outlined"
									density="compact"
									divided
									tile
								>
									<VBtn
										:title="locales.moveColumnLeft(header.title as string)"
										:disabled="index === 0"
										@click="left(header)"
									>
										<VIcon>
											{{ mdiTableArrowLeft }}
										</VIcon>
									</VBtn>
									<VBtn
										:title="locales.moveColumnRight(header.title as string)"
										:disabled="index === headers!.length - 1"
										@click="right(header)"
									>
										<VIcon>
											{{ mdiTableArrowRight }}
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
