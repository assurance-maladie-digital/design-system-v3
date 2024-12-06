<script setup lang="ts">
	import type { Cookie } from '../types.ts'
	import { headers } from './headers'

	defineProps<{ items: Cookie[] }>()
</script>

<template>
	<VTable class="vd-cookie-table">
		<thead>
			<tr>
				<th
					v-for="(item, index) in headers"
					:key="index"
					:style="{ width: item.width }"
					class="text-left"
				>
					{{ item.label }}
				</th>
			</tr>
		</thead>

		<tbody>
			<tr
				v-for="cookie in items"
				:key="cookie.name"
			>
				<td>{{ cookie.name }}</td>
				<td>
					<slot
						:name="'cookie-description-' + cookie.name"
						:cookie
					>
						{{ cookie.description }}
					</slot>
				</td>
				<td>{{ cookie.conservation }}</td>
			</tr>
		</tbody>
	</VTable>
</template>

<style lang="scss" scoped>
.vd-cookie-table :deep(table) {
	table-layout: fixed;
}
</style>
