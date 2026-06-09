import type { Meta, StoryObj } from '@storybook/vue3'
import PageContainer from './PageContainer.vue'
import { VCard, VDivider } from 'vuetify/components'
import HeaderBar from '../HeaderBar/HeaderBar.vue'
import FooterBar from '../FooterBar/FooterBar.vue'

const meta = {
	title: 'Composants/Layout/PageContainer',
	component: PageContainer,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['spacingClass', 'containerSize'] },
	},
	argTypes: {
		size: {
			options: ['xl', 'lg', 'md', 'sm', 'xs'],
			control: { type: 'select' },
			default: undefined,
		},
		spacing: {
			options: ['xl', 'lg', 'md', 'sm', 'xs'],
			control: { type: 'select' },
			default: undefined,
		},
		color: {
			options: [
				'transparent',
				'primary',
				'secondary',
				'accent',
				'error',
				'info',
				'success',
				'warning',
			],
			control: { type: 'select' },
			default: 'transparent',
		},
		uniqueId: {
			control: { type: 'text' },
			default: undefined,
		},
		role: {
			options: ['main', 'region', 'navigation', 'contentinfo', 'banner'],
			control: { type: 'text' },
			default: undefined,
		},
	},
} as Meta<typeof PageContainer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer>
		Contenu de la page
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { PageContainer } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
                <PageContainer :size="args.size" :spacing="args.spacing" :color="args.color" :uniqueId="args.uniqueId">
					{{ args.default }}
                </PageContainer>
            `,
		}
	},
}

export const Size: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer size="sm">
		Contenu de la page
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { PageContainer } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
		size: 'sm',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
				<PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
					{{ args.default }}
				</PageContainer>
			`,
		}
	},
}

export const Color: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer color="primary">
		<div class="pa-8">
			Contenu de la page
		</div>
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { PageContainer } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
		color: 'primary',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
				<PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
					<div class="pa-8">
						{{ args.default }}
					</div>
				</PageContainer>
			`,
		}
	},
}

export const Card: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer>
		<VCard class="pa-8">
			Contenu de la page
		</VCard>
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { PageContainer } from '@cnamts/synapse'
	import { VCard } from 'vuetify/components'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
	},
	render: (args) => {
		return {
			components: { PageContainer, VCard },
			setup() {
				return { args }
			},
			template: `
				<PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
					<VCard class="pa-8">
						{{ args.default }}
					</VCard>
				</PageContainer>
			`,
		}
	},
}

export const WithAriaRole: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer
		role="region"
		unique-id="main-content"
		aria-labelledby="main-content-title"
	>
		<h2 id="main-content-title">Contenu principal</h2>
		Contenu de la page
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { PageContainer } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		role: 'region',
		uniqueId: 'main-content',
		ariaLabelledby: 'main-content-title',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
				<PageContainer :role="args.role" :unique-id="args.uniqueId" :aria-labelledby="args.ariaLabelledby">
					<h2 id="main-content-title" class="pa-4">Contenu principal</h2>
					<p class="pa-4">Contenu de la page</p>
				</PageContainer>
			`,
		}
	},
}

