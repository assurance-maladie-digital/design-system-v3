import { VBtn, VIcon, VRow, VCol, VCard, VCardText, VCardTitle } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

import { mdiGithub, mdiArrowRight } from '@mdi/js'

import { version } from '../../../package.json'

export default {
	title: 'Démarrer/Accueil',
}

export const Header: StoryObj = {
	render: () => {
		return {
			components: { VBtn, VIcon, VCol, VRow },
			setup() {
				return {
					arrowRight: mdiArrowRight,
					githubIcon: mdiGithub,
					version,
				}
			},
			template: `
              <div>
				  <span style="position: absolute; top:0; left:-1000px; background-color: rgba(12, 65, 154, 0.2); width: 1000%; height: 100%; z-index: 0" />
				  <VRow cols="12" style="z-index: 1; position: relative">
					  <VCol md="6" sm="12">
						  <h1 class="font-weight-bold text-h4 mb-2">Synapse</h1>
						  <img alt="line" src="/.storybook/public/home-line.svg" width="120" height="5" class="mb-5" />
						  <h2 class="text-h4 mb-5">Documentation d'aide<br/> à la fabrication des IHM<br/>de la CNAM</h2>
						  <VBtn color="primary" href="/?path=/docs/d%C3%A9marrer-introduction--docs">
							  Démarrer
							  <VIcon size="small" class="ml-2" right>{{arrowRight}}</VIcon>
						  </VBtn>
					  </VCol>
					  <VCol md="6" sm="12" class="d-flex justify-center">
						  <img alt="line" src="/.storybook/public/home-illustration.svg" width="auto" height="300"  />
					  </VCol>
				  </VRow>
				  <div class="position-absolute right-0" style="bottom: -10px">
					  <VBtn
						  aria-label="GitHub"
						  href="https://github.com/assurance-maladie-digital/design-system-v3"
						  target="_blank"
						  rel="noopener noreferrer"
						  class="d-flex align-center justify-center text-lowercase"
					  >
						  <b>v{{ version }}</b>
						  <VIcon size="large" class="ml-2">{{ githubIcon }}</VIcon>
					  </VBtn>
				  </div>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const Welcome: StoryObj = {
	render: () => {
		return {
			template: `
              <div class="mt-12 mb-12">
                  <p>Bienvenue dans notre guide d'aide à la conception, pensé par et pour les équipes de la CNAM.</p>
                  <p class="mt-4">Ce guide a été conçu pour accompagner chaque membre de l'équipe dans la création de plateformes web de qualité, alignées avec nos standards et nos valeurs.</p>
                  <p class="mt-4">Vous y trouverez toutes les ressources essentielles pour vous guider tout au long du processus de conception :</p>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const DesignSystem: StoryObj = {
	render: () => {
		return {
			components: { VRow, VCol, VCard, VCardTitle, VCardText },
			template: `
              <div class="mb-12">
                  <h3 class="text-h5 font-weight-bold mb-6 text-primary">Design System</h3>
                  <VRow>
                      <VCol cols="12" md="4">
                          <VCard class="pa-0 card-hover" elevation="0" href="/?path=/docs/fondamentaux-introduction--docs">
							  <img src="/.storybook/public/home-card-tokens.svg" alt="Design Tokens" class="w-100" />
							  <VCardTitle><b>Design Tokens</b></VCardTitle>
                              <VCardText>Les Design Tokens fournissent des recommandations claires et des bonnes pratiques pour assurer l'uniformité et la qualité des interfaces numériques.</VCardText>
                          </VCard>
                      </VCol>
                      <VCol cols="12" md="4">
						  <VCard class="pa-0 card-hover" elevation="0" href="/?path=/docs/composants-structure-headerbar--docs">
							  <img src="/.storybook/public/home-card-components.svg" alt="Components" class="w-100" />
                              <VCardTitle><b>Composants</b></VCardTitle>
                              <VCardText>Les Composants assurent une expérience utilisateur homogène en offrant des éléments réutilisables et standardisés.</VCardText>
                          </VCard>
                      </VCol>
                      <VCol cols="12" md="4">
						  <VCard class="pa-0 card-hover" elevation="0" href="/?path=/docs/templates-errorpage--docs">
							  <img src="/.storybook/public/home-card-templates.svg" alt="Templates" class="w-100" />
                              <VCardTitle><b>Templates</b></VCardTitle>
                              <VCardText>Les Templates facilitent la mise en page en proposant des structures prédéfinies garantissant cohérence et efficacité dans la conception des interfaces.</VCardText>
                          </VCard>
                      </VCol>
                      <VCol cols="12" md="4">
						  <VCard class="pa-0 card-hover" elevation="0" href="/?path=/docs/guide-du-dev-cr%C3%A9er-une-issue--creeruneissue">
							  <img src="/.storybook/public/home-card-dev.svg" alt="Guide du dev" class="w-100" />
                              <VCardTitle><b>Guides du dev</b></VCardTitle>
                              <VCardText>Les Guides du Dev accompagnent les équipes techniques dans l'implémentation du Design System en garantissant une intégration fluide et efficace.</VCardText>
                          </VCard>
                      </VCol>
                  </VRow>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const Guidelines: StoryObj = {
	render: () => {
		return {
			components: { VRow, VCol, VCard, VCardTitle, VCardText },
			template: `
				<div>
					<h3 class="text-h5 font-weight-bold mb-6 text-primary">Guidelines</h3>
					<VRow>
						<VCol cols="12" md="4">
							<VCard class="pa-0 card-hover" elevation="0" href="/?path=/docs/accessibilit%C3%A9-introduction--docs">
								<img src="/.storybook/public/home-card-access.svg" alt="Accessibilité" class="w-100"/>
								<VCardTitle><b>Accessibilité</b></VCardTitle>
								<VCardText>L'Accessibilité permet de concevoir des interfaces inclusives respectant les
									normes d'accessibilité pour une expérience optimale pour tous les utilisateurs.
								</VCardText>
							</VCard>
						</VCol>
						<VCol cols="12" md="4">
							<VCard class="pa-0 card-hover" elevation="0" href="/?path=/docs/accessibilit%C3%A9-introduction--docs">
								<img src="/.storybook/public/home-card-eco.svg" alt="Eco-conception" class="w-100"/>
								<VCardTitle><b>Éco-conception</b></VCardTitle>
								<VCardText>L'éco-conception vise à réduire l'impact environnemental des interfaces
									numériques en incluant des pratiques optimales en termes de performance, de
									consommation énergétique et d'accessibilité.
								</VCardText>
							</VCard>
						</VCol>
					</VRow>
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
