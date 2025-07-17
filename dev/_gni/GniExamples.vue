<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue'

	// const AmeliproAccordionExample = defineAsyncComponent(() => import('./examples/AmeliproAccordionExample.vue'))
	// const AmeliproAccordionGroupExample = defineAsyncComponent(() => import('./examples/AmeliproAccordionGroupExample.vue'));
	// const AmeliproAccordionListExample = defineAsyncComponent(() => import('./examples/AmeliproAccordionListExample.vue'))
	// const AmeliproAccordionResultListExample = defineAsyncComponent(() => import('./examples/AmeliproAccordionResultListExample.vue'));
	// const AmeliproAccordionTemplateExample = defineAsyncComponent(() => import('./examples/AmeliproAccordionTemplateExample.vue'));
	const AmeliproAutoCompleteFieldExample = defineAsyncComponent(() => import('./examples/AmeliproAutoCompleteFieldExample.vue'))
	// const AmeliproBadgeExample = defineAsyncComponent(() => import('./examples/AmeliproBadgeExample.vue'));
	// const AmeliproBreadcrumbExample = defineAsyncComponent(() => import('./examples/AmeliproBreadcrumbExample.vue'));
	const AmeliproBtnExample = defineAsyncComponent(() => import('./examples/AmeliproBtnExample.vue'))
	// const AmeliproCallbackExample = defineAsyncComponent(() => import('./examples/AmeliproCallbackExample.vue'));
	const AmeliproCardExample = defineAsyncComponent(() => import('./examples/AmeliproCardExample.vue'))
	// const AmeliproCarouselExample = defineAsyncComponent(() => import('./examples/AmeliproCarouselExample.vue'));
	const AmeliproCheckboxExample = defineAsyncComponent(() => import('./examples/AmeliproCheckboxExample.vue'))
	// const AmeliproCheckboxGroupExample = defineAsyncComponent(() => import('./examples/AmeliproCheckboxGroupExample.vue'));
	// const AmeliproContentLayoutExample = defineAsyncComponent(() => import('./examples/AmeliproContentLayoutExample.vue'));
	// const AmeliproCustomSelectorExample = defineAsyncComponent(() => import('./examples/AmeliproCustomSelectorExample.vue'));
	const AmeliproDialogExample = defineAsyncComponent(() => import('./examples/AmeliproDialogExample.vue'))
	const AmeliproDisclosureExample = defineAsyncComponent(() => import('./examples/AmeliproDisclosureExample.vue'))
	// const AmeliproErrorTemplateExample = defineAsyncComponent(() => import('./examples/AmeliproErrorTemplateExample.vue'));
	// const AmeliproFilePreviewExample = defineAsyncComponent(() => import('./examples/AmeliproFilePreviewExample.vue'));
	// const AmeliproFiltersExample = defineAsyncComponent(() => import('./examples/AmeliproFiltersExample.vue'));
	const AmeliproFooterExample = defineAsyncComponent(() => import('./examples/AmeliproFooterExample.vue'))
	// const AmeliproHeaderBarExample = defineAsyncComponent(() => import('./examples/AmeliproHeaderBarExample.vue'));
	// const AmeliproHeaderExample = defineAsyncComponent(() => import('./examples/AmeliproHeaderExample.vue'));
	const AmeliproIconBtnExample = defineAsyncComponent(() => import('./examples/AmeliproIconBtnExample.vue'))
	const AmeliproIconExample = defineAsyncComponent(() => import('./examples/AmeliproIconExample.vue'))
	const AmeliproIllustratedDataTileExample = defineAsyncComponent(() => import('./examples/AmeliproIllustratedDataTileExample.vue'))
	// const AmeliproIllustratedRadioGroupExample = defineAsyncComponent(() => import('./examples/AmeliproIllustratedRadioGroupExample.vue'));
	const AmeliproMailTileExample = defineAsyncComponent(() => import('./examples/AmeliproMailTileExample.vue'))
	const AmeliproMessageExample = defineAsyncComponent(() => import('./examples/AmeliproMessageExample.vue'))
	const AmeliproMessagingLayoutExample = defineAsyncComponent(() => import('./examples/AmeliproMessagingLayoutExample.vue'))
	// const AmeliproMultipleFoldingCardExample = defineAsyncComponent(() => import('./examples/AmeliproMultipleFoldingCardExample.vue'));
	// const AmeliproPaginationExample = defineAsyncComponent(() => import('./examples/AmeliproPaginationExample.vue'))
	// const AmeliproPostalAddressCityRowExample = defineAsyncComponent(() => import('./examples/AmeliproPostalAddressCityRowExample.vue'));
	// const AmeliproPostalAddressFieldExample = defineAsyncComponent(() => import('./examples/AmeliproPostalAddressFieldExample.vue'));
	// const AmeliproRadioGroupExample = defineAsyncComponent(() => import('./examples/AmeliproRadioGroupExample.vue'));
	// const AmeliproSelectExample = defineAsyncComponent(() => import('./examples/AmeliproSelectExample.vue'));
	// const AmeliproSwitchExample = defineAsyncComponent(() => import('./examples/AmeliproSwitchExample.vue'));
	// const AmeliproTableExample = defineAsyncComponent(() => import('./examples/AmeliproTableExample.vue'))
	// const AmeliproTextAreaExample = defineAsyncComponent(() => import('./examples/AmeliproTextAreaExample.vue'));
	// const AmeliproTextFieldExample = defineAsyncComponent(() => import('./examples/AmeliproTextFieldExample.vue'));
	// const AmeliproTileBtnExample = defineAsyncComponent(() => import('./examples/AmeliproTileBtnExample.vue'));
	// const AmeliproUploadExample = defineAsyncComponent(() => import('./examples/AmeliproUploadExample.vue'))

	const activeState = ref<Record<string, boolean>>({
		AmeliproAutoCompleteField: false,
		AmeliproBtn: true,
		AmeliproCard: false,
		AmeliproCheckbox: false,
		AmeliproDialog: false,
		AmeliproDisclosure: false,
		AmeliproFooter: false,
		AmeliproIcon: false,
		AmeliproIconBtn: false,
		AmeliproIllustratedDataTile: false,
		AmeliproMailTile: false,
		AmeliproMessage: false,
		AmeliproMessagingLayout: false,
	})
	const selectedComponent = ref<string>('AmeliproBtn')
	const onComponentChange = () => {
		Object.keys(activeState.value).forEach((key) => {
			activeState.value[key] = key === selectedComponent.value
		})
	}
	const isActive = (componentName: string): boolean => activeState.value[componentName] ?? false

	onComponentChange()
