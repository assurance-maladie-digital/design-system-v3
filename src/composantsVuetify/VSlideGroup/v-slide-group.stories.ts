import type { Meta, StoryObj } from '@storybook/vue3'
import { VSlideGroup, VSlideGroupItem, VCard, VCardText, VBtn, VChip } from 'vuetify/components'
import { ref } from 'vue'

const meta: Meta<typeof VSlideGroup> = {
	title: 'Composants/Composants Vuetify/VSlideGroup',
	tags: ['!dev'],
	component: VSlideGroup,
	parameters: {
		docs: {
			source: {
				transform: (src: string) => {
					const templateMatch = src.match(/template:\s*`([\s\S]*?)`/)
					if (templateMatch && templateMatch[1]) {
						return templateMatch[1]
							.trim()
							.replace(/<VSlideGroup/g, '<v-slide-group')
							.replace(/<\/VSlideGroup>/g, '</v-slide-group>')
							.replace(/<VSlideGroupItem/g, '<v-slide-group-item')
							.replace(/<\/VSlideGroupItem>/g, '</v-slide-group-item>')
							.replace(/<VCard/g, '<v-card')
							.replace(/<\/VCard>/g, '</v-card>')
							.replace(/<VCardText/g, '<v-card-text')
							.replace(/<\/VCardText>/g, '</v-card-text>')
							.replace(/<VBtn/g, '<v-btn')
							.replace(/<\/VBtn>/g, '</v-btn>')
							.replace(/<VIcon/g, '<v-icon')
							.replace(/<\/VIcon>/g, '</v-icon>')
							.replace(/<VChip/g, '<v-chip')
							.replace(/<\/VChip>/g, '</v-chip>')
					}
					return src
				},
			},
		},
	},
	argTypes: {
		selectedClass: {
			control: { type: 'text' },
			description: 'Classe CSS appliquée aux éléments sélectionnés',
		},
		showArrows: {
			control: { type: 'boolean' },
			description: 'Affiche les flèches de navigation',
		},
		centerActive: {
			control: { type: 'boolean' },
			description: 'Centre l\'élément actif',
		},
		multiple: {
			control: { type: 'boolean' },
			description: 'Permet la sélection multiple',
		},
		mandatory: {
			control: { type: 'boolean' },
			description: 'Rend la sélection obligatoire',
		},
	},
}

export default meta

type Story = StoryObj<typeof VSlideGroup>

export const Default: Story = {
	render: args => ({
		components: { VSlideGroup, VSlideGroupItem, VCard, VCardText },
		setup() {
			return { args }
		},
		template: `
            <VSlideGroup v-bind="args">
                <VSlideGroupItem v-for="n in 15" :key="n">
                    <VCard
                        color="primary"
                        class="ma-2"
                        height="150"
                        width="150"
                        :ripple="false"
                    >
                        <VCardText class="d-flex align-center justify-center h-100 text-h4">
                            {{ n }}
                        </VCardText>
                    </VCard>
                </VSlideGroupItem>
            </VSlideGroup>
        `,
	}),
	args: {
		showArrows: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-slide-group :show-arrows="true">
        <v-slide-group-item v-for="n in 15" :key="n">
            <v-card
                color="primary"
                class="ma-2"
                height="150"
                width="150"
                :ripple="false"
            >
                <v-card-text class="d-flex align-center justify-center h-100 text-h4">
                    {{ n }}
                </v-card-text>
            </v-card>
        </v-slide-group-item>
    </v-slide-group>
</template>`,
			},
		},
	},
}

export const WithChips: Story = {
	render: args => ({
		components: { VSlideGroup, VSlideGroupItem, VChip },
		setup() {
			const tags = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8']
			return { args, tags }
		},
		template: `
            <VSlideGroup v-bind="args">
                <VSlideGroupItem v-for="(tag, index) in tags" :key="index" v-slot="{ isSelected, toggle }">
                    <VChip
                        color="primary"
                        :variant="isSelected ? 'flat' : 'outlined'"
                        class="ma-2"
                        :ripple="false"
                        @click="toggle"
                    >
                        {{ tag }}
                    </VChip>
                </VSlideGroupItem>
            </VSlideGroup>
        `,
	}),
	args: {
		showArrows: true,
		mandatory: false,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-slide-group :show-arrows="true">
        <v-slide-group-item v-for="(tag, index) in tags" :key="index" v-slot="{ isSelected, toggle }">
            <v-chip
                color="primary"
                :variant="isSelected ? 'flat' : 'outlined'"
                class="ma-2"
                :ripple="false"
                @click="toggle"
            >
                {{ tag }}
            </v-chip>
        </v-slide-group-item>
    </v-slide-group>
</template>

<script setup lang="ts">
const tags = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8']
</script>`,
			},
		},
	},
}

