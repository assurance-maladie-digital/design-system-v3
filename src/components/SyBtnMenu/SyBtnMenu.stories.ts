import { mdiAccount } from '@mdi/js'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SyBtnMenu from './SyBtnMenu.vue'
import { VListItem, VListItemTitle } from 'vuetify/components'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

const meta: Meta<typeof SyBtnMenu> = {
	title: 'Composants/Navigation/SyBtnMenu',
	component: SyBtnMenu,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue', 'label', 'required', 'isOpen', 'formattedItems', 'selectedItem'] },
	},
	argTypes: {
		modelValue: { control: 'text' },
		menuItems: { control: 'object' },
		label: { control: 'text' },
		menuId: { control: 'text' },
		textKey: { control: 'text' },
		valueKey: { control: 'text' },
		primaryInfo: { control: 'text' },
		secondaryInfo: { control: 'text' },
		hideIcon: { control: 'boolean' },
		hideLogoutBtn: { control: 'boolean' },
		isMobileView: { control: 'boolean' },
		iconOnly: { control: 'boolean' },
		showIdentityInList: {
			control: 'boolean',
			description: 'Affiche `primaryInfo` / `secondaryInfo` en tête du menu déroulant lorsque le bouton est en mode icône seule (`icon-only`), l\'identité étant alors masquée dans l\'activateur.',
		},
		options: { control: 'object' },
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu 
  	:primary-info="primaryInfo" 
  	:menu-items="items" 
  />
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'

const primaryInfo = 'Mes options'
const items = [
		{ text: 'Administration', value: 'Administration', link: '/admin' },
		{ text: 'Profil', value: 'Profil', link: '/profile' },
		{ text: 'Paramètres', value: 'Paramètres', link: '/settings' },
	]
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Mes options',
		menuItems: [
			{ text: 'Administration', value: 'Administration', link: '/admin' },
			{ text: 'Profil', value: 'Profil', link: '/profile' },
			{ text: 'Paramètres', value: 'Paramètres', link: '/settings' },
		],
		modelValue: 'Administration',
	},
	render: (args) => {
		return {
			components: { SyBtnMenu },
			setup() {
				return { args }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args"/>
              </div>
            `,
		}
	},
}

export const MobileView: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu
   	:primary-info="primaryInfo" 
  	:menu-items="items" 
  	is-mobile-view
  />
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'

const primaryInfo = 'Mes options'
const items = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Mes options',
		menuItems: ['Option 1', 'Option 2'],
		isMobileView: true,
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args"/>
              </div>
            `,
		}
	},
}

export const WithSlotPrependIcon: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu 
  	:primary-info="primaryInfo" 
  	:menu-items="items"
  >
    <template #prepend-icon>
	<SyIcon :icon="mdiAccount" color="secondary" decorative />
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Jane Doe'
const items = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Jane Doe',
		menuItems: ['Option 1', 'Option 2'],
		options: {
			iconColor: 'secondary',
		},
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args">
                  <template #prepend-icon>
					<SyIcon :icon="mdiAccount" color="secondary" decorative/>
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithSlotAppendIcon: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu 
  	:primary-info="primaryInfo" 
  	:menu-items="items"
  >
    <template #append-icon>
	<SyIcon :icon="mdiAccount" color="secondary" decorative />
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Jane Doe'
const items = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Jane Doe',
		menuItems: ['Option 1', 'Option 2'],
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args">
                  <template #append-icon>
					<SyIcon :icon="mdiAccount" color="secondary" decorative />
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithIconOnly: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu 
  	:primary-info="primaryInfo" 
  	:menu-items="items"
  	icon-only
  >
    <template #prepend-icon>
	<SyIcon :icon="mdiAccount" color="secondary" decorative />
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Jane Doe'
const items = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Jane Doe',
		menuItems: ['Option 1', 'Option 2'],
		iconOnly: true,
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args">
                  <template #prepend-icon>
					<SyIcon :icon="mdiAccount" color="secondary" decorative />
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithIdentityInList: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu
  	:primary-info="primaryInfo"
  	:secondary-info="secondaryInfo"
  	:menu-items="items"
  	icon-only
  	show-identity-in-list
  >
    <template #prepend-icon>
	<SyIcon :icon="mdiAccount" color="secondary" decorative />
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Jane Doe'
const secondaryInfo = 'Informations complémentaires'
const items = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Jane Doe',
		secondaryInfo: 'Informations complémentaires',
		menuItems: ['Option 1', 'Option 2'],
		iconOnly: true,
		showIdentityInList: true,
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args">
                  <template #prepend-icon>
					<SyIcon :icon="mdiAccount" color="secondary" decorative />
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithLogoutItemSlot: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu
  	:primary-info="primaryInfo"
  	:menu-items="items"
  >
    <template #footer-list-item>
      <VListItem @click="console.log('logout')">
        <VListItemTitle>Logout</VListItemTitle>
      </VListItem>
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'

