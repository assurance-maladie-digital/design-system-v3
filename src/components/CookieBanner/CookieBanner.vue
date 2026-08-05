<script setup lang="ts">
	import type { CustomizableOptions } from '@/composables/useCustomizableOptions'
	import useCustomizableOptions from '@/composables/useCustomizableOptions'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiClose, mdiArrowULeftBottom } from '@mdi/js'
	import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
	import { useDisplay } from 'vuetify'
	import type { CookiesItems } from '../CookiesSelection/types'
	import { config } from './config'
	import { locales } from './locales'
	import CookiesSelection from '../CookiesSelection/CookiesSelection.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import SyIconButton from '../Customs/SyIconButton/SyIconButton.vue'

	const props = withDefaults(defineProps<CustomizableOptions & {
		items?: CookiesItems
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
		headingLevelInformation?: 1 | 2 | 3 | 4 | 5 | 6

	}>(), {
		items: undefined,
		headingLevel: 2,
		headingLevelInformation: 3,
	})

	const options = useCustomizableOptions(config, props)

	const emits = defineEmits(['reject', 'accept', 'customize', 'submit'])

	const active = defineModel({
		type: Boolean,
		default: true,
	})

	const showCookiesSelection = ref(false)
	const closeBtnRef = ref<HTMLElement | null>(null)
	const vsheetRef = ref<HTMLElement | null>(null)
	const bannerRef = ref<HTMLElement | null>(null)
	const focusableElements = ref<HTMLElement[]>([])

	const display = useDisplay()
	const btnWidth = computed(() => {
		return display.smAndDown.value ? '100%' : 'auto'
	})

	const itemKeys = computed(() => Object.keys(props.items ?? {}) as (keyof CookiesItems)[])

	type ConsentPayload = Partial<Record<keyof CookiesItems, boolean>>

	function buildConsentPayload(value: boolean): ConsentPayload {
		if (!props.items) {
			return {}
		}

		return itemKeys.value.reduce<ConsentPayload>((payload, key) => {
			payload[key] = value
			return payload
		}, {})
	}

	function reject(): void {
		active.value = false
		emits('reject', buildConsentPayload(false))
	}

	function accept(): void {
		active.value = false
		emits('accept', buildConsentPayload(true))
	}

	function customize(): void {
		if (props.items) {
			showCookiesSelection.value = true
		}
		emits('customize')
	}

	function personalizeCookies(e: ConsentPayload) {
		emits('submit', e)
		showCookiesSelection.value = false
		active.value = false
	}

	// Fonction pour mettre à jour la liste des éléments focusables dans le banner
	function updateFocusableElements(): void {
		if (!bannerRef.value) return

		// Sélecteur pour tous les éléments focusables
		const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

		// Récupérer tous les éléments focusables dans le banner
		const elements = bannerRef.value.querySelectorAll(selector)

		// Convertir NodeList en Array et filtrer les éléments visibles et non désactivés
		focusableElements.value = Array.from(elements)
			.filter((el) => {
				const element = el as HTMLElement
				return !element.hasAttribute('disabled')
					&& element.style.display !== 'none'
					&& element.style.visibility !== 'hidden'
			}) as HTMLElement[]
	}

	// Mettre le focus sur le bouton de fermeture lorsque le composant est monté
	onMounted(() => {
		if (active.value && !showCookiesSelection.value) {
			nextTick(() => {
				// Accéder à l'élément DOM réel via $el
				if (closeBtnRef.value && '$el' in closeBtnRef.value) {
					(closeBtnRef.value.$el as HTMLElement).focus()
				}

				// Initialiser la liste des éléments focusables
				updateFocusableElements()
			})
		}

		document.addEventListener('keydown', handleKeydown)
	})

	// Observer les changements de l'état actif pour mettre le focus sur le bouton de fermeture
	watch(active, (newValue) => {
		if (newValue && !showCookiesSelection.value) {
			nextTick(() => {
				// Accéder à l'élément DOM réel via $el
				if (closeBtnRef.value && '$el' in closeBtnRef.value) {
					(closeBtnRef.value.$el as HTMLElement).focus()
				}

				// Mettre à jour la liste des éléments focusables
				updateFocusableElements()
			})
		}
	})

	// Fonction pour gérer les touches clavier (Escape et Tab)
	function handleKeydown(event: KeyboardEvent): void {
		// Gestion de la touche Escape
		if (event.key === 'Escape') {
			if (showCookiesSelection.value) {
				showCookiesSelection.value = false
			}
			else {
				reject()
			}
		}

		// Gestion de la touche Tab pour créer une boucle de focus
		if (event.key === 'Tab') {
			// Mettre à jour la liste des éléments focusables
			updateFocusableElements()

			// S'il n'y a pas d'éléments focusables, on ne fait rien
			if (focusableElements.value.length === 0) return

			// Récupérer le premier et le dernier élément focusable
			const firstFocusableElement = focusableElements.value[0]
			const lastFocusableElement = focusableElements.value[focusableElements.value.length - 1]

			// Si Shift+Tab est pressé et que le focus est sur le premier élément, rediriger vers le dernier
			if (event.shiftKey && document.activeElement === firstFocusableElement && lastFocusableElement) {
				lastFocusableElement.focus()
				event.preventDefault()
			}
			// Si Tab est pressé et que le focus est sur le dernier élément, rediriger vers le premier
			else if (!event.shiftKey && document.activeElement === lastFocusableElement && firstFocusableElement) {
				firstFocusableElement.focus()
				event.preventDefault()
			}
		}
	}

	// Observer les changements dans le contenu du banner pour mettre à jour les éléments focusables
	watch(showCookiesSelection, () => {
		nextTick(() => {
			updateFocusableElements()
		})
	})

	// Nettoyer l'écouteur d'événement lorsque le composant est détruit
	onUnmounted(() => {
		document.removeEventListener('keydown', handleKeydown)
	})
