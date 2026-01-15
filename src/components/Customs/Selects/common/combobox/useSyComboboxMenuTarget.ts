import { computed, type Ref } from 'vue'

type UseSyComboboxMenuTargetOptions = {
	textInput: Ref<{ $el?: HTMLElement } | null>
}

export function useSyComboboxMenuTarget(options: UseSyComboboxMenuTargetOptions) {
	const menuTarget = computed<HTMLElement | undefined>(() => {
		const rootEl = options.textInput.value?.$el as HTMLElement | undefined
		if (!rootEl) return undefined
		return (rootEl.querySelector('.v-field') as HTMLElement | null) ?? rootEl
	})

	return { menuTarget }
}
