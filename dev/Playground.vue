<script setup lang="ts">
	import SyServerTable from '@/components/Tables/SyServerTable/SyServerTable.vue'
	import { StateEnum } from '@/components/Tables/common/constants/StateEnum'
	import type { DataOptions } from '@/components/Tables/common/types'
	import { ref } from 'vue'

  interface User {
    name: string
    department: string
    status: string
  }

  interface DataObj {
    items: User[]
    total: number
  }

  const totalFilteredUsers = ref(0)
  const filteredUsers = ref<User[]>([])
  const state = ref(StateEnum.IDLE)

  const options = ref<DataOptions>({
    itemsPerPage: 5,
    page: 1,
    filters: [],
  })

  const headers = [
    {
      title: 'Nom',
      key: 'name',
      filterable: true,
      filterType: 'text'
    },
    {
      title: 'Département',
      key: 'department',
      filterable: true,
      filterType: 'select',
      hideMessages: true,
      filterOptions: [
        { text: 'RH', value: 'RH' },
        { text: 'IT', value: 'IT' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Marketing', value: 'Marketing' },
      ]
    },
    {
      title: 'Statut',
      key: 'status',
      filterable: true,
      filterType: 'select',
      hideMessages: true,
      filterOptions: [
        { text: 'Actif', value: 'Actif' },
        { text: 'En congé', value: 'En congé' },
        { text: 'Inactif', value: 'Inactif' },
      ]
    }
  ]

  const fetchData = async (): Promise<void> => {
    const { items, total } = await getDataFromApi(options.value)
    filteredUsers.value = items
    totalFilteredUsers.value = total
  }

  const wait = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
    state.value = StateEnum.PENDING
    await wait(1000)

    return new Promise((resolve) => {
      // Get all users
      let items: User[] = getUsers()

      // Apply filters on server side
      if (filters && filters.length > 0) {
        filters.forEach((filter: FilterOption) => {
          const { key, value, type } = filter

          items = items.filter(item => {
            const itemValue = item[key as keyof User]

            if (type === 'select') {
              return itemValue === value
            } else {
              return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
            }
          })
        })
      }

      const total = items.length

      // Apply sorting
      if (sortBy && sortBy.length > 0) {
        items = items.sort((a, b) => {
          const key = sortBy[0].key as keyof User
          const order = sortBy[0].order === 'asc' ? 1 : -1

          return String(a[key]) > String(b[key]) ? order : -order
        })
      }

      // Apply pagination
      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      }

      resolve({ items, total })
      state.value = StateEnum.RESOLVED
    })
  }

  const getUsers = (): User[] => {
    return [
      { name: 'Jean Dupont', department: 'RH', status: 'Actif' },
      { name: 'Marie Martin', department: 'IT', status: 'En congé' },
      { name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
      { name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
      { name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
      { name: 'Julie Bernard', department: 'RH', status: 'Actif' },
      { name: 'Nicolas Moreau', department: 'Finance', status: 'En congé' },
      { name: 'Camille Dubois', department: 'Marketing', status: 'Inactif' },
      { name: 'Alexandre Lefebvre', department: 'IT', status: 'Actif' },
      { name: 'Émilie Girard', department: 'RH', status: 'En congé' },
      { name: 'Lucas Roux', department: 'Finance', status: 'Actif' },
      { name: 'Chloé Lambert', department: 'Marketing', status: 'Actif' },
      { name: 'Maxime Simon', department: 'IT', status: 'Inactif' },
      { name: 'Laura Fournier', department: 'RH', status: 'Actif' },
      { name: 'Antoine Mercier', department: 'Finance', status: 'En congé' },
    ]
  }

  // Initialize data
  fetchData()
</script>

<template>
	<SyServerTable
    v-model:options="options"
    :items="filteredUsers"
    :headers="headers"
    :server-items-length="totalFilteredUsers"
    :loading="state === StateEnum.PENDING"
    suffix="server-filter-select"
    :show-filters="true"
    @update:options="fetchData"
  />
</template>
