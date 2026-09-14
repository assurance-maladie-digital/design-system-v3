import { computed, ref, useSlots, type ComputedRef, type ComponentPublicInstance, type Ref, type Slot } from 'vue'
import type DatePickerLiteInput from './DatePickerLiteText/DatePickerLiteInput.vue'
import type { DatePickerLiteVisualProps } from './DatePickerLiteVisual/DatePickerLiteVisualProps'
import type { DatePickerLiteValue } from './types'

/** Slots of the root component forwarded to DatePickerLiteVisual */
const VISUAL_SLOT_NAMES = new Set(['menu', 'header', 'footer', 'day'])

/** Matches the per-day slots of the visual picker (`day-2026-09-14`) */
const isDaySlotName = (name: string): boolean => /^day-\d{4}-\d{2}-\d{2}$/.test(name)

interface UseDatePickerLiteVisualOptions {
	props: DatePickerLiteVisualProps & {
		disabled: boolean
		readonly: boolean
	}
	locale: Ref<string>
	/** Normalized model from `useDatePickerLiteTextField` */
	modelValue: ComputedRef<DatePickerLiteValue>
	/** Opening button of a custom `input` slot, from `useDatePickerLiteTextField` */
	customToggleBtn: Ref<HTMLButtonElement | null>
	/** Default input instance, fallback for the toggle button */
	textInput: Ref<ComponentPublicInstance<typeof DatePickerLiteInput> | null>
}

/**
 * Centralizes the wiring of DatePickerLiteVisual inside DatePickerLite:
 * - `visualProps`: props to `v-bind` on the visual picker (model, anchor, toggle
 *   button with its custom-slot fallback, and the visual picker props)
 * - `customInputEl`: anchor of the picker menu, attached to the `input` slot wrapper
 * - `visualSlots`: root slots forwarded to the visual picker (menu, header, footer, day, day-*)
 */
export function useDatePickerLiteVisual(options: UseDatePickerLiteVisualOptions): {
	/** Props to `v-bind` on the visual picker (model, anchor, toggle button, visual picker props) */
	visualProps: ComputedRef<{
		modelValue: DatePickerLiteValue
		textInput: HTMLElement | null
		toggleBtn: HTMLElement | null
		mode: DatePickerLiteVisualProps['mode']
		locale: string
	} & DatePickerLiteVisualProps & { disabled: boolean, readonly: boolean }>
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
