import type { StoryObj } from '@storybook/vue3'

import { mdiGithub, mdiMenuRight } from '@mdi/js'

import { version } from '../../../package.json'
import { VBtn, VIcon, VRow, VCol, VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText } from 'vuetify/components'

export default {
	title: 'Démarrer/Introduction',
}

export const Header: StoryObj = {
	render: () => {
		return {
			components: { VBtn, VIcon },
			setup() {
				return {
					githubIcon: mdiGithub,
					version,
				}
			},
			template: `
              <div class="d-flex justify-space-between align-center">
                  <h1 class="title font-weight-medium mb-5">Démarrer</h1>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const List: StoryObj = {
	render: () => {
		return {
			components: { VRow, VCol },
			setup() {
				return {
					githubIcon: mdiGithub,
					version,
				}
			},
			template: `
              <VRow class="mt-8">
                <VCol cols="12" sm="6" class="m-2 p-2 v-col-auto background-list">
                  <p class="font-weight-bold mb-2">Qui sont nos principaux utilisateurs ?</p>
                  <p>Respectant les règles graphiques de la charte graphique de la CNAM, ce design system couvre prioritairement les produits à destination des assurés, des entreprises et des agents.</p>
                </VCol>
                <VCol cols="12" sm="6" class="m-2 p-2 v-col-auto background-list">
                  <p class="font-weight-bold mb-2">Comment accéder au design system ?</p>
                  <p>Afin d’améliorer la collaboration, il est disponible pour les développeurs depuis GitHub (accès open source) et pour les designers depuis Figma (accès sur demande).</p>
                </VCol>
                <VCol cols="12" sm="6" class="m-2 p-2 v-col-auto background-list">
                  <p class="font-weight-bold mb-2">Est-ce que le design system est complet ?</p>
                  <p>Face à l’ampleur des composants et des fonctionnalités nécessaires au bon fonctionnement d’un produit, le design system ne suffit pas seul. Vous devez composer avec la librairie vuetify et le framework vue.js.</p>
                </VCol>
                <VCol cols="12" sm="6" class="m-2 p-2 v-col-auto background-list">
                  <p class="font-weight-bold mb-2">Quels sont les bénéfices du design system ?</p>
                  <p>Utiliser un design system permet d’accélérer la fabrication, la collaboration et la prise de décision puisqu’il suffit à l’équipe-produit de piocher directement dans une collection de composants déjà adaptés aux besoins de CNAM.</p>
                </VCol>
              </VRow>
            `,
		}
	},
	tags: ['!dev'],
}

export const Intro: StoryObj = {
	render: () => {
		return {
			components: { },
			setup() {
				return {
					githubIcon: mdiGithub,
					version,
				}
			},
			template: `
              <div>
				  <p style="margin-bottom:5px;">Concevoir une plateforme digitale à la CNAM</p>
				  <p style="margin-bottom:5px;">Bienvenue dans notre guide d’aide à la conception, pensé par et pour les équipes de la CNAM</p>
				  <p>Ce guide a été conçu pour accompagner chaque membre de l’équipe dans la création de plateformes web de qualité, alignées avec nos standards et nos valeurs. Vous y trouverez toutes les ressources essentielles pour vous guider tout au long du processus de conception, notamment :</p>
				  <ul style="margin-left: 16px;">
				  <li style="line-height: 37px;"><span style="font-weight: bold;">Le Design System CNAM </span>: pour assurer une expérience utilisateur cohérente et harmonieuse.</li>
				  <li style="line-height: 37px;"><span style="font-weight: bold;">Le Guide de l’Accessibilité Numérique </span> : afin de rendre nos plateformes accessibles à toutes et tous, sans exception.</li>
				  <li style="line-height: 37px;"><span style="font-weight: bold;">Le Guide de l’Éco-conception </span>: pour concevoir de manière responsable et limiter notre empreinte numérique.</li>
				  </ul>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const Panels: StoryObj = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VIcon },
			setup() {
				return {
					arrowIcon: mdiMenuRight,
					version,
				}
			},
			template: `
              <div>
               <v-expansion-panels>
                    <v-expansion-panel>     
                      <v-expansion-panel-title style="display: inline-grid;">
                      <p style="font-weight:bold;"><VIcon :icon="arrowIcon"/>Le design system CNAM</p> 
                      <p>Un référentiel centralisé de nos styles et composants pour garantir une expérience utilisateur cohérente et harmonieuse sur toutes nos plateformes.</p>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
						 <p style="margin-bottom:5px; font-weight:bold;">Pourquoi utiliser le Design System de la CNAM ?</p>
						 <p style="margin-bottom:5px;font-weight:bold;">→ Gagner en productivité</p>
						<p style="margin-bottom:10px; ">En utilisant le design system pour la conception et le développement de votre plateforme, vous disposez d’un ensemble de règles éprouvées et d’une bibliothèque de composants prête à l’emploi (pour les développeurs et pour les designers) vous permettant de gagner du temps et de vous concentrer sur les tâches avec le plus de valeur ajoutée.</p>
						<p style="margin-bottom:5px;font-weight:bold;">→ S’assurer de la cohérence au sein de la plateforme et avec les autres plateformes de l’Assurance Maladie</p>
						<p style="margin-bottom:10px;">Le design system garantit que tous les produits et fonctionnalités respectent les mêmes règles de conception, offrant une expérience utilisateur fluide et cohérente. Cela réduit les risques d'incohérences visuelles ou fonctionnelles entre les différentes parties du produit.</p>
						<p style="margin-bottom:10px;">Il garantit également que tous les éléments du produit respectent les lignes directrices de l’identité visuelle et des valeurs de l’entreprise, assurant ainsi une expérience de marque cohérente sur tous les points de contact.</p>
						<p style="margin-bottom:5px;font-weight:bold;">→ S’assurer d’une maintenabilité et d’une mise à l’échelle simplifiée</p>
						<p style="margin-bottom:10px;">Lorsqu'une nouvelle fonctionnalité ou un nouveau produit est ajouté, l'équipe produit peut facilement l'intégrer au système existant, en utilisant les composants et règles déjà en place. Cela garantit une croissance rapide sans sacrifier la qualité ou la cohérence.</p>
						<p style="margin-bottom:5px;font-weight:bold;">→ Profiter de standards de qualité et d’accessibilité.</p>
						<p style="margin-bottom:10px;">Standards de qualité : Avec ses composants validés et testés, le design system vous assure que la qualité soit maintenue à travers toutes les interfaces, qu'il s'agisse d'éléments visuels, d'interactions ou de fonctionnalités.</p>
						<p style="margin-bottom:20px;">Standards d’accessibilité : </p>
        				 </v-expansion-panel-text>
                    </v-expansion-panel>
			   </v-expansion-panels>
				<v-expansion-panels style="margin-top:20px;">
                    <v-expansion-panel>     
                      <v-expansion-panel-title>
                      <p style="font-weight:bold;"><VIcon :icon="arrowIcon"/>Pour aller plus loin sur le fonctionnement et l’utilisation du design system</p>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
						 <p style="margin-bottom:10px;">Le design system de la CNAM est basé sur la librairie open source Vuetify offrant une grande variétée de composants paramétrables pour répondre aux besoins de nos produits tout en garantissant des mises à jours régulière pour la maintenabilité.</p>
						<p style="margin-bottom:10px;font-weight:bold;font-style: italic;">Mais pourquoi alors utiliser le design system et non directement la librairie vuetify ?</p>
						<p style="margin-bottom:5px;">Le design system vous offre une surcouche de cette librairie afin de :</p>
						<ul style="margin-left: 16px;">
						<li>Personnaliser les composants proposés à la charte graphique de l’Assurance Maladie</li>
						<li>Améliorer certains composants pour s’assurer du respect des critères d’accessibilité (+ développer cette partie)</li>
						<li style="margin-bottom:10px;">Améliorer certains composants pour mieux répondre à nos besoins</li>
						</ul>
						<p style="margin-bottom:10px;font-weight:bold;font-style: italic;">Certains composants sont disponibles dans vuetify mais pas dans le DS ?</p>
						Il peut s’agir de composants qui ne justifient aujourd’hui pas de leur attribuer de surcouche car ils sont pertinents en tant que tels ou encore de composants dont la surcouche n’est pas encore disponible. Il est dans ce cas complètement possible dans une plateforme d’utiliser à la fois des composants du DS et de vuetify, ces deux derniers sont compatibles.
					  </v-expansion-panel-text>
                    </v-expansion-panel>
				</v-expansion-panels>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}
