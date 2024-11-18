import { VBtn, VIcon, VRow, VCol } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

import { mdiGithub } from '@mdi/js';

import { version } from '../../../package.json'

export default {
    title: 'Home/Accueil',
}

export const Header: StoryObj = {
    render: () => {
        return {
            components: { VBtn, VIcon },
            setup() {
                return {
                    githubIcon: mdiGithub,
                    version
                }
            },
            template: `
              <div class="d-flex justify-space-between align-center">
                  <h1 class="title text-md-h3 text-h4 font-weight-medium">Un Design System<br/>pour l’Assurance Maladie</h1>
                  <VBtn
                      :icon="githubIcon"
                      aria-label="GitHub"
                      href="https://github.com/assurance-maladie-digital/design-system-v3"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="d-xs-none d-sm-flex"
                  />
              </div>
              <p class="mt-4 mb-8">
                <b>v{{ version }}</b>
              </p>
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
                    version
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