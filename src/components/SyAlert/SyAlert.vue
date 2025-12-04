<script setup lang="ts">
	import { computed, ref, onMounted, useAttrs } from 'vue'
	import { locales } from './locales'
	import {
		mdiAlertOutline,
		mdiAlertOctagonOutline,
		mdiCheckCircleOutline,
		mdiInformationOutline,
		mdiClose,
	} from '@mdi/js'
	import type { VIcon } from 'vuetify/components'

	defineOptions({
		inheritAttrs: false,
	})
	const show = defineModel<boolean>({
		default: true,
	})

	const props = withDefaults(defineProps<{
		type?: 'success' | 'info' | 'warning' | 'error'
		closable?: boolean
		variant?: 'tonal' | 'outlined'
	}>(), {
		type: 'info',
		closable: false,
		variant: 'tonal',
	})

	const attrs = useAttrs()

	const prependIcon = computed(() => {
		return {
			info: mdiInformationOutline,
			success: mdiCheckCircleOutline,
			warning: mdiAlertOutline,
			error: mdiAlertOctagonOutline,
		}[props.type]
	})

	const emit = defineEmits(['click:close'])

	function dismissAlert() {
		emit('click:close')
		show.value = false
	}

	defineExpose({
		prependIcon,
		dismissAlert,
	})

	const alertIcon = ref<typeof VIcon | null>(null)
	onMounted(() => {
		alertIcon.value?.$el?.querySelector('svg')?.setAttribute('role', 'presentation')
	})
</script>

<template>
	<div
		class="sy-alert"
		role="alert"
	>
		<VAlert
			v-model="show"
			:role="undefined"
			v-bind="attrs"
			:type="props.type"
			:closable="props.closable"
			:variant="props.variant"
			:class="`alert alert--${props.type}`"
			:color="props.type"
			:border="props.variant === 'tonal' ? 'start' : false"
		>
			<template #prepend>
				<VIcon
					ref="alertIcon"
					class="alert-icon"
					size="1.5rem"
					role="presentation"
				>
					<slot name="icon">
						{{ prependIcon }}
					</slot>
				</VIcon>
			</template>

			<template #default>
				<slot />
			</template>

			<template
				v-if="props.closable"
				#close
			>
				<VBtn
					:color="props.variant === 'outlined' ? undefined : 'primary'"
					:ripple="false"
					variant="text"
					width="auto"
					height="100%"
					class="alert-close-btn"
					@click="dismissAlert"
				>
					<VIcon
						size="small"
					>
						{{ mdiClose }}
					</VIcon>

					<span>
						{{ locales.close }}
					</span>
				</VBtn>
			</template>
		</VAlert>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';
@use 'sass:map';

.sy-alert {
	display: contents;
}

.alert {
	padding: tokens.$padding-4;
}

.alert-icon {
	border-radius: 50%;
}

:deep(.v-alert__underlay) {
	display: none;
}

:deep(.v-alert__prepend),
:deep(.v-alert__close) {
	grid-row: 1 / span 2;
	height: 100%;
}

:deep(.v-alert__close) {
	align-self: center;
}

:deep(.v-btn--variant-text .v-btn__overlay) {
	background: transparent !important;
}

.alert-icon :deep(.v-icon__svg) {
	height: 1.5rem !important;
}

.alert-close-btn {
	cursor: pointer;
	line-height: 0;
	text-transform: none;
	font-weight: bold;
	font-size: 0.75rem;
	letter-spacing: normal;

	&:focus-visible {
		outline: solid 2px black !important;
		outline-color: var(--v-primary-base) !important;
		outline-offset: 2px !important;

		&::after {
			visibility: hidden;
		}
	}

	.v-btn__overlay {
		display: none;
	}
}

@media screen and (width <= 440px) {
	.alert {
		display: flex;
		flex-direction: column;
		background-color: tokens.$white-base;

		:deep(.v-alert__content) {
			align-self: flex-start !important;
			margin-top: tokens.$padding-6;
		}

		:deep(.v-alert__close) {
			margin-top: tokens.$padding-4;
			align-self: flex-end;
		}

		.v-alert__prepend > .v-icon {
			background: none !important;
		}
	}
}

@media screen and (width >= 441px) {
	.alert {
		.alert-icon {
			width: 3.5rem !important;
			height: 3.5rem !important;
			display: grid;
			place-items: center;
		}
	}
}

@mixin redesign($type, $map) {
	&.alert--#{$type}.v-alert--variant-tonal {
		background: map.get($map, 'background') !important;
		color: tokens.$colors-text-base !important;

		:deep(.v-alert__border) {
			border-color: map.get($map, 'border') !important;
			opacity: 1 !important;
			border-inline-start-width: 4px;
		}
	}

	&.alert--#{$type}.v-alert--variant-outlined {
		background: transparent !important;

		:deep(.v-alert__border) {
			border-color: map.get($map, 'border') !important;
			opacity: 1 !important;
		}
	}

	&.alert--#{$type},
	&.text-#{$type} {
		.v-alert__prepend > .v-icon {
			background: map.get($map, 'icon-bg');

			:deep(svg) {
				fill: map.get($map, 'accent');
			}
		}
	}

	&.text-#{$type} {
		color: map.get($map, 'accent') !important;
		border-color: map.get($map, 'accent') !important;
	}
}

.v-alert {
	@include redesign(
		'warning',
		(
			'background': tokens.$colors-background-warning,
			'accent': tokens.$colors-border-warning,
			'border': tokens.$colors-border-warning,
			'icon':tokens.$colors-icon-warning,
			'icon-bg': tokens.$colors-background-warning-subdued,
		)
	);
	@include redesign(
		'success',
		(
			'background': tokens.$colors-background-success,
			'accent': tokens.$colors-border-success,
			'border': tokens.$colors-border-success,
			'icon':tokens.$colors-icon-success,
			'icon-bg': tokens.$colors-background-success-subdued,
		)
	);
	@include redesign(
		'error',
		(
			'background': tokens.$colors-background-error,
			'accent': tokens.$colors-border-error,
			'border': tokens.$colors-border-error,
			'icon':tokens.$colors-icon-error,
			'icon-bg': tokens.$colors-background-error-subdued,
		)
	);
	@include redesign(
		'info',
		(
			'background': tokens.$colors-background-info,
			'accent': tokens.$colors-border-info,
			'border': tokens.$colors-border-info,
			'icon':tokens.$colors-icon-info,
			'icon-bg': tokens.$colors-background-info-subdued,
		)
	);
}

.v-alert.v-theme--dark {
	&.v-alert--variant-outlined {
		background-color: tokens.$white-base !important;
	}

	.alert-close-btn {
		color: black !important;

		&:focus-visible {
			outline-color: black !important;
		}
	}
}
</style>
