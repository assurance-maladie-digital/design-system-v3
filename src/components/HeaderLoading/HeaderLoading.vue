<script lang="ts" setup>
	import { VSkeletonLoader } from 'vuetify/components/VSkeletonLoader'

	const props = defineProps({
		width: {
			type: String,
			default: '100px',
		},
		height: {
			type: String,
			default: '1rem',
		},
		// Optional ID for the associated status message element
		statusMessageId: {
			type: String,
			default: undefined,
		},
		// Whether this is a standalone loader that should announce itself
		standalone: {
			type: Boolean,
			default: false,
		},
		// Aria label for the standalone loader
		ariaLabel: {
			type: String,
			default: 'Chargement en cours...',
		},
	})
</script>

<template>
	<!-- Standalone skeleton with self-announcing capability -->
	<div
		v-if="props.standalone"
		role="alert"
		aria-live="polite"
		:aria-label="props.ariaLabel"
		class="vd-header-loading-container"
	>
		<VSkeletonLoader
			v-bind="$attrs"
			:width="props.width"
			:height="props.height"
			type="heading"
			class="vd-header-loading"
		/>
	</div>
	<!-- Non-standalone skeleton (to be used with aria-busy parent and separate status message) -->
	<VSkeletonLoader
		v-else
		v-bind="$attrs"
		:width="props.width"
		:height="props.height"
		type="heading"
		aria-hidden="true"
		class="vd-header-loading"
	/>
</template>

<style lang="scss" scoped>
.vd-header-loading-container {
	display: inline-block;
}

.vd-header-loading :deep() {
	background: transparent;

	.v-skeleton-loader__heading {
		width: 100%;
		height: 100%;
		border-radius: 35px;
		margin: 0;

		/* Use #E6E6E6 for a contrast ratio of ~1.5:1 against white background */
		background-color: #e6e6e6 !important;

		/* Disable animations for users who prefer reduced motion */
		@media (prefers-reduced-motion: reduce) {
			animation: none !important;
			position: static !important;
		}
	}
}

// Remove border radius when tile option is activated
.vd-header-loading.v-skeleton-loader--tile :deep() {
	.v-skeleton-loader__heading {
		border-radius: 0;
	}
}

/* Helper class for screen reader only content */
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}
</style>
