<script setup lang="ts">
	import {
		mdiChevronRight as rightArrowIcon,
		mdiChevronLeft as leftArrowIcon,
		mdiOpenInNew as linkIcon,
	} from '@mdi/js'

	import { locales } from './locales'
	import { computed, ref, type CSSProperties } from 'vue'
	import { convertToUnit } from '@/utils/convertToUnit'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'

	const props = withDefaults(defineProps<CustomizableOptions & {
		items: Array<{
			text: string
			href: string
		}>
		position?: 'top right' | 'top left' | 'bottom right' | 'bottom left'
		btnText?: string
		nudgeTop?: number | string
		nudgeBottom?: number | string
		fixed?: boolean
	}>(), {
		position: 'top left',
		btnText: locales.btnText,
		nudgeTop: 0,
		nudgeBottom: 0,
		fixed: false,
	})

	const options = useCustomizableOptions(config, props)

	const menu = ref(false)
	const hover = ref(false)
	const open = computed(() => menu.value || hover.value)

	const left = computed(() => props.position.includes('left'))
	const top = computed(() => props.position.includes('top'))

	const btnStyle = computed<CSSProperties>(() => {
		const minBtnWidth = '48px'
		const translate = left.value
			? `translateX(calc(-100% + ${minBtnWidth}))`
			: `translateX(calc(100% - ${minBtnWidth}))`

		return {
			transform: open.value ? 'translateX(0)' : translate,
			position: props.fixed ? 'fixed' : 'absolute',
			flexDirection: left.value ? 'row' : 'row-reverse',
			top: top.value ? convertToUnit(props.nudgeTop) : 'auto',
			bottom: !top.value ? convertToUnit(props.nudgeBottom) : 'auto',
			left: left.value ? 0 : 'auto',
			right: !left.value ? 0 : 'auto',
			// Change z-index to avoid shadow bleeding (VMenu is set to 4)
			zIndex: top.value ? '4' : '5',
		}
	})

	const arrowIcon = computed(() => {
		if (open.value) {
			return left.value ? leftArrowIcon : rightArrowIcon
		}
		return left.value ? rightArrowIcon : leftArrowIcon
	})
</script>

<template>
	<VMenu
		v-model="menu"
		v-bind="options.menu"
		:location="top ? 'bottom' : 'top'"
		attach
		transition="fade-transition"
		class="vd-external-links"
		:class="{
			'vd-external-links--left': left,
			'vd-external-links--right': !left,
		}"
	>
		<template #activator="{ props: vMenuProps }">
			<VBtn
				v-bind="{
					...vMenuProps,
					...options.btn,
				}"
				:style="btnStyle"
				class="vd-external-links-btn"
				@mouseenter="hover = true"
				@mouseleave="hover = false"
				@focusin="hover = true"
				@focusout="hover = false"
			>
				<span
					:class="{
						'ml-3': !left,
						'mr-3': left,
					}"
					class="vd-external-links-btn-text white--text"
				>
					{{ btnText }}
				</span>

				<VIcon v-bind="options.btnIcon">
					{{ arrowIcon }}
				</VIcon>
			</VBtn>
		</template>

		<VList
			v-if="items.length"
			v-bind="options.list"
			class="vd-external-links-list"
		>
			<VListItem
				v-for="(item, index) in items"
				:key="index"
				:href="item.href"
				v-bind="options.listItem"
			>
				<div class="d-flex flex-row justify-space-between">
					<VListItemTitle v-bind="options.listItemTitle">
						{{ item.text }}
					</VListItemTitle>

					<slot name="link-icon">
						<VIcon v-bind="options.linkIcon">
							{{ linkIcon }}
						</VIcon>
					</slot>
				</div>
			</VListItem>
		</VList>

		<VSheet
			v-else
			v-bind="options.sheet"
		>
			<p class="mb-0">
				{{ locales.noData }}
			</p>
		</VSheet>
	</VMenu>
</template>

<style lang="scss" scoped>
$list-max-height: 248px;

.vd-external-links-btn {
	// Allow overgrow on mobile
	max-width: none;

	:deep(.v-btn__content) {
		flex-direction: inherit;
		justify-content: space-between;
		width: 100%;
	}

	.v-icon {
		font-size: 1.5rem;
	}
}

.vd-external-links--left :deep(.v-overlay__content) {
	left: 0 !important;
	right: auto !important;
}

.vd-external-links--right :deep(.v-overlay__content) {
	right: 0 !important;
	left: auto !important;
}

.vd-external-links > :deep(.v-overlay__content) {
	border-radius: 0;
}

.vd-external-links-list {
	max-height: $list-max-height;
	overflow-y: auto;
	border-radius: 0;
}

@media only screen and (max-height: 340px) {
	.vd-external-links-btn {
		z-index: 4 !important;
	}
}
</style>
