import type { Meta, StoryObj } from '@storybook/vue3'
import UserMenuBtn from './UserMenuBtn.vue'

const meta = {
	title: 'Composants/Boutons/UserMenuBtn',
	component: UserMenuBtn,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue', 'label', 'icon', 'logoutIcon'] },
	},
	argTypes: {
		hideLogoutBtn: { control: 'boolean' },
		hideUserIcon: { control: 'boolean' },
		isMobileView: { control: 'boolean' },
		fullName: { control: 'text' },
		additionalInformation: { control: 'text' },
	},
} satisfies Meta<typeof UserMenuBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideLogOut = ref(false)
 const hideUserIcon = ref(false)
 const isMobileVersion = ref(false)
 const isVuetifyOptions = ref(false)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })
</script>`,
			},
		],
	},
	args: {
		menuItems: [
			{ text: 'Administration', value: 'Administration' },
			{ text: 'Profil', value: 'Profil' },
			{ text: 'Paramètres', value: 'Paramètres' },
		],
		modelValue: null,
		hideLogoutBtn: false,
		hideUserIcon: false,
		isMobileView: false,
		vuetifyOptions: undefined,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
              <UserMenuBtn v-bind="args"/>`,
		}
	},
}
export const HideLogoutButton: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideLogOut = ref(true)
 const hideUserIcon = ref(false)
 const isMobileVersion = ref(false)
 const isVuetifyOptions = ref(false)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		hideLogoutBtn: true,
	},
}

export const HideUserIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideLogOut = ref(false)
 const hideUserIcon = ref(true)
 const isMobileVersion = ref(false)
 const isVuetifyOptions = ref(false)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		hideUserIcon: true,
	},
}

export const MobileVersion: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideLogOut = ref(false)
 const hideUserIcon = ref(false)
 const isMobileVersion = ref(true)
 const isVuetifyOptions = ref(false)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		isMobileView: true,
	},
}

export const CustomFullName: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideLogOut = ref(false)
 const hideUserIcon = ref(false)
 const isMobileVersion = ref(false)
 const isVuetifyOptions = ref(false)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })

 const fullName = ref('John Doe')
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		fullName: 'John Doe',
	},
}

export const CustomAdditionalInformation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideLogOut = ref(false)
 const hideUserIcon = ref(false)
 const isMobileVersion = ref(false)
 const isVuetifyOptions = ref(false)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })

 const additionalInformation = ref('Custom Information')
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		additionalInformation: 'Custom Information',
	},
}

export const WithVuetifyOptions: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const handleLogout = () => {
  alert('User logged out')
 }

 const hideLogOut = ref(false)
 const hideUserIcon = ref(false)
 const isMobileVersion = ref(false)
 const isVuetifyOptions = ref(true)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		vuetifyOptions: {
			menu: { minWidth: '150px', maxWidth: '150px' },
			btn: { variant: 'outlined' },
			icon: { color: 'warning' },
			logoutListItem: { class: 'text-warning' },
			logoutIcon: { color: 'warning' },
		},
	},
}

export const LogoutEvent: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :hide-logout-btn="hideLogOut"
  :hide-user-icon="hideUserIcon"
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
  :vuetify-options="isVuetifyOptions ? vuetifyOptions : undefined"
  @logout="handleLogout"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import UserMenuBtn from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const handleLogout = () => {
  alert('Logout event triggered')
 }

 const hideLogOut = ref(false)
 const hideUserIcon = ref(false)
 const isMobileVersion = ref(false)
 const isVuetifyOptions = ref(false)

 const vuetifyOptions = ref({
  menu: { minWidth: '150px', maxWidth: '150px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })
</script>`,
			},
		],
	},
	args: {
		...Default.args,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				const handleLogout = () => {
					alert('Logout event triggered')
				}
				return { args, handleLogout }
			},
			template: `
              <UserMenuBtn v-bind="args" @logout="handleLogout"/>`,
		}
	},
}
