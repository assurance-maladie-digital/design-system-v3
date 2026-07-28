<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

	type Domain = 'strategy' | 'architecture' | 'ux' | 'backend' | 'maintenance'
	type Level = 1 | 2

	type Selection = {
		domain: Domain
		level: Level
	}

	type DomainAction = {
		label: string
		link?: string
	}

	type DomainConfig = {
		key: Domain
		shortLabel: string
		ariaLabel: string
		color: string
		level1: {
			value: string
			status: string
			action: DomainAction
			path: string
			fill: string
			score: { cx: number, cy: number, r: number, fill: string, textFill?: string }
		}
		level2: {
			value: string
			status: string
			action: DomainAction
			path: string
			score: { cx: number, cy: number, r: number, fill: string, textFill?: string }
		}
		label: {
			linePath: string
			circle: { cx: number, cy: number }
			rect: { x: number, y: number }
			text: { x: number, y: number, anchor?: 'start' | 'middle' | 'end' }
		}
	}

	const props = withDefaults(defineProps<{
		width?: number | string
		height?: number | string
		title?: string
		description?: string
	}>(), {
		width: 1346,
		height: 1294,
		title: 'Bonnes pratiques d’écoconception',
		description: 'Graphique interactif présentant cinq domaines et deux niveaux de maturité.',
	})

	const emit = defineEmits<{
		select: [selection: Selection]
	}>()

	const level1Link = '/?path=/docs/éco-conception-bonnes-pratiques-essentielles--docs'
	const level2Link = 'mailto:studio-design.cnam@assurance-maladie.fr?subject=Demande%20de%20référentiel%20d%27écoconception'

	const domains: DomainConfig[] = [
		{
			key: 'strategy',
			shortLabel: 'Stratégie',
			ariaLabel: 'Stratégie',
			color: '#8B5CF6',
			level1: {
				value: 'wip',
				status: 'Work in Progress',
				action: { label: 'Consulter les travaux du niveau 1', link: level1Link },
				path: 'M673 425C708.325 425 742.966 434.746 773.11 453.165L731.397 521.429C713.814 510.685 693.607 505 673 505L673 425Z',
				fill: '#D1BEFB',
				score: { cx: 714.165, cy: 470.68, r: 22, fill: '#8B5CF6', textFill: '#fff' },
			},
			level2: {
				value: '9',
				status: '9 bonnes pratiques disponibles',
				action: { label: 'Consulter le référentiel interne', link: level2Link },
				path: 'M673 247C741.075 247 807.831 265.781 865.92 301.275L803.351 403.673C764.102 379.69 718.997 367 673 367L673 247Z',
				score: { cx: 756.955, cy: 318.585, r: 22, fill: '#fff', textFill: '#8B5CF6' },
			},
			label: {
				linePath: 'M774.389 254.131L787.12 208.888',
				circle: { cx: 788.119, cy: 207.888 },
				rect: { x: 787.537, y: 190.636 },
				text: { x: 793.537, y: 179, anchor: 'middle' },
			},
		},
		{
			key: 'architecture',
			shortLabel: 'Cadrage / Archi',
			ariaLabel: 'Cadrage et architecture',
			color: '#EAB308',
			level1: {
				value: 'wip',
				status: 'Work in Progress',
				action: { label: 'Consulter les travaux du niveau 1', link: level1Link },
				path: 'M777.979 456.241C811.652 478.23 837.57 510.238 852.076 547.747C866.581 585.257 868.943 626.374 858.826 665.298L781.399 645.174C787.3 622.468 785.922 598.483 777.461 576.603C768.999 554.722 753.88 536.051 734.238 523.224L777.979 456.241Z',
				fill: '#F7E19C',
				score: { cx: 814.769, cy: 562.175, r: 22, fill: '#EAB308', textFill: '#fff' },
			},
			level2: {
				value: '21',
				status: '21 bonnes pratiques disponibles',
				action: { label: 'Consulter le référentiel interne', link: level2Link },
				path: 'M875.303 307.204C940.194 349.579 990.14 411.26 1018.09 483.544C1046.05 555.828 1050.6 635.065 1031.1 710.074L914.961 679.888C928.134 629.206 925.059 575.668 906.171 526.827C887.284 477.987 853.536 436.31 809.691 407.679L875.303 307.204Z',
				score: { cx: 962.133, cy: 505.186, r: 22, fill: '#fff', textFill: '#EAB308' },
			},
			label: {
				linePath: 'M1026.56 480.662L1070.39 463.71',
				circle: { cx: 1069.39, cy: 463.71 },
				rect: { x: 1090.05, y: 450.496 },
				text: { x: 1108.05, y: 463.314 },
			},
		},
		{
			key: 'ux',
			shortLabel: 'UX / UI / Dev Front',
			ariaLabel: 'UX, UI et développement front',
			color: '#EC4899',
			level1: {
				value: '20',
				status: '20 bonnes pratiques disponibles',
				action: { label: 'Consulter les pratiques du niveau 1', link: level1Link },
				path: 'M857.294 670.85C845.785 710.238 821.96 744.902 789.311 769.76C756.663 794.618 716.91 808.363 675.88 808.978C634.85 809.594 594.702 797.048 561.323 773.18C527.944 749.312 503.09 715.378 490.404 676.354L566.486 651.623C573.886 674.387 588.384 694.182 607.855 708.105C627.326 722.028 650.746 729.346 674.68 728.987C698.614 728.628 721.804 720.611 740.848 706.11C759.893 691.609 773.791 671.389 780.505 648.412L857.294 670.85Z',
				fill: '#F7B6D6',
				score: { cx: 675.28, cy: 768.983, r: 22, fill: '#EC4899', textFill: '#fff' },
			},
			level2: {
				value: '43',
				status: '43 bonnes pratiques disponibles',
				action: { label: 'Demander le référentiel interne', link: level2Link },
				path: 'M1028.15 720.773C1005.97 796.677 960.058 863.477 897.142 911.381C834.226 959.285 757.618 985.772 678.55 986.958C599.482 988.144 522.113 963.967 457.789 917.972C393.465 871.977 345.569 806.583 321.123 731.38L435.245 694.284C451.763 745.097 484.125 789.282 527.587 820.36C571.05 851.437 623.325 867.773 676.75 866.972C730.174 866.17 781.937 848.274 824.447 815.906C866.958 783.539 897.98 738.403 912.966 687.117L1028.15 720.773Z',
				score: { cx: 677.649, cy: 926.965, r: 26, fill: '#fff', textFill: '#EC4899' },
			},
			label: {
				linePath: 'M678.668 995.958L679.373 1042.95',
				circle: { cx: 679.373, cy: 1041.95 },
				rect: { x: 673.673, y: 1059.95 },
				text: { x: 679.673, y: 1097.27, anchor: 'middle' },
			},
		},
		{
			key: 'backend',
			shortLabel: 'Dev Back',
			ariaLabel: 'Développement back',
			color: '#5BC0EB',
			level1: {
				value: 'wip',
				status: 'Work in Progress',
				action: { label: 'Consulter les travaux du niveau 1', link: level1Link },
				path: 'M488.706 670.85C475.122 624.359 479.61 574.452 501.272 531.132L572.825 566.91C560.189 592.181 557.571 621.293 565.495 648.412L488.706 670.85Z',
				fill: '#BDE6F7',
				score: { cx: 521.611, cy: 603.385, r: 22, fill: '#5BC0EB', textFill: '#fff' },
			},
			level2: {
				value: '12',
				status: '12 bonnes pratiques disponibles',
				action: { label: 'Consulter le référentiel interne', link: level2Link },
				path: 'M317.851 720.773C291.672 631.182 300.322 535.007 342.065 451.524L449.395 505.192C421.19 561.599 415.346 626.583 433.034 687.117L317.851 720.773Z',
				score: { cx: 364.246, cy: 589.233, r: 22, fill: '#fff', textFill: '#5BC0EB' },
			},
			label: {
				linePath: 'M297.52 583.136L250.709 578.926',
				circle: { cx: 249.709, cy: 578.926 },
				rect: { x: 215.789, y: 571.134 },
				text: { x: 205.789, y: 583.952, anchor: 'end' },
			},
		},
		{
			key: 'maintenance',
			shortLabel: 'Maintenance / Run',
			ariaLabel: 'Maintenance et run',
			color: '#C2412D',
			level1: {
				value: 'wip',
				status: 'Work in Progress',
				action: { label: 'Consulter les travaux du niveau 1', link: level1Link },
				path: 'M503.925 526.019C519.894 496.342 543.393 471.391 572.061 453.674C600.729 435.957 633.555 426.097 667.241 425.086L669.64 505.05C649.991 505.64 630.842 511.391 614.119 521.727C597.396 532.062 583.688 546.616 574.373 563.928L503.925 526.019Z',
				fill: '#E7B3AB',
				score: { cx: 593.09, cy: 487.7, r: 22, fill: '#C2412D', textFill: '#fff' },
			},
			level2: {
				value: '18',
				status: '18 bonnes pratiques disponibles',
				action: { label: 'Consulter le référentiel interne', link: level2Link },
				path: 'M347.178 441.672C377.952 384.482 423.237 336.4 478.483 302.257C533.728 268.115 596.987 249.115 661.902 247.166L665.501 367.112C621.64 368.429 578.897 381.267 541.569 404.336C504.241 427.405 473.643 459.894 452.85 498.535L347.178 441.672Z',
				score: { cx: 510.026, cy: 353.297, r: 22, fill: '#fff', textFill: '#C2412D' },
			},
			label: {
				linePath: 'M475.269 296.457L450.559 256.477',
				circle: { cx: 449.559, cy: 255.477 },
				rect: { x: 425.044, y: 232.464 },
				text: { x: 415.044, y: 243.282, anchor: 'end' },
			},
		},
	]

	const levels: Level[] = [1, 2]

	const domainMap = Object.fromEntries(
		domains.map(domain => [domain.key, domain]),
	) as Record<Domain, DomainConfig>

	const hoveredSelection = ref<Selection | null>(null)
	const selectedSelection = ref<Selection | null>(null)
	const activeLevel = ref<Level | null>(null)
	const schemaContainerRef = ref<HTMLElement | null>(null)

	const activeSelection = computed(
		() => hoveredSelection.value ?? selectedSelection.value,
	)

	const selectedInfo = computed(() => {
		const selection = selectedSelection.value

		if (!selection)
			return null

		const domain = domainMap[selection.domain]
		const levelData = selection.level === 1 ? domain.level1 : domain.level2

		return {
			domain,
			level: selection.level,
			...levelData,
		}
	})

	function resetGraph() {
		hoveredSelection.value = null
		selectedSelection.value = null
		activeLevel.value = null
	}

	function handleOutsideClick(event: MouseEvent) {
		if (!(event.target instanceof Node))
			return

		if (!schemaContainerRef.value?.contains(event.target))
			resetGraph()
	}

	function activate(domain: Domain, level: Level) {
		hoveredSelection.value = { domain, level }
	}

	function deactivate() {
		hoveredSelection.value = null
	}

	function selectDomain(domain: Domain, level: Level) {
		// Le niveau reste filtré pendant l'affichage du détail du domaine.
		activeLevel.value = level
		selectedSelection.value = { domain, level }
		hoveredSelection.value = null
		emit('select', selectedSelection.value)
	}

	function selectLevel(level: Level) {
		activeLevel.value = level
		selectedSelection.value = null
		hoveredSelection.value = null
	}

	function isSelected(domain: Domain, level: Level) {
		return activeSelection.value?.domain === domain
			&& activeSelection.value.level === level
	}

	function isMuted(domain: Domain, level: Level) {
		if (activeLevel.value !== null)
			return activeLevel.value !== level

		if (!activeSelection.value || activeSelection.value.level !== level)
			return false

		return !isSelected(domain, level)
	}

	function isLevelMuted(level: Level) {
		return activeLevel.value !== null && activeLevel.value !== level
	}

	function getLevel(domain: DomainConfig, level: Level) {
		return level === 1 ? domain.level1 : domain.level2
	}

	onMounted(() => document.addEventListener('click', handleOutsideClick))
	onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
	<div
		ref="schemaContainerRef"
		class="eco-schema-layout"
		@click.stop
	>
		<svg
			class="eco-schema"
			:width="props.width"
			:height="props.height"
			viewBox="120 140 1100 1000"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-labelledby="eco-schema-title eco-schema-description"
		>
			<title id="eco-schema-title">{{ props.title }}</title>
			<desc id="eco-schema-description">{{ props.description }}</desc>

			<!-- Segments intérieurs : niveau 1 -->
			<g
				v-for="domain in domains"
				:key="`${domain.key}-level-1`"
				class="schema-domain schema-domain--interactive schema-domain--level-1"
				:class="{
					'schema-domain--active': isSelected(domain.key, 1),
					'schema-domain--muted': isMuted(domain.key, 1),
				}"
				tabindex="0"
				role="button"
				:aria-label="`${domain.ariaLabel}, niveau 1`"
				@mouseenter="activate(domain.key, 1)"
				@mouseleave="deactivate"
				@focus="activate(domain.key, 1)"
				@blur="deactivate"
				@click.stop="selectDomain(domain.key, 1)"
				@keydown.enter.prevent="selectDomain(domain.key, 1)"
				@keydown.space.prevent="selectDomain(domain.key, 1)"
			>
				<path
					:d="domain.level1.path"
					:fill="domain.level1.fill"
				/>
			</g>

			<!-- Anneau du niveau 2 -->
			<path
				class="schema-level-selector"
				:class="{
					'schema-level-selector--active': activeLevel === 2,
					'schema-level-element--muted': isLevelMuted(2),
				}"
				d="M918 617C918 752.31 808.31 862 673 862C537.69 862 428 752.31 428 617C428 481.69 537.69 372 673 372C808.31 372 918 481.69 918 617ZM476 617C476 725.8 564.2 814 673 814C781.8 814 870 725.8 870 617C870 508.2 781.8 420 673 420C564.2 420 476 508.2 476 617Z"
				fill="#1E3A8A"
				tabindex="0"
				role="button"
				aria-label="Afficher le niveau 2"
				@click.stop="selectLevel(2)"
				@keydown.enter.prevent="selectLevel(2)"
				@keydown.space.prevent="selectLevel(2)"
			/>

			<!-- Segments extérieurs : niveau 2 -->
			<g
				v-for="domain in domains"
				:key="`${domain.key}-level-2`"
				class="schema-domain schema-domain--interactive schema-domain--level-2"
				:class="{
					'schema-domain--active': isSelected(domain.key, 2),
					'schema-domain--muted': isMuted(domain.key, 2),
				}"
				tabindex="0"
				role="button"
				:aria-label="`${domain.ariaLabel}, niveau 2`"
				@mouseenter="activate(domain.key, 2)"
				@mouseleave="deactivate"
				@focus="activate(domain.key, 2)"
				@blur="deactivate"
				@click.stop="selectDomain(domain.key, 2)"
				@keydown.enter.prevent="selectDomain(domain.key, 2)"
				@keydown.space.prevent="selectDomain(domain.key, 2)"
			>
				<path
					:d="domain.level2.path"
					:fill="domain.color"
				/>
			</g>

			<!-- Centre : niveau 1 -->
			<circle
				class="schema-level-selector"
				:class="{
					'schema-level-selector--active': activeLevel === 1,
					'schema-level-element--muted': isLevelMuted(1),
				}"
				cx="673"
				cy="617"
				r="100"
				fill="#BBF7D0"
				tabindex="0"
				role="button"
				aria-label="Afficher le niveau 1"
				@click.stop="selectLevel(1)"
				@keydown.enter.prevent="selectLevel(1)"
				@keydown.space.prevent="selectLevel(1)"
			/>

			<g
				class="schema-level-text"
				aria-hidden="true"
			>
				<text
					x="673"
					y="620"
					class="schema-level-text__title schema-level-text__title--level-1"
					:class="{ 'schema-level-element--muted': isLevelMuted(1) }"
				>
					Niveau #1
				</text>

				<text
					x="673"
					y="405"
					class="schema-level-text__title schema-level-text__title--level-2"
					:class="{ 'schema-level-element--muted': isLevelMuted(2) }"
				>
					Niveau #2
				</text>
			</g>

			<!-- Scores -->
			<template
				v-for="domain in domains"
				:key="`${domain.key}-scores`"
			>
				<g
					v-for="level in levels"
					:key="`${domain.key}-score-${level}`"
					class="schema-score"
					aria-hidden="true"
				>
					<circle
						:class="{ 'schema-level-element--muted': isLevelMuted(level) }"
						:cx="getLevel(domain, level).score.cx"
						:cy="getLevel(domain, level).score.cy"
						:r="getLevel(domain, level).score.r"
						:fill="getLevel(domain, level).score.fill"
					/>
					<text
						:class="{ 'schema-level-element--muted': isLevelMuted(level) }"
						:x="getLevel(domain, level).score.cx"
						:y="getLevel(domain, level).score.cy"
						:fill="getLevel(domain, level).score.textFill"
						class="schema-score__text"
					>
						{{ getLevel(domain, level).value }}
					</text>
				</g>
			</template>

			<!-- Libellés des domaines -->
			<g
				class="schema-domain-labels"
				aria-hidden="true"
			>
				<g
					v-for="domain in domains"
					:key="`${domain.key}-label`"
				>
					<path
						:d="domain.label.linePath"
						class="schema-domain-labels__line"
					/>
					<circle
						:cx="domain.label.circle.cx"
						:cy="domain.label.circle.cy"
						r="3"
						:fill="domain.color"
					/>
					<rect
						:x="domain.label.rect.x"
						:y="domain.label.rect.y"
						width="12"
						height="12"
						rx="3"
						:fill="domain.color"
					/>
					<text
						:x="domain.label.text.x"
						:y="domain.label.text.y"
						:text-anchor="domain.label.text.anchor"
						class="schema-domain-labels__text"
					>
						{{ domain.shortLabel }}
					</text>
				</g>
			</g>
		</svg>

		<aside class="schema-legend">
			<template v-if="!selectedInfo">
				<h2 class="schema-legend__title">
					Légende
				</h2>

				<p class="schema-legend__subtitle">
					Niveau d’intégration des bonnes pratiques d’écoconception
				</p>

				<div class="schema-legend__levels">
					<div class="schema-level-card">
						<span class="schema-level-card__badge schema-level-card__badge--essential">1</span>
						<div>
							<strong>Niveau #1 · Essentiel</strong>
							<p>
								<span class="schema-level-card__number schema-level-card__number--essential">20</span>
								bonnes pratiques faciles à mettre en œuvre
							</p>
						</div>
					</div>

					<div class="schema-level-card">
						<span class="schema-level-card__badge schema-level-card__badge--advanced">2</span>
						<div>
							<strong>Niveau #2 · Avancé</strong>
							<p>
								<span class="schema-level-card__number schema-level-card__number--advanced">103</span>
								bonnes pratiques pour aller plus loin
							</p>
						</div>
					</div>
				</div>

				<p class="schema-legend__subtitle">
					Nombre de bonnes pratiques par niveau et par phase
				</p>

				<div class="schema-legend__domains">
					<span
						v-for="domain in domains"
						:key="domain.key"
						class="schema-domain-chip"
					>
						<i
							class="schema-domain-chip__dot"
							:style="{ backgroundColor: domain.color }"
						/>
						{{ domain.shortLabel }}
					</span>

					<span class="schema-domain-chip schema-domain-chip--wide">
						<i class="schema-domain-chip__dot schema-domain-chip__dot--wip" />
						wip = à définir entre S2 2026 et S1 2027
					</span>
				</div>
			</template>

			<template v-else>
				<span class="schema-legend__level">Niveau #{{ selectedInfo.level }}</span>

				<div class="schema-legend__domain">
					<span
						class="schema-legend__value"
						:style="{ backgroundColor: selectedInfo.domain.color }"
					>
						{{ selectedInfo.value }}
					</span>
					<span>{{ selectedInfo.domain.shortLabel }}</span>
				</div>

				<p class="schema-legend__status">
					{{ selectedInfo.status }}
				</p>

				<a
					v-if="selectedInfo.action.link"
					:href="selectedInfo.action.link"
					target="_blank"
					rel="noopener noreferrer"
					class="schema-legend__action"
				>
					{{ selectedInfo.action.label }}
					<span aria-hidden="true">→</span>
				</a>

				<span
					v-else
					class="schema-legend__action schema-legend__action--disabled"
				>
					{{ selectedInfo.action.label }}
				</span>
			</template>
		</aside>
	</div>
