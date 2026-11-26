<script lang="ts" setup>
	import { computed, useSlots } from 'vue'
	import type { RouteLocationRaw } from 'vue-router'
	import SyBtnMenu from '@/components/SyBtnMenu/SyBtnMenu.vue'
	import { useDisplay } from 'vuetify'
	import { mdiAccount, mdiLoginVariant } from '@mdi/js'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { defaultOptions } from './config'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	type MenuItem = { text: string, value: string, link?: string, to?: RouteLocationRaw, icon?: string }

	const props = withDefaults(defineProps<CustomizableOptions & {
		menuItems?: MenuItem[]
		additionalInformation?: string
		fullName?: string
		hideLogoutBtn?: boolean
		isMobileView?: boolean
		hideUserIcon?: boolean
		logoutText?: string
	}>(), {
		menuItems: () => [],
		additionalInformation: 'Information supplémentaire',
		fullName: 'Prénom Nom',
		hideLogoutBtn: false,
		isMobileView: false,
		hideUserIcon: false,
		logoutText: 'Se déconnecter',
	})

	const modelValue = defineModel<MenuItem | null>({
		default: null,
	})

	defineEmits(['logout'])

	const { smAndDown } = useDisplay()
	const slots = useSlots()

	const options = useCustomizableOptions(defaultOptions, props)

	const isMobileView = computed(() => {
		return props.isMobileView || smAndDown.value
	})

	// Seul `menu-header` remplace le bloc d'identité mobile. Le slot par défaut fournit
	// une option de menu à la place du bouton de déconnexion.
	const hasMenuHeader = computed(() => Boolean(slots['menu-header']))
</script>

<template>
	<SyBtnMenu
		v-model="modelValue"
		:hide-icon="hideUserIcon"
		:hide-logout-btn="hideLogoutBtn && !slots.default"
		:icon-only="isMobileView"
		:is-mobile-view="isMobileView"
		:menu-items="menuItems"
		:options="options"
		:primary-info="fullName"
		:secondary-info="additionalInformation"
		:show-identity-in-list="!hasMenuHeader"
		class="user-menu-btn"
	>
		<template #append-icon>
			<SyIcon
				v-if="!hideUserIcon"
				decorative
				:icon="mdiAccount"
				:size="isMobileView ? 'x-large' : 'default'"
				class="vd-user-icon mr-0 pa-2"
				v-bind="options['icon']"
			/>
		</template>
		<template #footer-list-item>
			<slot>
				<VListItem
					v-if="!hideLogoutBtn"
					class="logout"
					tag="li"
					role="menuitem"
					tabindex="0"
					v-bind="options['logoutListItem']"
					@click="$emit('logout')"
				>
					<div class="d-flex">
						<SyIcon
							:icon="mdiLoginVariant"
							class="mr-4"
							v-bind="options['logoutIcon']"
							decorative
						/>
						<VListItemTitle class="logout">
							{{ props.logoutText }}
						</VListItemTitle>
					</div>
				</VListItem>
			</slot>
		</template>
		<template
			v-if="slots['header-list-item']"
			#header-list-item
		>
			<slot name="header-list-item" />
		</template>
		<template
			v-if="slots['menu-header']"
			#menu-header
		>
			<slot name="menu-header" />
		</template>
	</SyBtnMenu>
</template>

<style scoped lang="scss">
.vd-user-icon {
	width: 40px;
	height: 40px;
	background: rgb(var(--v-theme-primary));
	color: rgb(var(--v-theme-on-primary));
	border-radius: 50%;

	svg,
	.v-icon__svg {
		width: 24px;
		height: 24px;
	}
}
</style>
