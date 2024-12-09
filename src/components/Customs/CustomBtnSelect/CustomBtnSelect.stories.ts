import { mdiAccount } from '@mdi/js'
import type { Meta, StoryObj } from '@storybook/vue3'
import CustomBtnSelect from './CustomBtnSelect.vue'
import { VIcon, VListItem, VListItemTitle } from 'vuetify/components'

const meta: Meta<typeof CustomBtnSelect> = {
	title: 'Composants/Formulaires/CustomBtnSelect',
	component: CustomBtnSelect,
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
		options: { control: 'object' },
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect 
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
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect },
			setup() {
				return { args }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args" />
              </div>
            `,
		}
	},
}

export const MobileView: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect
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
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args" />
              </div>
            `,
		}
	},
}

export const WithSlotPrependIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect 
  	:primary-info="primaryInfo" 
  	:menu-items="items"
  >
    <template #prepend-icon>
      <VIcon :icon="mdiAccount" color="secondary" />
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args">
                  <template #prepend-icon>
                    <VIcon :icon="mdiAccount" color="secondary"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithSlotAppendIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect 
  	:primary-info="primaryInfo" 
  	:menu-items="items"
  >
    <template #append-icon>
      <VIcon :icon="mdiAccount" color="secondary" />
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args">
                  <template #append-icon>
                    <VIcon :icon="mdiAccount" color="secondary"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithIconOnly: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect 
  	:primary-info="primaryInfo" 
  	:menu-items="items"
  	icon-only
  >
    <template #prepend-icon>
      <VIcon :icon="mdiAccount" color="secondary" />
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args">
                  <template #prepend-icon>
                    <VIcon :icon="mdiAccount" color="secondary"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithLogoutItemSlot: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect
  	:primary-info="primaryInfo"
  	:menu-items="items"
  >
    <template #footer-list-item>
      <VListItem @click="args.logout">
        <VListItemTitle>Logout</VListItemTitle>
      </VListItem>
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args">
                  <template #footer-list-item>
                    <VListItem @click="args.logout">
                      <VListItemTitle>Logout</VListItemTitle>
                    </VListItem>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithCustomKeys: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect
    v-bind="args"
    text-key="customText"
    value-key="customValue"
    :menu-items="menuItems"
  >
    <template #prepend-icon>
      <VIcon :icon="mdiAccount" />
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect
                    v-bind="args"
                >
                  <template #prepend-icon>
                    <VIcon :icon="mdiAccount"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithMultipleSlots: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect
    :primary-info="primaryInfo"
  	:menu-items="menuItems"
  >
    <template #prepend-icon>
      <VIcon :icon="mdiAccount" />
    </template>
    <template #footer-list-item>
      <VListItem @click="args.logout">
        <VListItemTitle>Se déconnecter</VListItemTitle>
      </VListItem>
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon, VListItem, VListItemTitle },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args">
                  <template #prepend-icon>
                    <VIcon :icon="mdiAccount"/>
                  </template>
                  <template #footer-list-item>
                    <VListItem @click="args.logout">
                      <VListItemTitle>Se déconnecter</VListItemTitle>
                    </VListItem>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithCustomStyles: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect 
  	:primary-info="primaryInfo"
  	:menu-items="items"
  	>
    <template #prepend-icon>
      <VIcon 
      	:icon="mdiAccount" 
      	class="mr-2"
      	color="red" 
      />
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect v-bind="args">
                  <template #prepend-icon>
                    <VIcon 
						:icon="mdiAccount" 
						class="mr-2" 
						color="red"
					/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithStyledOptions: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <CustomBtnSelect
    :primary-info="primaryInfo"
  	:menu-items="menuItems"
    :options="options"
  >
    <template #prepend-icon>
      <VIcon :icon="mdiAccount" />
    </template>
  </CustomBtnSelect>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import CustomBtnSelect from './CustomBtnSelect.vue'

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
			components: { CustomBtnSelect, VIcon },
			setup() {
				return { args, mdiAccount }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <CustomBtnSelect
                    v-bind="args"
                >
                  <template #prepend-icon>
                    <VIcon :icon="mdiAccount"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}
