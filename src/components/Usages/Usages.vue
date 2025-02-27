<script lang="ts" setup>
	import { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { checkIcon, croixIcon } from '@/constants/icons'
	import { ref } from 'vue'

	const props = withDefaults(defineProps<CustomizableOptions & {
		itemsToDo?: []
		itemsNotToDo?: []

	}>(), {
		modelValue: null,
		itemsToDo: () => [],
		itemsNotToDo: () => [],
	})

	const iconCheck = ref(checkIcon)
	const iconCross = ref(croixIcon)

</script>

<template>
	<div
		class="mt-8"
		style="display: flex;justify-content: center;"
	>
		<div
			cols="12"
			sm="5"
			class="m-2 p-2 mr-2 v-col-auto"
			style="background-color: '#E5F7F4';"
		>
			<div
				class="d-flex"
				style="color: '#004439'; font-weight: 'bold';"
			>
				<VIcon :icon="iconCheck" />
				<p class="font-weight-bold mb-2">
					À faire
				</p>
			</div>
			<ul style="font-size: 13px;margin-left: 20px;">
				<li
					v-for="(item, index) in itemsToDo"
					:key="index"
				/>
			</ul>
		</div>
		<div
			cols="12"
			sm="5"
			class="m-2 p-2 v-col-auto"
			style="background-color: '#FCEDEB';"
		>
			<div
				class="d-flex"
				style="color: '#B33F2E'; font-weight: 'bold';"
			>
				<VIcon :icon="iconCross" />
				<p class="font-weight-bold mb-2">
					À ne pas faire
				</p>
			</div>
			<ul style="font-size: 13px;margin-left: 20px;">
				<li
					v-for="(item, index) in props.itemsNotToDo"
					:key="index"
				/>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
