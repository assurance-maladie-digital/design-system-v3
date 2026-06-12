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
			options: ['transparent', 'primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning'],
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
    <div class="d-flex flex-column" style="min-height: 100vh; width: 100%;">
        <PageContainer style="flex: 1; width: 100%;">
            <template #prepend>
                <HeaderBar
                    service-title="Mon espace professionnel"
                    service-subtitle="Service pour les professionnels de santé"
                    :heading-level-title="1"
                >
                    <template #header-side>
                        <div class="d-flex align-center ga-3 text-primary">
                            <div class="text-body-2">
                                <div class="font-weight-medium">Dr. Jean Dupont</div>
                                <div>Cabinet médical</div>
                                <div>12 rue de la Paix, 75001 Paris</div>
                            </div>
                            <VDivider vertical class="mx-2" style="height: 48px;" />
                            <div class="text-body-2">
                                <div class="font-weight-medium">Contact</div>
                                <div>Tel: 01 23 45 67 89</div>
                                <div>contact@cabinet.fr</div>
                            </div>
                        </div>
                    </template>
                    <template #append>
                        <div class="bg-primary" style="width: 100%; min-height: 48px; display: flex; align-items: center; justify-content: center;">
                            <div class="text-white font-weight-medium">Mon Espace Personnel</div>
                        </div>
                    </template>
                </HeaderBar>
            </template>
            
            <h2 class="text-h5 mb-4">Bienvenue dans votre espace professionnel</h2>
            <p>
                Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                un texte en faux latin, qui permet de faire office de texte d'attente.
            </p>
            <p class="mt-4">
                L'avantage de le mettre en latin est que l'opérateur sait au premier coup d'œil que la page
                contenant ces lignes n'est pas valide, et surtout l'attention du client n'est pas dérangée
                par le contenu, il demeure concentré seulement sur l'aspect graphique. Ce texte a pour autre
                avantage d'utiliser des mots de longueur variable, essayant de simuler une occupation normale.
            </p>
            <p class="mt-4">
                La méthode simplifiée consiste à ne pas s'embarrasser de prétentions philosophiques,
                et à composer un texte en français présentable. On peut aussi utiliser des générateurs
                de texte automatiques pour obtenir du contenu aléatoire, mais il faut veiller à ce que
                le résultat soit cohérent et agréable à lire.
            </p>
            <p class="mt-4 mb-16">
                Ce contenu supplémentaire permet de bien visualiser l'espacement entre le contenu principal
                et le pied de page. Il est important de prévoir suffisamment d'espace pour que la mise en page
                reste harmonieuse et que le contenu soit facilement lisible. Le texte d'attente peut être remplacé
                par du texte réel dès que celui-ci est disponible.
            </p>
            
            <template #append>
                <FooterBar
                    version="3.0.0"
                    a11y-compliance="partiellement-conforme"
                />
            </template>
        </PageContainer>
    </div>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { PageContainer, HeaderBar, FooterBar } from '@cnamts/synapse'
    import { VDivider } from 'vuetify/components'
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
                <div class="d-flex flex-column" style="min-height: 100vh; width: 100%;">
                    <PageContainer :size="args.size" :spacing="args.spacing" :color="args.color" style="flex: 1; width: 100%;">
                        <template #prepend>
                            <HeaderBar
                                service-title="Mon espace professionnel"
                                service-subtitle="Service pour les professionnels de santé"
                                :heading-level-title="1"
                            >
                                <template #header-side>
                                    <div class="d-flex align-center ga-3 text-primary mr-4">
                                        <div class="text-body-2">
                                            <div class="font-weight-medium">Dr. Jean Dupont</div>
                                            <div>Cabinet médical</div>
                                            <div>12 rue de la Paix, 75001 Paris</div>
                                        </div>
                                        <VDivider vertical class="mx-2" style="height: 48px;" />
                                        <div class="text-body-2">
                                            <div class="font-weight-medium">Contact</div>
                                            <div>Tel: 01 23 45 67 89</div>
                                            <div>contact@cabinet.fr</div>
                                        </div>
                                    </div>
                                </template>
                                <template #append>
                                    <div class="bg-primary" style="width: 100%; min-height: 48px; display: flex; align-items: center; justify-content: center;">
                                        <div class="text-white font-weight-medium">Mon Espace Personnel</div>
                                    </div>
                                </template>
                            </HeaderBar>
                        </template>
                        
                        <h2 class="text-h5 mb-4">Bienvenue dans votre espace professionnel</h2>
                        <p>
                            Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                            à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                            faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                            un texte en faux latin, qui permet de faire office de texte d'attente.
                        </p>
                        <p class="mt-4">
                            L'avantage de le mettre en latin est que l'opérateur sait au premier coup d'œil que la page
                            contenant ces lignes n'est pas valide, et surtout l'attention du client n'est pas dérangée
                            par le contenu, il demeure concentré seulement sur l'aspect graphique. Ce texte a pour autre
                            avantage d'utiliser des mots de longueur variable, essayant de simuler une occupation normale.
                        </p>
                        <p class="mt-4">
                            La méthode simplifiée consiste à ne pas s'embarrasser de prétentions philosophiques,
                            et à composer un texte en français présentable. On peut aussi utiliser des générateurs
                            de texte automatiques pour obtenir du contenu aléatoire, mais il faut veiller à ce que
                            le résultat soit cohérent et agréable à lire.
                        </p>
                        <p class="mt-4 mb-16">
                            Ce contenu supplémentaire permet de bien visualiser l'espacement entre le contenu principal
                            et le pied de page. Il est important de prévoir suffisamment d'espace pour que la mise en page
                            reste harmonieuse et que le contenu soit facilement lisible. Le texte d'attente peut être remplacé
                            par du texte réel dès que celui-ci est disponible.
                        </p>
                        
                        <template #append>
                            <FooterBar
                                version="3.0.0"
                                a11y-compliance="partiellement-conforme"
                            />
                        </template>
                    </PageContainer>
                </div>
            `,
		}
	},
}
