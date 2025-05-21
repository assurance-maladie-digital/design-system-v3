import { computed, type Ref } from 'vue'
import { type VTextarea } from 'vuetify/components/VTextarea'
import trimStartOnUpdate from './trimStartOnUpdate'
import { wrapText } from './wrapText'

type ActionsOptions = {
	trim: Ref<boolean>
	autoWrap: Ref<number | undefined>
	replaceTabs: Ref<number | undefined>
	normalize: Ref<boolean>
}

export default function useTextActions(textAreaRef: Ref<InstanceType<typeof VTextarea> | null>, options: ActionsOptions) {
	const changeActions = computed(() => {
		const actions: Array<(value: string) => string> = []
		if (options.trim.value) {
			const textArea: HTMLTextAreaElement | null | undefined = textAreaRef.value?.$el.querySelector('textarea')
			if (textArea) {
				actions.push(trimStartOnUpdate(textArea))
			}
		}
		if (typeof options.replaceTabs.value === 'number') {
			actions.push((value) => {
				const regex = /\t/gm
				const replace = ' '.repeat(options.replaceTabs.value as number)
				return value.replace(regex, replace)
			})
		}
		if (options.normalize.value) {
			actions.push(value => value.normalize('NFC'))
		}

		return actions
	})

	const blurActions = computed(() => {
		const actions: Array<(value: string) => string> = []
		if (options.trim.value) {
			actions.push(value => value.trim())
		}
		if (typeof options.autoWrap.value === 'number') {
			actions.push(wrapText(options.autoWrap.value as number))
		}

		return actions
	})

	return {
		changeActions,
		blurActions,
	}
}
