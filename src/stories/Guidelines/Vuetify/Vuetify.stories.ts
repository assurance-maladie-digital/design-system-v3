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
    
   
								<template v-slot:header.name="{ header }" >
								 Composant Vuetify
     							 </template>
								
								<template v-slot:header.errorImportants="{ header }" >
								Erreurs Bloquantes
     							 </template>
								<template v-slot:item.name="{ item }">
									<v-chip v-if="item.errorImportants == 0 && item.errorIndeterminated == 0" style="font-size: 12px; line-height: 15px;">
										<VIcon style="margin-right: 2px;" :icon="checkIcon" /> {{ item.name }}
									</v-chip>
									<v-chip v-else style="font-size: 12px; line-height: 15px;">
										<VIcon style="margin-right: 2px;" :icon="iconAlert" /> {{ item.name }}
									</v-chip>
									</template>

									<template v-slot:item.solution="{ item }">
									<div v-if="item.solution.length > 0" >
										<span v-for="(item, index) in item.solution" style="display:flex; font-size: 12px; line-height: 15px;">
										{{ item.name }} <a :href="item.href" target="_blank"><VIcon style="margin-left: 3px;" :icon="linkICon" /></a>
									</span>
										</div>
									</template>
									
								 	<template v-slot:item.errorImportants="{ item }" >
										<div v-if="item.errorImportants.length == 0">
										<p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px;">Pas d'erreur d'accessibilité relevée à ce jour</p>
										</div>
										<div  v-else v-for="item in item.errorImportants" :key="index" style="width: 100% !important; font-size: 12px; line-height: 15px;">

										<p style="margin-top: 5px; margin-bottom: 5px;">
										<span style="font-weight: bold;">{{item.match('[0-9.]+')?.join('') || '' }} </span>
										 {{item.replace(/[0-9.]/g, '') }}</p>
										

										</div>						
									</template>




										<template v-slot:item.errorIndeterminated="{ item }" >
										<div v-if="item.errorIndeterminated.length == 0">
										<p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px;">Pas d'erreur d'accessibilité relevée à ce jour</p>
										</div>
										<div v-else v-for="item in item.errorIndeterminated" :key="index" style="width: 100% !important; font-size: 12px; line-height: 15px;">
										<p style="margin-top: 5px; margin-bottom: 5px;">
										<span style="font-weight: bold;">{{item.match('[0-9.]+')?.join('') || '' }} </span>
										 {{item.replace(/[0-9.]/g, '') }}</p>
									

										</div>						
													 </template>



								 <template v-slot:header.errorIndeterminated="{ header }">
								Erreurs Indéterminées
     							 </template>
								  <template v-slot:header.solution="{ header }">
								Solution 
     							 </template>



								   <template v-slot:header.href="{ header }" style="display:none">
										<v-th  v-if="false" style="display:none"></v-th>
										</template>

									
										<template v-slot:item.href="{ item }" style="display:none">
										<v-td v-if="false">{{ item.someColumn }}</v-td> 
										</template>
								</v-data-table
						
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
				<p>Suite à une étude comparative de l'outil Tanaguru et du référentiel RGAA, voici l'analyse des composants Vuetify.</p>
				<p>Bien que Vuetify offre une grande variété de composants prêts à l'emploi, il peut parfois présenter des lacunes en matière d'accessibilité.</p>
				<p>C'est pourquoi nous avons mis en place une solution (de nouveaux composants) qui permettent de pallier à ces soucis.</p>
				</div>
                </VCol>

                <VCol cols="12" sm="4" class="m-2 p-2 v-col-auto">
				  <p style="font-size: 13px;"><VIcon style="margin-right: 2px;" :icon="iconAlert" />  Composant non accessible.</p>
                  <p style="font-size: 13px;"><VIcon style="margin-right: 2px;" :icon="checkIcon" />  Composant accessible.</p>
                </VCol>
               
              </VRow>
			 
            `,
		}
	},
	tags: ['!dev'],
}
