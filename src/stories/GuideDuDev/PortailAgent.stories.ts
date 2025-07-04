import { VExpansionPanel, VExpansionPanels, VExpansionPanelText, VExpansionPanelTitle } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'Guide Du Dev/Correspondance composants PAG',
}

export const PAgComponents: StoryObj = {
	render: () => {
		return {
			components: {
				VExpansionPanels,
				VExpansionPanel,
				VExpansionPanelTitle,
				VExpansionPanelText,
			},
			setup() {
				return {}
			},
			template: `
				<VExpansionPanels>
					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Accordéon
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Accordéon</span> est remplacé par le composant <span class="component-name">Accordion</span> de Synapse.
								<br>
								<a href="/docs/composants-donn%C3%A9es-accordion--docs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse Accordion
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-accordeon.htm">
									Documentation du composant Portail Accordéon correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Alerts
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Alerts</span> est remplacé par le composant <span class="component-name">SyAlert</span> de Synapse.
								<br>
								<a href="/docs/composants-feedback-syalert--docs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse SyAlert
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-alert.htm">
									Documentation du composant Portail Alert correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Badges
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Badge</span> est remplacé par le composant <span class="component-name">ChipList</span> de Synapse dans le cas ou une liste de chip doit être affiché.
								<br> Si un seul élément doit être affiché le composant <span class="component-name">Vchip</span> de Vuetify peut lui être préféré : <a href="https://vuetifyjs.com/components/chips" target="_blank" rel="noopener noreferrer">Documentation du composant Vuetify Chip</a>.
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-badge.htm">
									Documentation du composant Portail Badge correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Barre d’actions
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Barre d’action</span> est remplacé par le composant <span class="component-name">Vbtn</span> et <span class="component-name">VbtnGroupe</span> de Vuetify.
							</p>
							<ul class="mt-4">
								<li>
									<a href="https://vuetifyjs.com/components/button-groups" target="_blank" rel="noopener noreferrer">
										Documentation du composant Vuetify Button Group
									</a>
								</li>
								<li>
									<a href="https://vuetifyjs.com/components/buttons" target="_blank" rel="noopener noreferrer">
										Documentation du composant Vuetify Button
									</a>
								</li>
							</ul>
							<p class="mt-4">
								Le composant <span class="component-name">ToolbarContainer</span> de Synapse peut également être utilisé en complément pour améliorer l’expérience utilisateur lors de la navigation clavier.
								<br>
								<a href="https://synapse-dev.netlify.app/?path=//docs/composants-layout-toolbarcontainer--docs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse ToolbarContainer
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-barreactions.htm">
									Documentation du composant Portail Barre d'actions correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Barre de tâches
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Les composant de barre de tâches peuvent êtres crées en utilisant les composants Vuetify <span class="component-name">VbtnGroup</span>, <span class="component-name">Vbtn</span> et <span class="component-name">VProgressLinear</span>.
							</p>
							<ul class="mt-4">
								<li>
									<a href="https://vuetifyjs.com/api/v-btn-group" target="_blank" rel="noopener noreferrer">
										Documentation du composant Vuetify VbtnGroup
									</a>
								</li>
								<li>
									<a href="https://vuetifyjs.com/api/v-btn" target="_blank" rel="noopener noreferrer">
										Documentation du composant Vuetify Vbtn
									</a>
								</li>
								<li>
									<a href="https://vuetifyjs.com/components/progress-linear" target="_blank" rel="noopener noreferrer">
										Documentation du composant Vuetify VProgressLinear
									</a>
								</li>
							</ul>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-barre-taches.htm">
									Documentation du composant Portail Barre de tâches correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Boutons
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Les boutons de bases peuvent êtres crées en utilisant le composant <span class="component-name">VBtn</span> de Vuetify.
								<br>
								<a href="https://vuetifyjs.com/api/v-btn" target="_blank" rel="noopener noreferrer">
									Documentation du composant Vuetify Vbtn
								</a>
							</p>

							<div class="mt-4">
								<pre>
	&lt;VBtn color=&quot;primary&quot;&gt;
		Bouton d’action primaire
	&lt;/VBtn&gt;
	&lt;VBtn&gt;
		Bouton d’action par d&#233;faut
	&lt;/VBtn&gt;
								</pre>
							</div>

							<p class="mt-4">
								Les boutons case à cocher ou radio peuvent êtres crées avec le composant Vuetify <span class="component-name">VBtnToggle</span>.
								<a href="https://vuetifyjs.com/components/button-groups" target="_blank" rel="noopener noreferrer">
									Documentation du composant Vuetify VBtnToggle
								</a>
							</p>
							<p class="mt-6">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-buttons.htm">
									Documentation du composant Portail Buttons correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Fenêtre modales
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Fenêtre modale</span> est remplacé par le composant <span class="component-name">DialogBox</span> de Synapse.
								<br>
								<a href="https://synapse-dev.netlify.app/?path=//docs/composants-feedback-dialogbox--docs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse DialogBox
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-modal.htm">
									Documentation du composant Portail Fenêtre modales correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Fiche de travail
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Fiche de travail</span> est remplacé par le composant <span class="component-name">DataListGroup</span> Synapse.
								<br>
								<a href="https://synapse-dev.netlify.app/?path=//docs/composants-donn%C3%A9es-datalistgroup--docs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse DataListGroup
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-fichetravail.htm">
									Documentation du composant Portail Fiche de travail correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Formulaires
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Pour constituer des formulaires, Synapse met a disposition les composants 
								<a href="/docs/composants-formulaires-sytextfield--docs">SyTextField</a>, 
								<a href="/docs/composants-formulaires-syselect--docs">SySelect</a>, 
								<a href="/docs/composants-formulaires-syinputselect--docs">SyInputSelect</a>, 
								<a href="/docs/composants-formulaires-sybtnselect--docs">SyBtnSelect</a>, 
								<a href="/docs/composants-formulaires-sytextarea--docs">SyTextArea</a>, 
								<a href="/docs/composants-formulaires-datepicker-introduction--docs">DatePicker</a>, 
								<a href="/docs/composants-formulaires-diacriticpicker--docs">DiacriticPicker</a>, 
								<a href="/docs/composants-formulaires-fileupload--docs">FileUpload</a>, 
								<a href="/docs/composants-formulaires-nirfield--docs">NirField</a>, 
								<a href="/docs/composants-formulaires-passwordfield--docs">PasswordField</a>, 
								<a href="/docs/composants-formulaires-periodfield--docs">PeriodField</a>, 
								<a href="/docs/composants-formulaires-phonefield--docs">PhoneField</a>, 
								<a href="/docs/composants-formulaires-rangefield--docs">RangeField</a>, 
								<a href="/docs/composants-formulaires-searchlistfield--docs">SearchListField</a> et
								<a href="/docs/composants-formulaires-selectbtnfield--docs">SelectBtnField</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-forms.htm">
									Documentation des composants Portail formulaires correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Fil d’ariane
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Fenêtre modale</span> est remplacé par le composant <span class="component-name">VBreadcrumbs</span> de Vuetify.
								<br>
								<a href="https://vuetifyjs.com/components/breadcrumbs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Vuetify VBreadcrumbs
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-breadcrumbs.htm">
									Documentation du composant Portail Fil d'ariane correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Icônes
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Synapse utilise les icônes 
								<a href="https://pictogrammers.com/">Pictogrammer</a> via le package <a href="https://www.npmjs.com/package/@mdi/js">@mdi/js</a> et en utilisant Le composant VIcon de Vuetify.
								<br> <a href="https://vuetifyjs.com/en/components/icons" target="_blank" rel="noopener noreferrer">
									Documentation du composant Vuetify VIcon
								</a>
							</p>
							<p class="mt-4">Pour utiliser les Icônes historiques de portail agent, il faut les récupérer ici <a href="https://maloron.net/am/cnamuipav2/cnamui-icones.htm">https://maloron.net/am/cnamuipav2/cnamui-icones.htm</a>.</p>
							
							<p class="mt-4">Pour plus d'informations sur l'intégration des icons materials <a href="https://vuetifyjs.com/en/features/icon-fonts/#mdi-js-svg">https://vuetifyjs.com/en/features/icon-fonts/#mdi-js-svg</a>.</p>
							<p class="mt-6">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-icones.htm">
									Documentation des icones Portail
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Liens
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Les liens internes avec <a href="https://router.vuejs.org/guide/#App-vue">RouterLink</a> ou externes avec la balise HTML <code>&lt;a href=&quot;...&quot;&gt;… &lt;/a&gt;</code>
								 peuvent être mise en formes avec les classes utilitaires Vuetify <a href="https://vuetifyjs.com/styles/text-and-typography">https://vuetifyjs.com/styles/text-and-typography</a> et êtres ajointes d’une icône (voir section Icones) Si le lien ne contient qu’une icône, il doit alors posséder un attribut <span class="component-name">title</span>.
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-liens.htm">
									Documentation du composant Portail Liens correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Menus déroulants
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Menus déroulants</span> est remplacé par le composant <span class="component-name">VMenu</span> de Vuetify
								<br>
								<a href="https://vuetifyjs.com/components/menus" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse Menus
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-dropdown.htm">
									Documentation du composant Portail Menus déroulants correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Notifications
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Notfications</span> est remplacé par le composant <span class="component-name">NotificationBar</span> Synapse.
								<br>
								<a href="/docs/composants-feedback-notificationbar--docs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse NotificationBar
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-notification.htm">
									Documentation du composant Portail Notification correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Onglets
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">onglets</span> est remplacé par le composant <span class="component-name">Tabs</span> de Vuetify.
								<br>
								<a href="https://vuetifyjs.com/components/tabs" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse Tabs
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-tabs.htm">
									Documentation du composant Portail Onglets correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Popovers et tooltips
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Portail <span class="component-name">Popovers</span> est remplacé par le composant <span class="component-name">VMenu</span> de Vuetify.
							</p>
							<p class="mt-4">
								Pour l’utilisation de ce composant pour cet usage, la props <span class="component-name">close-on-content-click</span> doit être a false et la props <span class="component-name">open-on-hover</span> peux être passé a true,
							</p>
				
							<p class="mt-4">
								<a href="https://vuetifyjs.com/components/menus" target="_blank" rel="noopener noreferrer">
									Documentation du composant Synapse VMenu
								</a>
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-popover.htm">
									Documentation du composants Portail Popovers et tooltips correspondants
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Tableaux
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant <span class="component-name">Tableau</span> est remplacé par deux composants Synapse 
								<a href="/docs/composants-tableaux-sytable--docs" target="_blank" rel="noopener noreferrer">
									SyTable
								</a> et 
								<a href="/docs/composants-tableaux-syservertable--docs" target="_blank" rel="noopener noreferrer">
									SyServerTable
								</a>.
							</p>
							<ul class="mt-4">
								<li><span class="component-name">SyTable</span> doit être utilisé quand toutes les données accessibles sont chargées sur le client front, il permet notamment de faire de filtrages automatique en local sans faire de call api et sans code supplémentaire du développeur.</li>
								<li class="mt-4"><span class="component-name">SyServerTable</span> doit être utilisée quand le volume de données est trop gros pour les chargés intégralement sur le client. Le composants émets des événements quand l’utilisateur fait appel a la paginations ou aux filtres, Le développeur a la charge de récupérer ces événements pour faire un requête au serveur et mettre à jours les données affichées par le tableau.</li>
							</ul>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-accordeon.htm">
									Documentation du composant Portail Accordéon correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>
					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Titres de page et de tableau
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Synapse ne propose pas de remplacent au composent <span class="component-name">Titres de page</span>, Il devra être réalisé en CSS par les développeurs.<br>
								Les boutons d’actions pourrons être réalisés avec le composant 
								<a href="https://vuetifyjs.com/components/buttons" target="_blank" rel="noopener noreferrer">
									VBtn
								</a> de Vuetify.<br>
								Le composant 
								<a href="https://vuetifyjs.com/api/v-badge" target="_blank" rel="noopener noreferrer">
									VBadge
								</a> pourra être utilisé pour ajouter des informations.
							</p>
							<div class="mt-4">
<pre>
&lt;VBadge
	color=&quot;primary&quot;
	content=&quot;8&quot;
	class=&quot;mb-4&quot;
	label=&quot;8 notifications non lues&quot;
&gt;
	&lt;VBtn&gt;
		Messagerie
	&lt;/VBtn&gt;
&lt;/VBadge&gt;
</pre>
							</div>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-titre.htm">
									Documentation du composant Portail Titres de page et de tableau correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>

					<VExpansionPanel>
						<VExpansionPanelTitle class="font-weight-bold">
							Panels et sections
						</VExpansionPanelTitle>
						<VExpansionPanelText>
							<p>
								Le composant Synapse
								<a href="/docs/composants-layout-panel--docs" target="_blank" rel="noopener noreferrer">
									Accordion
								</a>
								permet d’organiser sa page en différents panels. 
							</p>
							<p class="mt-4">
								Il est également possibles d’utiliser le composant Vuetify 
								<a href="https://vuetifyjs.com/api/v-divider" target="_blank" rel="noopener noreferrer">
									VDivider
								</a>
								pour séparer visuellement plusieurs sections de la page, que ce soit horizontalement ou verticalement,
							</p>
							<p class="mt-4">
								le composant Synapse 
								<a href="/docs/composants-feedback-syalert--docs" target="_blank" rel="noopener noreferrer">
									SyAlert
								</a>
								peux également être utilisée pour mettre en exergue certaines informations.
							</p>
							<p class="mt-4">
								Pour créé des layouts plus complexes pour formater l’information, il est également possible d’utiliser le système de grid de Vuetify qui est fortement inspiré de celui de Bootstrap.
								https://vuetifyjs.com/components/grids
							</p>
							<p class="mt-4">
								<a href="https://maloron.net/am/cnamuipav2/cnamui-panels.htm">
									Documentation du composant Portail Panel correspondant
								</a>
							</p>
						</VExpansionPanelText>
					</VExpansionPanel>
				</VExpansionPanels>
			`,
		}
	},
	tags: ['!dev'],
}
