import type { Meta, StoryObj } from '@storybook/vue3'
import ErrorPage from './ErrorPage.vue'

const meta: Meta = {
	title: 'Templates/ErrorPage',
	component: ErrorPage,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof ErrorPage>

export default meta

type Story = StoryObj<typeof ErrorPage>

export const Default: Story = {
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <div style="padding: 20px; background: rgb(231, 236, 245)">
                        <ErrorPage />
                    </div>
                </template>
                `,
			}, {
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ErrorPage } from '@cnamts/synapse'
                </script>
                `,
			},
		],
	},
}

export const WithLink: Story = {
	args: {
		...Default.args,
		btnHref: '/',
		btnText: 'Retour à l\'accueil',
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <div style="padding: 20px; background: rgb(231, 236, 245)">
                        <ErrorPage 
                            btn-href="/"
                            btn-text="Retour à l'accueil"
                        />
                    </div>
                </template>
                `,
			}, {
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ErrorPage } from '@cnamts/synapse'
                </script>
                `,
			},
		],
	},
}

export const CustomIllustration: Story = {
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <div style="padding: 20px; background: rgb(231, 236, 245)">
                        <ErrorPage>
                            <template #illustration>
                                <div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
                                    <span style="font-weight: 700; color: #0D419A;">Illustration</span>
                                </div>
                            </template>
                        </ErrorPage>
                    </div>
                </template>
                `,
			},
			{
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ErrorPage } from '@cnamts/synapse'
                </script>
                `,
			},
		],
	},
	render: () => ({
		components: { ErrorPage },
		template: `
            <ErrorPage>
                <template #illustration>
                    <div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
                        <span style="font-weight: 700; color: #0D419A;">Illustration</span>
                    </div>
                </template>
            </ErrorPage>
        `,
	}),
}

export const SlotAction: Story = {
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <div style="padding: 20px; background: rgb(231, 236, 245)">
                        <ErrorPage :hide-btn="true">
                            <template #action>
                                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <VBtn href="/" color="colorPrimary">Retour à l'accueil</VBtn>
                                    <VBtn variant="outlined" color="colorPrimary">Déconnexion</VBtn>
                                </div>
                            </template>
                        </ErrorPage>
                    </div>
                </template>
                `,
			},
			{
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ErrorPage } from '@cnamts/synapse'
                </script>
                `,
			},
		],
	},
	render: () => ({
		components: { ErrorPage },
		template: `
            <ErrorPage :hide-btn="true">
                <template #action>
                    <div style="display: flex; gap: 8px; margin-top: 16px;">
                        <VBtn href="/" color="colorPrimary">Retour à l'accueil</VBtn>
                        <VBtn variant="outlined" color="colorPrimary">Déconnexion</VBtn>
                    </div>
                </template>
            </ErrorPage>
        `,
	}),
}

export const SlotAdditionalContent: Story = {
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <div style="padding: 20px; background: rgb(231, 236, 245)">
                        <ErrorPage>
                            <template #additional-content>
                                <p style="text-align: center; color: #555;">
                                    Si le problème persiste, veuillez contacter le support technique.
                                </p>
                            </template>
                        </ErrorPage>
                    </div>
                </template>
                `,
			},
			{
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ErrorPage } from '@cnamts/synapse'
                </script>
                `,
			},
		],
	},
	render: () => ({
		components: { ErrorPage },
		template: `
            <ErrorPage>
                <template #additional-content>
                    <p style="text-align: center; color: #555;">
                        Si le problème persiste, veuillez contacter le support technique.
                    </p>
                </template>
            </ErrorPage>
        `,
	}),
}

export const WithRole: Story = {
	args: {
		...Default.args,
		role: 'region',
		uniqueId: 'error-page-region',
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <div style="padding: 20px; background: rgb(231, 236, 245)">
                        <ErrorPage
                            role="region"
                            unique-id="error-page-region"
                        />
                    </div>
                </template>
                `,
			}, {
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ErrorPage } from '@cnamts/synapse'
                </script>
                `,
			},
		],
	},
}