const primaryInfo = 'Mes options'
const items = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Mes options',
		menuItems: ['Option 1', 'Option 2'],
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args">
                  <template #footer-list-item>
                    <VListItem @click="console.log('logout')">
                      <VListItemTitle>Logout</VListItemTitle>
                    </VListItem>
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithCustomKeys: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu
    text-key="customText"
    value-key="customValue"
    :menu-items="menuItems"
  >
    <template #prepend-icon>
	<SyIcon :icon="mdiAccount" decorative />
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Information principale'
const menuItems = [
	{ customText: 'Choix 1', customValue: '1' },
	{ customText: 'Choix 2', customValue: '2' },
],
</script>
				`,
			},
		],
	},
	args: {
		menuItems: [
			{ customText: 'Choix 1', customValue: '1' },
			{ customText: 'Choix 2', customValue: '2' },
		],
		textKey: 'customText',
		valueKey: 'customValue',
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu
                    v-bind="args"
                >
                  <template #prepend-icon>
					<SyIcon :icon="mdiAccount" decorative />
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithMultipleSlots: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu
    :primary-info="primaryInfo"
  	:menu-items="menuItems"
  >
    <template #prepend-icon>
	<SyIcon :icon="mdiAccount" decorative />
    </template>
    <template #footer-list-item>
      <VListItem @click="console.log('logout')">
        <VListItemTitle>Se déconnecter</VListItemTitle>
      </VListItem>
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Information principale'
const menuItems = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		menuItems: ['Option 1', 'Option 2'],
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon, VListItem, VListItemTitle },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args">
                  <template #prepend-icon>
					<SyIcon :icon="mdiAccount" decorative />
                  </template>
                  <template #footer-list-item>
                    <VListItem @click="console.log('logout')">
                      <VListItemTitle>Se déconnecter</VListItemTitle>
                    </VListItem>
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithCustomStyles: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu 
  	:primary-info="primaryInfo"
  	:menu-items="items"
  	>
    <template #prepend-icon>
	<SyIcon 
      	:icon="mdiAccount" 
      	class="mr-2"
      	color="secondary"
		decorative
      />
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Jane Doe'
const items = ['Option 1', 'Option 2']
</script>
				`,
			},
		],
	},
	args: {
		primaryInfo: 'Jane Doe',
		menuItems: ['Option 1', 'Option 2'],
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu v-bind="args">
                  <template #prepend-icon>
					<SyIcon
                        :icon="mdiAccount"
                        class="mr-2"
                        color="secondary"
						decorative
                    />
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}

export const WithStyledOptions: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyBtnMenu
    :primary-info="primaryInfo"
  	:menu-items="menuItems"
    :options="options"
  >
    <template #prepend-icon>
	<SyIcon :icon="mdiAccount" decorative />
    </template>
  </SyBtnMenu>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { SyBtnMenu } from '@cnamts/synapse'
import { mdiAccount } from '@mdi/js'

const primaryInfo = 'Information principale'
const menuItems = ['Option 1', 'Option 2']
const options = {
	menu: { height: '200px' },
	btn: { variant: 'outlined', textColor: 'primary', color: 'primary' },
	list: { dense: true, textColor: 'primary' },
}
</script>
				`,
			},
		],
	},
	args: {
		menuItems: ['Option 1', 'Option 2'],
		options: {
			menu: { height: '200px' },
			btn: { variant: 'outlined', textColor: 'primary', color: 'primary' },
			list: { dense: true, textColor: 'primary' },
		},
	},
	render: (args) => {
		return {
			components: { SyBtnMenu, SyIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <SyBtnMenu
                    v-bind="args"
                >
                  <template #prepend-icon>
					<SyIcon :icon="mdiAccount" decorative />
                  </template>
                </SyBtnMenu>
              </div>
            `,
		}
	},
}
