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
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { vRgaaSvgFix } from '@/directives/rgaaSvgFix'

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
		role?: string
		ariaLive?: 'off' | 'polite' | 'assertive'
	}>(), {
		type: 'info',
		closable: false,
		variant: 'tonal',
		role: 'alert',
		ariaLive: undefined,
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
		:role="props.role"
		:aria-live="props.ariaLive"
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
					v-rgaa-svg-fix
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
				v-if="props.closable"
				#close
			>
				<VBtn
					:color="props.variant === 'outlined' ? undefined : 'primary'"
					:ripple="false"
					variant="text"
					width="auto"
					class="alert-close-btn"
					@click="dismissAlert"
				>
					<SyIcon
						size="large"
						:icon="mdiClose"
						decorative
					/>
					<span>
						{{ locales.close }}
					</span>
				</VBtn>
			</template>
		</VAlert>
	</div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.sy-alert {
	display: contents;
}

.alert {
	padding: var(--v-padding-4);
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
	// Hauteur naturelle du bouton (comme les autres boutons DS) mais centré verticalement
	// sur toute la hauteur de l'alerte (grid-row span 2 + align-self center).
	align-self: center;
	height: auto;
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
	letter-spacing: normal;

	span {
		font-size: var(--v-fontSize-liensEtLibelles);
	}

	// Ring DS. Le fond de l'alerte reste clair même en thème dark → ring en primary
	// (pas onPrimary) pour rester visible. Le `::after` natif du VBtn est masqué par
	// l'override global `_btns.scss`. (Avant : `var(--v-theme-primary)` sur un triplet
	// RGB était invalide → le ring retombait en noir.)
	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 3px;
	}

	.v-btn__overlay {
		display: none;
	}
}

@media screen and (width <= 440px) {
	.alert {
		display: flex;
		flex-direction: column;
		background-color: rgb(var(--v-theme-surface));

		:deep(.v-alert__content) {
			align-self: flex-start !important;
			margin-top: var(--v-padding-4);
		}

		:deep(.v-alert__close) {
			margin-top: var(--v-padding-4);
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
		color: rgb(var(--v-theme-onSurface)) !important;

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
				fill: map.get($map, 'icon');
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
			'background': rgb(var(--v-theme-warningVariant)),
			'accent': rgb(var(--v-theme-onWarningVariant)),
			'border': rgb(var(--v-theme-onWarningVariant)),
			'icon': rgb(var(--v-theme-onWarningVariant)),
			'icon-bg': rgb(var(--v-theme-warningVariantLighten)),
		)
	);
	@include redesign(
		'success',
		(
			'background': rgb(var(--v-theme-successVariant)),
			'accent': rgb(var(--v-theme-onSuccessVariant)),
			'border': rgb(var(--v-theme-onSuccessVariant)),
			'icon':rgb(var(--v-theme-onSuccessVariant)),
			'icon-bg': rgb(var(--v-theme-successVariantLighten)),
		)
	);
	@include redesign(
		'error',
		(
			'background': rgb(var(--v-theme-errorVariant)),
			'accent': rgb(var(--v-theme-error)),
			'border': rgb(var(--v-theme-error)),
			'icon':rgb(var(--v-theme-error)),
			'icon-bg': rgb(var(--v-theme-errorVariantLighten)),
		)
	);
	@include redesign(
		'info',
		(
			'background': rgb(var(--v-theme-infoVariant)),
			'accent': rgb(var(--v-theme-info)),
			'border': rgb(var(--v-theme-info)),
			'icon':rgb(var(--v-theme-info)),
			'icon-bg': rgb(var(--v-theme-infoVariantLighten)),
		)
	);
}

.v-alert.v-theme--dark {
	&.v-alert--variant-outlined {
		background-color: rgb(var(--v-theme-surface)) !important;
	}

	.alert-close-btn {
		color: black !important;

		// Le fond de l'alerte reste clair en thème dark → ring primary (comme en clair).
		&:focus-visible {
			outline-color: rgb(var(--v-theme-primary));
		}
	}
}
</style>