</template>

<style scoped>
.schema-level-selector {
	cursor: pointer;
	outline: none;
	transition: opacity 180ms ease, filter 180ms ease;
}

.schema-level-selector:hover,
.schema-level-selector--active {
	filter: drop-shadow(0 6px 8px rgb(15 23 42 / 24%));
}

.schema-level-selector:focus-visible,
.schema-domain--interactive:focus-visible {
	filter:
		drop-shadow(0 0 2px #0c419a)
		drop-shadow(0 0 8px #0c419a);
}

.schema-level-element--muted {
	opacity: 0.2;
}

.schema-score,
.schema-level-text,
.schema-domain-labels {
	pointer-events: none;
}

.schema-score__text {
	font-family: Inter, Arial, sans-serif;
	font-size: 22px;
	font-weight: 700;
	text-anchor: middle;
	dominant-baseline: central;
}

.schema-level-text__title {
	font-family: Inter, Arial, sans-serif;
	font-weight: 700;
	text-anchor: middle;
}

.schema-level-text__title--level-1 {
	fill: #166534;
	font-size: 28px;
}

.schema-level-text__title--level-2 {
	fill: #fff;
	font-size: 24px;
}

.schema-domain-labels__line {
	fill: none;
	stroke: #94a3b8;
	stroke-width: 1.2;
	stroke-dasharray: 4 3;
}

.schema-domain-labels__text {
	fill: #334155;
	font-family: Inter, Arial, sans-serif;
	font-size: 24px;
	font-weight: 600;
}

.eco-schema-layout {
	display: grid;
	grid-template-columns: minmax(0, 1.4fr) minmax(260px, 360px);
	align-items: center;
	width: 100%;
}

.eco-schema {
	display: block;
	width: 100%;
	max-width: 890px;
	height: auto;
	justify-self: center;
	background: transparent;
}

.schema-legend {
	padding: 1.5rem;
	background: white;
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgb(15 23 42 / 12%);
	color: #1e293b;
}

.schema-legend__title {
	margin: 0 0 22px;
	color: #475569;
	font-size: 24px;
	font-weight: 700;
}

.schema-legend__subtitle {
	margin: 0 0 14px;
	color: #475569;
	font-size: 17px;
	font-weight: 700;
	line-height: 1.45;
}

.schema-legend__levels {
	display: grid;
	gap: 10px;
	margin-bottom: 22px;
}

.schema-level-card {
	display: flex;
	align-items: flex-start;
	gap: 14px;
	padding: 14px;
	border: 1px solid #dfe5dd;
	border-radius: 5px;
}

.schema-level-card__badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 38px;
	height: 38px;
	border-radius: 50%;
	flex-shrink: 0;
	font-weight: 700;
}

.schema-level-card__badge--essential {
	background: #bbf7d0;
	color: #166534;
}

.schema-level-card__badge--advanced {
	background: #3d67ae;
	color: #fff;
}

.schema-level-card strong {
	display: block;
	margin-bottom: 4px;
	color: #334155;
	font-size: 15px;
}

.schema-level-card p {
	margin: 0;
	color: #94a3b8;
	font-size: 13px;
	line-height: 1.4;
}

.schema-level-card__number {
	font-weight: 700;
}

.schema-level-card__number--essential {
	color: #166534;
}

.schema-level-card__number--advanced,
.schema-legend__status,
.schema-legend__action {
	color: #0c419a;
}

.schema-legend__domains {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.schema-domain-chip {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-width: 145px;
	padding: 7px 12px;
	border: 1px solid #dfe5dd;
	border-radius: 999px;
	color: #475569;
	font-size: 13px;
}

.schema-domain-chip--wide {
	min-width: 100%;
}

.schema-domain-chip__dot {
	display: inline-block;
	width: 9px;
	height: 9px;
	border-radius: 50%;
	flex-shrink: 0;
}

.schema-domain-chip__dot--wip {
	background: #64748b;
}

.schema-legend__level {
	display: inline-block;
	margin: 0 0 1.5rem;
	padding: 0.35rem 0.65rem;
	border-radius: 6px;
	background: #3d67ae;
	color: white;
	font-weight: 700;
}

.schema-legend__domain {
	display: flex;
	align-items: center;
	gap: 10px;
}

.schema-legend__value {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	color: white;
	font-size: 22px;
	font-weight: 700;
	flex-shrink: 0;
}

.schema-legend__status {
	margin: 1.5rem 0;
	font-weight: 700;
}

.schema-domain {
	transform-box: fill-box;
	transform-origin: center;
	transition: transform 180ms ease, filter 180ms ease, opacity 180ms ease;
}

.schema-domain--interactive {
	cursor: pointer;
	outline: none;
}

.schema-domain--active {
	transform: scale(1.025);
	filter: drop-shadow(0 8px 10px rgb(15 23 42 / 22%));
}

.schema-domain--muted {
	opacity: 0.38;
}

.schema-legend__action {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0;
	border: 0;
	background: transparent;
	font: inherit;
	font-weight: 700;
	text-decoration: none;
	cursor: pointer;
}

.schema-legend__action:hover {
	text-decoration: underline;
}

.schema-legend__action:focus-visible {
	outline: 2px solid #0c419a;
	outline-offset: 4px;
	border-radius: 2px;
}

.schema-legend__action--disabled {
	color: #475569;
	cursor: default;
}

@media (width <= 900px) {
	.eco-schema-layout {
		grid-template-columns: 1fr;
	}
}

@media (prefers-reduced-motion: reduce) {
	.schema-domain,
	.schema-level-selector {
		transition: none;
	}
}
</style>