export const CenterActive: Story = {
	render: args => ({
		components: { VSlideGroup, VSlideGroupItem, VBtn },
		setup() {
			const model = ref(3)
			const items = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
			return { args, model, items }
		},
		template: `
            <VSlideGroup v-model="model" v-bind="args">
                <VSlideGroupItem v-for="(item, index) in items" :key="index" :value="index" v-slot="{ isSelected, toggle }">
                    <VBtn
                        color="primary"
                        :variant="isSelected ? 'flat' : 'outlined'"
                        class="ma-2"
                        :ripple="false"
                        @click="toggle"
                    >
                        {{ item }}
                    </VBtn>
                </VSlideGroupItem>
            </VSlideGroup>
            <div class="text-center mt-4">
                <p class="text-body-2">Jour sélectionné : {{ items[model] }}</p>
            </div>
        `,
	}),
	args: {
		showArrows: true,
		centerActive: true,
		mandatory: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-slide-group v-model="model" :show-arrows="true" :center-active="true" :mandatory="true">
        <v-slide-group-item v-for="(item, index) in items" :key="index" :value="index" v-slot="{ isSelected, toggle }">
            <v-btn
                color="primary"
                :variant="isSelected ? 'flat' : 'outlined'"
                class="ma-2"
                :ripple="false"
                @click="toggle"
            >
                {{ item }}
            </v-btn>
        </v-slide-group-item>
    </v-slide-group>
    <div class="text-center mt-4">
        <p class="text-body-2">Jour sélectionné : {{ items[model] }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref(3)
const items = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
</script>`,
			},
		},
	},
}

export const Misc: Story = {
	render: args => ({
		components: { VSlideGroup, VSlideGroupItem, VChip },
		setup() {
			const model = ref(0)
			const items = [
				{ text: 'Aperitifs', value: 'aperitifs' },
				{ text: 'Appetizers', value: 'appetizers' },
				{ text: 'Cocktails', value: 'cocktails' },
				{ text: 'Dinner', value: 'dinner' },
				{ text: 'Wines by the Bottle', value: 'wines_bottle' },
				{ text: 'Wines by the Glass', value: 'wines_glass' },
			]
			return { args, model, items }
		},
		template: `
            <VSlideGroup v-model="model" v-bind="args" selected-class="bg-primary">
                <VSlideGroupItem
                    v-for="(item, index) in items"
                    :key="item.value"
                    :value="index"
                    v-slot="{ isSelected, toggle }"
                >
                    <VChip
                        class="ma-2"
                        color="primary"
                        :variant="isSelected ? 'flat' : 'outlined'"
                        :ripple="false"
                        @click="toggle"
                    >
                        {{ item.text }}
                    </VChip>
                </VSlideGroupItem>
            </VSlideGroup>

            <div class="text-center mt-4">
                <p class="text-body-2 text-medium-emphasis">Selected: {{ items[model]?.text || 'None' }}</p>
            </div>
        `,
	}),
	args: {
		showArrows: true,
		centerActive: true,
		mandatory: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Exemple de menu de navigation avec sélection et affichage de la valeur sélectionnée.',
			},
			source: {
				code: `<template>
    <v-slide-group v-model="model" :show-arrows="true" :center-active="true" :mandatory="true" selected-class="bg-primary">
        <v-slide-group-item
            v-for="(item, index) in items"
            :key="item.value"
            :value="index"
            v-slot="{ isSelected, toggle }"
        >
            <v-chip
                class="ma-2"
                color="primary"
                :variant="isSelected ? 'flat' : 'outlined'"
                :ripple="false"
                @click="toggle"
            >
                {{ item.text }}
            </v-chip>
        </v-slide-group-item>
    </v-slide-group>

    <div class="text-center mt-4">
        <p class="text-body-2 text-medium-emphasis">Selected: {{ items[model]?.text || 'None' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref(0)
const items = [
    { text: 'Aperitifs', value: 'aperitifs' },
    { text: 'Appetizers', value: 'appetizers' },
    { text: 'Cocktails', value: 'cocktails' },
    { text: 'Dinner', value: 'dinner' },
    { text: 'Wines by the Bottle', value: 'wines_bottle' },
    { text: 'Wines by the Glass', value: 'wines_glass' },
]
</script>`,
			},
		},
	},
}

export const MultipleSelection: Story = {
	render: args => ({
		components: { VSlideGroup, VSlideGroupItem, VCard, VCardText },
		setup() {
			return { args }
		},
		template: `
            <VSlideGroup v-bind="args">
                <VSlideGroupItem v-for="n in 10" :key="n" v-slot="{ isSelected, toggle }">
                    <VCard
                        color="primary"
                        :variant="isSelected ? 'flat' : 'outlined'"
                        class="ma-2"
                        height="120"
                        width="120"
                        :ripple="false"
                        @click="toggle"
                    >
                        <VCardText class="d-flex align-center justify-center h-100 text-h5">
                            {{ n }}
                        </VCardText>
                    </VCard>
                </VSlideGroupItem>
            </VSlideGroup>
        `,
	}),
	args: {
		showArrows: true,
		multiple: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-slide-group :show-arrows="true" :multiple="true">
        <v-slide-group-item v-for="n in 10" :key="n" v-slot="{ isSelected, toggle }">
            <v-card
                color="primary"
                :variant="isSelected ? 'flat' : 'outlined'"
                class="ma-2"
                height="120"
                width="120"
                :ripple="false"
                @click="toggle"
            >
                <v-card-text class="d-flex align-center justify-center h-100 text-h5">
                    {{ n }}
                </v-card-text>
            </v-card>
        </v-slide-group-item>
    </v-slide-group>
</template>`,
			},
		},
	},
}

export const CustomCards: Story = {
	render: args => ({
		components: { VSlideGroup, VSlideGroupItem, VCard, VCardText },
		setup() {
			const categories = [
				{ title: 'Catégorie 1', color: 'primary' },
				{ title: 'Catégorie 2', color: 'secondary' },
				{ title: 'Catégorie 3', color: 'success' },
				{ title: 'Catégorie 4', color: 'info' },
				{ title: 'Catégorie 5', color: 'warning' },
				{ title: 'Catégorie 6', color: 'error' },
			]
			return { args, categories }
		},
		template: `
            <VSlideGroup v-bind="args">
                <VSlideGroupItem v-for="(category, index) in categories" :key="index" v-slot="{ isSelected, toggle }">
                    <VCard
                        :color="category.color"
                        :variant="isSelected ? 'flat' : 'outlined'"
                        :elevation="isSelected ? 4 : 0"
                        class="ma-2"
                        height="180"
                        width="180"
                        :ripple="false"
                        @click="toggle"
                    >
                        <VCardText class="d-flex align-center justify-center h-100 text-h6 text-center">
                            {{ category.title }}
                        </VCardText>
                    </VCard>
                </VSlideGroupItem>
            </VSlideGroup>
        `,
	}),
	args: {
		showArrows: true,
		mandatory: false,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-slide-group :show-arrows="true">
        <v-slide-group-item v-for="(category, index) in categories" :key="index" v-slot="{ isSelected, toggle }">
            <v-card
                :color="category.color"
                :variant="isSelected ? 'flat' : 'outlined'"
                :elevation="isSelected ? 4 : 0"
                class="ma-2"
                height="180"
                width="180"
                :ripple="false"
                @click="toggle"
            >
                <v-card-text class="d-flex align-center justify-center h-100 text-h6 text-center">
                    {{ category.title }}
                </v-card-text>
            </v-card>
        </v-slide-group-item>
    </v-slide-group>
</template>

<script setup lang="ts">
const categories = [
    { title: 'Catégorie 1', color: 'primary' },
    { title: 'Catégorie 2', color: 'secondary' },
    { title: 'Catégorie 3', color: 'success' },
    { title: 'Catégorie 4', color: 'info' },
    { title: 'Catégorie 5', color: 'warning' },
    { title: 'Catégorie 6', color: 'error' },
]
</script>`,
			},
		},
	},
}
