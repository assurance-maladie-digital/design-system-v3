import type { Meta, StoryObj } from '@storybook/vue3'
import { VNavigationDrawer, VList, VListItem, VListItemTitle, VDivider, VBtn, VApp, VMain } from 'vuetify/components'
import { ref } from 'vue'

const meta = {
	title: 'Composants/Composants Vuetify/VNavigationDrawer',
	tags: ['!dev'],
	component: VNavigationDrawer,
	parameters: {
		docs: {
			description: {
				component: 'Le composant VNavigationDrawer est utilisé pour créer des tiroirs de navigation latéraux.',
			},
		},
	},
} satisfies Meta<typeof VNavigationDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: args => ({
		components: { VNavigationDrawer, VList, VListItem, VListItemTitle, VDivider, VBtn, VApp, VMain },
		setup() {
			const drawer = ref(true)
			return { args, drawer }
		},
		template: `
            <VApp style="height: 400px;">
                <VNavigationDrawer v-model="drawer" v-bind="args">
                    <VList>
                        <VListItem value="home">
                            <VListItemTitle>Accueil</VListItemTitle>
                        </VListItem>
                        <VListItem value="about">
                            <VListItemTitle>À propos</VListItemTitle>
                        </VListItem>
                        <VDivider />
                        <VListItem value="profile">
                            <VListItemTitle>Profil</VListItemTitle>
                        </VListItem>
                        <VListItem value="settings">
                            <VListItemTitle>Paramètres</VListItemTitle>
                        </VListItem>
                    </VList>
                </VNavigationDrawer>
                <VMain>
                    <div class="pa-4">
                        <VBtn @click="drawer = !drawer" color="primary">
                            Toggle Drawer
                        </VBtn>
                    </div>
                </VMain>
            </VApp>
        `,
	}),
	args: {
		width: 256,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" :width="256">
            <v-list>
                <v-list-item value="home">
                    <v-list-item-title>Accueil</v-list-item-title>
                </v-list-item>
                <v-list-item value="about">
                    <v-list-item-title>À propos</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item value="profile">
                    <v-list-item-title>Profil</v-list-item-title>
                </v-list-item>
                <v-list-item value="settings">
                    <v-list-item-title>Paramètres</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <div class="pa-4">
                <v-btn @click="drawer = !drawer" color="primary">
                    Toggle Drawer
                </v-btn>
            </div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(true)
</script>`,
			},
		},
	},
}

export const Permanent: Story = {
	render: args => ({
		components: { VNavigationDrawer, VList, VListItem, VListItemTitle, VApp, VMain },
		setup() {
			return { args }
		},
		template: `
            <VApp style="height: 400px;">
                <VNavigationDrawer v-bind="args" permanent>
                    <VList>
                        <VListItem value="dashboard">
                            <VListItemTitle>Tableau de bord</VListItemTitle>
                        </VListItem>
                        <VListItem value="messages">
                            <VListItemTitle>Messages</VListItemTitle>
                        </VListItem>
                        <VListItem value="notifications">
                            <VListItemTitle>Notifications</VListItemTitle>
                        </VListItem>
                    </VList>
                </VNavigationDrawer>
                <VMain>
                    <div class="pa-4">
                        <p>Contenu principal de l'application</p>
                    </div>
                </VMain>
            </VApp>
        `,
	}),
	args: {
		width: 256,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-app>
        <v-navigation-drawer permanent :width="256">
            <v-list>
                <v-list-item value="dashboard">
                    <v-list-item-title>Tableau de bord</v-list-item-title>
                </v-list-item>
                <v-list-item value="messages">
                    <v-list-item-title>Messages</v-list-item-title>
                </v-list-item>
                <v-list-item value="notifications">
                    <v-list-item-title>Notifications</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <div class="pa-4">
                <p>Contenu principal de l'application</p>
            </div>
        </v-main>
    </v-app>
</template>`,
			},
		},
	},
}

