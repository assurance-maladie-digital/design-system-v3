<script setup lang="ts">
	import { computed } from 'vue'
	import { VContainer, VRow, VCol, VCard, VCardTitle, VCardSubtitle } from 'vuetify/components'

	interface Props {
		colorCategory: string
		cnamColors: Record<string, string>
		paColors: Record<string, string>
	}

	const props = defineProps<Props>()

	const theme = computed(() => typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam')
	const displayColors = computed(() => theme.value === 'cnam' ? props.cnamColors : props.paColors)

	const isEmptyObject = (obj: Record<string, string>) => {
		return Object.keys(obj).length === 0
	}
</script>

<template>
	<VContainer>
		<VRow v-if="!isEmptyObject(displayColors)">
			<VCol
				v-for="(color, name) in displayColors"
				:key="name"
				cols="6"
				md="3"
				sm="4"
			>
				<VCard color="grey-lighten-4">
					<VCardTitle style="font-size: medium;">
						{{ name }}
					</VCardTitle>
					<VCardSubtitle>{{ color }}</VCardSubtitle>
					<VCard
						height="70px"
						class="color"
					>
						<div :style="{ backgroundColor: color, height: '100%', width: '100%' }" />
					</VCard>
				</VCard>
			</VCol>
		</VRow>
		<div
			v-else
			class="text-grey"
		>
			Couleurs en cours définition.
		</div>
	</VContainer>
</template>

<style lang="scss" scoped>
	.v-card--variant-elevated.color {
		background: transparent !important;
	}
</style>
