import type { Meta, StoryFn } from '@storybook/vue3'
import NotificationBar from './NotificationBar.vue'
import { VBtn } from 'vuetify/components'
import { ref, toRefs, watch } from 'vue'
import { useNotificationService } from '@/services/NotificationService'
import type { Notification } from '@/components/NotificationBar/types'

interface StoryArgs {
	closeBtnText: string
	type: Notification['type']
	bottom: boolean
	rounded: string
}

const meta: Meta<typeof NotificationBar> = {
	title: 'Components/NotificationBar',
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		closeBtnText: { control: 'text', type: 'string' },
		bottom: { control: 'boolean', type: 'boolean' },
		rounded: { control: 'text', type: 'string' },
	},
}

export default meta

type Story = StoryFn<StoryArgs>

const Template: Story = args => ({
	components: { NotificationBar, VBtn },
	setup() {
		const { addNotification } = useNotificationService()
		const showNotification = ref(false)
		const { closeBtnText, bottom, rounded } = toRefs(args)
		const typeRef = ref(args.type)

		watch(
			() => args,
			(newArgs) => {
				typeRef.value = newArgs.type
				closeBtnText.value = newArgs.closeBtnText
				bottom.value = newArgs.bottom
				rounded.value = newArgs.rounded
			},
			{ deep: true },
		)

		const envoyerNotification = (message: string) => {
			const notification: Notification = {
				id: Date.now().toString(),
				message,
				type: typeRef.value,
				timeout: -1,
			}
			addNotification(notification)
			showNotification.value = true
		}

		return {
			showNotification,
			typeRef,
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
			>
				<template #default>This is a {{ typeRef }} notification</template>
			</NotificationBar>
			<VBtn
				color="primary"
				@click="envoyerNotification('This is a ' + typeRef + ' notification')"
				class="ma-6"
			>
				Afficher la notification
			</VBtn>
		</div>
	`,
})

export const Success = Template.bind({})
Success.args = { type: 'success', closeBtnText: 'Fermer', bottom: false, rounded: 'lg' }
export const Info = Template.bind({})
Info.args = { type: 'info', closeBtnText: 'Fermer', bottom: false, rounded: 'lg' }
export const Warning = Template.bind({})
Warning.args = { type: 'warning', closeBtnText: 'Fermer', bottom: false, rounded: 'lg' }
export const Error = Template.bind({})
Error.args = { type: 'error', closeBtnText: 'Fermer', bottom: false, rounded: 'lg' }

export const WithAction: Story = args => ({
	components: { NotificationBar, VBtn },
	setup() {
		const { addNotification } = useNotificationService()
		const showNotification = ref(false)
		const { type: typeRef, closeBtnText } = toRefs(args)

		const envoyerNotification = (message: string) => {
			const notification: Notification = {
				id: Date.now().toString(),
				message,
				type: typeRef.value,
				timeout: -1,
			}
			addNotification(notification)
			showNotification.value = true
		}

		return {
			showNotification,
			typeRef,
			closeBtnText,
			envoyerNotification,
		}
	},
	template: `
    <div class="d-flex flex-wrap align-center justify-center">
      <NotificationBar
        v-model="showNotification"
        :close-btn-text="closeBtnText"
      >
        <template #default>This is a {{ typeRef }} notification</template>
        <template #action>
          <VBtn variant="outlined">Action</VBtn>
        </template>
      </NotificationBar>
      <VBtn
        color="primary"
        @click="envoyerNotification('This is a ' + typeRef + ' notification')"
        class="ma-6"
      >
        Afficher la notification
      </VBtn>
    </div>
  `,
})
WithAction.args = {
	type: 'info',
	closeBtnText: 'Fermer',
}

export const WithTimeout: Story = args => ({
	components: { NotificationBar, VBtn },
	setup() {
		const { addNotification } = useNotificationService()
		const showNotification = ref(false)

		// Ajouter une valeur par défaut si `args.type` n'est pas défini
		const typeRef = ref(args.type || 'info')
		const { closeBtnText } = toRefs(args)

		const envoyerNotification = (message: string) => {
			const notification: Notification = {
				id: Date.now().toString(),
				message,
				type: typeRef.value,
				timeout: 5000, // Timeout de 5 secondes
			}
			addNotification(notification)
			showNotification.value = true
		}

		return {
			showNotification,
			typeRef, // Utilisation de `typeRef`
			closeBtnText,
			envoyerNotification,
		}
	},
	template: `
		<div class="d-flex flex-wrap align-center justify-center">
			<NotificationBar
				v-model="showNotification"
				:close-btn-text="closeBtnText"
			>
				<template #default>This is a {{ typeRef }} notification</template>
			</NotificationBar>
			<VBtn
				color="primary"
				@click="envoyerNotification('This is a ' + typeRef + ' notification')"
				class="ma-6"
			>
				Afficher la notification
			</VBtn>
		</div>
	`,
})
WithTimeout.args = {
	type: 'info', // Valeur par défaut pour `type`
	closeBtnText: 'Fermer',
}

export const WithLongText: Story = args => ({
	components: { NotificationBar, VBtn },
	setup() {
		const { addNotification } = useNotificationService()
		const showNotification = ref(false)

		// Ajouter une valeur par défaut pour `type`
		const typeRef = ref(args.type || 'info')
		const { closeBtnText } = toRefs(args)

		const envoyerNotification = (message: string) => {
			const notification: Notification = {
				id: Date.now().toString(),
				message,
				type: typeRef.value,
				timeout: -1, // Notification persistante
			}
			addNotification(notification)
			showNotification.value = true
		}

		return {
			showNotification,
			typeRef, // Utilisation de `typeRef`
			closeBtnText,
			envoyerNotification,
		}
	},
	template: `
		<div class="d-flex flex-wrap align-center justify-center">
			<NotificationBar
				v-model="showNotification"
				:close-btn-text="closeBtnText"
			>
				<template #default>
					<div>
						<p>This is a {{ typeRef }} notification</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
					</div>
				</template>
			</NotificationBar>
			<VBtn
				color="primary"
				@click="envoyerNotification('This is a ' + typeRef + ' lorem ipsum dolor sit amet, consectetur adipiscing elit...')"
				class="ma-6"
			>
				Afficher la notification
			</VBtn>
		</div>
	`,
})
WithLongText.args = {
	type: 'info',
	closeBtnText: 'Fermer',
}

export const forMobile: Story = args => ({
	components: { NotificationBar, VBtn },
	setup() {
		const { addNotification } = useNotificationService()
		const showNotification = ref(false)

		const typeRef = ref(args.type || 'info')
		const { closeBtnText } = toRefs(args)

		const envoyerNotification = (message: string) => {
			const notification: Notification = {
				id: Date.now().toString(),
				message,
				type: typeRef.value,
				timeout: -1,
			}
			addNotification(notification)
			showNotification.value = true
		}

		return {
			showNotification,
			typeRef,
			closeBtnText,
			envoyerNotification,
		}
	},
	template: `
		<div class="d-flex flex-wrap align-center justify-center">
			<NotificationBar
				v-model="showNotification"
				:close-btn-text="closeBtnText"
			>
				<template #default>This is a {{ typeRef }} notification</template>
			</NotificationBar>
			<VBtn
				color="primary"
				@click="envoyerNotification('This is a ' + typeRef + ' notification ')"
				class="ma-6"
			>
				Afficher la notification
			</VBtn>
		</div>
	`,
})
forMobile.args = {
	type: 'info',
	closeBtnText: 'Fermer',
}
forMobile.parameters = {
	viewport: {
		defaultViewport: 'mobile2',
	},
}

export const forMobileWithLongText: Story = args => ({
	components: { NotificationBar, VBtn },
	setup() {
		const { addNotification } = useNotificationService()
		const showNotification = ref(false)

		const typeRef = ref(args.type || 'info')
		const { closeBtnText } = toRefs(args)

		const envoyerNotification = (message: string) => {
			const notification: Notification = {
				id: Date.now().toString(),
				message,
				type: typeRef.value,
				timeout: -1,
			}
			addNotification(notification)
			showNotification.value = true
		}

		return {
			showNotification,
			typeRef,
			closeBtnText,
			envoyerNotification,
		}
	},
	template: `
		<div class="d-flex flex-wrap align-center justify-center">
			<NotificationBar
				v-model="showNotification"
				:close-btn-text="closeBtnText"
			>
				<template #default>This is a {{ typeRef }} notification</template>
			</NotificationBar>
			<VBtn
				color="primary"
				@click="envoyerNotification('This is a ' + typeRef + ' lorem ipsum dolor sit amet, consectetur adipiscing elit...')"
				class="ma-6"
			>
				Afficher la notification
			</VBtn>
		</div>
	`,
})
forMobileWithLongText.args = {
	type: 'info',
	closeBtnText: 'Fermer',
}
forMobileWithLongText.parameters = {
	viewport: {
		defaultViewport: 'mobile2',
	},
}
