<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/label-has-for */
	import AmeliproDisclosure from '@/components/Amelipro/AmeliproDisclosure/AmeliproDisclosure.vue'
	import { ref } from 'vue'

	interface IAmeliproDisclosureProps {
		isOpen?: boolean
		title: string
		uniqueId: string
	}

	const ameliproDisclosure = ref<typeof AmeliproDisclosure>()

	const valueA = (): IAmeliproDisclosureProps => ({
		title: 'Titre A',
		uniqueId: 'amelipro-disclosure-unique-id-a',
	})

	const valueB = (): IAmeliproDisclosureProps => ({
		title: 'Titre B',
		uniqueId: 'amelipro-disclosure-unique-id-b',
	})

	const valueC = (): IAmeliproDisclosureProps => ({
		isOpen: true,
		title: 'Titre C',
		uniqueId: 'amelipro-disclosure-unique-id-c',
	})

	const dataTest = ref<IAmeliproDisclosureProps>(valueA())
	const values: Record<string, () => IAmeliproDisclosureProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const disclosureData = {
		content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
			Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
			Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
			vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue
			duis dolore te feugait nulla facilisi.`,
	}
</script>

<template>
	<section>
		<h2>AmeliproDisclosure</h2>
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
				v-model="dataTest.isOpen"
				type="checkbox"
			> isOpen</label>
		</p>
		<div class="component-wrapper">
			<AmeliproDisclosure
				v-bind="dataTest"
				ref="ameliproDisclosure"
			>
				{{ disclosureData.content }}
			</AmeliproDisclosure>
		</div>
	</section>
</template>

<style scoped>

</style>
