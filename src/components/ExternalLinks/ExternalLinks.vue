<script setup lang="ts">
	import {
		mdiChevronRight as rightArrowIcon,
		mdiChevronLeft as leftArrowIcon,
		mdiOpenInNew as linkIcon,
	} from '@mdi/js'

	import { locales } from './locales'
	import { computed, ref, watch, nextTick, type CSSProperties, useId } from 'vue'
	import { convertToUnit } from '@/utils/convertToUnit'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'
	import { vToolbar } from '@/directives/Toolbar'
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'

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
		ariaLabel?: string
	}>(), {
		position: 'top left',
		btnText: locales.btnText,
		nudgeTop: 0,
		nudgeBottom: 0,
		fixed: false,
		ariaLabel: locales.ariaLabel,
	})

	const options = useCustomizableOptions(config, props)

	const menu = ref(false)
	const hover = ref(false)
	const open = computed(() => menu.value || hover.value)
	const menuId = `sy-external-links-menu-${useId()}`

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

	const list = ref<HTMLElement | null>(null)

	watch(menu, async (newValue) => {
		if (newValue) {
			await nextTick()
			const firstItem = list.value?.querySelector<HTMLElement>('li a')
			firstItem?.focus()
		}
	})
</script>

<template>
	<div>
		<VMenu
			:id="menuId"
			v-bind="options.menu"
			v-model="menu"
			:location="top ? 'bottom' : 'top'"
			attach
			transition="fade-transition"
			class="sy-external-links"
			:class="{
				'sy-external-links--left': left,
				'sy-external-links--right': !left,
			}"
		>
			<template #activator="{ props: vMenuProps }">
				<VBtn
					v-bind="{
						...vMenuProps,
						...options.btn,
					}"
					:aria-label="props.ariaLabel"
					:aria-controls="menu ? menuId : undefined"
					:style="btnStyle"
					class="sy-external-links-btn"
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
						class="sy-external-links-btn-text white--text"
					>
						{{ btnText }}
					</span>

					<SyIcon
						v-bind="options.btnIcon"
						:icon="arrowIcon"
						decorative
					/>
				</VBtn>
			</template>

			<ul
				v-if="items.length"
				v-bind="options.list"
				ref="list"
				v-toolbar
				class="sy-external-links-list elevation-3"
			>
				<li
					v-for="(item, index) in items"
					:key="index"
				>
					<VBtn
						:href="item.href"
						block
						class="sy-external-links-list-item py-2"
						v-bind="options.listItem"
					>
						<div class="w-100 h-100 d-flex justify-space-between align-center">
							<div v-bind="options.listItemTitle">
								{{ item.text }}
							</div>

							<slot name="link-icon">
								<SyIcon
									v-bind="options.linkIcon"
									:icon="linkIcon"
									decorative
								/>
							</slot>
						</div>
					</VBtn>
				</li>
			</ul>

			<VSheet
				v-else
				v-bind="options.sheet"
			>
				<p class="mb-0">
					{{ locales.noData }}
				</p>
			</VSheet>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
$list-max-height: 248px;

.sy-external-links-btn {
	// Allow overgrow on mobile
	max-width: none;
	border-radius: 0 !important;
	box-shadow: none !important;

	:deep(.v-btn__content) {
		flex-direction: inherit;
		justify-content: space-between;
		width: 100%;
	}

	.v-icon {
		font-size: 1.5rem;
	}
}

.sy-external-links--left :deep(.v-overlay__content) {
	left: 0 !important;
	right: auto !important;
}

.sy-external-links--right :deep(.v-overlay__content) {
	right: 0 !important;
	left: auto !important;
}

.sy-external-links > :deep(.v-overlay__content) {
	border-radius: 0;
}

.sy-external-links-list {
	max-height: $list-max-height;
	overflow-y: auto;
	border-radius: 0;
	background-color: white;
	box-shadow:
		0 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgb(0 0 0 / 20%)),
		0 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgb(0 0 0 / 14%)),
		0 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgb(0 0 0 / 12%));
}

.sy-external-links-list-item {
	padding-block: 4px !important;
	height: 48px !important;
	border-radius: 0 !important;

	&:focus-visible {
		outline: 0;

		:deep(.v-btn__overlay) {
			background-color: transparent !important;
			display: none !important;
		}

		&::after {
			opacity: 1;
			border: 2px solid rgb(var(--v-theme-primary));
		}
	}
}

.sy-external-links-list-item :deep(.v-btn__content) {
	width: 100%;
	font-size: 1rem;
	font-weight: 400;
}

@media only screen and (height <= 340px) {
	.sy-external-links-btn {
		z-index: 4 !important;
	}
}
</style>
