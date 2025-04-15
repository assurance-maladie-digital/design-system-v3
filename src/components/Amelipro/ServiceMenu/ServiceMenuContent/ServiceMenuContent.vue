<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import AmeliproMessage from '../../AmeliproMessage/AmeliproMessage.vue'
	import type { IndexedObject } from '../../types'
	import type { Service } from '../ServiceBtn/types'
	import ServiceList from '../ServiceList/ServiceList.vue'
	import { useDisplay } from 'vuetify'

	defineProps({
		messageToDisplay: {
			type: String,
			default: undefined,
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

	const { smAndUp } = useDisplay()

	const listsStyle = computed<IndexedObject>(() => {
		const listsStyleRules: IndexedObject = {
			flexBasis: '50%',
			maxWidth: '50%',
			width: '50%',
		}

		if (!smAndUp.value) {
			listsStyleRules.width = '100%'
			listsStyleRules.maxWidth = '100%'
			listsStyleRules.flexBasis = '100%'
		}

		return listsStyleRules
	})

	// TODO : Pour améliorer l'accessibilité du menu de service, il faut que le focus fasse une boucle de tabulation entre le premier et le dernier élément focusable
	// le code ci-dessous permettait de gérer le focus vers le premier élément lorsqu'un bouton de retour à l'accueil existait, ce qui n'est plus le cas aujourd'hui, il faut donc trouver une nouvelle manière de faire
	// const menuLastFocussableId = (): string => {
	// 	const element = document.querySelector('#service-menu')?.querySelectorAll('button, a')
	// 	const elementId = element?.item(element.length - 1).getAttribute('id')

	// 	return elementId !== null && elementId !== undefined ? elementId : ''
	// }

	// const setFocus = (id : string): void => {
	// 	let element
	// 	element = document.querySelector('#service-menu-dialog-close-btn') as HTMLElement
	// 	if (!breakpointHelper.isDesktop() && element !== null && element !== undefined) {
	// 		element.focus()
	// 	}
	// 	if (id !== null && id !== undefined && id !== '') {
	// 		element = document.getElementById(id) as HTMLElement
	// 		element.focus()
	// 	}
	// }
</script>

<template>
	<nav
		:id="`${uniqueId}`"
		aria-label="Bouquet de services"
		class="service-menu__nav"
	>
		<div class="d-flex flex-column flex-md-row">
			<div
				:id="`${uniqueId}-service-menu-ps`"
				class="py-2 bg-ap-blue-lighten-3 service-menu__ps"
				:style="listsStyle"
			>
				<ServiceList
					:items="servicesPs"
					:unique-id="`${uniqueId}-ps-service-list`"
				/>
			</div>

			<div
				:id="`${uniqueId}-service-menu-patient`"
				class="py-2 bg-ap-white service-menu__patient"
				:style="listsStyle"
			>
				<div>
					<ServiceList
						v-if="servicesPatient.length > 0"
						:items="servicesPatient"
						service-patient
						:unique-id="`${uniqueId}-patient-service-list`"
					/>

					<AmeliproMessage
						v-if="messageToDisplay || $slots.message"
						class="mt-4"
						text
						:unique-id="`${uniqueId}-patient-message`"
					>
						<slot name="message">
							<p
								:id="`${uniqueId}-patient-message-text`"
								class="mb-0"
							>
								{{ messageToDisplay }}
							</p>
						</slot>
					</AmeliproMessage>
				</div>
			</div>

			<div
				v-if="servicesContact.length > 0"
				:id="`${uniqueId}-service-menu-contact`"
				class="py-2 bg-ap-white service-menu__contact"
				:style="listsStyle"
			>
				<ServiceList
					:items="servicesContact"
					service-contact
					:unique-id="`${uniqueId}-contact-service-list`"
				/>
			</div>
		</div>
	</nav>
</template>
