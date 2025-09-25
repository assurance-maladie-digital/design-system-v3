import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
import AmeliproDialog from './AmeliproDialog.vue'

const meta = {
	argTypes: {
		attach: { description: 'attache le contenu de la boite de dialogue et son overlay à l\'intérieur de v-app' },
		cancelBtnLabel: { description: 'Label du bouton annuler' },
		change: { description: 'Événement émis au click sur les boutons annuler et fermer' },
		confirm: { description: 'Événement émis au click sur le bouton valider' },
		default: { description: 'Contenu principal de la fenêtre' },
		eager: { description: 'Property héritée de Vuetify permettant de charger le contenu de la modale dans le DOM même lorsque la modale est fermée' },
		footer: { description: 'Contenu du footer de la fenêtre' },
		fullscreen: { description: 'Affiche la modale en plein écran' },
		header: { description: 'Titre de la fenêtre' },
		hiddenCancelBtn: { description: 'Masque le bouton Annuler du footer' },
		labelledby: { description: 'Id du titre de la modale' },
		mainContentMaxHeight: { description: 'Hauteur maximale du contenu principal' },
		mainContentMinHeight: { description: 'Hauteur minimale du contenu principal' },
		modelValue: { description: 'Valeur d’affichage de la fenêtre de dialogue' },
		noClickOutside: { description: 'Empêche la fermeture de la modale en cliquant à l’extérieur ou en appuyant sur echap mais la croix de fermeture reste présente' },
		noFooter: { description: 'Masque le footer par défaut' },
		persistent: { description: 'Retire la croix de fermeture' },
		title: { description: 'Titre par défaut' },
		uniqueId: { description: 'Identifiant unique de la modale' },
		validationBtnLabel: { description: 'Label du bouton valider' },
		width: { description: 'Largeur de la fenêtre de dialogue' },
	},
	component: AmeliproDialog,
	title: 'Composants/Amelipro/Boites de dialogue/AmeliproDialog',
} as Meta<typeof AmeliproDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		default: '[Slot: default]',
		modelValue: false,
		uniqueId: 'amelipro-dialog-unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center justify-center w-100">
		<AmeliproBtn
			unique-id="amelipro-dialog-unique-id-btn"
			@click="value = true"
		>
			Ouvrir la modale
		</AmeliproBtn>

		<AmeliproDialog
			v-model="value"
			labelledby="modal-title"
			unique-id="amelipro-dialog-unique-id"
		>
			<template #header>
				<h2
					id="modal-title"
					class="ma-0 text-h3"
				>
					Mon titre
				</h2>
			</template>

			<template #default>
				[Slot: default]
			</template>
		</AmeliproDialog>
	</div>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue
	import { AmeliproBtn, AmeliproDialog } from '@cnamts/synapse'

	const value = ref(false)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDialog, AmeliproBtn },
		setup() {
			const value = ref<boolean | undefined>(false)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
<div class="d-flex flex-wrap align-center justify-center w-100">
	<AmeliproBtn
		unique-id="amelipro-dialog-unique-id-btn"
		@click="value = true"
	>
		Ouvrir la modale
	</AmeliproBtn>

	<AmeliproDialog
		labelledby="modal-title"
		v-bind="args"
		v-model="value"
	>
		<template #header>
			<h2
				id="modal-title"
				class="ma-0 text-h3"
			>
				Mon titre
			</h2>
		</template>

		<template #default>
			{{ args.default }}
		</template>
	</AmeliproDialog>
</div>`,
	}),
}

// ...existing code...

export const Fullscreen: Story = {
	name: 'Plein écran',
	args: {
		modelValue: false,
		fullscreen: true,
		uniqueId: 'amelipro-dialog-fullscreen',
		default: 'Contenu de la modale en plein écran',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <div class="d-flex flex-wrap align-center justify-center w-100">
        <AmeliproBtn
            unique-id="amelipro-dialog-fullscreen-btn"
            @click="value = true"
        >
            Ouvrir la modale plein écran
        </AmeliproBtn>
        <AmeliproDialog
            v-model="value"
            fullscreen
            unique-id="amelipro-dialog-fullscreen"
        >
            <template #header>
                <h2 class="ma-0 text-h3">Titre plein écran</h2>
            </template>
            <template #default>
                Contenu de la modale en plein écran
            </template>
        </AmeliproDialog>
    </div>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { AmeliproBtn, AmeliproDialog } from '@cnamts/synapse'

const value = ref(false)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDialog, AmeliproBtn },
		setup() {
			const value = ref<boolean | undefined>(false)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
<p class="mb-2">Modale affichée en plein écran (<code>fullscreen</code>).</p>
<div class="d-flex flex-wrap align-center justify-center w-100">
    <AmeliproBtn
        unique-id="amelipro-dialog-fullscreen-btn"
        @click="value = true"
    >
        Ouvrir la modale plein écran
    </AmeliproBtn>
    <AmeliproDialog
        fullscreen
        unique-id="amelipro-dialog-fullscreen"
        v-model="value"
    >
        <template #header>
            <h2 class="ma-0 text-h3">Titre plein écran</h2>
        </template>
        <template #default>
            Contenu de la modale en plein écran
        </template>
    </AmeliproDialog>
</div>
        `,
	}),
}

