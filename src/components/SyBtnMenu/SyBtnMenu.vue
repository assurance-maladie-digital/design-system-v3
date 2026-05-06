<script lang="ts" setup>
	import { ref, watch, computed, onMounted, useSlots, type PropType, nextTick } from 'vue'
	import { useDisplay } from 'vuetify'
	import slugify from 'slugify'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	type Item = string | Record<string, unknown>

	const props = defineProps({
		modelValue: {
			type: [Object, String, null],
			default: null,
		},
		menuItems: {
			type: Array as PropType<Item[]>,
			default: () => [],
		},
		label: {
			type: String,
			default: 'Menu utilisateur',
		},
		required: {
			type: Boolean,
			default: false,
		},
		menuId: {
			type: String,
			default: 'custom-btn-select-menu',
		},
		textKey: {
			type: String,
			default: 'text',
		},
		valueKey: {
			type: String,
			default: 'value',
		},
		iconKey: {
			type: String,
			default: 'icon',
		},
		primaryInfo: {
			type: String,
			default: 'Information principale',
		},
		secondaryInfo: {
			type: String,
			default: undefined,
		},
		hideIcon: {
			type: Boolean,
			default: false,
		},
		hideLogoutBtn: {
			type: Boolean,
			default: false,
		},
		isMobileView: {
			type: Boolean,
			default: false,
		},
		iconOnly: {
			type: Boolean,
			default: false,
		},
		options: {
			type: Object,
			default: () => ({ menu: {}, btn: {}, list: {} }),
		},
	})

	const emit = defineEmits(['update:modelValue', 'logout'])
	const slots = useSlots()
	const { smAndDown } = useDisplay()

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown> | string | null>(props.modelValue as Record<string, unknown> | string | null)
	const buttonRef = ref<HTMLElement | null>(null)
	const buttonWidth = ref('')

	onMounted(() => {
		if (buttonRef.value && !isMobileVersion.value) {
			buttonWidth.value = `${buttonRef.value.getBoundingClientRect().width}px`
		}
	})

	const selectItem = (item: Item | null) => {
		selectedItem.value = item
		emit('update:modelValue', item)
		isOpen.value = false
	}

	const formattedItems = computed(() => {
		return props.menuItems.map((item) => {
			if (typeof item === 'string') {
				return { [props.textKey]: item, [props.valueKey]: item }
			}
			return item
		})
	})

	const btnPadding = computed(() => {
		if (props.hideIcon) {
			return 'pa-1 pa-sm-2'
		}
		return isMobileVersion.value ? 'pa-1' : 'pa-1 pa-sm-3'
	})

	const hasListContent = computed(() => {
		return Boolean(slots.default || !props.hideLogoutBtn)
	})

	const isMobileVersion = computed(() => {
		return props.isMobileView || smAndDown.value || props.iconOnly
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
	})

	const generatedId = ref(`custom-btn-select-${Math.random().toString(36).substring(7)}`)

	function getSelectedValue() {
		if (!selectedItem.value) return undefined
		if (typeof selectedItem.value === 'string') return selectedItem.value
		return selectedItem.value[props.textKey] as string
	}

	const menu = ref<InstanceType<typeof import('vuetify/components').VList> | null>(null)

	watch(isOpen, async (newVal) => {
		if (newVal) {
			await nextTick()
			if (menu.value?.$el) {
				menu.value.$el.querySelector('[role="menuitem"]')?.focus()
			}
		}
		else {
			await nextTick()
			document.getElementById(generatedId.value)!.focus()
		}
	})

	defineExpose({
		isOpen,
		formattedItems,
		selectedItem,
	})
</script>

