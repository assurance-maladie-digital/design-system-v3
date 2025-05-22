<script setup lang="ts">
	import SyServerTable from '@/components/Tables/SyServerTable/SyServerTable.vue'
	import { StateEnum } from '@/components/Tables/common/constants/StateEnum'
	import type { DataOptions } from '@/components/Tables/common/types'
	import { ref } from 'vue'

	interface User {
		[key: string]: string
		firstname: string
		lastname: string
		email: string
	}

	interface DataObj {
		items: User[]
		total: number
	}

	const totalUsers = ref(0)
	const users = ref<User[]>([])
	const state = ref(StateEnum.IDLE)

	const options = ref<DataOptions>({
		itemsPerPage: 5,
		sortBy: [{ key: 'lastname', order: 'asc' }],
		page: 1,
	})

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	const fetchData = async (): Promise<void> => {
		const { items, total } = await getDataFromApi(options.value)
		users.value = items
		totalUsers.value = total
	}

	const wait = async (ms: number) => {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
		state.value = StateEnum.PENDING
		await wait(1000)

		return new Promise((resolve) => {
			let items: User[] = getUsers()
			const total = items.length

			if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
					const key = sortBy[0].key
					const order = sortBy[0].order === 'asc' ? 1 : -1

					return a[key] > b[key] ? order : -order
				})
			}

			if (itemsPerPage > 0) {
				items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
			}

			resolve({ items, total })
			state.value = StateEnum.RESOLVED
		})
	}

	const getUsers = (): User[] => {
		return [
			{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
			{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
			{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
			{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com' },
			{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com' },
			{ firstname: 'Louis', lastname: 'Denis', email: 'louis.denis@example.com' },
			{ firstname: 'Édith', lastname: 'Cartier', email: 'edith.cartier@example.com' },
			{ firstname: 'Alphonse', lastname: 'Bouvier', email: 'alphonse.bouvier@example.com' },
			{ firstname: 'Eustache', lastname: 'Dubois', email: 'eustache.dubois@example.com' },
			{ firstname: 'Rosemarie', lastname: 'Quessy', email: 'rosemarie.quessy@example.com' },
			{ firstname: 'Serge', lastname: 'Rivard', email: 'serge.rivard@example.com' },
			{ firstname: 'Jacques', lastname: 'Demers', email: 'jacques.demers@example.com' },
			{ firstname: 'Aimée', lastname: 'Josseaume', email: 'aimee.josseaume@example.com' },
			{ firstname: 'Delphine', lastname: 'Robillard', email: 'delphine.robillard@example.com' },
			{ firstname: 'Alexandre', lastname: 'Lazure', email: 'alexandre.lazure@example.com' },
		]
	}
</script>

<template>
	<SyServerTable
		v-model:options="options"
		:items="users"
		:headers="headers"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		suffix="api-example"
		@update:options="fetchData"
	/>
</template>