</script>

<template>
	<Teleport
		v-if="active"
		to="body"
	>
		<VSheet
			ref="vsheetRef"
			v-bind="options.banner"
			class="vd-cookie-banner"
		>
			<div
				ref="bannerRef"
				class="vd-cookie-banner__inner"
				role="dialog"
				:aria-label="locales.label"
			>
				<div class="d-flex align-start flex-nowrap pa-0 mb-6">
					<SyHeading
						:class="headingLevel === 2 ? 'text-h5 font-weight-bold' : 'font-weight-bold'"
						:level="headingLevel"
					>
						{{ locales.title }}
					</SyHeading>

					<VSpacer v-bind="options.spacer" />

					<VBtn
						v-if="showCookiesSelection"
						v-bind="options.backBtn"
						:aria-label="locales.backBtn"
						@click="showCookiesSelection = false"
					>
						<SyIcon
							v-bind="options.icon"
							:icon="mdiArrowULeftBottom"
							label="Bouton de retour en arrière."
						/>
					</VBtn>
					<SyIconButton
						v-else
						class="vd-cookie-banner-close-btn"
						v-bind="options.closeBtn"
						:icon="mdiClose"
						:label="locales.closeBtn"
						@click-icon-button="reject"
					/>
				</div>
				<div class="vd-cookie-banner-content">
					<Transition name="height">
						<div v-if="showCookiesSelection && items">
							<CookiesSelection
								:items="items"
								:heading-level="headingLevelInformation"
								@submit="personalizeCookies"
							>
								<template
									v-for="(_, slotName) in $slots"
									#[slotName]="slotProps"
								>
									<slot
										:name="slotName"
										v-bind="slotProps || {}"
									/>
								</template>
							</CookiesSelection>
						</div>
						<div v-else>
							<slot>
								<p>
									{{ locales.description }}
								</p>
							</slot>

							<div
								class="vd-cookie-banner-action-ctn d-flex align-center flex-wrap max-width-none mt-6 ga-4"
							>
								<VSpacer v-bind="options.actionsSpacer" />

								<VBtn
									v-bind="options.customizeBtn"
									data-test-id="customize"
									:width="btnWidth"
									@click="customize"
								>
									{{ locales.customizeBtnText }}
								</VBtn>

								<VBtn
									v-bind="options.rejectBtn"
									data-test-id="reject"
									:width="btnWidth"
									@click="reject"
								>
									{{ locales.rejectBtnText }}
								</VBtn>

								<VBtn
									v-bind="options.acceptBtn"
									data-test-id="accept"
									:width="btnWidth"
									@click="accept"
								>
									{{ locales.acceptBtnText }}
								</VBtn>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</VSheet>
	</Teleport>
</template>

<style lang="scss" scoped>
:deep(.text-h5) {
	font-size: 1.5rem;
	font-weight: 400;
	line-height: 1.333;
	line-height: normal;
}

.vd-cookie-banner {
	position: fixed;
	left: 50%;
	bottom: 0;
	display: flex;
	transform: translateX(-50%);
	z-index: 20;
	max-height: calc(100dvh - 64px);
	width: calc(100% - 64px);
	max-width: 1200px;
	margin-bottom: 32px;
}

.vd-cookie-banner__inner {
	display: flex;
	flex-direction: column;
	width: 100%;
	background: transparent;
}

.vd-cookie-banner-content {
	overflow-y: auto;

	// `overflow-y: auto` fait aussi passer `overflow-x` en `auto` → ce conteneur rogne les deux
	// axes. Les boutons d'action sont à son bord : sans marge, leur ring de focus outset (offset
	// 3px + 2px) serait rogné en bas, et à gauche quand les boutons passent en pleine largeur
	// (mobile). On agrandit donc la boîte de débordement via un padding (bas + gauche) POUR laisser
	// la place au ring, et on compense par une marge négative afin de NE PAS décaler la mise en page
	// visible (la place récupérée est absorbée par le padding `pa-8` de la VSheet parente). Le 8px à
	// droite existait déjà pour la scrollbar et couvre le ring de ce côté.
	padding: 0 8px 6px 6px;
	margin-bottom: -6px;
	margin-left: -6px;
	background: transparent;

	div {
		background: transparent;
	}
}

.vd-cookie-banner-action-ctn .v-btn {
	flex: 1 1 auto;
}

.v-btn--icon {
	color: rgb(0 0 0 / 54%);
	position: absolute;
	right: 24px;
}

.height-enter-active,
.height-leave-active {
	box-sizing: border-box;
	transition: height 2s ease;
	interpolate-size: allow-keywords;
	overflow: hidden;
	background-color: white;
}

.height-enter-active {
	transition: height 0.5s ease;
}

.height-leave-active {
	transition: height 0.1s ease;
}

.height-enter-from,
.height-leave-to {
	height: 0;
}

.height-enter-to,
.height-leave-from {
	height: auto;
}
</style>
