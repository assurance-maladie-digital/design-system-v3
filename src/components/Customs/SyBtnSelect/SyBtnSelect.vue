<script lang="ts" setup>
	import { ref, watch, computed, onMounted, useSlots, type PropType } from 'vue'
	import { useDisplay } from 'vuetify'

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
			default: 'Sélectionnez une option',
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
	const toggleMenu = () => {
		isOpen.value = !isOpen.value
	}

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
		return isMobileVersion.value ? 'pa-0' : 'pa-1 pa-sm-3'
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

	defineExpose({
		isOpen,
		formattedItems,
		selectedItem,
	})
</script>

<template>
	<div
		ref="buttonRef"
		class="vd-user-menu-btn-ctn d-inline-block"
	>
		<VMenu
			:id="generatedId"
			:disabled="!hasListContent"
			location="bottom end"
			transition="fade-transition"
			v-bind="props.options['menu']"
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
					class="vd-user-menu-btn"
					v-bind="{
						...menuProps,
						...props.options['btn'],
					}"
					@click="toggleMenu"
				>
					<div
						:class="['text-'+props?.options['btn']?.color]"
						class="d-flex align-center"
					>
						<slot name="prepend-icon" />
						<span class="d-sr-only">{{ props.label }}</span>
						<span
							v-if="!isMobileVersion && !iconOnly"
							class="d-flex flex-column align-end py-1 mr-1"
						>
							<span
								:class="`text-${props?.options['btn']?.textColor}`"
								class="font-weight-bold"
							>
								{{ props.primaryInfo }}
							</span>
							<span
								:class="`text-${props?.options['btn']?.textColor}`"
								class="text-grey text-darken-2 font-weight-medium"
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
					</div>
				</VBtn>
			</template>
			<slot name="content">
				<VList
					v-if="hasListContent"
					v-bind="props.options['list']"
				>
					<VListItem
						v-for="(item, index) in formattedItems"
						:key="index"
						:class="`text-${props?.options['list']?.textColor}`"
						v-bind="props.options['list']"
						:href="item.link"
						@click="selectItem(item)"
					>
						<VListItemTitle v-bind="props.options['list']">
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
@use '@/assets/tokens.scss';
@use '@/assets/tokens' as *;

.vd-user-menu-btn-ctn {
  position: relative;
  z-index: 1;

  .v-btn.v-btn--density-default {
    height: auto !important;
  }
}

.vd-user-menu-btn {
  outline: none;
  padding: 12px !important;

  &:hover:before {
    background: #000;
    opacity: 0.05;
  }

  &:focus:before {
    background: tokens.$blue-base;
    opacity: 0.08;
  }

  &:focus {
    background: rgba(tokens.$blue-base, 0.08) !important;
  }
}

:deep(.vd-user-menu-btn:focus > .v-btn__overlay) {
  opacity: 0 !important;
}
</style>
