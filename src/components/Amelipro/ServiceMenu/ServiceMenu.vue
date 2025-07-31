<script setup lang="ts">
	import { type PropType, computed, onMounted } from 'vue'
	import AmeliproDialog from '../AmeliproDialog/AmeliproDialog.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import type { Service } from './ServiceBtn/types'
	import ServiceMenuContent from './ServiceMenuContent/ServiceMenuContent.vue'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		icon: {
			type: String,
			default: 'applications',
		},
		messageToDisplay: {
			type: String,
			default: undefined,
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
		servicesContact: {
			type: Array as PropType<Service[]>,
			default: () => [],
		},
		servicesPatient: {
			type: Array as PropType<Service[]>,
			default: () => [],
		},
		servicesPs: {
			type: Array as PropType<Service[]>,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const modalId = `${props.uniqueId}-service-menu-title`
	const { mdAndUp } = useDisplay()

	// Computed property to safely handle the attach target
	const attachTarget = computed(() => {
		const targetId = `#${props.uniqueId}-service-menu`
		// Check if the element exists in the DOM
		if (typeof document !== 'undefined' && document.querySelector(targetId)) {
			return targetId
		}
		// Fallback to body or undefined to let Vuetify handle it
		return undefined
	})

	const emit = defineEmits(['update:model-value', 'change'])
	const emitChangeEvent = (): void => {
		visible.value = false
		emit('change', false)
	}

	const visible = computed({
		get: (): boolean => props.modelValue,
		set: (newValue: boolean): void => {
			emit('update:model-value', newValue)
		},
	})

	const closeMenu = (event: KeyboardEvent): void => {
		if (event.code === 'Escape' && visible.value) {
			visible.value = false
			document.getElementById(`${props.uniqueId}-service-menu-btn`)?.focus()
		}
	}

	const setMenuAttrs = (): void => {
		const element = document.querySelector(`#${props.uniqueId}-service-menu`)?.querySelector('.v-overlay__content')
		element?.setAttribute('aria-label', 'Liste des services')
		element?.setAttribute('aria-modal', 'true')
		element?.setAttribute('role', 'dialog')
	}

	onMounted(() => {
		setMenuAttrs()
		window.addEventListener('keyup', closeMenu)
	})

	// Rendre publique la méthode closeMenu permet à un bouton ou à un composant externe de fermer le menu
	defineExpose({ closeMenu })
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="service-menu"
	>
		<slot name="activator">
			<AmeliproIconBtn
				btn-label="Bouquet de services"
				class="service-menu__btn"
				:icon="icon"
				icon-bg-color="ap-blue-darken-1"
				icon-color="ap-white"
				icon-hover-bg-color="ap-blue-darken-2"
				icon-hover-color="ap-white"
				size="2rem"
				:unique-id="`${uniqueId}-service-menu-btn`"
				@click="visible = true"
			/>
		</slot>

		<div
			v-show="mdAndUp"
			:id="`${uniqueId}-service-menu`"
			class="service-menu__wrapper"
		>
			<VMenu
				v-model="visible"
				:attach="attachTarget"
				:close-on-content-click="false"
				eager
				max-height="520px"
				max-width="900px"
				min-width="900px"
				scroll-strategy="reposition"
				transition="slide-y-transition"
				@keyup.esc="visible = false"
			>
				<ServiceMenuContent
					:message-to-display="messageToDisplay"
					:services-contact="servicesContact"
					:services-patient="servicesPatient"
					:services-ps="servicesPs"
					:unique-id="`${uniqueId}-content-desktop`"
				/>
			</VMenu>
		</div>

		<AmeliproDialog
			v-if="!mdAndUp"
			v-model="visible"
			fullscreen
			:labelledby="modalId"
			main-content-max-height="100%"
			:unique-id="`${uniqueId}-service-menu-dialog`"
			width="100%"
			@change="emitChangeEvent"
		>
			<template #header>
				<h2
					:id="modalId"
					class="ma-0 text-h3"
				>
					Liste des services
				</h2>
			</template>

			<template #default>
				<ServiceMenuContent
					:message-to-display="messageToDisplay"
					:services-contact="servicesContact"
					:services-patient="servicesPatient"
					:services-ps="servicesPs"
					:unique-id="`${uniqueId}-content-mobile`"
				>
					<template
						v-if="$slots.message"
						#message
					>
						<slot name="message" />
					</template>
				</ServiceMenuContent>
			</template>
		</AmeliproDialog>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	:deep(.v-overlay__content) {
		top: 40px;
		left: -515px;
		transform-origin: left top 0;
		z-index: 8;
		border-radius: 4px;

		@media #{apTokens.$media-up-md} {
			left: -800px;
		}
	}

	.service-menu {
		position: relative;
	}
</style>
