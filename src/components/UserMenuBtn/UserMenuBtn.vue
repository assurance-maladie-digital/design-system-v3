<script lang="ts" setup>
	import { computed } from 'vue'
	import SyBtnSelect from '../Customs/SyBtnSelect/SyBtnSelect.vue'
	import { useDisplay } from 'vuetify'
	import { mdiAccount, mdiLoginVariant } from '@mdi/js'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { defaultOptions } from './config'

	type MenuItem = { text: string, value: string, link?: string }

	const props = withDefaults(defineProps<CustomizableOptions & {
		menuItems?: MenuItem[]
		additionalInformation?: string
		fullName?: string
		hideLogoutBtn?: boolean
		isMobileView?: boolean
		hideUserIcon?: boolean
	}>(), {
		menuItems: () => [],
		additionalInformation: 'Information supplémentaire',
		fullName: 'Prénom Nom',
		hideLogoutBtn: false,
		isMobileView: false,
		hideUserIcon: false,
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
	<SyBtnSelect
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
			<VIcon
				v-if="!hideUserIcon"
				:size="isMobileView ? 'x-large' : 'default'"
				class="vd-user-icon mr-0 pa-2"
				v-bind="options['icon']"
			>
				{{ mdiAccount }}
			</VIcon>
		</template>
		<template #footer-list-item>
			<VListItem
				v-if="!hideLogoutBtn"
				class="logout"
				v-bind="options['logoutListItem']"
				@click="$emit('logout')"
			>
				<div class="d-flex">
					<VIcon
						:icon="mdiLoginVariant"
						class="mr-4"
						v-bind="options['logoutIcon']"
					/>
					<VListItemTitle>
						Logout
					</VListItemTitle>
				</div>
			</VListItem>
		</template>
	</SyBtnSelect>
</template>

<style scoped lang="scss">
@use '@/assets/tokens';

.vd-user-icon {
	width: 40px;
	height: 40px;
	background: tokens.$grey-lighten-90;
	border-radius: 50%;

	svg,
	.v-icon__svg {
		width: 24px;
		height: 24px;
	}
}
</style>
