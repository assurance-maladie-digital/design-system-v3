import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon, VRow, VCol } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { VuetifyItems } from './VuetifyItems'
import { mdiCheckboxMarkedCircleOutline, mdiLinkVariant, mdiAlertCircleOutline } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircleOutline
const linkICon = mdiLinkVariant
const iconAlert = mdiAlertCircleOutline
export default {
	title: 'Guidelines/Vuetify',
}

export const VuetifyPanel: StoryObj = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon },
			setup() {
				return { VuetifyItems, checkIcon, iconAlert, linkICon }
			},
			template: `

				<div v-for="(item, index) in VuetifyItems" :key="index">

					<v-data-table
						:items="item.items"
						:items-per-page="23"
						hide-default-footer>
						<template v-slot:header.name="{ header }">
							Composant Vuetify
						</template>

						<template v-slot:header.errorImportants="{ header }">
							Erreurs bloquantes (Tanaguru)
						</template>
						<template v-slot:item.name="{ item }">
							<v-chip v-if="item.errorImportants === 0 && item.errorIndeterminated === 0"
									style="font-size: 12px; line-height: 15px;">
								<VIcon style="margin-right: 2px;" :icon="checkIcon"/>
								{{ item.name }}
							</v-chip>
							<v-chip v-else style="font-size: 12px; line-height: 15px;">
								<VIcon style="margin-right: 2px;" :icon="iconAlert"/>
								{{ item.name }}
							</v-chip>
						</template>

						<template v-slot:item.solution="{ item }">
							<div v-if="item.solution.length > 0">
							<span v-for="(item, index) in item.solution"
								  style="display:flex; align-items: center; font-size: 12px; line-height: 15px; font-weight: bold">
								{{ item.name }} <a :href="item.href" v-if="item.href">
								<VBtn color="primary" style="margin-left: 5px;" :icon="linkICon" size="small"
									  variant="text"/></a>
							</span>
							</div>
						</template>

						<template v-slot:item.errorImportants="{ item }">
							<div v-if="item.errorImportants.length === 0">
								<p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px;">Pas d'erreur
									d'accessibilité relevée à ce jour</p>
							</div>
							<div v-else v-for="item in item.errorImportants" :key="index"
								 style="width: 100% !important; font-size: 12px; line-height: 15px;">
								<p style="margin-top: 5px; margin-bottom: 5px;">
									<span style="font-weight: bold;">{{ item.match('[0-9.]+')?.join('') || '' }} </span>
									{{ item.replace(/[0-9.]/g, '') }}
								</p>
							</div>
						</template>

						<template v-slot:item.errorIndeterminated="{ item }">
							<div v-if="item.errorIndeterminated.length === 0">
								<p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px;">Pas d'erreur
									d'accessibilité relevée à ce jour</p>
							</div>
							<div v-else v-for="item in item.errorIndeterminated" :key="index"
								 style="width: 100% !important; font-size: 12px; line-height: 15px;">
								<p style="margin-top: 5px; margin-bottom: 5px;">
									<span style="font-weight: bold;">{{ item.match('[0-9.]+')?.join('') || '' }} </span>
									{{ item.replace(/[0-9.]/g, '') }}
								</p>
							</div>
						</template>

						<template v-slot:header.errorIndeterminated="{ header }">
							Erreurs indéterminées (Tanaguru)
						</template>
						<template v-slot:header.solution="{ header }">
							Solution
						</template>

						<template v-slot:header.href="{ header }" style="display:none">
							<th v-if="false" style="display:none"></th>
						</template>

						<template v-slot:item.href="{ item }" style="display:none">
							<td v-if="false">{{ item.someColumn }}</td>
						</template>
					</v-data-table>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

export const Legende: StoryObj = {
	args: {
	},
	render: (args) => {
		return {
			components: { VIcon, VRow, VCol },
			setup() {
				return { args, checkIcon, iconAlert }
			},
			template: `
			  <p style="color: grey;font-size: 11px; margin-bottom: 12px;">Date de conception: 13/12/2024</p>

				<VRow class="mt-2 mb-5">
				<VCol cols="12" sm="12" class="m-2 p-2 v-col-auto">
				<div style="font-size: 13px;">
					<p>L'étude relève que la majorité des composants garantissent l'accessibilité numérique par défaut tel que défini par le RGAA. <br />Nous identifions néanmoins pour certains composants qu'un travail d'ajustement est nécessaire. Ce travail peut être réalisé directement par les produits.<br />Dans une démarche d'accélération de la fabrication, nous proposons pour chaque composant relevant d'un manque sur le sujet des solutions afin d'en faciliter la mise en conformité. Ces solutions peuvent être de nature : composant ou recommandation.</p>
					<br />
					<p>Pour chaque composant, nous indiquons les erreurs remontées par l'outil Tanaguru : Erreurs bloquantes et indéterminées.<br />Ces erreurs doivent être analysées contextuellement. Pour rappel, l'accessibilité numérique ne se mesure par sur des composants seuls dénués de contexte.<br />Une appréciation de la part du développeur est nécessaire pour en évaluer la pertinence.</p>
				</div>
                </VCol>

                <VCol cols="12" sm="4" class="m-2 p-2 v-col-auto">
				  <p style="font-size: 13px;"><VIcon style="margin-right: 2px;" :icon="iconAlert" />  Composant non conforme par défaut.</p>
                  <p style="font-size: 13px;"><VIcon style="margin-right: 2px;" :icon="checkIcon" />  Composant conforme.</p>
                </VCol>
               
              </VRow>
			 
            `,
		}
	},
	tags: ['!dev'],
}
