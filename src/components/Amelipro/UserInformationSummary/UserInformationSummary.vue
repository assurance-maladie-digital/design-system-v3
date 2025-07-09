<script setup lang="ts">
	import { type PropType } from 'vue'
	import type { UserInformationSummaryInfos } from './types'

	defineProps({
		uniqueId: {
			type: String,
			default: undefined,
		},
		userInformationSummaryInfos: {
			type: Object as PropType<UserInformationSummaryInfos>,
			default: undefined,
		},
	})
</script>

<template>
	<div
		v-if="userInformationSummaryInfos !== undefined && userInformationSummaryInfos !== null"
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="user-information-summary"
	>
		<p
			v-if="userInformationSummaryInfos.userName !== undefined && userInformationSummaryInfos.userName !== null"
			:id="uniqueId ? `${uniqueId}-user-name` : undefined"
			class="mb-0 text-body-2 font-weight-bold user-information-summary__name"
		>
			{{ userInformationSummaryInfos.userName }}
		</p>
		<p
			v-if="userInformationSummaryInfos.denomination !== undefined && userInformationSummaryInfos.denomination !== null"
			:id="uniqueId ? `${uniqueId}-denomination` : undefined"
			class="mb-0 text-body-2 user-information-summary__denomination"
		>
			{{ userInformationSummaryInfos.denomination }}
		</p>
		<p
			v-if="userInformationSummaryInfos.categorieSpecialite !== undefined && userInformationSummaryInfos.categorieSpecialite !== null"
			:id="uniqueId ? `${uniqueId}-specialty` : undefined"
			class="mb-0 text-body-2 user-information-summary__specialty"
		>
			{{ userInformationSummaryInfos.categorieSpecialite }}
		</p>
		<p
			v-if="userInformationSummaryInfos.profil !== undefined && userInformationSummaryInfos.profil !== null"
			:id="uniqueId ? `${uniqueId}-profil` : undefined"
			class="mb-0 text-body-2 user-information-summary__profil"
		>
			{{ userInformationSummaryInfos.profil }}
		</p>
		<p
			v-if="userInformationSummaryInfos.nomCabinet !== undefined && userInformationSummaryInfos.nomCabinet !== null"
			:id="uniqueId ? `${uniqueId}-office` : undefined"
			class="mb-0 text-body-2 user-information-summary__office"
		>
			{{ userInformationSummaryInfos.nomCabinet }}
		</p>
		<p
			v-if="userInformationSummaryInfos.adresseLigne1 !== undefined && userInformationSummaryInfos.adresseLigne1 !== null"
			:id="uniqueId ? `${uniqueId}-address-line-1` : undefined"
			class="mb-0 text-body-2 user-information-summary__address-1"
		>
			{{ userInformationSummaryInfos.adresseLigne1 }}
		</p>
		<p
			v-if="userInformationSummaryInfos.adresseLigne2 !== undefined && userInformationSummaryInfos.adresseLigne2 !== null"
			:id="uniqueId ? `${uniqueId}-address-line-2` : undefined"
			class="mb-0 text-body-2 user-information-summary__address-2"
		>
			{{ userInformationSummaryInfos.adresseLigne2 }}
		</p>
	</div>
</template>
