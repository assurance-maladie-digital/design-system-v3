<script setup lang="ts">
	import { ref } from 'vue'
	import SyTable from '@/components/Tables/SyTable/SyTable.vue'
	import SyServerTable from '@/components/Tables/SyServerTable/SyServerTable.vue'
	import { StateEnum } from '@/components/Tables/common/constants/StateEnum'

	const selected = ref<(string | number)[]>([])

	const options = ref({
		page: 1,
		itemsPerPage: 5,
		sortBy: [{ key: 'lastname', order: 'asc' }],
	})

	const headers = [
		{ title: 'User ID', key: 'userId' },
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	const items = [
		{ userId: 101, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie@example.com' },
		{ userId: 102, firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone@example.com' },
		{ userId: 103, firstname: 'Étienne', lastname: 'Salois', email: 'etienne@example.com' },
	]

	type User = {
		userId: number
		firstname: string
		lastname: string
		email: string
	}

	const selected2 = ref<number[]>([])
	const totalUsers = ref(0)
	const users = ref<User[]>([])

	const headers2 = [
		{ title: 'User ID', key: 'userId' },
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	// Example server fetch using current options
	async function fetchData() {
		const { items, total } = await getDataFromApi(options.value)
		users.value = items
		totalUsers.value = total
	}

	const state = ref(StateEnum.IDLE)

	// Mocked API
	async function getDataFromApi({ page, itemsPerPage }) {
		const all: User[] = [
			{ userId: 201, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie@example.com' },
			{ userId: 202, firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone@example.com' },
			{ userId: 203, firstname: 'Étienne', lastname: 'Salois', email: 'etienne@example.com' },
			{ userId: 204, firstname: 'Marie', lastname: 'Curie', email: 'marizcurie@example.com' },
			{ userId: 205, firstname: 'Albert', lastname: 'Einstein', email: 'albert@example.com' },
			{ userId: 206, firstname: 'Isaac', lastname: 'Newton', email: 'isaac@exemple.com' },
			{ userId: 207, firstname: 'Nikola', lastname: 'Tesla', email: 'nikola@exemple.com' },
		]
		const total = all.length
		const start = (page - 1) * itemsPerPage
		const items = itemsPerPage > 0 ? all.slice(start, start + itemsPerPage) : all
		return { items, total }
	}

	fetchData()
</script>

<template>
	<SyTable
		v-model="selected"
		v-model:options="options"
		:headers="headers"
		:items="items"
		show-select
		selection-key="userId"
		suffix="users-client"
	/>

	{{ selected }}

	<SyServerTable
		v-model="selected2"
		v-model:options="options"
		:items="users"
		:headers="headers2"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		show-select
		selection-key="userId"
		suffix="users-server"
		@update:options="fetchData"
	/>

	{{ selected2 }}
</template>