export const Temporary: Story = {
	render: args => ({
		components: { VNavigationDrawer, VList, VListItem, VListItemTitle, VBtn, VApp, VMain },
		setup() {
			const drawer = ref(false)
			return { args, drawer }
		},
		template: `
            <VApp style="height: 400px;">
                <VNavigationDrawer v-model="drawer" v-bind="args" temporary>
                    <VList>
                        <VListItem value="item1">
                            <VListItemTitle>Élément 1</VListItemTitle>
                        </VListItem>
                        <VListItem value="item2">
                            <VListItemTitle>Élément 2</VListItemTitle>
                        </VListItem>
                        <VListItem value="item3">
                            <VListItemTitle>Élément 3</VListItemTitle>
                        </VListItem>
                    </VList>
                </VNavigationDrawer>
                <VMain>
                    <div class="pa-4">
                        <VBtn @click="drawer = !drawer" color="primary">
                            Ouvrir le drawer
                        </VBtn>
                        <p class="mt-4">Le drawer temporaire se superpose au contenu et se ferme en cliquant en dehors.</p>
                    </div>
                </VMain>
            </VApp>
        `,
	}),
	args: {
		width: 256,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" temporary :width="256">
            <v-list>
                <v-list-item value="item1">
                    <v-list-item-title>Élément 1</v-list-item-title>
                </v-list-item>
                <v-list-item value="item2">
                    <v-list-item-title>Élément 2</v-list-item-title>
                </v-list-item>
                <v-list-item value="item3">
                    <v-list-item-title>Élément 3</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <div class="pa-4">
                <v-btn @click="drawer = !drawer" color="primary">
                    Ouvrir le drawer
                </v-btn>
            </div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)
</script>`,
			},
		},
	},
}

export const WithCustomContent: Story = {
	render: args => ({
		components: { VNavigationDrawer, VList, VListItem, VListItemTitle, VDivider, VApp, VMain },
		setup() {
			return { args }
		},
		template: `
            <VApp style="height: 400px;">
                <VNavigationDrawer v-bind="args" permanent>
                    <div class="pa-4">
                        <h3 class="text-h6 mb-2">Menu Principal</h3>
                        <p class="text-caption text-medium-emphasis">Sélectionnez une option</p>
                    </div>
                    <VDivider />
                    <VList>
                        <VListItem value="option1">
                            <VListItemTitle>Option 1</VListItemTitle>
                        </VListItem>
                        <VListItem value="option2">
                            <VListItemTitle>Option 2</VListItemTitle>
                        </VListItem>
                        <VListItem value="option3">
                            <VListItemTitle>Option 3</VListItemTitle>
                        </VListItem>
                    </VList>
                    <VDivider />
                </VNavigationDrawer>
                <VMain>
                    <div class="pa-4">
                        <p>Contenu principal avec menu personnalisé</p>
                    </div>
                </VMain>
            </VApp>
        `,
	}),
	args: {
		width: 256,
	},
	parameters: {
		docs: {
			source: {
				code: `<template>
    <v-app>
        <v-navigation-drawer permanent :width="256">
            <div class="pa-4">
                <h3 class="text-h6 mb-2">Menu Principal</h3>
                <p class="text-caption text-medium-emphasis">Sélectionnez une option</p>
            </div>
            <v-divider />
            <v-list>
                <v-list-item value="option1">
                    <v-list-item-title>Option 1</v-list-item-title>
                </v-list-item>
                <v-list-item value="option2">
                    <v-list-item-title>Option 2</v-list-item-title>
                </v-list-item>
                <v-list-item value="option3">
                    <v-list-item-title>Option 3</v-list-item-title>
                </v-list-item>
            </v-list>
            <v-divider />
        </v-navigation-drawer>
        <v-main>
            <div class="pa-4">
                <p>Contenu principal avec menu personnalisé</p>
            </div>
        </v-main>
    </v-app>
</template>`,
			},
		},
	},
}
