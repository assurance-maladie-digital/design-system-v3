import type { StoryObj } from '@storybook/vue3'
import { mdiKeyboard } from '@mdi/js'

const keyboardIcon = mdiKeyboard

export default {
	title: 'Composants/Formulaires/Selects/SyAutocomplete/Accessibility',
}

export const ComboboxKeyboardNavigation: StoryObj = {
	tags: ['!dev'],
	render: () => {
		return {
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
						touche: 'Saisie de texte',
						action: 'Filtre les options en temps réel basé sur le texte saisi',
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
					<p>Le composant SyAutocomplete implémente le pattern de navigation au clavier recommandé par le W3C pour les combobox avec auto-complétion.</p>
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
