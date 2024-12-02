<script lang="ts" setup>
	import { ref, watch, computed, useSlots } from 'vue'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		modelValue: {
			type: [Object, String, null],
			default: null,
		},
		menuItems: {
			type: Array,
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

	const selectItem = (item: unknown) => {
		selectedItem.value = item as string | Record<string, unknown> | null
		emit('update:modelValue', item)
		isOpen.value = false
	}

	const getItemText = (item: unknown) => {
		return (item as Record<string, unknown>)[props.textKey]
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
		return props.isMobileView || smAndDown.value
	})

	const isMobileWithIcon = computed(() => {
		return isMobileVersion.value && !props.hideIcon
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
	<div class="vd-user-menu-btn-ctn d-inline-block">
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
					:height="isMobileWithIcon ? undefined : 'auto'"
					:icon="isMobileWithIcon"
					:size="isMobileWithIcon ? 'x-large' : 'default'"
					class="vd-user-menu-btn"
					v-bind="{
						...menuProps,
						...props.options['btn'],
					}"
					@click="toggleMenu"
				>
					<span class="d-sr-only">{{ label }}</span>
					<span
						v-if="!isMobileVersion"
						class="d-flex flex-column align-end"
					>
						<span class="font-weight-bold">{{ primaryInfo }}</span>
						<span class="text-grey text-darken-2 font-weight-medium">{{ secondaryInfo }}</span>
					</span>
					<span
						v-if="isMobileVersion && hideIcon"
						class="font-weight-bold text-sm-caption"
					>{{ primaryInfo }}</span>
					<slot name="icon" />
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
						v-bind="props.options['list']"
						@click="selectItem(item)"
					>
						<VListItemTitle v-bind="props.options['list']">
							{{ getItemText(item) }}
						</VListItemTitle>
					</VListItem>
					<slot />
					<slot name="logout-item" />
				</VList>
			</slot>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss';

.vd-user-menu-btn-ctn {
  position: relative;
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
