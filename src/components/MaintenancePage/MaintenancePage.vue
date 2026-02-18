<script setup lang="ts">
	import StatusPage from '../StatusPage/StatusPage.vue'
	import { locales } from './locales'
</script>

<template>
	<StatusPage
		:page-title="locales.pageTitle"
		:message="locales.message"
		:hide-btn="true"
	>
		<template #illustration>
			<slot name="illustration">
				<img
					src="./assets/maintenance.svg"
					alt=""
					aria-hidden="true"
				>
			</slot>
		</template>
	</StatusPage>
</template>

<style lang="scss" scoped>
img {
	max-height: 290px;
}
</style>
