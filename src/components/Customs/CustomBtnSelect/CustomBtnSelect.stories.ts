import { mdiAccount } from '@mdi/js'
import type { Meta, StoryObj } from '@storybook/vue3'
import CustomBtnSelect from './CustomBtnSelect.vue'
import { VIcon } from 'vuetify/components'

const meta: Meta<typeof CustomBtnSelect> = {
	title: 'Components/CustomBtnSelect',
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
	args: {
		primaryInfo: 'John Doe',
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
                  <template #icon>
                    <VIcon :icon="mdiAccount"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const WithIcon: Story = {
	args: {
		primaryInfo: 'John Doe',
		menuItems: ['Option 1', 'Option 2'],
		hideIcon: true,
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
                  <template #icon>
                    <VIcon :icon="mdiAccount"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}

export const MobileView: Story = {
	args: {
		primaryInfo: 'John Doe',
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
                <CustomBtnSelect v-bind="args">
                  <template #icon>
                    <VIcon :icon="mdiAccount"/>
                  </template>
                </CustomBtnSelect>
              </div>
            `,
		}
	},
}
