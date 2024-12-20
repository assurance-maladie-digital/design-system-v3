<script setup lang="ts">
	import { computed, ref } from 'vue'
	import type { VForm } from 'vuetify/components'
	import CookiesInformation from './CookiesInformation/CookiesInformation.vue'
	import { locales } from './locales'
	import type { CookieTypes, CookiesItems, Preferences } from './types'

	const props = defineProps<{
		items: CookiesItems
	}>()

	const emits = defineEmits<{
		submit: [preferences: Partial<Preferences>]
	}>()

	const form = ref<VForm | null>(null)

	const preferences = ref<Preferences>({
		essentials: undefined,
		functional: undefined,
		analytics: undefined,
	})

	const filteredPreferences = computed(() => {
		const filtered: Partial<Preferences> = {}

		Object.entries(preferences.value).forEach(([key, value]) => {
			if (key != 'essentials' && props.items[key as CookieTypes]) {
				filtered[key as CookieTypes] = value
			}
		})

		return filtered
	})

	function setGlobalPreferences(value: boolean): void {
		preferences.value['functional'] = value
		preferences.value['analytics'] = value
	}

	async function submitForm(): Promise<void> {
		const { valid } = await form.value!.validate()

		if (!valid) {
			return
		}

		emits('submit', filteredPreferences.value)
	}
</script>

<template>
	<VCard
		v-if="items"
		elevation="0"
		color="transparent"
		class="vd-cookies-card"
	>
		<VForm ref="form">
			<p class="mb-4">
				{{ locales.description }}
			</p>

			<p class="mb-4">
				{{ locales.cookieDefinition }}
			</p>

			<div class="d-flex flex-wrap justify-end mx-n2 mt-n2 mb-6">
				<VBtn
					data-test-id="reject-all"
					color="primary"
					variant="outlined"
					class="ma-2"
					@click="setGlobalPreferences(false)"
				>
					{{ locales.rejectAll }}
				</VBtn>

				<VBtn
					data-test-id="accept-all"
					color="primary"
					variant="outlined"
					class="ma-2"
					@click="setGlobalPreferences(true)"
				>
					{{ locales.acceptAll }}
				</VBtn>
			</div>

			<template
				v-for="(cookies, cookieType) in items"
				:key="cookieType"
			>
				<CookiesInformation
					v-if="cookies"
					v-model="preferences[cookieType]"
					:type="cookieType"
					:table-items="cookies"
					class="mb-6"
				>
					<template
						v-for="(_, slotName) in $slots"
						#[slotName]="slotProps"
					>
						<slot
							v-if="String(slotName).startsWith('cookie-description')"
							:name="slotName"
							v-bind="slotProps ?? {}"
						/>
					</template>
				</CookiesInformation>
			</template>

			<div class="d-flex mt-16">
				<VSpacer />

				<VBtn
					data-test-id="submit"
					color="primary"
					@click="submitForm"
				>
					{{ locales.saveBtn }}
				</VBtn>
			</div>
		</VForm>
	</VCard>
</template>
