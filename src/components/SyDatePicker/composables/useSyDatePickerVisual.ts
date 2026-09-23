import { computed, ref, useSlots, type ComputedRef, type ComponentPublicInstance, type Ref, type Slot } from 'vue'
import type SyDatePickerInput from '../SyDatePickerText/SyDatePickerInput.vue'
import type { SyDatePickerVisualProps } from '../SyDatePickerVisual/SyDatePickerVisualProps'
import type { SyDatePickerValue } from '../types'

/** Slots of the root component forwarded to SyDatePickerVisual */
const VISUAL_SLOT_NAMES = new Set(['menu', 'header', 'footer', 'day'])

/** Matches the per-day slots of the visual picker (`day-2026-09-14`) */
const isDaySlotName = (name: string): boolean => /^day-\d{4}-\d{2}-\d{2}$/.test(name)

interface UseSyDatePickerVisualOptions {
	props: SyDatePickerVisualProps & {
		disabled: boolean
		readonly: boolean
	}
	locale: Ref<string>
	/** Normalized model from `useSyDatePickerTextField` */
	modelValue: ComputedRef<SyDatePickerValue>
	/** Opening button of a custom `input` slot, from `useSyDatePickerTextField` */
	customToggleBtn: Ref<HTMLButtonElement | null>
	/** Default input instance, fallback for the toggle button */
	textInput: Ref<ComponentPublicInstance<typeof SyDatePickerInput> | null>
}

/**
 * Centralizes the wiring of SyDatePickerVisual inside SyDatePicker:
 * - `visualProps`: props to `v-bind` on the visual picker (model, anchor, toggle
 *   button with its custom-slot fallback, and the visual picker props)
 * - `customInputEl`: anchor of the picker menu, attached to the `input` slot wrapper
 * - `visualSlots`: root slots forwarded to the visual picker (menu, header, footer, day, day-*)
 */
export function useSyDatePickerVisual(options: UseSyDatePickerVisualOptions): {
	/** Props to `v-bind` on the visual picker (model, anchor, toggle button, visual picker props) */
	visualProps: ComputedRef<{
		modelValue: SyDatePickerValue
		textInput: HTMLElement | null
		toggleBtn: HTMLElement | null
		mode: SyDatePickerVisualProps['mode']
		locale: string
	} & SyDatePickerVisualProps & { disabled: boolean, readonly: boolean }>
	/** Anchor of the picker menu, attached to the `input` slot wrapper (full width, custom slot included) */
	customInputEl: Ref<HTMLElement | null>
	/** Root slots forwarded to the visual picker (menu, header, footer, day, day-*) */
	visualSlots: ComputedRef<Record<string, Slot | undefined>>
} {
	const slots = useSlots()

	// The menu anchors to the `input` slot wrapper (full width), with the fallback included
	const customInputEl = ref<HTMLElement | null>(null)

	const visualProps = computed(() => ({
		modelValue: options.modelValue.value,
		textInput: customInputEl.value,
		// The toggle button comes from a custom `input` slot when provided, else from the default input
		toggleBtn: options.customToggleBtn.value ?? options.textInput.value?.toggleBtn ?? null,
		mode: options.props.mode,
		locale: options.locale.value,
		minYear: options.props.minYear,
		maxYear: options.props.maxYear,
		yearsOrder: options.props.yearsOrder,
		initialView: options.props.initialView,
		isDateDisabled: options.props.isDateDisabled,
		disabled: options.props.disabled,
		readonly: options.props.readonly,
	}))

	const visualSlots = computed(() => Object.fromEntries(
		Object.entries(slots).filter(([name]) => VISUAL_SLOT_NAMES.has(name) || isDaySlotName(name)),
	))

	return {
		visualProps,
		customInputEl,
		visualSlots,
	}
}
