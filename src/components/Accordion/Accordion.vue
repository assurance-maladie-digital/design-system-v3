<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from '@/components/Accordion/config'
	import { mdiChevronRight } from '@mdi/js'

	type EventListener = (event: Event) => void

	interface ContentObject {
		title: string
		content: string
	}

	interface AccordionItem {
		id: string
		title: string
		content: string | ContentObject
		headingLevel?: number
	}

	interface Props extends CustomizableOptions {
		items: AccordionItem[]
		headingLevel?: number
		groupId?: string
		vuetifyOptions?: {
			accordion?: {
				backgroundColor?: string
				titleColor?: string
				hoverColor?: string
				focusColor?: string
				activeColor?: string
			}
		}
	}

	const props = withDefaults(defineProps<Props>(), {
		headingLevel: 3,
		groupId: 'default',
		vuetifyOptions: () => ({}),
	})

	const options = useCustomizableOptions(config, props)

	const instanceId = `accordion-${Math.random().toString(36).substring(2, 9)}`

	const ACCORDION_FOCUS_EVENT = 'accordion-focus-changed'

	const openItems = ref<string[]>([])
	const focusedItemId = ref<string | null>(null)

	const handleFocusChange = (event: CustomEvent) => {
		const { sourceInstanceId, groupId } = event.detail

		if (sourceInstanceId === instanceId) return

		if (groupId !== props.groupId) return

		focusedItemId.value = null
	}

	const emitFocusChange = (itemId: string | null) => {
		const event = new CustomEvent(ACCORDION_FOCUS_EVENT, {
			bubbles: true,
			detail: {
				sourceInstanceId: instanceId,
				groupId: props.groupId,
				itemId,
			},
		})
		window.dispatchEvent(event)
	}

	const toggleItem = (itemId: string) => {
		// Si cet élément est déjà focalisé, on le garde en mémoire
		const wasFocused = focusedItemId.value === itemId

		const index = openItems.value.indexOf(itemId)
		if (index === -1) {
			openItems.value.push(itemId)
			setFocus(itemId)
		}
		else {
			openItems.value.splice(index, 1)
			if (!wasFocused) {
				setFocus(itemId)
			}
			else {
				setFocus(null)
			}
		}
	}

	const isItemOpen = (itemId: string) => {
		return openItems.value.includes(itemId)
	}

	const isItemFocused = (itemId: string) => {
		return focusedItemId.value === itemId
	}

	// Méthode pour définir explicitement le focus sur un élément
	const setFocus = (itemId: string | null) => {
		if (focusedItemId.value === itemId) return

		focusedItemId.value = itemId
		emitFocusChange(itemId)
	}

	const getHeadingTag = (item: AccordionItem) => {
		const level = item.headingLevel || props.headingLevel
		return `h${level}`
	}

	onMounted(() => {
		window.addEventListener(ACCORDION_FOCUS_EVENT, handleFocusChange as unknown as EventListener)
	})

	onBeforeUnmount(() => {
		window.removeEventListener(ACCORDION_FOCUS_EVENT, handleFocusChange as unknown as EventListener)
	})
</script>

