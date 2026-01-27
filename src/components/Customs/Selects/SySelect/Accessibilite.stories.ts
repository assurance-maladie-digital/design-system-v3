import { VIcon, VTable } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle, mdiKeyboard } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle

const keyboardIcon = mdiKeyboard

export default {
	title: 'Composants/Formulaires/Selects/SySelect/Accessibilité',
}

// Story masquée qui n'apparaît que dans le MDX
export const ComboboxKeyboardNavigation: StoryObj = {
	tags: ['!dev'],
	render: () => {
		return {
			components: { VTable, VIcon },
			setup() {
				const keyboardData = [
					{
						touche: 'Flèche bas',
						action: 'Ouvre le menu et déplace le focus sur la première option (ou la suivante si une option est déjà sélectionnée)',
					},
					{
						touche: 'Flèche haut',
						action: 'Ouvre le menu et déplace le focus sur la dernière option',
					},
					{
						touche: 'Flèches haut/bas',
						action: 'Déplace le focus dans la liste des options (sans modifier la sélection)',
					},
					{
						touche: 'Entrée',
						action: 'Sélectionne l\'option active et ferme le menu',
					},
					{
						touche: 'Échap',
						action: 'Ferme le menu sans modifier la sélection',
					},
					{
						touche: 'Caractères imprimables',
						action: 'Déplace le focus sur l\'option commençant par le(s) caractère(s) saisi(s)',
					},
				]
				return { keyboardData, keyboardIcon }
			},
			template: `
				<div>
					<h3><v-icon :icon="keyboardIcon" style="margin-right: 8px;"/>Navigation au clavier</h3>
					<p>Le composant SySelect implémente le pattern de navigation au clavier recommandé par le W3C pour les combobox select-only.</p>
					<v-table density="compact" style="margin-top: 16px;">
						<thead>
							<tr>
								<th>Touche</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in keyboardData" :key="index">
								<td><code>{{ item.touche }}</code></td>
								<td>{{ item.action }}</td>
							</tr>
						</tbody>
					</v-table>
					<p style="margin-top: 16px;"><strong>Note:</strong> Le focus DOM reste toujours sur l'élément combobox, tandis que le focus visuel est géré via <code>aria-activedescendant</code>.</p>
				</div>
			`,
		}
	},
}

export const Legende: StoryObj = {
	args: {
		icon: checkIcon,
	},
	render: (args) => {
		return {
			components: { VIcon },
			setup() {
				return { args }
			},
			template: `
			   
		 
        <div class="mt-4">
					  <p>Rapport d’audit manuel : <a href="/audits/SySelect.xlsx" style="color:#0C41BD;">Voir le
						  rapport</a></p>
					  <p style="color: grey; font-size: 14px">Correctifs associés (<a
						  href="https://github.com/assurance-maladie-digital/design-system-v3/issues/787" target="_blank"
						  style="color:#0C41BD;"
					  >issue #787</a>, <a
						  href="https://github.com/assurance-maladie-digital/design-system-v3/issues/931" target="_blank"
						  style="color:#0C41BD;"
					  >issue #931</a>)</p>
				  </div>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
