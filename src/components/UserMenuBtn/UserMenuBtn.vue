<script lang="ts" setup>
	import { computed } from 'vue'
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
		logoutText: 'Logout',
	})

	const modelValue = defineModel<MenuItem | null>({
		default: null,
	})

	defineEmits(['logout'])

	const { smAndDown } = useDisplay()

	const options = useCustomizableOptions(defaultOptions, props)

	const isMobileView = computed(() => {
		return props.isMobileView || smAndDown.value
	})
</script>

<template>
	<SyBtnMenu
		v-model="modelValue"
		:hide-icon="hideUserIcon"
		:icon-only="isMobileView"
		:is-mobile-view="isMobileView"
		:menu-items="menuItems"
		:options="options"
		:primary-info="fullName"
		:secondary-info="additionalInformation"
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
	</SyBtnMenu>
</template>

<style scoped lang="scss">

.vd-user-icon {
	width: 40px;
	height: 40px;
	background: rgb(var(--v-theme-grey-lighten90));
	border-radius: 50%;

	svg,
	.v-icon__svg {
		width: 24px;
		height: 24px;
	}
}
</style>
