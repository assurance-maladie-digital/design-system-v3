import type { StoryObj } from '@storybook/vue3'
import { mdiKeyboard, mdiLoading } from '@mdi/js'

const keyboardIcon = mdiKeyboard
const loadingIcon = mdiLoading

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

export const LoadingAccessibility: StoryObj = {
	tags: ['!dev'],
	render: () => {
		return {
			setup() {
				return { loadingIcon }
			},
			template: `
				<div>
					<p>Lorsque la prop <code>loading</code> est à <code>true</code>, le composant affiche une barre de progression au bas du champ.</p>
					<v-table density="compact" style="margin-top: 16px;">
						<thead>
							<tr>
								<th>Comportement</th>
								<th>Détail</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Barre de progression accessible</td>
								<td>La barre porte un <code>aria-label</code> nommant le champ (<em>« Chargement de [label] »</em>) afin que les lecteurs d’écran annoncent son état.</td>
							</tr>
							<tr>
								<td>Message « Aucune option » masqué</td>
								<td>Le message d’absence de résultats n’est pas affiché pendant le chargement, pour éviter de signaler à tort que la liste est vide.</td>
							</tr>
							<tr>
								<td>Critère RGAA 4.1 / WCAG 4.1.2</td>
								<td>Le rôle <code>progressbar</code> et son nom accessible satisfont le critère « Nom, rôle, valeur » pour les composants d’interface.</td>
							</tr>
						</tbody>
					</v-table>
				</div>
			`,
		}
	},
}
