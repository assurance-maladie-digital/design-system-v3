<script setup lang="ts">
	import { computed } from 'vue'
	import { locales } from './locales'
	import {
		mdiAlertOutline,
		mdiAlertOctagonOutline,
		mdiCheckCircleOutline,
		mdiInformationOutline,
		mdiClose,
	} from '@mdi/js'

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

	const prependIcon = computed(() => {
		return {
			info: mdiInformationOutline,
			success: mdiCheckCircleOutline,
			warning: mdiAlertOutline,
			error: mdiAlertOctagonOutline,
		}[props.type]
	})

	function dismissAlert() {
		show.value = false
	}

	defineExpose({
		prependIcon,
		dismissAlert,
	})
</script>

<template>
	<VAlert
		v-model="show"
		:type
		:closable
		:variant
		:class="`alert alert--${type}`"
		:color="type"
		:border="variant === 'tonal' ? 'start' : false"
	>
		<template #prepend>
			<VIcon
				class="alert-icon"
				size="1.5rem"
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
			v-if="closable"
			#close
		>
			<VBtn
				:color="variant === 'outlined' ? undefined : 'primary'"
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
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss';
@use 'sass:map';

.alert {
	padding: tokens.$padding-4;
}

.alert-icon {
	border-radius: 50%;
}

:deep(.v-alert__underlay) {
	display: none;
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

	.v-btn__overlay {
		display: none;
	}
}

@media screen and (max-width: 440px) {
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

@media screen and (min-width: 441px) {
	.alert{
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

</style>
