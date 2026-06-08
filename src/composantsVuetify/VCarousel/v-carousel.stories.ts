import type { Meta, StoryObj } from '@storybook/vue3'
import { VCarousel, VCarouselItem, VCard, VCardTitle, VCardText, VBtn } from 'vuetify/components'

const meta: Meta<typeof VCarousel> = {
	title: 'Composants/Composants Vuetify/VCarousel',
	component: VCarousel,
	tags: ['!dev'],
	parameters: {
		docs: {
			source: {
				transform: (src: string) =>
					src
						.replace(/VCarousel/g, 'v-carousel')
						.replace(/VCarouselItem/g, 'v-carousel-item'),
			},
		},
	},
	argTypes: {
		cycle: {
			control: { type: 'boolean' },
			description: 'Active le défilement automatique',
			table: {
				defaultValue: { summary: 'false' },
			},
		},
		hideDelimiters: {
			control: { type: 'boolean' },
			description: 'Masque les indicateurs de pagination',
			table: {
				defaultValue: { summary: 'false' },
			},
		},
		hideDelimiterBackground: {
			control: { type: 'boolean' },
			description: 'Masque le fond des indicateurs',
			table: {
				defaultValue: { summary: 'false' },
			},
		},
		showArrows: {
			control: { type: 'select' },
			options: [true, false, 'hover'],
			description: 'Affiche les flèches de navigation',
			table: {
				defaultValue: { summary: 'true' },
			},
		},
		height: {
			control: { type: 'text' },
			description: 'Hauteur du carousel',
			table: {
				defaultValue: { summary: '500' },
			},
		},
		interval: {
			control: { type: 'number' },
			description: 'Intervalle de défilement automatique (ms)',
			table: {
				defaultValue: { summary: '6000' },
			},
		},
		continuous: {
			control: { type: 'boolean' },
			description: 'Continue le défilement en boucle',
			table: {
				defaultValue: { summary: 'true' },
			},
		},
		progress: {
			control: { type: 'select' },
			options: [false, 'primary', 'secondary', 'success', 'info', 'warning', 'error'],
			description: 'Affiche une barre de progression',
		},
	},
}

export default meta

type Story = StoryObj<typeof VCarousel>

export const Primary: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem },
		setup() {
			const colors = ['primary', 'secondary', 'success', 'info', 'warning']
			return { args, colors }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem
                    v-for="(color, i) in colors"
                    :key="i"
                    :color="color"
                >
                    <div class="d-flex fill-height justify-center align-center">
                        <div class="text-h2">Slide {{ i + 1 }}</div>
                    </div>
                </VCarouselItem>
            </VCarousel>
        `,
	}),
	args: {
		height: 400,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-carousel :height="400">
    <v-carousel-item
        v-for="(color, i) in colors"
        :key="i"
        :color="color"
    >
        <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2">Slide {{ i + 1 }}</div>
        </div>
    </v-carousel-item>
</v-carousel>`,
			},
		},
	},
}

export const WithCycle: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem },
		setup() {
			const slides = [
				{ title: 'Slide 1', color: 'primary' },
				{ title: 'Slide 2', color: 'secondary' },
				{ title: 'Slide 3', color: 'success' },
			]
			return { args, slides }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem
                    v-for="(slide, i) in slides"
                    :key="i"
                    :color="slide.color"
                >
                    <div class="d-flex fill-height justify-center align-center">
                        <div class="text-h2">{{ slide.title }}</div>
                    </div>
                </VCarouselItem>
            </VCarousel>
        `,
	}),
	args: {
		height: 400,
		cycle: true,
		interval: 3000,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-carousel :height="400" cycle :interval="3000">
    <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
        :color="slide.color"
    >
        <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2">{{ slide.title }}</div>
        </div>
    </v-carousel-item>
</v-carousel>`,
			},
		},
	},
}

