import { onMounted, onBeforeUnmount } from 'vue'

export interface AccordionGroupCommunication {
	emitFocusChange: (itemId: string | null) => void
	handleFocusChange: (event: CustomEvent) => void
}

export default function useAccordionGroupCommunication(
	instanceId: string,
	groupId: string,
	onFocusChange: (itemId: string | null) => void,
): AccordionGroupCommunication {
	const ACCORDION_FOCUS_EVENT = 'accordion-focus-changed'

	const handleFocusChange = (event: CustomEvent) => {
		const { sourceInstanceId, groupId: eventGroupId } = event.detail

		// Ignore les événements provenant de cette instance
		if (sourceInstanceId === instanceId) return

		// Ignore les événements d'autres groupes
		if (eventGroupId !== groupId) return

		// Réinitialise le focus dans cette instance
		onFocusChange(null)
	}

	const emitFocusChange = (itemId: string | null) => {
		const event = new CustomEvent(ACCORDION_FOCUS_EVENT, {
			bubbles: true,
			detail: {
				sourceInstanceId: instanceId,
				groupId,
				itemId,
			},
		})
		window.dispatchEvent(event)
	}

	onMounted(() => {
		window.addEventListener(ACCORDION_FOCUS_EVENT, handleFocusChange as unknown as EventListener)
	})

	onBeforeUnmount(() => {
		window.removeEventListener(ACCORDION_FOCUS_EVENT, handleFocusChange as unknown as EventListener)
	})

	return {
		emitFocusChange,
		handleFocusChange,
	}
}