<template>
	<div
		ref="buttonRef"
		class="sy-user-menu-btn-ctn d-inline-block"
	>
		<VMenu
			:id="$props.menuId"
			v-model="isOpen"
			class="sy-user-menu"
			:disabled="!hasListContent"
			location="bottom end"
			transition="fade-transition"
			v-bind="props.options['menu']"
			scroll-strategy="none"
			z-index="9999"
		>
			<template #activator="{ props: menuProps }">
				<VBtn
					:id="generatedId"
					:class="btnPadding"
					:height="iconOnly ? 'auto' : undefined"
					:icon="iconOnly"
					:size="iconOnly ? 'x-large' : 'default'"
					:width="iconOnly ? 'auto' : undefined"
					class="sy-user-menu-btn"
					v-bind="{
						...menuProps,
						...props.options['btn'],
					}"
				>
					<span
						:class="['text-'+props?.options['btn']?.color]"
						class="d-flex align-center ga-2"
					>
						<slot name="prepend-icon" />
						<span class="d-sr-only">{{ props.label }}</span>
						<span
							v-if="!isMobileVersion && !iconOnly"
							class="d-flex flex-column align-end py-1"
						>
							<span
								:class="`text-${props?.options['btn']?.textColor}`"
								class="text-h6 font-weight-bold"
							>
								{{ props.primaryInfo }}
							</span>
							<span
								:class="`text-${props?.options['btn']?.textColor}`"
								class="subtitle text-grey text-darken-2 font-weight-regular"
							>
								{{ props.secondaryInfo }}
							</span>
						</span>
						<span
							v-if="isMobileVersion && !iconOnly"
							:class="`text-${props?.options['btn']?.textColor}`"
							class="font-weight-bold text-caption"
						>
							{{ props.primaryInfo }}
						</span>
						<slot name="append-icon" />
					</span>
				</VBtn>
			</template>
			<slot name="content">
				<VList
					v-if="hasListContent"
					ref="menu"
					tag="ul"
					role="menu"
					v-bind="props.options['list']"
					:aria-labelledby="generatedId"
					:aria-activedescendant="getSelectedValue() ? `item-${slugify(getSelectedValue()!)}` : undefined"
				>
					<VListItem
						v-for="(item, index) in formattedItems"
						:id="`item-${slugify(item[props.textKey] as string)}`"
						:key="index"
						tag="li"
						:class="`text-${props?.options['list']?.textColor}`"
						v-bind="props.options['list']"
						:href="item.link"
						:to="item.to"
						:tabindex="0"
						role="menuitem"
						:aria-current="selectedItem === item ? 'page' : undefined"
						@click="selectItem(item)"
					>
						<template
							v-if="item[props.iconKey]"
							#prepend
						>
							<SyIcon
								:icon="item[props.iconKey] as string"
								decorative
							/>
						</template>
						<VListItemTitle
							class="item-title"
						>
							{{ item[props.textKey] }}
						</VListItemTitle>
					</VListItem>
					<slot />
					<slot name="footer-list-item" />
				</VList>
			</slot>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
.sy-user-menu-btn-ctn {
	position: relative;
	z-index: 1;

	.v-btn.v-btn--density-default {
		height: auto !important;
	}

	.v-btn {
		text-transform: none !important;
	}
}

.sy-user-menu-btn {
	outline: none;
	padding: 12px !important;

	&:hover::before {
		background: #000;
		opacity: 0.05;
	}

	&:focus::before {
		background: rgb(var(--v-theme-blue-base));
		opacity: 0.08;
	}

	&:focus {
		background: rgba(var(--v-theme-blue-base), 0.08) !important;
	}

	.subtitle {
		font-size: 0.875rem;
		line-height: 1.5;
	}
}

:deep(.sy-user-menu-btn:focus > .v-btn__overlay) {
	opacity: 0 !important;
}

.v-btn:focus-visible {
	outline: 2px solid rgb(var(--v-theme-colorPrimary));
	outline-offset: 2px;

	:deep(.v-btn__overlay) {
		opacity: 0;
	}

	&::after {
		opacity: 0;
	}
}

:global(.sy-user-menu .v-list-item:focus) {
	outline: 2px solid rgb(var(--v-theme-colorPrimary));
	outline-offset: -2px;
}

.item-title {
	white-space: wrap;
}

:deep(.v-list-item__prepend) {
	display: unset !important;
}
</style>