export const HideDelimiters: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem },
		setup() {
			const colors = ['primary', 'secondary', 'success']
			return { args, colors }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem
                    v-for="(color, i) in colors"
                    :key="i"
                    :color="color"
                >
                    <div class="d-flex fill-height justify-center align-center">
                        <div class="text-h2">Slide {{ i + 1 }}</div>
                    </div>
                </VCarouselItem>
            </VCarousel>
        `,
	}),
	args: {
		height: 400,
		hideDelimiters: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-carousel :height="400" hide-delimiters>
    <v-carousel-item
        v-for="(color, i) in colors"
        :key="i"
        :color="color"
    >
        <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2">Slide {{ i + 1 }}</div>
        </div>
    </v-carousel-item>
</v-carousel>`,
			},
		},
	},
}

export const ShowArrowsOnHover: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem },
		setup() {
			const colors = ['primary', 'secondary', 'success', 'info']
			return { args, colors }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem
                    v-for="(color, i) in colors"
                    :key="i"
                    :color="color"
                >
                    <div class="d-flex fill-height justify-center align-center">
                        <div class="text-h2">Slide {{ i + 1 }}</div>
                    </div>
                </VCarouselItem>
            </VCarousel>
        `,
	}),
	args: {
		height: 400,
		showArrows: 'hover',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-carousel :height="400" show-arrows="hover">
    <v-carousel-item
        v-for="(color, i) in colors"
        :key="i"
        :color="color"
    >
        <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2">Slide {{ i + 1 }}</div>
        </div>
    </v-carousel-item>
</v-carousel>`,
			},
		},
	},
}

export const WithProgress: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem },
		setup() {
			const colors = ['primary', 'secondary', 'success']
			return { args, colors }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem
                    v-for="(color, i) in colors"
                    :key="i"
                    :color="color"
                >
                    <div class="d-flex fill-height justify-center align-center">
                        <div class="text-h2">Slide {{ i + 1 }}</div>
                    </div>
                </VCarouselItem>
            </VCarousel>
        `,
	}),
	args: {
		height: 400,
		cycle: true,
		progress: 'primary',
		interval: 4000,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-carousel :height="400" cycle progress="primary" :interval="4000">
    <v-carousel-item
        v-for="(color, i) in colors"
        :key="i"
        :color="color"
    >
        <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2">Slide {{ i + 1 }}</div>
        </div>
    </v-carousel-item>
</v-carousel>`,
			},
		},
	},
}

export const WithImages: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem },
		setup() {
			const images = [
				'https://picsum.photos/800/400?random=1',
				'https://picsum.photos/800/400?random=2',
				'https://picsum.photos/800/400?random=3',
			]
			return { args, images }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem
                    v-for="(image, i) in images"
                    :key="i"
                    :src="image"
                    cover
                />
            </VCarousel>
        `,
	}),
	args: {
		height: 400,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-carousel :height="400">
    <v-carousel-item
        v-for="(image, i) in images"
        :key="i"
        :src="image"
        cover
    />
</v-carousel>`,
			},
		},
	},
}

export const CustomHeight: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem },
		setup() {
			const colors = ['primary', 'secondary', 'success']
			return { args, colors }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem
                    v-for="(color, i) in colors"
                    :key="i"
                    :color="color"
                >
                    <div class="d-flex fill-height justify-center align-center">
                        <div class="text-h2">Slide {{ i + 1 }}</div>
                    </div>
                </VCarouselItem>
            </VCarousel>
        `,
	}),
	args: {
		height: 600,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-carousel :height="600">
    <v-carousel-item
        v-for="(color, i) in colors"
        :key="i"
        :color="color"
    >
        <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2">Slide {{ i + 1 }}</div>
        </div>
    </v-carousel-item>
</v-carousel>`,
			},
		},
	},
}

