<script lang="ts" setup>
	import { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { checkIcon, croixIcon } from '@/constants/icons'
	import { ref } from 'vue'

	withDefaults(defineProps<CustomizableOptions & {
		items1?: string[]
		items2?: string[]

	}>(), {
		items1: undefined,
		items2: undefined,
	})

	const iconCheck = ref(checkIcon)
	const iconCross = ref(croixIcon)

</script>

<template>
	<VRow
		class="mt-8"
		style="display: flex;justify-content: center;"
	>
		<VCol
			cols="12"
			sm="5"
			class="m-2 p-2 mr-2 v-col-auto check"
		>
			<div
				style="display: flex;"
				class="d-flex check-text"
			>
				<VIcon :icon="iconCheck" />
				<p class="font-weight-bold mb-2">
					À faire
				</p>
			</div>
			<ul style="font-size: 13px;margin-left: 20px;">
				<li
					v-for="(item, index) in items1"
					:key="index"
					style="margin-bottom: 5px;"
				>
					<span>
						{{ item }}
					</span>
				</li>
			</ul>
		</VCol>
		<VCol
			cols="12"
			sm="5"
			class="m-2 p-2 v-col-auto not-check"
		>
			<div class="d-flex not-check-text">
				<VIcon :icon="iconCross" />
				<p class="font-weight-bold mb-2">
					À ne pas faire
				</p>
			</div>
			<ul style="font-size: 13px;margin-left: 20px;">
				<li
					v-for="(item, index) in items2"
					:key="index"
					style="margin-bottom: 5px;"
				>
					<span>
						{{ item }}
					</span>
				</li>
			</ul>
		</VCol>
	</VRow>
</template>

<style lang="scss" scoped>
.check {
	background-color: #e5f7f4;

	.check-text {
		color: #004439;
		font-weight: bold;
	}
}

.not-check {
	background: #fcedeb;

	.not-check-text {
		color: #b33f2e;
		font-weight: bold;
	}
}
</style>
