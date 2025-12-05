<script setup lang="ts">
	import type { AmeliproTab, AmeliproTabsSelect } from './types'
	import { computed, onMounted, onUpdated, type PropType, ref, watch } from 'vue'
	import AmeliproSelect from '../AmeliproSelect/AmeliproSelect.vue'
	import AmeliproTabBtn from './AmeliproTabBtn/AmeliproTabBtn.vue'
	import type { SelectItem } from '../AmeliproSelect/types'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		ariaLabel: {
			type: String,
			default: undefined,
		},
		ariaLabelledby: {
			type: String,
			default: undefined,
		},
		btnGroupClasses: {
			type: String,
			default: undefined,
		},
		items: {
			type: Array as PropType<AmeliproTab[]>,
			default: () => [],
		},
		noTabDefaultStyle: {
			type: Boolean,
			default: false,
		},
		pills: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
		value: {
			type: Number,
			default: 0,
		},
	})

	const ameliproTabsBtns = ref<typeof AmeliproTabBtn[]>()
	const ameliproTabsSelect = ref<AmeliproTabsSelect>()
	const selected = ref(props.value)
	const { mdAndUp } = useDisplay()

	const mobileItems = computed<SelectItem[]>(() => {
		const selectList: SelectItem[] = []
		props.items.forEach((element: AmeliproTab, index) => {
			let title = element.label
			if (element.notification) {
				title += `(${element.notification})`
			}
			selectList.push({
				disabled: element.disabled,
				title,
				value: index,
			})
		})
		return selectList
	})

	onMounted(() => {
		setDefaultValues()
		hideSelectLabel()
	})

	onUpdated(() => {
		hideSelectLabel()
	})

	const hideSelectLabel = (): void => {
		document.getElementById(`${props.uniqueId}-select-label`)?.setAttribute('class', 'd-sr-only')
	}

	const setDefaultValues = (): void => {
		if (props.items !== undefined && selected.value !== undefined && props.items[selected.value] !== undefined) {
			let disabledBtn = props.items[selected.value].disabled
			while (disabledBtn) {
				selected.value += 1
				if (props.items[selected.value].disabled === false) {
					disabledBtn = false
				}
			}
		}
	}

	const onClick = (index: number): void => {
		selected.value = index
		emitTabChangeEvent()
	}

	const pressLeft = (): void => {
		let disabledBtn = true
		if (selected.value === 0) {
			let tablePos = 1
			while (disabledBtn) {
				selected.value = props.items.length - tablePos
				if (props.items[selected.value].disabled === false) {
					disabledBtn = false
				}
				tablePos += 1
			}
			focusChange()
		}

		while (disabledBtn) {
			selected.value -= 1
			if (selected.value < 0) {
				selected.value = props.items.length - 1
			}
			if (props.items[selected.value].disabled === false) {
				disabledBtn = false
			}
			focusChange()
		}
	}

	const pressRight = (): void => {
		let disabledBtn = true
		if (selected.value === (props.items.length - 1)) {
			let tablePos = 0
			while (disabledBtn) {
				selected.value = tablePos
				if (props.items[selected.value].disabled === false) {
					disabledBtn = false
				}
				tablePos += 1
			}
			focusChange()
		}

		while (disabledBtn) {
			selected.value += 1
			if (selected.value === props.items.length) {
				selected.value = 0
			}
			if (props.items[selected.value].disabled === false) {
				disabledBtn = false
			}
			focusChange()
		}
	}

	const pressHome = (): void => {
		selected.value = 0
		let disabledBtn = props.items[selected.value].disabled
		while (disabledBtn) {
			selected.value += 1
			if (props.items[selected.value].disabled === false) {
				disabledBtn = false
			}
		}
		focusChange()
	}

	const pressEnd = (): void => {
		selected.value = props.items.length - 1
		let disabledBtn = props.items[selected.value].disabled

		while (disabledBtn) {
			selected.value -= 1

			if (props.items[selected.value].disabled === false) {
				disabledBtn = false
			}
		}
		focusChange()
	}

	const focusChange = (): void => {
		if (ameliproTabsBtns.value) {
			(ameliproTabsBtns.value[selected.value].$el as HTMLElement).focus()
			emitTabChangeEvent()
		}
	}

	const emit = defineEmits(['change-tab'])
	const emitTabChangeEvent = (): void => {
		emit('change-tab', selected.value)
	}

	watch(() => props.value, () => {
		selected.value = props.value
	})
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-tabs"
	>
		<div
			v-if="mdAndUp || pills"
			:id="`${uniqueId}-desktop`"
			class="amelipro-tabs--desktop"
		>
			<div
				class="amelipro-tabs__btn-group"
				:class="btnGroupClasses"
			>
				<slot name="tabsDesc" />

				<div
					:id="uniqueId"
					:aria-label="ariaLabel"
					:aria-labelledby="ariaLabelledby"
					class="d-flex flex-column flex-sm-row align-center flex-nowrap justify-center justify-sm-start amelipro-tabs__btn-group__wrapper"
					role="tablist"
				>
					<AmeliproTabBtn
						v-for="(item, index) in items"
						:key="index"
						ref="ameliproTabsBtns"
						:class="{
							'first-tab-btn': index === 0 && !pills,
							'last-tab-btn': index === items.length - 1 && !pills,
						}"
						:controls="`${uniqueId}-tab-panel-${index}`"
						:disabled="item.disabled"
						:notification="item.notification"
						:pills="pills"
						:selected="index === selected && !item.disabled"
						:tabindex="selected === index && !item.disabled ? 0 : -1"
						:unique-id="`${uniqueId}-tab-btn-${index}`"
						@click="onClick(index)"
						@keyup.end="pressEnd"
						@keyup.home="pressHome"
						@keyup.left="pressLeft"
						@keyup.right="pressRight"
					>
						{{ item.label }}
					</AmeliproTabBtn>
				</div>
			</div>

			<div
				v-for="(tab, index) in items"
				v-show="index === selected"
				:id="`${uniqueId}-tab-panel-${index}`"
				:key="index"
				class="tabpanel amelipro-tabs__tab"
				:class="{
					'bg-ap-white pa-6': !noTabDefaultStyle,
					'tab-panel-default': !noTabDefaultStyle,
					'border-top-left': !noTabDefaultStyle && !pills,
				}"
				role="tabpanel"
				:tabindex="selected === index ? 0 : -1"
			>
				<slot :name="`${uniqueId}-tab-panel-${index}`">
					<slot
						name="tab-panel"
						v-bind="tab"
					/>
				</slot>
			</div>
		</div>

		<div
			v-else
			:id="`${uniqueId}-mobile`"
			class="amelipro-tabs--mobile"
		>
			<div
				class="amelipro-tabs__btn-group"
				:class="btnGroupClasses"
			>
				<slot name="tabsDesc" />

				<AmeliproSelect
					ref="ameliproTabsSelect"
					v-model="selected"
					:aria-controls="`${uniqueId}-select-panel`"
					classes="amelipro-tabs__select"
					horizontal
					:items="mobileItems"
					label="Selectionnez l'onglet à afficher"
					:unique-id="`${uniqueId}-select`"
					@update:model-value="emitTabChangeEvent"
				/>
			</div>

			<div :id="`${uniqueId}-select-panel`">
				<div
					v-for="(tab, index) in items"
					v-show="index === selected"
					:id="`${uniqueId}-tab-panel-${index}`"
					:key="index"
					class=" tabpanel amelipro-tabs__tab"
					:class="{
						'bg-ap-white pa-6 tab-panel-default': !noTabDefaultStyle,
					}"
					role="tabpanel"
					:tabindex="selected === index ? 0 : -1"
				>
					<slot :name="`${uniqueId}-tab-panel-${index}`" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.first-tab-btn {
	border-top-left-radius: 8px;
}

.last-tab-btn {
	border-top-right-radius: 8px;
}

.tabpanel {
	&:focus {
		outline: 1px dotted apTokens.$ap-grey-darken1;
	}
}

.tab-panel-default {
	border-radius: 8px;
	border: 1px solid apTokens.$ap-grey-lighten2;
}

.border-top-left {
	@media #{apTokens.$media-up-md} {
		border-top-left-radius: 0;
	}
}
</style>