export const WithCustomSlots: Story = {
	render: args => ({
		components: { VCarousel, VCarouselItem, VCard, VCardTitle, VCardText, VBtn },
		setup() {
			return { args }
		},
		template: `
            <VCarousel v-bind="args">
                <VCarouselItem>
                    <div class="d-flex fill-height justify-center align-center pa-4">
                        <VCard class="w-100" style="max-width: 600px;">
                            <VCardTitle>Slide 1</VCardTitle>
                            <VCardText>
                                <p class="mb-0">
                                    Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                                    à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                                    faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                                    un texte en faux latin, le Lorem ipsum ou Lipsum.
                                </p>
                                <VBtn color="primary" class="mt-2">
                                    Bouton slide 1
                                </VBtn>
                            </VCardText>
                        </VCard>
                    </div>
                </VCarouselItem>

                <VCarouselItem>
                    <div class="d-flex fill-height justify-center align-center pa-4">
                        <VCard class="w-100" style="max-width: 600px;">
                            <VCardTitle>Slide 2</VCardTitle>
                            <VCardText>
                                <p class="mb-0">
                                    Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                                    à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                                    faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                                    un texte en faux latin, le Lorem ipsum ou Lipsum.
                                </p>
                                <VBtn color="primary" class="mt-2">
                                    Bouton slide 2
                                </VBtn>
                            </VCardText>
                        </VCard>
                    </div>
                </VCarouselItem>

                <VCarouselItem>
                    <div class="d-flex fill-height justify-center align-center pa-4">
                        <VCard class="w-100" style="max-width: 600px;">
                            <VCardTitle>Slide 3</VCardTitle>
                            <VCardText>
                                <p class="mb-0">
                                    Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                                    à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                                    faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                                    un texte en faux latin, le Lorem ipsum ou Lipsum.
                                </p>
                                <VBtn color="primary" class="mt-2">
                                    Bouton slide 3
                                </VBtn>
                            </VCardText>
                        </VCard>
                    </div>
                </VCarouselItem>
            </VCarousel>
        `,
	}),
	args: {
		height: 500,
		showArrows: 'hover',
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-carousel :height="500" show-arrows="hover">
        <v-carousel-item>
            <div class="d-flex fill-height justify-center align-center pa-4">
                <v-card class="w-100" style="max-width: 600px;">
                    <v-card-title>Slide 1</v-card-title>
                    <v-card-text>
                        <p class="mb-0">
                            Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                            à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                            faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                            un texte en faux latin, le Lorem ipsum ou Lipsum.
                        </p>
                        <v-btn color="primary" class="mt-2">
                            Bouton slide 1
                        </v-btn>
                    </v-card-text>
                </v-card>
            </div>
        </v-carousel-item>

        <v-carousel-item>
            <div class="d-flex fill-height justify-center align-center pa-4">
                <v-card class="w-100" style="max-width: 600px;">
                    <v-card-title>Slide 2</v-card-title>
                    <v-card-text>
                        <p class="mb-0">
                            Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                            à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                            faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                            un texte en faux latin, le Lorem ipsum ou Lipsum.
                        </p>
                        <v-btn color="primary" class="mt-2">
                            Bouton slide 2
                        </v-btn>
                    </v-card-text>
                </v-card>
            </div>
        </v-carousel-item>

        <v-carousel-item>
            <div class="d-flex fill-height justify-center align-center pa-4">
                <v-card class="w-100" style="max-width: 600px;">
                    <v-card-title>Slide 3</v-card-title>
                    <v-card-text>
                        <p class="mb-0">
                            Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
                            à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
                            faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
                            un texte en faux latin, le Lorem ipsum ou Lipsum.
                        </p>
                        <v-btn color="primary" class="mt-2">
                            Bouton slide 3
                        </v-btn>
                    </v-card-text>
                </v-card>
            </div>
        </v-carousel-item>
    </v-carousel>
</template>

<script setup lang="ts">
import { VCarousel, VCarouselItem, VCard, VCardTitle, VCardText, VBtn } from 'vuetify/components'
</script>`,
			},
		},
	},
}
