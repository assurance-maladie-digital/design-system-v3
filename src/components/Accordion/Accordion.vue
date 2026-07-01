<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from '@/components/Accordion/config'
	import { mdiChevronRight } from '@mdi/js'
	// Importation des composables
	import useAccordionState from './composables/useAccordionState'
	import useAccordionGroupCommunication from './composables/useAccordionGroupCommunication'
	import useAccordionKeyboardNavigation, { type AccordionItem as KeyboardNavigationItem } from './composables/useAccordionKeyboardNavigation'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	interface AccordionItem {
		id: string
		title: string
		content?: string | { title: string, content: string }
		headingLevel?: number
		disabled?: boolean
	}

	export interface AccordionProps extends CustomizableOptions {
		items: AccordionItem[]
		headingLevel?: number
		groupId?: string
		iconPosition?: 'left' | 'right'
		compact?: boolean
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

	const props = withDefaults(defineProps<AccordionProps>(), {
		headingLevel: 3,
		groupId: 'default',
		iconPosition: 'left',
		compact: false,
		vuetifyOptions: () => ({}),
	})

	const openItems = defineModel<string[]>({ default: () => [] })

	const options = useCustomizableOptions(config, props)

	// Génération d'un ID unique pour cette instance d'accordéon
	const instanceId = `accordion-${Math.random().toString(36).substring(2, 9)}`

	// Utilisation du composable pour gérer l'état de l'accordéon
	const {
		toggleItem,
		isItemOpen,
		isItemFocused,
		setFocus,
	} = useAccordionState(openItems)

	// Utilisation du composable pour gérer la communication entre accordéons
	const { emitFocusChange } = useAccordionGroupCommunication(
		instanceId,
		props.groupId,
		itemId => setFocus(itemId),
	)

	// Utilisation du composable pour gérer la navigation clavier
	const { handleKeyNavigation } = useAccordionKeyboardNavigation(
		props.items as KeyboardNavigationItem[],
		(itemId) => {
			setFocus(itemId)
			emitFocusChange(itemId)
		},
	)

	// Fonction pour déterminer le niveau de titre à utiliser
	const getHeadingTag = (item: AccordionItem) => {
		const level = item.headingLevel || props.headingLevel
		return `h${level}`
	}
</script>

<template>
	<div
		class="sy-accordion"
		:class="{ 'sy-accordion--compact': compact }"
		:style="{
			'--accordion-hover-color': `var(--v-theme-${options.accordion.hoverColor})`,
			'--accordion-focus-color': `var(--v-theme-${options.accordion.focusColor})`,
			'--accordion-active-color': `var(--v-theme-${options.accordion.activeColor})`
		}"
	>
		<div
			v-for="(item, index) in items"
			:key="item.id"
			class="sy-accordion-item"
			:class="`bg-${options.accordion.backgroundColor}`"
		>
			<div
				:id="`accordion-button-${item.id}`"
				role="button"
				:aria-expanded="isItemOpen(item.id)"
				:aria-controls="`accordion-content-${item.id}`"
				:aria-disabled="item.disabled ? 'true' : 'false'"
				class="sy-accordion-button"
				:class="{
					'sy-accordion-button--focused': isItemFocused(item.id),
					'sy-accordion-button--disabled': item.disabled
				}"
				tabindex="0"
				@click="!item.disabled && toggleItem(item.id)"
				@keydown.space.prevent="!item.disabled && toggleItem(item.id)"
				@keydown.enter.prevent="!item.disabled && toggleItem(item.id)"
				@keydown.down.prevent="!item.disabled && handleKeyNavigation($event, item.id, index)"
				@keydown.up.prevent="!item.disabled && handleKeyNavigation($event, item.id, index)"
				@keydown.home.prevent="!item.disabled && handleKeyNavigation($event, item.id, index)"
				@keydown.end.prevent="!item.disabled && handleKeyNavigation($event, item.id, index)"
			>
				<component
					:is="getHeadingTag(item)"
					class="sy-accordion-heading"
				>
					<span
						class="sy-accordion-title"
						:class="[
							isItemOpen(item.id) ? `text-${options.accordion.activeColor}` : `text-${options.accordion.titleColor}`,
							{ 'sy-accordion-title--icon-right': iconPosition === 'right' }
						]"
					>
						<span
							v-if="iconPosition === 'left'"
							class="sy-accordion-icon"
							:class="{ 'sy-accordion-icon--open': isItemOpen(item.id) }"
						>
							<SyIcon
								:icon="mdiChevronRight"
								decorative
							/>
						</span>
						<slot
							name="title"
							:item="item"
							:index="index"
						>
							<span>{{ item.title }}</span>
						</slot>
						<span
							v-if="iconPosition === 'right'"
							class="sy-accordion-icon"
							:class="{ 'sy-accordion-icon--open': isItemOpen(item.id) }"
						>
							<SyIcon
								:icon="mdiChevronRight"
								decorative
							/>
						</span>
					</span>
					<span
						v-if="$slots['right-content']"
						class="sy-accordion-right-content"
					>
						<slot
							name="right-content"
							:item="item"
							:index="index"
						/>
					</span>
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
					<slot
						name="content"
						:item="item"
						:index="index"
						:is-open="isItemOpen(item.id)"
					>
						<template v-if="typeof item.content === 'string'">
							<p class="sy-accordion-content-text">
								{{ item.content }}
							</p>
						</template>
						<template v-else-if="typeof item.content === 'object' && item.content !== null && 'title' in item.content && 'content' in item.content">
							<div class="sy-accordion-content-item">
								<p class="sy-accordion-content-text">
									<strong>{{ item.content.title }}</strong>
								</p>
								<p class="sy-accordion-content-text">
									{{ item.content.content }}
								</p>
							</div>
						</template>
					</slot>
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

/* Mode compact : supprime l'espacement entre les éléments */
.sy-accordion--compact .sy-accordion-item {
    margin-bottom: 0;
    border-radius: 0;

    &:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    &:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    /* Évite les doubles bordures entre les éléments */
    & + .sy-accordion-item {
        border-top: none;
    }
}

.sy-accordion-heading {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
    align-items: center;
    gap: 8px;

    &.sy-accordion-title--icon-right {
        justify-content: space-between;
        width: 100%;
    }
}

.sy-accordion-right-content {
    display: flex;
    align-items: center;
    margin-left: 16px;
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
    line-height: 1.5;
}

/* Style pour l'icône de flèche */
.sy-accordion-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
    flex-shrink: 0;
}

/* Rotation de l'icône lorsque l'accordéon est ouvert */
.sy-accordion-icon--open {
    transform: rotate(90deg);
}

/* Style pour les éléments désactivés */
.sy-accordion-button--disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