<template>
	<div
		class="sy-accordion"
		:style="{
			'--accordion-hover-color': `var(--v-theme-${options.accordion.hoverColor})`,
			'--accordion-focus-color': `var(--v-theme-${options.accordion.focusColor})`,
			'--accordion-active-color': `var(--v-theme-${options.accordion.activeColor})`
		}"
	>
		<div
			v-for="item in items"
			:key="item.id"
			class="sy-accordion-item"
			:class="`bg-${options.accordion.backgroundColor}`"
		>
			<div
				:id="`accordion-button-${item.id}`"
				role="button"
				:aria-expanded="isItemOpen(item.id)"
				:aria-controls="`accordion-content-${item.id}`"
				class="sy-accordion-button"
				:class="{ 'sy-accordion-button--focused': isItemFocused(item.id) }"
				tabindex="0"
				@click="toggleItem(item.id)"
				@keydown.space.prevent="toggleItem(item.id)"
				@keydown.enter.prevent="toggleItem(item.id)"
			>
				<component
					:is="getHeadingTag(item)"
					class="sy-accordion-heading"
				>
					<div
						class="sy-accordion-title"
						:class="isItemOpen(item.id) ? `text-${options.accordion.activeColor}` : `text-${options.accordion.titleColor}`"
					>
						<span
							class="sy-accordion-icon"
							:class="{ 'sy-accordion-icon--open': isItemOpen(item.id) }"
						>
							<v-icon :icon="mdiChevronRight" />
						</span>
						<span>{{ item.title }}</span>
					</div>
				</component>
			</div>

			<div
				:id="`accordion-content-${item.id}`"
				role="region"
				:aria-labelledby="`accordion-button-${item.id}`"
				class="sy-accordion-content"
				:class="{ 'sy-accordion-content--open': isItemOpen(item.id) }"
				:tabindex="isItemOpen(item.id) ? 0 : -1"
			>
				<div class="sy-accordion-content-inner">
					<template v-if="typeof item.content === 'string'">
						<p class="sy-accordion-content-text">
							{{ item.content }}
						</p>
					</template>
					<template v-else>
						<div class="sy-accordion-content-item">
							<div class="sy-accordion-content-line">
								<strong>
									{{ item.content.title }}
								</strong>: {{ item.content.content }}
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.sy-accordion {
	width: 100%;
}

.sy-accordion-item {
	border: 1px solid #e0e0e0;
	border-radius: 4px;
	margin-bottom: 8px;
	overflow: hidden;
}

.sy-accordion-heading {
	margin: 0;
}

.sy-accordion-button {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 16px;
	border: none;
	text-align: left;
	cursor: pointer;
	font-weight: 500;
	transition: outline-color 0.3s ease;
	outline: 2px solid transparent;
	outline-offset: 2px;
	position: relative;
}

.sy-accordion-title {
	display: flex;
}

.sy-accordion-button:hover,
.sy-accordion-content--open + .sy-accordion-button,
.sy-accordion-item:has(.sy-accordion-content--open) .sy-accordion-button {
	background-color: rgba(var(--accordion-active-color), 0.15);

	.sy-accordion-title {
		/* La couleur sera appliquée via la classe text-{color} dans le template */
		color: rgb(var(--accordion-active-color));
	}
}

/* Style pour l'accordéon ouvert (focus programmatique) */
.sy-accordion-button--focused:not(:focus-visible) {
	background-color: rgba(var(--accordion-focus-color), 0.15);
	border: 3px solid rgb(var(--accordion-focus-color));
	z-index: 1;
}

/* Style pour l'état de focus lors de la navigation au clavier */
.sy-accordion-button:focus-visible {
	outline: none;
	position: relative;
	background-color: rgba(var(--accordion-focus-color), 0.15);
	border: 3px solid rgb(var(--accordion-focus-color));
	transition: background-color 0.2s ease;
}

.sy-accordion-content {
	max-height: 0;
	overflow: hidden;
	margin-top: 1px;
	transition: max-height 0.3s ease;
}

.sy-accordion-content--open {
	max-height: 500px;
}

.sy-accordion-content:focus-visible {
	outline: 2px solid rgb(var(--accordion-focus-color));
	border-top: 2px solid rgb(var(--accordion-focus-color));
	outline-offset: 2px;
	margin-top: 2px;
}

.sy-accordion-content-inner {
	padding: 16px;
}

.sy-accordion-content-text {
	margin: 0;
}

/* Style pour les éléments interactifs à l'intérieur du contenu */
.sy-accordion-content a:focus-visible,
.sy-accordion-content button:focus-visible,
.sy-accordion-content input:focus-visible,
.sy-accordion-content select:focus-visible,
.sy-accordion-content textarea:focus-visible {
	outline: 2px solid rgb(var(--accordion-focus-color));
	outline-offset: 2px;
	box-shadow: 0 0 0 2px rgba(var(--accordion-focus-color), 0.3);
}

.sy-accordion-content-item {
	margin: 0;
}

.sy-accordion-content-line {
	margin-bottom: 8px;
	line-height: 1.5;
}

/* Style pour l'icône de flèche */
.sy-accordion-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.3s ease;
}

/* Rotation de l'icône lorsque l'accordéon est ouvert */
.sy-accordion-icon--open {
	transform: rotate(90deg);
}
</style>