export const SansFooter: Story = {
	name: 'Sans footer',
	args: {
		modelValue: false,
		noFooter: true,
		uniqueId: 'amelipro-dialog-no-footer',
		default: 'Contenu sans footer',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <div class="d-flex flex-wrap align-center justify-center w-100">
        <AmeliproBtn
            unique-id="amelipro-dialog-no-footer-btn"
            @click="value = true"
        >
            Ouvrir la modale sans footer
        </AmeliproBtn>
        <AmeliproDialog
            v-model="value"
            no-footer
            unique-id="amelipro-dialog-no-footer"
        >
            <template #header>
                <h2 class="ma-0 text-h3">Titre sans footer</h2>
            </template>
            <template #default>
                Contenu sans footer
            </template>
        </AmeliproDialog>
    </div>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { AmeliproBtn, AmeliproDialog } from '@cnamts/synapse'

const value = ref(false)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDialog, AmeliproBtn },
		setup() {
			const value = ref<boolean | undefined>(false)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
<p class="mb-2">Modale sans footer (<code>noFooter</code>).</p>
<div class="d-flex flex-wrap align-center justify-center w-100">
    <AmeliproBtn
        unique-id="amelipro-dialog-no-footer-btn"
        @click="value = true"
    >
        Ouvrir la modale sans footer
    </AmeliproBtn>
    <AmeliproDialog
        no-footer
        unique-id="amelipro-dialog-no-footer"
        v-model="value"
    >
        <template #header>
            <h2 class="ma-0 text-h3">Titre sans footer</h2>
        </template>
        <template #default>
            Contenu sans footer
        </template>
    </AmeliproDialog>
</div>
        `,
	}),
}

export const Persistent: Story = {
	name: 'Persistent (pas de croix de fermeture)',
	args: {
		modelValue: false,
		persistent: true,
		uniqueId: 'amelipro-dialog-persistent',
		default: 'Contenu persistent',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <div class="d-flex flex-wrap align-center justify-center w-100">
        <AmeliproBtn
            unique-id="amelipro-dialog-persistent-btn"
            @click="value = true"
        >
            Ouvrir la modale persistent
        </AmeliproBtn>
        <AmeliproDialog
            v-model="value"
            persistent
            unique-id="amelipro-dialog-persistent"
        >
            <template #header>
                <h2 class="ma-0 text-h3">Titre persistent</h2>
            </template>
            <template #default>
                Contenu persistent
            </template>
        </AmeliproDialog>
    </div>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { AmeliproBtn, AmeliproDialog } from '@cnamts/synapse'

const value = ref(false)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDialog, AmeliproBtn },
		setup() {
			const value = ref<boolean | undefined>(false)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
<p class="mb-2">Modale sans croix de fermeture (<code>persistent</code>).</p>
<div class="d-flex flex-wrap align-center justify-center w-100">
    <AmeliproBtn
        unique-id="amelipro-dialog-persistent-btn"
        @click="value = true"
    >
        Ouvrir la modale persistent
    </AmeliproBtn>
    <AmeliproDialog
        persistent
        unique-id="amelipro-dialog-persistent"
        v-model="value"
    >
        <template #header>
            <h2 class="ma-0 text-h3">Titre persistent</h2>
        </template>
        <template #default>
            Contenu persistent
        </template>
    </AmeliproDialog>
</div>
        `,
	}),
}

export const AvecFooterPersonnalise: Story = {
	name: 'Avec footer personnalisé',
	args: {
		modelValue: false,
		uniqueId: 'amelipro-dialog-footer-custom',
		default: 'Contenu principal',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <div class="d-flex flex-wrap align-center justify-center w-100">
        <AmeliproBtn
            unique-id="amelipro-dialog-footer-custom-btn"
            @click="value = true"
        >
            Ouvrir la modale avec footer personnalisé
        </AmeliproBtn>
        <AmeliproDialog
            v-model="value"
            unique-id="amelipro-dialog-footer-custom"
        >
            <template #header>
                <h2 class="ma-0 text-h3">Titre avec footer personnalisé</h2>
            </template>
            <template #default>
                Contenu principal
            </template>
            <template #footer>
                <div style="text-align:right;">
                    <button type="button" class="btn btn-secondary" @click="value = false">Fermer</button>
                    <button type="button" class="btn btn-primary">Action personnalisée</button>
                </div>
            </template>
        </AmeliproDialog>
    </div>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { AmeliproBtn, AmeliproDialog } from '@cnamts/synapse'

const value = ref(false)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDialog, AmeliproBtn },
		setup() {
			const value = ref<boolean | undefined>(false)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
<p class="mb-2">Modale avec footer personnalisé via le slot <code>footer</code>.</p>
<div class="d-flex flex-wrap align-center justify-center w-100">
    <AmeliproBtn
        unique-id="amelipro-dialog-footer-custom-btn"
        @click="value = true"
    >
        Ouvrir la modale avec footer personnalisé
    </AmeliproBtn>
    <AmeliproDialog
        unique-id="amelipro-dialog-footer-custom"
        v-model="value"
    >
        <template #header>
            <h2 class="ma-0 text-h3">Titre avec footer personnalisé</h2>
        </template>
        <template #default>
            Contenu principal
        </template>
        <template #footer>
            <div style="text-align:right;">
                <button type="button" class="btn btn-secondary" @click="value = false">Fermer</button>
                <button type="button" class="btn btn-primary">Action personnalisée</button>
            </div>
        </template>
    </AmeliproDialog>
</div>
        `,
	}),
}
