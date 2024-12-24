<script setup lang="ts">
	import { required } from '@/utils/rules/required'
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
	import { computed, ref } from 'vue'
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

		<VRadioGroup
			v-if="type !== 'essentials'"
			:model-value="parsedValue"
			:rules="[required]"
			data-test-id="radio-group"
			inline
			:label="locales.fieldLabel(locales[type].title)"
			hide-details="auto"
			class="vd-cookies-information__radio-group"
			@update:model-value="status = $event === 'accept'"
		>
			<VSpacer />

			<VRadio
				:label="locales.reject"
				:value="'reject'"
				color="primary"
			/>

			<VRadio
				:label="locales.accept"
				:value="'accept'"
				class="mr-0"
				color="primary"
			/>
		</VRadioGroup>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss';

details > summary {
	cursor: pointer;
	list-style: none;
	user-select: none;

	&::marker,
	&::-webkit-details-marker {
		display: none;
	}
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
