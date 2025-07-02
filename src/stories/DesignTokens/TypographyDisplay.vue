<script setup lang="ts">
	import { computed } from 'vue'

	defineProps({
		typographyCategory: {
			type: String,
			required: true,
		},
		cnamTypography: {
			type: Object,
			required: true,
		},
		paTypography: {
			type: Object,
			required: true,
		},
	})

	const theme = computed(() => typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam')
</script>

<template>
	<div class="typography-display">
		<div
			v-if="theme === 'cnam'"
			class="typography-section"
		>
			<div
				v-for="(style, key) in cnamTypography"
				:key="`cnam-${key}`"
				class="typography-item"
			>
				<div
					class="typography-sample"
					:style="{
						fontFamily: style.fontFamily,
						fontSize: style.fontSize,
						fontWeight: style.fontWeight,
						lineHeight: style.lineHeight
					}"
				>
					{{ style.sample }}
				</div>
				<div class="typography-details">
					<div class="typography-name">
						{{ key }}
					</div>
					<div class="typography-description">
						{{ style.description }}
					</div>
					<div class="typography-specs">
						<span>Font: {{ style.fontFamily }}</span>
						<span>Size: {{ style.fontSize }}</span>
						<span>Weight: {{ style.fontWeight }}</span>
						<span>Line height: {{ style.lineHeight }}</span>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="theme === 'pa'"
			class="typography-section"
		>
			<div
				v-for="(style, key) in paTypography"
				:key="`pa-${key}`"
				class="typography-item"
			>
				<div
					class="typography-sample"
					:style="{
						fontFamily: style.fontFamily,
						fontSize: style.fontSize,
						fontWeight: style.fontWeight,
						lineHeight: style.lineHeight
					}"
				>
					{{ style.sample }}
				</div>
				<div class="typography-details">
					<div class="typography-name">
						{{ key }}
					</div>
					<div class="typography-description">
						{{ style.description }}
					</div>
					<div class="typography-specs">
						<span>Font: {{ style.fontFamily }}</span>
						<span>Size: {{ style.fontSize }}</span>
						<span>Weight: {{ style.fontWeight }}</span>
						<span>Line height: {{ style.lineHeight }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.typography-display {
	margin: 20px 0;
}

.typography-section {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.typography-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 16px;
	border: 1px solid rgb(0 0 0 / 5%);
	border-radius: 4px;
	box-shadow: rgb(0 0 0 / 5%) 0 1px 3px 0;
}

.typography-sample {
	margin-bottom: 12px;
}

.typography-details {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.typography-name {
	font-weight: 600;
	font-size: 14px;
}

.typography-description {
	font-size: 14px;
	color: #666;
	margin-bottom: 8px;
}

.typography-specs {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	font-size: 12px;
	color: #666;
}

.typography-specs span {
	background-color: #f5f5f5;
	padding: 4px 8px;
	border-radius: 4px;
}
</style>