</script>

<template>
	<div class="component-wrapper">
		<div class="bg component-selector-wrapper mb-4">
			<h1>Amelipro Components Examples</h1>
			<label for="component-selector">Sélectionner un composant
				<select
					id="component-selector"
					v-model="selectedComponent"
					class="component-selector ml-2"
					@change="onComponentChange"
				>
					<option
						v-for="componentName in Object.keys(activeState)"
						:key="componentName"
						:value="componentName"
					>
						{{ componentName }}
					</option>
				</select> </label>
		</div>
		<div class="bg">
			<!-- <AmeliproAccordionExample v-if="isActive('AmeliproAccordion')" /> -->
			<!-- <AmeliproAccordionGroupExample v-if="isActive('AmeliproAccordionGroup')" /> -->
			<!-- <AmeliproAccordionListExample v-if="isActive('AmeliproAccordionList')" /> -->
			<!-- <AmeliproAccordionResultListExample v-if="isActive('AmeliproAccordionResultList')" /> -->
			<!-- <AmeliproAccordionTemplateExample v-if="isActive('AmeliproAccordionTemplate')" /> -->
			<AmeliproAutoCompleteFieldExample v-if="isActive('AmeliproAutoCompleteField')" />
			<!-- <AmeliproBadgeExample v-if="isActive('AmeliproBadge')" /> -->
			<!-- <AmeliproBreadcrumbExample v-if="isActive('AmeliproBreadcrumb')" /> -->
			<AmeliproBtnExample v-if="isActive('AmeliproBtn')" />
			<!-- <AmeliproCallbackExample v-if="isActive('AmeliproCallback')" /> -->
			<AmeliproCardExample v-if="isActive('AmeliproCard')" />
			<!-- <AmeliproCarouselExample v-if="isActive('AmeliproCarousel')" /> -->
			<AmeliproCheckboxExample v-if="isActive('AmeliproCheckbox')" />
			<!-- <AmeliproCheckboxGroupExample v-if="isActive('AmeliproCheckboxGroup')" /> -->
			<!-- <AmeliproContentLayoutExample v-if="isActive('AmeliproContentLayout')" /> -->
			<!-- <AmeliproCustomSelectorExample v-if="isActive('AmeliproCustomSelector')" /> -->
			<AmeliproDialogExample v-if="isActive('AmeliproDialog')" />
			<AmeliproDisclosureExample v-if="isActive('AmeliproDisclosure')" />
			<!-- <AmeliproErrorTemplateExample v-if="isActive('AmeliproErrorTemplate')" /> -->
			<!-- <AmeliproFilePreviewExample v-if="isActive('AmeliproFilePreview')" /> -->
			<!-- <AmeliproFiltersExample v-if="isActive('AmeliproFilters')" /> -->
			<AmeliproFooterExample v-if="isActive('AmeliproFooter')" />
			<!-- <AmeliproHeaderBarExample v-if="isActive('AmeliproHeaderBar')" /> -->
			<!-- <AmeliproHeaderExample v-if="isActive('AmeliproHeader')" /> -->
			<AmeliproIconBtnExample v-if="isActive('AmeliproIconBtn')" />
			<AmeliproIconExample v-if="isActive('AmeliproIcon')" />
			<AmeliproIllustratedDataTileExample v-if="isActive('AmeliproIllustratedDataTile')" />
			<!-- <AmeliproIllustratedRadioGroupExample v-if="isActive('AmeliproIllustratedRadioGroup')" /> -->
			<!-- <AmeliproMultipleFoldingCardExample v-if="isActive('AmeliproMultipleFoldingCard')" /> -->
			<AmeliproMailTileExample v-if="isActive('AmeliproMailTile')" />
			<AmeliproMessageExample v-if="isActive('AmeliproMessage')" />
			<AmeliproMessagingLayoutExample v-if="isActive('AmeliproMessagingLayout')" />
			<!-- <AmeliproPaginationExample v-if="isActive('AmeliproPagination')" /> -->
			<!-- <AmeliproPostalAddressCityRowExample v-if="isActive('AmeliproPostalAddressCityRow')" /> -->
			<!-- <AmeliproPostalAddressFieldExample v-if="isActive('AmeliproPostalAddressField')" /> -->
			<!-- <AmeliproRadioGroupExample v-if="isActive('AmeliproRadioGroup')" /> -->
			<!-- <AmeliproSelectExample v-if="isActive('AmeliproSelect')" /> -->
			<!-- <AmeliproSwitchExample v-if="isActive('AmeliproSwitch')" /> -->
			<!-- <AmeliproTableExample v-if="isActive('AmeliproTable')" /> -->
			<!-- <AmeliproTextAreaExample v-if="isActive('AmeliproTextArea')" /> -->
			<!-- <AmeliproTextFieldExample v-if="isActive('AmeliproTextField')" /> -->
			<!-- <AmeliproTileBtnExample v-if="isActive('AmeliproTileBtn')" /> -->
			<!-- <AmeliproUploadExample v-if="isActive('AmeliproUpload')" /> -->
		</div>
	</div>
</template>

<style lang="scss">
body {
	background-color: #17181a;
}
.component-selector-wrapper {
	align-items: center;
	margin-bottom: 1rem;
	color: #636266;
}
.component-selector {
	width: 100%;
	max-width: 300px;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: 1px solid #ccc;
	background-color: #2d3036;
	color: #636266;
	font-size: 1rem;
}
.bg {
	background-color: #2d3036;
	padding: 1rem;
	border-radius: 0.5rem;
	h1, h2 {
		color: #636266;
	}
	.data-selector-wrapper {
		margin-bottom: 1rem;
		color: #636266;
	}
	.component-wrapper {
		padding: 1rem;
		background: repeating-linear-gradient(
		135deg,
		#fafafa,
		#fafafa 10px,
		#f5f5f5 10px,
		#f5f5f5 20px
	);
	overflow: hidden;
	max-width: 100%;
	}
}
</style>
