<script setup lang="ts">
	const props = withDefaults(defineProps<{
		width?: number | string
		height?: number | string
		title?: string
		description?: string
	}>(), {
		width: 783,
		height: 629,
		title: 'Niveaux de maturité de la démarche d’écoconception',
		description: 'Graphique circulaire interactif présentant les différents axes de la démarche.',
	})
</script>

<template>
	<svg
		class="eco-schema"
		:width="props.width"
		:height="props.height"
		viewBox="0 0 783 629"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-labelledby="schema-title schema-description"
	>
		<title id="schema-title">
			{{ props.title }}
		</title>

		<desc id="schema-description">
			{{ props.description }}
		</desc>

		<rect
			width="783"
			height="600"
			transform="translate(0 27.9502)"
			fill="white"
		/>

		<!-- Fond bleu -->
		<g
			class="schema-background"
			aria-hidden="true"
		>
			<path
				d="M391.5 157.95C485.388 157.95 561.5 234.062 561.5 327.95C561.5 421.839 485.388 497.95 391.5 497.95C297.612 497.95 221.5 421.839 221.5 327.95C221.5 234.062 297.612 157.95 391.5 157.95Z"
				fill="white"
				stroke="#3D67AE"
				stroke-width="150"
			/>

			<path
				d="M391.5 269.95C423.533 269.95 449.5 295.918 449.5 327.95C449.5 359.983 423.533 385.95 391.5 385.95C359.467 385.95 333.5 359.983 333.5 327.95C333.5 295.918 359.467 269.95 391.5 269.95Z"
				stroke="#B1EFAB"
				stroke-width="100"
			/>
		</g>

		<!-- Segment violet -->
		<g
			class="schema-segment schema-segment--strategy"
			tabindex="0"
			role="button"
			aria-label="Stratégie"
		>
			<path
				d="M394.777 168.431L396.537 84.4411C446.31 85.4838 494.574 101.727 534.85 130.99C575.125 160.253 605.486 201.136 621.857 248.151L542.527 275.771C531.79 244.943 511.881 218.137 485.471 198.951C459.061 179.764 427.414 169.114 394.777 168.431Z"
				fill="#ECE1FF"
				stroke="#9747FF"
				stroke-width="0.84"
			/>

			<path
				d="M392.59 275.96L393.76 219.97C415.79 220.432 437.152 227.621 454.979 240.573C472.805 253.526 486.243 271.621 493.49 292.43L440.61 310.85C437.121 300.83 430.651 292.117 422.067 285.881C413.484 279.644 403.198 276.182 392.59 275.96Z"
				fill="#ECE1FF"
				stroke="#9747FF"
				stroke-width="0.84"
			/>

			<path
				d="M464.09 225.15L457.71 242.77L449.3 236.66L464.09 225.15Z"
				fill="#9747FF"
				fill-opacity="0.8"
			/>
		</g>

		<!-- Segment jaune -->
		<g
			class="schema-segment schema-segment--architecture"
			tabindex="0"
			role="button"
			aria-label="Architecture"
		>
			<path
				d="M544.67 281.7L625.09 257.43C639.477 305.088 638.942 356.006 623.557 403.351C608.172 450.696 578.674 492.203 539.02 522.3L488.24 455.39C514.242 435.653 533.584 408.434 543.671 377.387C553.757 346.34 554.106 312.951 544.67 281.7Z"
				fill="#FCF0D3"
				stroke="#F0B323"
				stroke-width="0.84"
			/>

			<path
				d="M441.279 312.92L494.889 296.73C501.261 317.826 501.026 340.366 494.218 361.324C487.409 382.283 474.352 400.657 456.799 413.98L422.939 369.37C431.39 362.956 437.676 354.109 440.955 344.019C444.233 333.929 444.346 323.077 441.279 312.92Z"
				fill="#FCF0D3"
				stroke="#F0B323"
				stroke-width="0.84"
			/>

			<path
				d="M512.03 366.65L493.3 366.03L496.51 356.15L512.03 366.65Z"
				fill="#F0B323"
			/>
		</g>

		<!-- Segment rose -->
		<g
			class="schema-segment schema-segment--ux"
			tabindex="0"
			role="button"
			aria-label="UX et UI"
		>
			<path
				d="M482.81 459.33L530.75 528.31C489.872 556.72 441.281 571.947 391.5 571.947C341.719 571.947 293.128 556.72 252.25 528.31L300.19 459.33C326.995 477.959 358.857 487.943 391.5 487.943C424.143 487.943 456.005 477.959 482.81 459.33Z"
				fill="#FFD5EA"
				stroke="#ED76B3"
				stroke-width="0.84"
			/>

			<path
				d="M421.179 370.65L453.139 416.63C435.045 429.207 413.536 435.948 391.499 435.948C369.463 435.948 347.954 429.207 329.859 416.63L361.819 370.65C370.532 376.706 380.889 379.952 391.499 379.952C402.11 379.952 412.467 376.706 421.179 370.65Z"
				fill="#FFD5EA"
				stroke="#ED76B3"
				stroke-width="0.84"
			/>

			<path
				d="M391.5 454.95L386.3 436.95H396.7L391.5 454.95Z"
				fill="#ED76B3"
			/>
		</g>

		<!-- Segment bleu clair -->
		<g
			class="schema-segment schema-segment--development"
			tabindex="0"
			role="button"
			aria-label="Développement"
		>
			<path
				d="M294.761 455.39L243.981 522.3C204.328 492.203 174.829 450.696 159.444 403.351C144.06 356.006 143.525 305.088 157.911 257.43L238.331 281.7C228.895 312.951 229.244 346.34 239.331 377.387C249.418 408.434 268.76 435.653 294.761 455.39Z"
				fill="#E2F8FF"
				stroke="#66C9EC"
				stroke-width="0.84"
			/>

			<path
				d="M360.062 369.37L326.202 413.98C308.65 400.657 295.593 382.283 288.784 361.324C281.976 340.366 281.741 317.826 288.112 296.73L341.722 312.92C338.656 323.077 338.769 333.929 342.047 344.019C345.326 354.109 351.612 362.956 360.062 369.37Z"
				fill="#E2F8FF"
				stroke="#66C9EC"
				stroke-width="0.84"
			/>

			<path
				d="M272.3 367.65L287.82 357.15L291.03 367.03L272.3 367.65Z"
				fill="#66C9EC"
			/>
		</g>

		<!-- Segment rouge -->
		<g
			class="schema-segment schema-segment--maintenance"
			tabindex="0"
			role="button"
			aria-label="Maintenance"
		>
			<path
				d="M240.4 275.33L161.07 247.71C177.441 200.694 207.802 159.812 248.078 130.549C288.354 101.286 336.617 85.0427 386.39 84L388.15 167.99C355.514 168.673 323.867 179.323 297.457 198.509C271.046 217.696 251.137 244.502 240.4 275.33Z"
				fill="#F9DCD7"
				stroke="#B33F2E"
				stroke-width="0.84"
			/>

			<path
				d="M342.39 310.85L289.51 292.43C296.756 271.621 310.194 253.526 328.021 240.573C345.848 227.621 367.209 220.432 389.24 219.97L390.41 275.96C379.802 276.182 369.516 279.644 360.933 285.881C352.349 292.117 345.879 300.83 342.39 310.85Z"
				fill="#F9DCD7"
				stroke="#B33F2E"
				stroke-width="0.84"
			/>

			<path
				d="M314.3 228.15L329.09 239.66L320.68 245.77L314.3 228.15Z"
				fill="#B33F2E"
			/>
		</g>
	</svg>
</template>

<style scoped>
.eco-schema {
	display: block;
	width: 100%;
	max-width: 783px;
	height: auto;
	overflow: visible;
}

.schema-segment {
	cursor: pointer;
	outline: none;
	transform-box: fill-box;
	transform-origin: center;
	transition:
		transform 180ms ease,
		filter 180ms ease,
		opacity 180ms ease;
}

.schema-segment:hover,
.schema-segment:focus-visible {
	transform: scale(1.035);
	filter: drop-shadow(0 6px 8px rgb(0 0 0 / 18%));
}

.eco-schema:hover .schema-segment:not(:hover) {
	opacity: 0.5;
}

.schema-segment:focus-visible {
	filter:
		drop-shadow(0 0 0.5px #0c419a)
		drop-shadow(0 0 4px #0c419a);
}

@media (prefers-reduced-motion: reduce) {
	.schema-segment {
		transition: none;
	}
}
</style>
