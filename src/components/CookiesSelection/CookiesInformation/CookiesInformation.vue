<script setup lang="ts">
	import { isRequired } from '@/utils/rules/isRequired'
	import type { VRadio, VRadioGroup } from 'vuetify/components'
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
	import { computed, ref, nextTick, onMounted } from 'vue'
	import CookiesTable from '../CookiesTable/CookiesTable.vue'
	import type { CookieTypes, Cookie } from '../types'
	import { locales } from './locales'

	defineProps<{
		type: CookieTypes
		tableItems: Cookie[]
	}>()

	const status = defineModel<boolean | undefined>()

	const parsedValue = computed(() => {
		if (status.value === true) {
			return 'accept'
		}
		if (status.value === false) {
			return 'reject'
		}
		return undefined
	})

	const open = ref(false)
	function toggleDetails(event: ToggleEvent): void {
		open.value = event.newState === 'open'
	}

	const rejectRadioRef = ref<VRadio | null>(null)
	const acceptRadioRef = ref<VRadio | null>(null)
	const radioGroupRef = ref<VRadioGroup | null>(null)

	// Fonction pour supprimer les attributs aria-disabled des composants radio
	const removeAriaDisabled = (radioRef: typeof rejectRadioRef) => {
		if (!radioRef.value?.$el) return

		// Chercher l'élément input dans le composant radio
		const radioElement = radioRef.value.$el

		// Supprimer l'attribut aria-disabled du composant lui-même
		radioElement.removeAttribute('aria-disabled')

		// Chercher et supprimer l'attribut aria-disabled des éléments enfants (input, label, etc.)
		const elements = radioElement.querySelectorAll('[aria-disabled]')
		elements.forEach(el => el.removeAttribute('aria-disabled'))
	}

	const removeAriaDescribedby = (radioGrpRef: typeof radioGroupRef) => {
		if (!radioGrpRef.value?.$el) return

		// Chercher l'élément input dans le composant radio
		const radioElement = radioGrpRef.value.$el

		// Supprimer l'attribut aria-disabled du composant lui-même
		radioElement.removeAttribute('aria-describedby')

		// Chercher et supprimer l'attribut aria-disabled des éléments enfants (input, label, etc.)
		const elements = radioElement.querySelectorAll('[aria-describedby]')
		elements.forEach(el => el.removeAttribute('aria-describedby'))
	}

	onMounted(() => {
		nextTick(() => {
			// Supprimer les attributs aria-disabled initiaux
			removeAriaDisabled(rejectRadioRef)
			removeAriaDisabled(acceptRadioRef)
			removeAriaDescribedby(radioGroupRef)

			// Observer les changements DOM pour supprimer aria-disabled s'il est ajouté dynamiquement
			const observer = new MutationObserver(() => {
				removeAriaDisabled(rejectRadioRef)
				removeAriaDisabled(acceptRadioRef)
				removeAriaDescribedby(radioGroupRef)
			})

			// Observer les deux boutons radio
			if (rejectRadioRef.value?.$el) {
				observer.observe(rejectRadioRef.value.$el, { attributes: true, subtree: true, childList: true })
			}
			if (acceptRadioRef.value?.$el) {
				observer.observe(acceptRadioRef.value.$el, { attributes: true, subtree: true, childList: true })
			}
			if (radioGroupRef.value?.$el) {
				observer.observe(radioGroupRef.value.$el, { attributes: true, subtree: true, childList: true })
			}
		})
	})
</script>

<template>
	<div class="vd-cookies-information">
		<h2 class="text-subtitle-1 font-weight-bold mb-2">
			{{ locales[type].title }}
		</h2>

		<p class="mb-4">
			{{ locales[type].description }}
		</p>

		<details @toggle="toggleDetails">
			<summary class="mb-1">
				{{ open ? locales.hideInformation : locales.showInformation }}

				<VIcon
					class="mr-2"
					data-test="chevron"
				>
					{{ open ? mdiChevronUp : mdiChevronDown }}
				</VIcon>
			</summary>

			<CookiesTable
				:items="tableItems"
				class="mb-2"
			>
				<template
					v-for="(_, slotName) in $slots"
					#[slotName]="slotProps"
				>
					<slot
						:name="slotName"
						v-bind="slotProps ?? {}"
					/>
				</template>
			</CookiesTable>
		</details>

		<div
			:id="`radio-group-${type}`"
			role="heading"
			aria-level="3"
			class="vd-cookies-information__heading"
		>
			{{ locales.fieldLabel(locales[type].title) }}
		</div>

		<VRadioGroup
			v-if="type !== 'essentials'"
			ref="radioGroupRef"
			:model-value="parsedValue"
			:rules="[isRequired]"
			data-test-id="radio-group"
			inline
			hide-details="auto"
			class="vd-cookies-information__radio-group"
			@update:model-value="status = $event === 'accept'"
		>
			<VSpacer />

			<VRadio
				ref="rejectRadioRef"
				:label="locales.reject"
				:value="'reject'"
				color="primary"
			/>

			<VRadio
				ref="acceptRadioRef"
				:label="locales.accept"
				:value="'accept'"
				class="mr-0"
				color="primary"
			/>
		</VRadioGroup>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

details > summary {
	cursor: pointer;
	list-style: none;
	user-select: none;

	&::marker,
	&::-webkit-details-marker {
		display: none;
	}
}

.vd-cookies-information__heading {
	text-align: end;
	opacity: var(--v-medium-emphasis-opacity);
}

.vd-cookies-information__radio-group {
	margin-top: 0;

	:deep(.v-input__details) {
		padding: 0;
	}

	:deep(.v-messages) {
		text-align: end;
	}

	:deep(.v-label) {
		justify-content: end;
	}
}
</style>
