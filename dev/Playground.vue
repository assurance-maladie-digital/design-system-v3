<script setup lang="ts">
	import DataList from '@/components/DataList/DataList.vue'
	// import DataListGroup from '@/components/DataListGroup/DataListGroup.vue'

	import { mdiCalendar, mdiAccount, mdiInformationOutline, mdiDoctor, mdiCardAccountDetails, mdiPencil } from '@mdi/js'

	const items = [
		{
			key: 'Nom',
			value: 'Dupont',
		},
		{
			key: 'Prénom',
			value: 'Paul',
		},
		{
			key: 'Date de naissance',
			value: '24/09/1970',
		},
	]

	const itemsWithIcons = [
		{
			key: 'Nom',
			value: 'Dupont',
			icon: 'accountIcon',
		},
		{
			key: 'Prénom',
			value: 'Paul',
			icon: 'accountIcon',
		},
		{
			key: 'Date de naissance',
			value: '24/09/1970',
			icon: 'calendarIcon',
		},
	]

	const icons = {
		calendarIcon: mdiCalendar,
		accountIcon: mdiAccount,
		mdiInformationOutline: mdiInformationOutline,
	}

	const itemsWithChips = [
		{
			key: 'Nom',
			value: 'Dupont',
			chip: true,
		},
		{
			key: 'Prénom',
			value: 'Paul',
			chip: true,
		},
		{
			key: 'Date de naissance',
			value: '24/09/1970',
			chip: true,
		},
		{
			key: 'Statut',
			value: 'Enregistré',
			chip: true,
			options: {
				chip: {
					color: 'success',
				},
			},
		},
	]

	const itemsWithHtmlValues = [
		{
			key: 'Nom',
			value: 'Dupont',
		},
		{
			key: 'Prénom',
			value: 'Paul',
		},
		{
			key: 'Adresse',
			value: '50 Avenue du Professeur André Lemierre<br>75020 Paris',
		},
	]

	const itemOptions = {
		icon: {
			color: 'grey-darken-20',
			class: 'mt-0 mr-4',
		},
	}

	const itemsWithOptions = [
		{
			key: 'Nom',
			value: 'Dupont',
			icon: 'accountIcon',
			chip: true,
			options: itemOptions,
		},
		{
			key: 'Prénom',
			value: 'Paul',
			icon: 'accountIcon',
			chip: true,
			options: itemOptions,
		},
		{
			key: 'Date de naissance',
			value: '24/09/1970',
			icon: 'calendarIcon',
			chip: true,
			options: itemOptions,
		},
	]

	const itemsWithActions = [
		{
			key: 'Nom',
			value: 'Dupont',
		},
		{
			key: 'Prénom',
			value: 'Paul',
		},
		{
			key: 'Date de naissance',
			value: '24/09/1970',
			action: 'Modifier',
		},
	]

	const itemsList = [
		{
			title: 'Informations patient',
			items: [
				{
					key: 'Nom',
					value: 'Dupont',
					icon: 'accountIcon',
					chip: true,
				},
				{
					key: 'Prénom',
					value: 'Paul',
					icon: 'accountIcon',
				},
				{
					key: 'Date de naissance',
					value: '24/09/1970',
					icon: 'calendarIcon',
					action: 'Modifier',
				},
			],
		},
		{
			title: 'Médecin traitant',
			items: [
				{
					key: 'Nom du praticien',
					value: 'Gérard Leblanc',
					icon: 'doctorIcon',
				},

				{
					key: 'N° RPPS',
					value: 'XXXXX',
					icon: 'cardAccountIcon',
				},
			],
		},
		{
			title: 'Autres informations',
			items: [
				{
					key: 'Dernière modification',
					value: '04/06/2020',
					icon: 'editIcon',
				},
			],
		},
	]

	const iconsList = {
		calendarIcon: mdiCalendar,
		accountIcon: mdiAccount,
		doctorIcon: mdiDoctor,
		cardAccountIcon: mdiCardAccountDetails,
		editIcon: mdiPencil,
	}

	function updateBirthdate(index: number) {
		console.log(itemsWithActions[index].value)
		itemsWithActions[index].value = '25/09/1970'
	}
</script>

<template>
	<h2>Sans icone</h2>
	<div class="d-flex">
		<DataList :items="items" />
		<DataList
			:items="items"
			row
		/>
		<DataList
			:items="items"
			loading
		/>
		<DataList
			:items="items"
			loading
			row
		/>
		<DataList
			:items="items"
			heading-loading
			loading
		/>
		<DataList
			:items="items"
			:items-number-loading="4"
			loading
		/>
		<DataList
			:items="items"
			list-title="Exemple"
		/>
	</div>
	<div class="d-flex">
		<h2>Avec icone</h2>
		<DataList
			:items="itemsWithIcons"
			:icons="icons"
		/>
	</div>
	<div class="d-flex">
		<h2>Avec action</h2>
		<DataList
			:items="itemsWithActions"
			@click:item-action="updateBirthdate"
		/>
	</div>
	<div class="d-flex">
		<h2>Avec chips</h2>
		<DataList :items="itemsWithChips" />
	</div>
	<div class="d-flex">
		<DataList
			:items="itemsWithHtmlValues"
			item-width="auto"
			render-html-value
		/>

		<DataList
			:items="itemsWithOptions"
			:icons="icons"
		/>

		<DataList :items="items">
			<template #title>
				<h3 class="text-subtitle-1 font-weight-bold mb-3">
					Liste de données

					<VTooltip bottom>
						<template #activator="{ props }">
							<VIcon v-bind="props">
								{{ icons.mdiInformationOutline }}
							</VIcon>
						</template>

						<span>Cette liste contient des données concernant le patient.</span>
					</VTooltip>
				</h3>
			</template>
		</DataList>
	</div>
	<!--<div>
		<h2> DataList group</h2>
		<DataListGroup
		:items="itemsList"
		:icons="iconsList"
		@click:list-item="updateBirthdate"
		/>
		<br /><br />
		<DataListGroup
		:items="itemsList"
		item-width="300px"
		/>
		<br /><br />
		<DataListGroup
		:items="itemsList"
		loading
		/>
		</div>-->
</template>
