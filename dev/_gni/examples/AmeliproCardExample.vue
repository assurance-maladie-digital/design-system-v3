<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import AmeliproCard from '@/components/Amelipro/AmeliproCard/AmeliproCard.vue'
	import { ref } from 'vue'

	interface IAmeliproCardProps {
		borderColor?: string
		bordered?: boolean
		cardColor?: string
		cardTitle?: string
		classes?: string
		contentClasses?: string
		divider?: boolean
		headerRightWidth?: string
		noCardHeader?: boolean
		rightPart?: boolean
		rightPartClasses?: string
		rightPartWidth?: string
		titleColor?: string
		titleLevel?: number
		uniqueId?: string
	}

	const ameliproCard = ref<typeof AmeliproCard>()

	const valueA = (): IAmeliproCardProps => ({ uniqueId: 'amelipro-card-unique-id-a' })

	const valueB = (): IAmeliproCardProps => ({
		cardTitle: 'Titre B',
		divider: true,
		rightPart: true,
		rightPartClasses: 'bg-gray-100',
		rightPartWidth: '200px',
		uniqueId: 'amelipro-card-unique-id-b',
	})

	const valueC = (): IAmeliproCardProps => ({
		cardColor: '#f0c0c0',
		cardTitle: 'Titre C',
		divider: false,
		noCardHeader: true,
		uniqueId: 'amelipro-card-unique-id-c',
	})

	const dataTest = ref<IAmeliproCardProps>(valueA())
	const values: Record<string, () => IAmeliproCardProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const cardData = {
		content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
			Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
			Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
			vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue
			duis dolore te feugait nulla facilisi.`,
	}

</script>

<template>
	<section>
		<h2>AmeliproCard</h2>
		<p class="data-selector-wrapper">
			Set props data :
			<button @click="selectData('A')">
				Data set A (reset)
			</button> | <button @click="selectData('B')">
				Data set B
			</button> | <button @click="selectData('C')">
				Data set C
			</button>
			-
			<label><input
				v-model="dataTest.divider"
				type="checkbox"
			>divider</label>
		</p>
		<div class="component-wrapper">
			<AmeliproCard
				v-bind="dataTest"
				ref="ameliproCard"
			>
				<template
					v-if="dataTest.rightPart"
					#headerRight
				>
					Header right
				</template>
				<template
					v-if="dataTest.rightPart"
					#rightPartContent
				>
					Right part content
				</template>
				<template #default>
					<p class="mb-0">
						{{ cardData.content }}
					</p>
				</template>
			</AmeliproCard>
		</div>
	</section>
</template>

<style scoped></style>