export const WithHeaderAndFooter: Story = {
	parameters: {
		layout: 'fullscreen',
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <div class="d-flex flex-column" style="min-height: 100vh;">
        <HeaderBar
            service-title="Mon espace professionnel"
            service-subtitle="Service pour les professionnels de santé"
            :heading-level-title="1"
        >
            <template #header-side>
                <div class="d-flex align-center ga-3 mx-4">
                    <div class="text-body-2">
                        <div class="font-weight-medium">Dr. Jean Dupont</div>
                        <div class="text--secondary">Cabinet médical</div>
                        <div class="text--secondary">12 rue de la Paix, 75001 Paris</div>
                    </div>
                    <v-divider vertical class="mx-2" style="height: 48px;" />
                    <div class="text-body-2">
                        <div class="font-weight-medium">Contact</div>
                        <div class="text--secondary">Tel: 01 23 45 67 89</div>
                        <div class="text--secondary">contact@cabinet.fr</div>
                    </div>
                </div>
            </template>
            <template #append>
                <div style="max-width: 1712px; margin: 0 auto; min-height: 48px; background-color: #0084B2; display: flex; align-items: center; justify-content: center;" class="text-white px-4">
                    <p>Mon Espace Personnel</p>
                </div>
            </template>
        </HeaderBar>
        
        <PageContainer>
            <h2 class="text-h5 mb-4">Contenu principal</h2>
            <p>
                Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                faux-texte dès qu'il est prêt ou que la mise en page est achevée.
            </p>
            <p class="mt-4">
                Généralement, on utilise un texte en faux latin (le Lorem ipsum ou Lipsum), qui permet donc
                de faire office de texte d'attente. L'avantage de le mettre en latin est que l'opérateur sait
                au premier coup d'œil que la page contenant ces lignes n'est pas valide, et surtout l'attention
                du client n'est pas dérangée par le contenu, il demeure concentré seulement sur l'aspect graphique.
            </p>
        </PageContainer>
        
        <FooterBar
            version="3.0.0"
            a11y-compliance="partiellement-conforme"
        >
            <p class="text--secondary mb-0">Contenu supplémentaire du footer.</p>
        </FooterBar>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { PageContainer, HeaderBar, FooterBar } from '@cnamts/synapse'
</script>
                `,
			},
		],
	},
	render: (args) => {
		return {
			components: { PageContainer, HeaderBar, FooterBar, VDivider },
			setup() {
				return { args }
			},
			template: `
                <div class="d-flex flex-column" style="min-height: 100vh;">
                    <HeaderBar
                        service-title="Mon espace professionnel"
                        service-subtitle="Service pour les professionnels de santé"
                        :heading-level-title="1"
                    >
                        <template #header-side>
                            <div class="d-flex align-center ga-3 mx-4">
                                <div class="text-body-2">
                                    <div class="font-weight-medium">Dr. Jean Dupont</div>
                                    <div class="text--secondary">Cabinet médical</div>
                                    <div class="text--secondary">12 rue de la Paix, 75001 Paris</div>
                                </div>
                                <VDivider vertical class="mx-2" style="height: 48px;" />
                                <div class="text-body-2">
                                    <div class="font-weight-medium">Contact</div>
                                    <div class="text--secondary">Tel: 01 23 45 67 89</div>
                                    <div class="text--secondary">contact@cabinet.fr</div>
                                </div>
                            </div>
                        </template>
                        <template #append>
                            <div style="max-width: 1712px; margin: 0 auto; min-height: 48px; background-color: #0084B2; display: flex; align-items: center; justify-content: center;" class="text-white px-4">
                                <div>Mon Espace Personnel</div>
                            </div>
                        </template>
                    </HeaderBar>
                    
                    <PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
                        <h2 class="text-h5 mb-4">Contenu principal</h2>
                        <p>
                            Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                            à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                            faux-texte dès qu'il est prêt ou que la mise en page est achevée.
                        </p>
                        <p class="mt-4">
                            Généralement, on utilise un texte en faux latin (le Lorem ipsum ou Lipsum), qui permet donc
                            de faire office de texte d'attente. L'avantage de le mettre en latin est que l'opérateur sait
                            au premier coup d'œil que la page contenant ces lignes n'est pas valide, et surtout l'attention
                            du client n'est pas dérangée par le contenu, il demeure concentré seulement sur l'aspect graphique.
                        </p>
                    </PageContainer>
                    
                    <FooterBar
            version="3.0.0"
            a11y-compliance="partiellement-conforme"
        >
            <p class="text--secondary mb-0">Contenu supplémentaire du footer.</p>
        </FooterBar>
                </div>
            `,
		}
	},
}
