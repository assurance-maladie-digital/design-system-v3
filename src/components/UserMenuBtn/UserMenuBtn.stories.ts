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
  :menuItems="menuItems"
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
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
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
  :menuItems="menuItems"
  :hide-logout-btn="hideLogOut"
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
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		hideLogoutBtn: true,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
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
  :menuItems="menuItems"
  :hide-user-icon="hideUserIcon"
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

 const hideUserIcon = ref(true)
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		hideUserIcon: true,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
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
  :menuItems="menuItems"
  :is-mobile-view="isMobileVersion"
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

 const isMobileVersion = ref(true)
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		isMobileView: true,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
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
  :menuItems="menuItems"
  :fullName="fullName"
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

 const fullName = ref('John Doe')
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		fullName: 'John Doe',
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
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
  :menuItems="menuItems"
  :additionalInformation="additionalInformation"
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

 const additionalInformation = ref('Custom Information')
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		additionalInformation: 'Custom Information',
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
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
  :menuItems="menuItems"
  :vuetify-options="vuetifyOptions"
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

 const vuetifyOptions = ref({
  menu: { minWidth: '250px' },
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
			menu: { minWidth: '250px' },
			btn: { variant: 'outlined' },
			icon: { color: 'warning' },
			logoutListItem: { class: 'text-warning' },
			logoutIcon: { color: 'warning' },
		},
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
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
  :menuItems="menuItems"
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
<div class="pa-4">
	<UserMenuBtn v-bind="args" @logout="handleLogout"/>
</div>`,
		}
	},
}
