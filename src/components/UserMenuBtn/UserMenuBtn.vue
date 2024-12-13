<script lang="ts" setup>
	import { defineProps, defineEmits, withDefaults, computed } from 'vue'
	import SyBtnSelect from '../Customs/SyBtnSelect/SyBtnSelect.vue'
	import { useDisplay } from 'vuetify'
	import { mdiAccount, mdiLoginVariant } from '@mdi/js'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { defaultOptions } from './config'

	const props = withDefaults(defineProps<CustomizableOptions & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		modelValue: string | Record<string, any> | null | undefined
		menuItems?: { text: string, value: string }[]
		additionalInformation?: string
		fullName?: string
		hideLogoutBtn?: boolean
		logoutIcon?: string
		isMobileView?: boolean
		hideUserIcon?: boolean
	}>(), {
		modelValue: null,
		menuItems: () => [],
		additionalInformation: 'Information supplémentaire',
		fullName: 'Prénom Nom',
		hideLogoutBtn: false,
		logoutIcon: 'mdiLoginVariant',
		isMobileView: false,
		hideUserIcon: false,
	})

	const emit = defineEmits(['update:modelValue', 'logout'])
	const { smAndDown } = useDisplay()

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const options = useCustomizableOptions(defaultOptions, props) as any

	const isMobileView = computed(() => {
		return props.isMobileView || smAndDown.value
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	function updateModelValue(value: any) {
		emit('update:modelValue', value)
	}
</script>

<template>
	<SyBtnSelect
		:is-mobile-view="isMobileView"
		:icon-only="isMobileView"
		:menu-items="menuItems"
		:model-value="props.modelValue ?? undefined"
		:options="options"
		:primary-info="fullName"
		:secondary-info="additionalInformation"
		:hide-icon="hideUserIcon"
		class="user-menu-btn"
		@update:model-value="updateModelValue"
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

<style scoped>
@use '@/assets/tokens.scss';
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
