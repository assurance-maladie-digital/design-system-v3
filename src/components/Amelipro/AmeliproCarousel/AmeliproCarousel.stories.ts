import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
import AmeliproCarousel from './AmeliproCarousel.vue'

const meta = {
	argTypes: {
		'`${uniqueId}-slot-item-${index}`': { description: 'Slots générés automatiquement pour chaque slide, l’id est celui du carrousel et index est la position de la slide' },
		'duration': { description: 'Durée de transition entre les slides du carrousel en secondes' },
		'infiniteRotation': { description: 'Booléen permettant de faire boucler les slides du carrousel' },
		'item': { description: 'Slots générés automatiquement pour chaque slide, afin de donner le même aspect à tous les items' },
		'items': {
			description: 'Tableau comprenant la liste des slides (si vous voulez utiliser les slots, créez un objet vide `{}` dans ce tableau pour chaque slide)',
			table: {
				type: {
					detail: `Array <{
	href?: string;
	imgSrc?: string;
	imgAlt?: string;
	to?: RouteLocationRaw;
}>`,
					summary: 'AmeliproCarouselListItem[]',
				},
			},
		},
		'labelNextBtn': { description: 'Libellé du bouton suivant, il est affiché au survol du bouton' },
		'labelPreviousBtn': { description: 'Libellé du bouton précédent, il est affiché au survol du bouton' },
		'title': { description: 'Titre du carrousel doit être pertinent par rapport au contenu' },
		'uniqueId': { description: 'Identifiant unique du carrousel' },
	},
	component: AmeliproCarousel,
	title: 'Composants/Amelipro/Mise en page/AmeliproCarousel',
} as Meta<typeof AmeliproCarousel>
export default meta

type Story = StoryObj<typeof AmeliproCarousel>

export const Default: Story = {
	args: {
		items: [{}, {}, {}],
		title: 'Titre du carrousel',
		uniqueId: 'amelipro-carousel-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCarousel
		:items="items"
		title="Titre du carrousel"
		unique-id="amelipro-carousel-id"
	>
		<template #amelipro-carousel-id-slot-item-0>
			<div class="d-flex">
				<AmeliproCard card-title="Slide 1">
					<template #default>
						<p class="mb-0">
							Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
							à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
							faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
							un texte en faux latin, le Lorem ipsum ou Lipsum.
						</p>
						<AmeliproBtn class="mt-2">
							bouton slide 1
						</AmeliproBtn>
					</template>
				</AmeliproCard>
			</div>
		</template>

		<template #amelipro-carousel-id-slot-item-1>
			<div class="d-flex">
				<AmeliproCard card-title="Slide 2">
					<template #default>
						<p class="mb-0">
							Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
							à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
							faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
							un texte en faux latin, le Lorem ipsum ou Lipsum.
						</p>
						<AmeliproBtn class="mt-2">
							bouton slide 2
						</AmeliproBtn>
					</template>
				</AmeliproCard>
			</div>
		</template>

		<template #amelipro-carousel-id-slot-item-2>
			<div class="d-flex">
				<AmeliproCard card-title="Slide 3">
					<template #default>
						<p class="mb-0">
							Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
							à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
							faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
							un texte en faux latin, le Lorem ipsum ou Lipsum.
						</p>
						<AmeliproBtn class="mt-2">
							bouton slide 3
						</AmeliproBtn>
					</template>
				</AmeliproCard>
			</div>
		</template>
	</AmeliproCarousel>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproBtn, AmeliproCard, AmeliproCarousel } from '@cnamts/synapse'

	const items = [
		{},
		{},
		{},
	]
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproBtn, AmeliproCard, AmeliproCarousel },
		setup() {
			return { args }
		},
		template: `
<AmeliproCarousel
	v-bind="args"
>
	<template #amelipro-carousel-id-slot-item-0>
		<div class="d-flex">
			<AmeliproCard card-title="Slide 1">
				<template #default>
					<p class="mb-0">
						Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
						à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
						faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
						un texte en faux latin, le Lorem ipsum ou Lipsum.
					</p>
					<AmeliproBtn class="mt-2">
						bouton slide 1
					</AmeliproBtn>
				</template>
			</AmeliproCard>
		</div>
	</template>

	<template #amelipro-carousel-id-slot-item-1>
		<div class="d-flex">
			<AmeliproCard card-title="Slide 2">
				<template #default>
					<p class="mb-0">
						Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
						à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
						faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
						un texte en faux latin, le Lorem ipsum ou Lipsum.
					</p>
					<AmeliproBtn class="mt-2">
						bouton slide 2
					</AmeliproBtn>
				</template>
			</AmeliproCard>
		</div>
	</template>

	<template #amelipro-carousel-id-slot-item-2>
		<div class="d-flex">
			<AmeliproCard card-title="Slide 3">
				<template #default>
					<p class="mb-0">
						Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée
						à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le
						faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise
						un texte en faux latin, le Lorem ipsum ou Lipsum.
					</p>
					<AmeliproBtn class="mt-2">
						bouton slide 3
					</AmeliproBtn>
				</template>
			</AmeliproCard>
		</div>
	</template>
</AmeliproCarousel>
		`,
	}),
}
