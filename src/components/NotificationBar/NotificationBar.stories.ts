import type { Meta, StoryFn } from '@storybook/vue3'
import NotificationBar from './NotificationBar.vue'
import { VBtn } from 'vuetify/components'
import { ref, toRefs } from 'vue'
import { useNotificationService } from '@/services/NotificationService'
import type { Notification } from '@/components/NotificationBar/types'

interface StoryArgs {
	closeBtnText: string
	type: Notification['type']
	bottom: boolean
	rounded: string | number | boolean
}

const meta: Meta<typeof NotificationBar> = {
	title: 'Composants/Feedback/NotificationBar',
	parameters: {
		layout: 'fullscreen',
	},
	component: NotificationBar,
	argTypes: {
		closeBtnText: {
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Fermer',
				},
			},
		},
		bottom: {
			control: 'boolean',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		rounded: {
			control: 'select',
			options: [0, 1, 2, 3, 4, 'xs', 'sm', true, 'lg', 'xl', 'pill', 'circle', 'shaped'],
			table: {
				type: {
					summary: '0, 1, 2, 3, 4, \'xs\', \'sm\', true, \'lg\', \'xl\', \'pill\', \'circle\', \'shaped\'',
				},
				defaultValue: {
					summary: '4',
				},
			},
		},
	},
}

export default meta

type Story = StoryFn<StoryArgs>

export const Default: Story = (args) => {
	return {
		components: { NotificationBar, VBtn },
		setup() {
			const { addNotification } = useNotificationService()
			const showNotification = ref(false)
			const { type, closeBtnText, bottom, rounded } = toRefs(args)

			const envoyerNotification = (message: string) => {
				const notification: Notification = {
					id: Date.now().toString(),
					message,
					type: type.value,
					timeout: -1,
				}
				addNotification(notification)
				showNotification.value = true
			}

			return {
				showNotification,
				type,
				closeBtnText,
				bottom,
				rounded,
				envoyerNotification,
			}
		},
		template: `
          <div class="d-flex flex-wrap align-center justify-center">
            <NotificationBar
                v-model="showNotification"
                :close-btn-text="closeBtnText"
                :bottom="bottom"
                :rounded="rounded"
                :type="type"
            >
              <template #default>This is a {{ type }} notification</template>
            </NotificationBar>
            <VBtn
                color="primary"
                @click="envoyerNotification('This is a ' + type + ' notification')"
                class="ma-6"
            >
              Afficher la notification
            </VBtn>
          </div>
        `,
	}
}

Default.args = {
	closeBtnText: 'Fermer',
	type: 'info',
	bottom: false,
}

Default.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					v-model="showNotification"
					:close-btn-text="closeBtnText"
					:bottom="bottom"
					:type="type"
				>
					<template #default>This is a {{ type }} notification</template>
				</NotificationBar>
				<VBtn
					color="primary"
					@click="envoyerNotification('This is a ' + type + ' notification')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar } from '@cnamts/synapse'
				import { ref } from 'vue'
				import { useNotificationService } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()
				const showNotification = ref(false)

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'info',
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
			</script>
			`,
		},
	],
}

export const Success: Story = Default.bind({})
Success.args = {
	...Default.args,
	type: 'success',
}
Success.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					v-model="showNotification"
					:close-btn-text="closeBtnText"
					:bottom="bottom"
					type="success"
				>
					<template #default>This is a success notification</template>
				</NotificationBar>
				<VBtn
					color="success"
					@click="envoyerNotification('This is a success notification')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar } from '@cnamts/synapse'
				import { ref } from 'vue'
				import { useNotificationService } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()
				const showNotification = ref(false)

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'success',
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
			</script>
			`,
		},
	],
}

export const Warning: Story = Default.bind({})
Warning.args = {
	...Default.args,
	type: 'warning',
}
Warning.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					v-model="showNotification"
					:close-btn-text="closeBtnText"
					:bottom="bottom"
					type="warning"
				>
					<template #default>This is a warning notification</template>
				</NotificationBar>
				<VBtn
					color="warning"
					@click="envoyerNotification('This is a warning notification')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar } from '@cnamts/synapse'
				import { ref } from 'vue'
				import { useNotificationService } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()
				const showNotification = ref(false)

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'warning',
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
			</script>
			`,
		},
	],
}

export const Error: Story = Default.bind({})
Error.args = {
	...Default.args,
	type: 'error',
}
Error.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					v-model="showNotification"
					:close-btn-text="closeBtnText"
					:bottom="bottom"
					type="error"
				>
					<template #default>This is an error notification</template>
				</NotificationBar>
				<VBtn
					color="error"
					@click="envoyerNotification('This is an error notification')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar } from '@cnamts/synapse'
				import { ref } from 'vue'
				import { useNotificationService } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()
				const showNotification = ref(false)

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'error',
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
			</script>
			`,
		},
	],
}

export const Bottom: Story = Default.bind({})
Bottom.args = {
	...Default.args,
	bottom: true,
}
Bottom.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					v-model="showNotification"
					:close-btn-text="closeBtnText"
					:bottom="true"
					:type="type"
				>
					<template #default>This is a bottom-positioned notification</template>
				</NotificationBar>
				<VBtn
					color="primary"
					@click="envoyerNotification('This is a bottom-positioned notification')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar } from '@cnamts/synapse'
				import { ref } from 'vue'
				import { useNotificationService } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()
				const showNotification = ref(false)

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'info',
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
			</script>
			`,
		},
	],
}

export const CustomCloseBtnText: Story = Default.bind({})
CustomCloseBtnText.args = {
	...Default.args,
	closeBtnText: 'Masquer',
}
CustomCloseBtnText.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					v-model="showNotification"
					close-btn-text="Masquer"
					:bottom="bottom"
					:rounded="pill"
					:type="type"
				>
					<template #default>This is a notification with custom close button text</template>
				</NotificationBar>
				<VBtn
					color="primary"
					@click="envoyerNotification('This is a notification with custom close button text')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar } from '@cnamts/synapse'
				import { ref } from 'vue'
				import { useNotificationService } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()
				const showNotification = ref(false)

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'info',
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
			</script>
			`,
		},
	],
}

export const Customization: Story = Default.bind({})
Customization.args = {
	...Default.args,
	rounded: 'pill',
	type: 'success',
}
Customization.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					v-model="showNotification"
					:close-btn-text="closeBtnText"
					:bottom="bottom"
					:rounded="pill"
					type="success"
				>
					<template #default>This is a success notification</template>
				</NotificationBar>
				<VBtn
					color="success"
					@click="envoyerNotification('This is a success notification')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar } from '@cnamts/synapse'
				import { ref } from 'vue'
				import { useNotificationService } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()
				const showNotification = ref(false)

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'success',
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
			</script>
			`,
		},
	],
}
