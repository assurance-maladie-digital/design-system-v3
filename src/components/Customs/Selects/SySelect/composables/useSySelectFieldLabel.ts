import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'

export interface UseSySelectFieldLabelOptions {
	label: Ref<string>
	required: Ref<boolean>
	displayAsterisk: Ref<boolean>
}

export interface UseSySelectFieldLabelResult {
	labelWithAsterisk: ComputedRef<string>
	labelWidth: Ref<number>
	labelRef: Ref<HTMLElement | null>
}

export function useSySelectFieldLabel(options: UseSySelectFieldLabelOptions): UseSySelectFieldLabelResult {
	const labelWidth = ref(0)
	const labelRef = ref<HTMLElement | null>(null)

	const labelWithAsterisk = computed(() => {
		return (options.required.value && options.displayAsterisk.value)
			? `${options.label.value} *`
			: options.label.value
	})

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}
	})

	return {
		labelWithAsterisk,
		labelWidth,
		labelRef,
	}
}
