import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { mdiAccount, mdiCog, mdiShieldAccount } from '@mdi/js'
import { VBtn } from 'vuetify/components'
import UserMenuBtn from './UserMenuBtn.vue'

const meta = {
	title: 'Composants/Boutons/UserMenuBtn',
	component: UserMenuBtn,
	parameters: {
		controls: { exclude: ['logout'] },
	},
	argTypes: {
		'modelValue': {
			control: false,
			description: 'Élément sélectionné dans le menu',
			table: {
				category: 'props',
				type: { summary: '{ text: string, value: string } | null | undefined' },
			},
		},
		'hideLogoutBtn': {
			control: 'boolean',
			description: 'Masque le bouton de déconnexion',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'hideUserIcon': {
			control: 'boolean',
			description: 'Masque l\'icône utilisateur',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'isMobileView': {
			control: 'boolean',
			description: 'Affiche le menu en version mobile',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'fullName': {
			control: 'text',
			description: 'Nom complet de l\'utilisateur',
			table: {
				type: { summary: 'string' },
			},
		},
		'logoutText': {
			control: 'text',
			description: 'Texte dans le bouton de déconnexion',
			table: {
				type: { summary: 'string' },
			},
		},
		'additionalInformation': {
			control: 'text',
			description: 'Informations supplémentaires sur l\'utilisateur (ex: rôle, service, etc.)',
			table: {
				type: { summary: 'string' },
			},
		},
		'menuItems': {
			control: 'object',
			description: 'Liste des éléments du menu utilisateur',
			table: {
				type: {
					summary: '{ text: string, value: string, link?: string, to?: RouteLocationRaw, icon?: string }[]',
				},
			},
		},
		'vuetifyOptions': {
			control: 'object',
			description: 'Options de personnalisation des éléments Vuetify',
			table: {
				category: 'props',
				type: {
					summary: 'object',
					detail: `{
	menu: Record<string, any>,
	btn: Record<string, any>,
	icon: Record<string, any>,
	logoutListItem: Record<string, any>,
	logoutIcon: Record<string, any>,
	identityListItem: Record<string, any>,
}`,
				},
				defaultValue: {
					summary: 'object',
					detail: `{
	menu: {
		offsetY: true,
		zIndex: 4,
		minWidth: '198px',
		maxWidth: 'auto',
		nudgeRight: 0,
	},
	btn: {
		variant: 'text',
		height: 'auto',
	},
	icon: {
		color: 'avatar',
	},
	logoutListItem: {
		class: 'text-primary',
		minWidth: '198px',
	},
	logoutIcon: {
		color: 'primary',
		class: 'mr-4',
	},
	identityListItem: {},
}`,
				},
			},
		},
		'default': {
			control: false,
			description: 'Remplace le bouton de déconnexion par un élément de menu personnalisé',
			table: {
				category: 'slots',
			},
		},
		'menu-header': {
			control: false,
			description: 'Ajoute un bloc de contenu personnalisé au-dessus des options dans le popin',
			table: { category: 'slots' },
		},
		'header-list-item': {
			control: false,
			description: 'Remplace le contenu du bloc d’identité du menu mobile',
			table: { category: 'slots' },
		},
		'onLogout': {
			action: 'logout',
			description: 'Événement déclenché lors de la déconnexion de l\'utilisateur',
			table: {
				category: 'events',
				type: { summary: 'void' },
			},
		},
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Événement déclenché lors de la selection d\'un élément du menu',
			table: {
				category: 'events',
				type: { summary: '{ text: string, value: string }' },
			},
		},
	},
} satisfies Meta<typeof UserMenuBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])
</script>`,
			},
		],
	},
	args: {
		menuItems: [
			{ text: 'Administration', value: 'Administration' },
			{ text: 'Profil', value: 'Profil' },
			{ text: 'Paramètres', value: 'Paramètres' },
		],
		modelValue: null,
		hideLogoutBtn: false,
		hideUserIcon: false,
		isMobileView: false,
		vuetifyOptions: undefined,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const WithIcons: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { mdiAccount, mdiCog, mdiShieldAccount } from '@mdi/js'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration', icon: mdiShieldAccount },
  { text: 'Profil', value: 'Profil', icon: mdiAccount },
  { text: 'Paramètres', value: 'Paramètres', icon: mdiCog },
 ])
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		menuItems: [
			{ text: 'Administration', value: 'Administration', icon: mdiShieldAccount },
			{ text: 'Profil', value: 'Profil', icon: mdiAccount },
			{ text: 'Paramètres', value: 'Paramètres', icon: mdiCog },
		],
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}
export const HideLogoutButton: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  :hide-logout-btn="hideLogOut"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideLogOut = ref(true)
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		hideLogoutBtn: true,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const HideUserIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  :hide-user-icon="hideUserIcon"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const hideUserIcon = ref(true)
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		hideUserIcon: true,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const MobileVersion: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  :is-mobile-view="isMobileVersion"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const isMobileVersion = ref(true)
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		isMobileView: true,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const CustomFullName: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  :fullName="fullName"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const fullName = ref('John Doe')
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		fullName: 'John Doe',
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const CustomLogoutText: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  :logout-text="Déconnexion"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const logoutText = ref('Déconnexion')
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		logoutText: 'Déconnexion',
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const CustomAdditionalInformation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  :additionalInformation="additionalInformation"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const additionalInformation = ref('Custom Information')
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		additionalInformation: 'Custom Information',
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const WithVuetifyOptions: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  :vuetify-options="vuetifyOptions"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const vuetifyOptions = ref({
  menu: { minWidth: '250px' },
  btn: { variant: 'outlined' },
  icon: { color: 'warning' },
  logoutListItem: { class: 'text-warning' },
  logoutIcon: { color: 'warning' },
 })
</script>`,
			},
		],
	},
	args: {
		...Default.args,
		vuetifyOptions: {
			menu: { minWidth: '250px' },
			btn: { variant: 'outlined' },
			icon: { color: 'warning' },
			logoutListItem: { class: 'text-warning' },
			logoutIcon: { color: 'warning' },
		},
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args"/>
</div>`,
		}
	},
}

export const LogoutEvent: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
 <UserMenuBtn
  v-model="selected"
  :menu-items="menuItems"
  @logout="handleLogout"
/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { ref } from 'vue'
 import { UserMenuBtn } from '@cnamts/synapse'

 const selected = ref(null)
 const menuItems = ref([
  { text: 'Administration', value: 'Administration' },
  { text: 'Profil', value: 'Profil' },
  { text: 'Paramètres', value: 'Paramètres' },
 ])

 const handleLogout = () => {
  alert('Logout event triggered')
 }
</script>`,
			},
		],
	},
	args: {
		...Default.args,
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				const handleLogout = () => {
					alert('Logout event triggered')
				}
				return { args, handleLogout }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args" @logout="handleLogout"/>
</div>`,
		}
	},
}

export const Slot: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UserMenuBtn
		v-model="selected"
		:full-name="fullName"
	>
		<div class="ma-6 text-center">
			<p class="text-h6">
				Bienvenue, {{ fullName }}
			</p>

			<p class="mt-2">
				La création de votre compte est en cours,<br> vos services seront accessibles dans les prochains jours.
			</p>
		</div>
	</UserMenuBtn>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UserMenuBtn } from '@cnamts/synapse'

	const selected = ref(null)
	const fullName = ref('John Doe')

</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		hideLogoutBtn: false,
		hideUserIcon: false,
		isMobileView: false,
		vuetifyOptions: undefined,
		fullName: 'John Doe',
	},
	render: (args) => {
		return {
			components: { UserMenuBtn },
			setup() {
				return { args }
			},
			template: `
<div class="pa-4">
	<UserMenuBtn v-bind="args">
			<div class="ma-6 text-center">
			<p class="text-h6">
				Bienvenue, {{ args.fullName }}
			</p>

			<p class="mt-2">
				La création de votre compte est en cours,<br> vos services seront accessibles dans les prochains jours.
			</p>
		</div>
	</UserMenuBtn>
</div>`,
		}
	},
}

export const WithPsInfo: Story = {
	parameters: {
		controls: { exclude: ['logout', 'menuItems'] },
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <UserMenuBtn
    :full-name="fullName"
    :additional-information="secondaryInfo"
    :hide-logout-btn="true"
    :vuetify-options="{ menu: { minWidth: '320px' } }"
  >
    <template #menu-header>
      <div>
        <div class="ma-6">
          <p><strong>{{ fullName }}</strong></p>
          <p>{{ userDetails.profil }}</p>
          <p>N° RPPS : {{ userDetails.rpps }}</p>
          <p>N° ADELI : {{ userDetails.adeli }}</p>
          <p>Adresse email : {{ userDetails.email }}</p>
          <p class="last-connection text-caption">Dernière connexion : {{ userDetails.lastConnexion }}</p>
        </div>

        <div class="buttons d-flex ma-6">
          <VBtn class="flex-grow-1" color="primary" variant="text" @click="handleAccount">
            Mon compte
          </VBtn>
          <VBtn class="flex-grow-1" color="primary" variant="text" @click="handleLogout">
            Déconnexion
          </VBtn>
        </div>
      </div>
    </template>
  </UserMenuBtn>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { VBtn } from 'vuetify/components'
import { UserMenuBtn } from '@cnamts/synapse'

const fullName = 'Georges Duval'

const userDetails = {
  userName: 'Georges Duval',
  profil: 'Médecin généraliste',
  rpps: '12345678910',
  adeli: '123456789',
  email: 'georges.duval@aphp.fr',
  adresse: {
    numero: '3',
    type: 'rue',
    nom: 'Victor-Hugo',
    codePostal: '78470',
    commune: 'Saint-Rémy-lès-Chevreuse',
  },
  lastConnexion: '01/06/2024 à 10:00',
}

const secondaryInfo = [
  userDetails.profil,
  \`\${userDetails.adresse.numero} \${userDetails.adresse.type} \${userDetails.adresse.nom}\`,
  \`\${userDetails.adresse.codePostal} \${userDetails.adresse.commune}\`,
].join('\\n')

const handleAccount = () => {
  // Ouvrir le compte utilisateur
}

const handleLogout = () => {
  // Déclencher la déconnexion de l'utilisateur
}
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		menuItems: [],
		hideUserIcon: false,
		hideLogoutBtn: true,
		fullName: 'Georges Duval',
		additionalInformation: 'Médecin généraliste\n3 rue Victor-Hugo\n78470 Saint-Rémy-lès-Chevreuse',
		vuetifyOptions: { menu: { minWidth: '320px' } },
	},

	render: (args) => {
		return {
			components: { UserMenuBtn, VBtn },

			setup() {
				const userDetails = {
					profil: 'Médecin généraliste',
					rpps: '12345678910',
					adeli: '123456789',
					email: 'georges.duval@aphp.fr',
					lastConnexion: '01/06/2024 à 10:00',
				}

				const handleLogout = () => {
					// Déclencher la déconnexion de l'utilisateur
				}

				const handleAccount = () => {
					// Ouvrir le compte utilisateur
				}

				return {
					args,
					userDetails,
					handleAccount,
					handleLogout,
				}
			},

			template: `
<div class="pa-4">
  <UserMenuBtn v-bind="args" @logout="handleLogout">
  <template #menu-header>
    <div>
      <div class="ma-6">
        <p><strong>{{ args.fullName }}</strong></p>
        <p>{{ userDetails.profil }}</p>
        <p>N° RPPS : {{ userDetails.rpps }}</p>
        <p>N° ADELI : {{ userDetails.adeli }}</p>
        <p>Adresse email : {{ userDetails.email }}</p>
        <p class="last-connection text-caption">Dernière connexion : {{ userDetails.lastConnexion }}</p>
      </div>

        <div class="buttons d-flex ma-6">
          <VBtn class="flex-grow-1" color="primary" variant="text" @click="handleAccount">
            Mon compte
          </VBtn>
          <VBtn v-if="args.hideLogoutBtn" class="flex-grow-1" color="primary" variant="text" @click="handleLogout">
            Déconnexion
          </VBtn>
        </div>
    </div>
  </template>
  </UserMenuBtn>
</div>`,
		}
	},
}
