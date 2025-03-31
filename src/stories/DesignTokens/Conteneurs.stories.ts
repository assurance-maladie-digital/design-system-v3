import { VRow, VCol } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'Design Tokens/Conteneurs de page',
}

export const Desktop: StoryObj = {
	render: () => {
		return {
			components: { VCol, VRow },
			template: `
              <div style="font-size: 14px">
				  <VRow cols="12" style="z-index: 1; position: relative">
					  <VCol md="6" sm="12">
						  <b>Page container</b><br/>
						  Comportement : Responsive + max width<br/>
						  Paddings : Vertical 40px; Horizontal 56px<br/>
						  Vertical spacing : 32px
						  <br/><br/>
						  <b>Grille</b><br/>
						  Columns : 12<br/>
						  Margin : /<br/>
						  Gutter : 24px
					  </VCol>
					  <VCol md="6" sm="12">
						  <b>Narrow</b><br/>
						  Pour les plateformes n’ayant que très peu d’information à présenter et où la faible largeur du contenu rendra sa lecture plus simple<br/>
						  ex. formulaires<br/>
						  max width = 960px
						  <br/><br/>
						  <b>Wide</b><br/>
						  Pour les plateformes nécessitant l’affichage d’une grande quantité d’information (tableaux complexes, pages d’accueil,  ... )<br/>
						  max width = 1600 px
					  </VCol>
				  </VRow>
				  <img src="/conteneur-desktop.svg" alt="Tablet" class="w-100 mt-4" />
              </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const Tablet: StoryObj = {
	render: () => {
		return {
			components: { VCol, VRow },
			template: `
              <div style="font-size: 14px">
				  <VRow cols="12" style="z-index: 1; position: relative">
					  <VCol md="6" sm="12">
						  <b>Page container</b><br/>
						  Comportement : Responsive<br/>
						  Paddings : Top 40px; Horizontal 24px; Bottom 80px<br/>
						  Vertical spacing : 24px<br/>
						  Format de travail conseillé : 960px.
						  <br/><br/>
						  <b>Grille</b><br/>
						  Columns : 6<br/>
						  Margin : /<br/>
						  Gutter : 24px
					  </VCol>
					  <VCol md="6" sm="12">
						  <img src="/conteneur-tablet.svg" alt="Tablet" class="w-100" />
					  </VCol>
				  </VRow>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const Mobile: StoryObj = {
	render: () => {
		return {
			components: { VCol, VRow },
			template: `
              <div style="font-size: 14px">
				  <VRow cols="12" style="z-index: 1; position: relative">
					  <VCol md="6" sm="12">
						  <b>Page container</b><br/>
						  Comportement : Responsive<br/>
						  Paddings : Top 40px; Horizontal 24px; Bottom 80px<br/>
						  Vertical spacing : 24px<br/>
						  Format de travail conseillé : 360px.
						  <br/><br/>
						  <b>Grille</b><br/>
						  Columns : 6<br/>
						  Margin : /<br/>
						  Gutter : 24px
					  </VCol>
					  <VCol md="6" sm="12">
						  <img src="/conteneur-mobile.svg" alt="Mobile" class="w-50" />
					  </VCol>
				  </VRow>
              </div>
            `,
		}
	},
	tags: ['!dev'],
}
