<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import type { IndexedObject } from '../../types'
	import type { Service } from '../ServiceBtn/types'
	import ServiceBtn from '../ServiceBtn/ServiceBtn.vue'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		items: {
			type: Array as PropType<Service[]>,
			required: true,
		},
		serviceContact: {
			type: Boolean,
			default: false,
		},
		servicePatient: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const btnId = (index: number) => {
		if (props.servicePatient) {
			return `${props.uniqueId}-service-patient-btn-${index}`
		}
		if (props.serviceContact) {
			return `${props.uniqueId}-service-contact-btn-${index}`
		}
		return `${props.uniqueId}-service-ps-btn-${index}`
	}

	const { xs } = useDisplay()
	const iconBgColor = computed<string>(() => {
		if (props.servicePatient) {
			return '#1CB0BA'
		}
		if (props.serviceContact) {
			return convertToHex('ap-pink')
		}
		return '#01B9F5'
	})

	const iconHoverBgColor = computed<string>(() => {
		if (props.servicePatient) {
			return '#006A77'
		}
		if (props.serviceContact) {
			return convertToHex('ap-red-darken-2')
		}
		return '#005DA8'
	})

	const serviceStyles = computed<IndexedObject>(() => {
		const serviceStyleRules: IndexedObject = {
			flexBasis: 'calc((100% / 3) - 8px)',
			maxWidth: 'calc((100% / 3) - 8px)',
			width: 'calc((100% / 3) - 8px)',
		}

		if (xs.value) {
			serviceStyleRules.width = 'calc(50% - 8px)'
			serviceStyleRules.maxWidth = 'calc(50% - 8px)'
			serviceStyleRules.flexBasis = 'calc(50% - 8px)'
		}

		return serviceStyleRules
	})
</script>

<template>
	<ul
		:id="uniqueId"
		class="d-flex flex-wrap list-style-none service-list"
	>
		<li
			v-for="(item, index) in items"
			:id="`${uniqueId}-item-${index}`"
			:key="index"
			class="mx-1 my-2 service-item"
			:style="serviceStyles"
		>
			<ServiceBtn
				:icon-bg-color="iconBgColor"
				:icon-hover-bg-color="iconHoverBgColor"
				:item="item"
				:unique-id="btnId(index)"
			/>
		</li>
	</ul>
</template>
