<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/label-has-for, no-console */
	import type { A11yComplianceEnum } from '@/components/Amelipro/AmeliproFooter/A11yComplianceEnum'
	import AmeliproFooter from '@/components/Amelipro/AmeliproFooter/AmeliproFooter.vue'
	import type { RouteLocationRaw } from 'vue-router'
	import { ref } from 'vue'

	interface IAmeliproFooterProps {
		a11yCompliance?: string | A11yComplianceEnum
		a11yHref?: string
		a11yTarget?: string
		a11yTo?: RouteLocationRaw
		aboutHref?: string
		aboutTarget?: string
		aboutTo?: RouteLocationRaw
		backOffice?: boolean
		backOfficeText?: string
		cguHref?: string
		cguTarget?: string
		cguTo?: RouteLocationRaw
		configurationHref?: string
		configurationTarget?: string
		configurationTo?: RouteLocationRaw
		legalNoticeHref?: string
		legalNoticeTarget?: string
		legalNoticeTo?: RouteLocationRaw
		noA11y?: boolean
		noAbout?: boolean
		noCgu?: boolean
		noConfiguration?: boolean
		noLegalNotice?: boolean
		noLinkA11y?: boolean
		noPhone?: boolean
		noSiteMap?: boolean
		phoneLink?: boolean
		siteMapHref?: string
		siteMapTarget?: string
		siteMapTo?: RouteLocationRaw
		uniqueId?: string
		version?: string
	}

	const ameliproFooter = ref<typeof AmeliproFooter>()

	const valueA = (): IAmeliproFooterProps => ({ uniqueId: 'amelipro-footer-unique-id-a' })

	const valueB = (): IAmeliproFooterProps => ({
		backOffice: true,
		backOfficeText: 'Accès Back Office',
		uniqueId: 'amelipro-footer-unique-id-b',
		version: '2.3.4',
	})

	const valueC = (): IAmeliproFooterProps => ({
		a11yCompliance: 'COMPLIANT',
		noAbout: true,
		noCgu: true,
		noConfiguration: true,
		noLegalNotice: true,
		noSiteMap: true,
		phoneLink: false,
		uniqueId: 'amelipro-footer-unique-id-c',
		version: '3.0.0-beta',
	})
	const dataTest = ref<IAmeliproFooterProps>(valueA())
	const values: Record<string, () => IAmeliproFooterProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const onChange = (event: any) => console.info('AmeliproFooter:onChange', event)
</script>

<template>
	<section>
		<h2>AmeliproFooter</h2>
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
				v-model="dataTest.backOffice"
				type="checkbox"
			> backOffice</label>
		</p>
		<div class="component-wrapper">
			<AmeliproFooter
				v-bind="dataTest"
				ref="ameliproFooter"
				@change="onChange"
			/>
		</div>
	</section>
</template>

<style scoped>

</style>
