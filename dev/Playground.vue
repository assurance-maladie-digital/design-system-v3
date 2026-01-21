<script setup lang="ts">
	import SubHeader from '@/components/SubHeader/SubHeader.vue'

</script>
<template>
	<SubHeader
		back-btn-text="Retour"
	>
		<template #additional-informations>
			<VBtn class="text-primary mr-5 font-weight-bold">
				Actions dossier
			</VBtn>
		</template>
	</SubHeader>
</template>
