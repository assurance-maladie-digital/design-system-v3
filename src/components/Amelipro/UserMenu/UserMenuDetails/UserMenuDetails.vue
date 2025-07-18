<script setup lang="ts">
	import { type PropType } from 'vue'
	import type { UserMenuDetailsInfos } from './types'

	defineProps({
		uniqueId: {
			type: String,
			default: undefined,
		},
		userMenuDetailsInfos: {
			type: Object as PropType<UserMenuDetailsInfos>,
			default: undefined,
		},
	})
</script>

<template>
	<div
		v-if="userMenuDetailsInfos !== undefined && userMenuDetailsInfos !== null"
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="user-menu-details"
	>
		<p
			v-if="userMenuDetailsInfos.userName !== undefined && userMenuDetailsInfos.userName !== null"
			:id="uniqueId ? `${uniqueId}-user-name` : undefined"
			class="mb-0 text-body-2 font-weight-bold text-ap-grey-darken-1 user-menu-details__name"
		>
			{{ userMenuDetailsInfos.userName }}
		</p>
		<p
			v-if="userMenuDetailsInfos.profil !== undefined && userMenuDetailsInfos.profil !== null"
			:id="uniqueId ? `${uniqueId}-profile` : undefined"
			class="mb-0 text-body-2 font-weight-bold text-ap-grey-darken-1 user-menu-details__profil"
		>
			{{ userMenuDetailsInfos.profil }}
		</p>
		<p
			v-if="userMenuDetailsInfos.denomination !== undefined && userMenuDetailsInfos.denomination !== null"
			:id="uniqueId ? `${uniqueId}-denomination` : undefined"
			class="mb-0 text-body-2 font-weight-bold text-ap-grey-darken-1 user-menu-details__denomination"
		>
			{{ userMenuDetailsInfos.denomination }}
		</p>
		<p
			v-if="userMenuDetailsInfos.rpps !== undefined && userMenuDetailsInfos.rpps !== null"
			:id="uniqueId ? `${uniqueId}-rpps` : undefined"
			class="mb-0 text-body-2 text-ap-grey-darken-1 user-menu-details__rpps"
		>
			N° RPPS : {{ userMenuDetailsInfos.rpps }}
		</p>
		<p
			v-if="userMenuDetailsInfos.adeli !== undefined && userMenuDetailsInfos.adeli !== null"
			:id="uniqueId ? `${uniqueId}-adeli` : undefined"
			class="mb-0 text-body-2 text-ap-grey-darken-1 user-menu-details__adeli"
		>
			N° ADELI : {{ userMenuDetailsInfos.adeli }}
		</p>
		<p
			v-if="userMenuDetailsInfos.am !== undefined && userMenuDetailsInfos.am !== null"
			:id="uniqueId ? `${uniqueId}-am` : undefined"
			class="mb-0 text-body-2 text-ap-grey-darken-1 user-menu-details__am"
		>
			N° AM : {{ userMenuDetailsInfos.am }}
		</p>
		<p
			v-if="userMenuDetailsInfos.finess !== undefined && userMenuDetailsInfos.finess !== null"
			:id="uniqueId ? `${uniqueId}-finess` : undefined"
			class="mb-0 text-body-2 text-ap-grey-darken-1 user-menu-details__finess"
		>
			N° FINESS : {{ userMenuDetailsInfos.finess }}
		</p>
		<p
			v-if="userMenuDetailsInfos.email !== undefined && userMenuDetailsInfos.email !== null"
			:id="uniqueId ? `${uniqueId}-email` : undefined"
			class="mb-2 text-body-2 text-ap-grey-darken-1 user-menu-details__mail"
		>
			{{ userMenuDetailsInfos.email }}
		</p>

		<p
			v-if="userMenuDetailsInfos.adresse"
			:id="uniqueId ? `${uniqueId}-address-line-1` : undefined"
			class="mb-0"
		>
			{{ `${userMenuDetailsInfos.adresse && userMenuDetailsInfos.adresse.numero ? userMenuDetailsInfos.adresse.numero : ''}
				${userMenuDetailsInfos.adresse && userMenuDetailsInfos.adresse.complement ? userMenuDetailsInfos.adresse.complement : ''}
				${userMenuDetailsInfos.adresse && userMenuDetailsInfos.adresse.type ? userMenuDetailsInfos.adresse.type : ''}
				${userMenuDetailsInfos.adresse && userMenuDetailsInfos.adresse.nom ? userMenuDetailsInfos.adresse.nom :''}` }}
		</p>
		<p
			v-if="userMenuDetailsInfos.adresse"
			:id="uniqueId ? `${uniqueId}-address-line-2` : undefined"
			class="mb-0"
		>
			{{ userMenuDetailsInfos.adresse && userMenuDetailsInfos.adresse.codePostal ? userMenuDetailsInfos.adresse.codePostal : '' }}
			{{ userMenuDetailsInfos.adresse && userMenuDetailsInfos.adresse.commune ? userMenuDetailsInfos.adresse.commune : '' }}
		</p>
	</div>
</template>
