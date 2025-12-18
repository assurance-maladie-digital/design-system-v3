<script setup lang="ts">
	import { computed } from 'vue'

	interface VerifiedPage {
		name: string
		url?: string
	}

	interface DefenderContact {
		name: string
		address: string
		postalCode: string
	}

	type ConformityLevel = 'non' | 'partiellement' | 'totalement'

	type EvaluationMethod = 'auto-evaluation' | 'audit-interne' | 'audit-externe'

	interface DeclarationAccessibilityPageProps {
		entityName: string
		schemaUrl?: string
		actionsRealisedUrl?: string
		planActionsUrl?: string
		siteName: string
		siteUrl: string
		conformityLevel: ConformityLevel
		rgaaVersion?: string
		auditEntity?: string
		auditDate?: string
		evaluationMethod?: EvaluationMethod
		rgaaCriteriaRespectedPercent?: number | null
		siteConformityPercent?: number | null
		auditGridUrl?: string
		contactEmail: string
		contactPhone?: string
		defender?: DefenderContact
		nonConformities?: string[]
		exemptions?: string[]
		nonObligatoryContents?: string[]
		declarationDate?: string
		updateDate?: string
		technologies?: string[]
		testEnvironments?: string[]
		accessibilityTools?: string[]
		verifiedPages?: VerifiedPage[]
	}

	const props = withDefaults(defineProps<DeclarationAccessibilityPageProps>(), {
		rgaaVersion: '4',
		evaluationMethod: 'auto-evaluation',
		rgaaCriteriaRespectedPercent: null,
		siteConformityPercent: null,
		defender: () => ({
			name: 'Défenseur des droits',
			address: 'Libre réponse 71120',
			postalCode: '75342 Paris CEDEX 07',
		}),
		nonConformities: () => [],
		exemptions: () => [],
		nonObligatoryContents: () => [],
		technologies: () => [],
		testEnvironments: () => [],
		accessibilityTools: () => [],
		verifiedPages: () => [],
	})

	const hasItems = <T>(items?: T[] | null): items is T[] =>
		Array.isArray(items) && items.length > 0

	const formatDate = (date?: string) => {
		if (!date) {
			return ''
		}

		const parsedDate = new Date(date)
		if (Number.isNaN(parsedDate.getTime())) {
			return date
		}

		return new Intl.DateTimeFormat('fr-FR').format(parsedDate)
	}

	const conformityLabel = computed(() => {
		if (props.conformityLevel === 'totalement') {
			return 'totalement conforme'
		}

		if (props.conformityLevel === 'partiellement') {
			return 'partiellement conforme'
		}

		return 'non conforme'
	})

	const evaluationMethodLabel = computed(() => {
		if (props.evaluationMethod === 'audit-interne') {
			return 'un audit interne'
		}

		if (props.evaluationMethod === 'audit-externe') {
			return 'un audit externe'
		}

		return 'une auto-évaluation'
	})

	const phoneHref = computed(() => {
		if (!props.contactPhone) {
			return undefined
		}

		const normalized = props.contactPhone.replace(/\s+/g, '')
		if (!normalized) {
			return undefined
		}

		return `tel:${normalized}`
	})

	const hasTestResults = computed(
		() =>
			!!props.auditEntity
			|| props.rgaaCriteriaRespectedPercent !== null
			|| props.siteConformityPercent !== null
			|| !!props.auditGridUrl,
	)
</script>

<template>
	<div class="accessibility-statement">
		<section class="engagement">
			<h2>Engagement d'accessibilité</h2>
			<p>
				<strong>{{ entityName }}</strong> s'engage à rendre ses sites internet, intranet, extranet et ses progiciels accessibles (et ses applications mobiles et mobilier urbain numérique) conformément à l'article 47 de la loi n°2005-102 du 11 février 2005.
			</p>

			<p>À cette fin, <strong>{{ entityName }}</strong> met en œuvre la stratégie et les actions suivantes :</p>

			<ul>
				<li v-if="schemaUrl">
					<a :href="schemaUrl">Schéma pluriannuel de mise en accessibilité 2022-2024</a> ;
				</li>
				<li v-if="actionsRealisedUrl">
					<a :href="actionsRealisedUrl">Actions réalisées en 2020-2021</a> ;
				</li>
				<li v-if="planActionsUrl">
					<a :href="planActionsUrl">Plan d'actions 2022-2024</a>.
				</li>
			</ul>

			<p>
				Cette déclaration d'accessibilité s'applique à <a
					:href="siteUrl"
					:title="siteUrl"
				>{{ siteName }}</a>.
			</p>
		</section>

		<section class="conformity">
			<h2>État de conformité</h2>
			<p>
				<a :href="siteUrl">{{ siteName }}</a> est <strong>{{ conformityLabel }}</strong> au référentiel général d'amélioration de l'accessibilité (RGAA), version {{ rgaaVersion }}, en raison des non-conformités et des dérogations énumérées ci-dessous.
			</p>
		</section>

		<section
			v-if="hasTestResults"
			class="test-results"
		>
			<h2>Résultats des tests</h2>
			<p v-if="auditEntity">
				L'audit de conformité réalisé par {{ auditEntity }}
				<span v-if="auditDate"> le {{ formatDate(auditDate) }}</span>
				révèle que :
			</p>
			<p v-else>
				Les tests de conformité réalisés conformément au RGAA version {{ rgaaVersion }} révèlent que :
			</p>
			<ul>
				<li v-if="rgaaCriteriaRespectedPercent !== null">
					{{ rgaaCriteriaRespectedPercent }}% des critères du RGAA version {{ rgaaVersion }} sont respectés ;
				</li>
				<li v-if="siteConformityPercent !== null">
					Le taux moyen de conformité du site s'élève à {{ siteConformityPercent }}% ;
				</li>
				<li v-if="auditGridUrl">
					<a :href="auditGridUrl">Accéder à la grille d'audit RGAA</a> pour télécharger la grille d'audit.
				</li>
			</ul>
		</section>

		<section class="non-accessible-content">
			<h2 v-if="hasItems(nonConformities)">
				Contenus non accessibles
			</h2>

			<div
				v-if="hasItems(nonConformities)"
				class="non-conformities"
			>
				<h3>Non-conformités</h3>
				<ul>
					<li
						v-for="(item, index) in nonConformities"
						:key="`non-conformity-${index}`"
					>
						{{ item }}
					</li>
				</ul>
			</div>

			<div
				v-if="hasItems(exemptions)"
				class="exemptions"
			>
				<h3>Dérogations pour charge disproportionnée</h3>
				<ul>
					<li
						v-for="(item, index) in exemptions"
						:key="`exemption-${index}`"
					>
						{{ item }}
					</li>
				</ul>
			</div>

			<div
				v-if="hasItems(nonObligatoryContents)"
				class="non-obligatory-contents"
			>
				<h3>Contenus non soumis à l'obligation d'accessibilité</h3>
				<ul>
					<li
						v-for="(item, index) in nonObligatoryContents"
						:key="`non-obligatory-${index}`"
					>
						{{ item }}
					</li>
				</ul>
			</div>
		</section>

		<section
			v-if="declarationDate || hasItems(technologies) || hasItems(testEnvironments) || hasItems(accessibilityTools) || hasItems(verifiedPages)"
			class="declaration-establishment"
		>
			<h2>Établissement de cette déclaration d'accessibilité</h2>

			<p v-if="declarationDate || updateDate">
				<span v-if="declarationDate">
					Cette déclaration a été établie le {{ formatDate(declarationDate) }} à partir de {{ evaluationMethodLabel }} réalisée conformément au référentiel RGAA version {{ rgaaVersion }}.
				</span>
				<span v-else>
					Cette déclaration a été établie à partir de {{ evaluationMethodLabel }} réalisée conformément au référentiel RGAA version {{ rgaaVersion }}.
				</span>
				<span v-if="updateDate"> Elle a été mise à jour le {{ formatDate(updateDate) }}.</span>
			</p>

			<div
				v-if="hasItems(technologies)"
				class="technologies"
			>
				<h3>Technologies utilisées pour la réalisation du site</h3>
				<ul>
					<li
						v-for="(item, index) in technologies"
						:key="`technology-${index}`"
					>
						{{ item }}
					</li>
				</ul>
			</div>

			<div
				v-if="hasItems(testEnvironments)"
				class="test-environments"
			>
				<h3>Environnement de test</h3>
				<p>Les vérifications de restitution de contenus ont été réalisées sur la base de la combinaison fournie par la base de référence du RGAA, avec les versions suivantes :</p>
				<ul>
					<li
						v-for="(item, index) in testEnvironments"
						:key="`environment-${index}`"
					>
						{{ item }}
					</li>
				</ul>
			</div>

			<div
				v-if="hasItems(accessibilityTools)"
				class="accessibility-tools"
			>
				<h3>Outils pour évaluer l'accessibilité</h3>
				<ul>
					<li
						v-for="(item, index) in accessibilityTools"
						:key="`tool-${index}`"
					>
						{{ item }}
					</li>
				</ul>
			</div>

			<div
				v-if="hasItems(verifiedPages)"
				class="verified-pages"
			>
				<h3>Pages du site ayant fait l'objet de la vérification de conformité</h3>
				<ul>
					<li
						v-for="(item, index) in verifiedPages"
						:key="`page-${index}`"
					>
						<span v-if="item.url"><a :href="item.url">{{ item.name }}</a></span>
						<span v-else>{{ item.name }}</span>
					</li>
				</ul>
			</div>
		</section>

		<section class="contact-information">
			<h2>Retour d'information et contact</h2>
			<p>
				Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le ou la responsable de
				<strong>{{ entityName }}</strong> pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
			</p>

			<ul>
				<li>
					Envoyer un message à <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
				</li>
				<li v-if="contactPhone">
					Contacter par téléphone : <a :href="phoneHref">{{ contactPhone }}</a>
				</li>
			</ul>
		</section>

		<section class="recourse">
			<h2>Voies de recours</h2>
			<p>
				Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une
				fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part,
				vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
			</p>

			<p>Plusieurs moyens sont à votre disposition :</p>

			<ul>
				<li><a href="https://formulaire.defenseurdesdroits.fr/formulaire_saisine/">Écrire un message au Défenseur des droits</a></li>
				<li><a href="https://www.defenseurdesdroits.fr/carte-des-delegues">Contacter le délégué du Défenseur des droits dans votre région</a></li>
				<li>
					Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) :
					<address>
						{{ defender.name }}<br>
						{{ defender.address }}<br>
						{{ defender.postalCode }}
					</address>
				</li>
			</ul>
		</section>
	</div>
</template>

<style scoped>
.accessibility-statement {
	font-family: var(--v-font-family);
	color: var(--v-text-color);
	line-height: 1.5;
	padding: 1rem;
}

.accessibility-statement section {
	margin-bottom: 2rem;
}

.accessibility-statement h2 {
	margin-top: 1.5rem;
	margin-bottom: 1rem;
	font-weight: 600;
}

.accessibility-statement ul {
	list-style-type: disc;
	margin-left: 1.5rem;
	margin-bottom: 1rem;
}

.accessibility-statement ul ul {
	margin-top: 0.5rem;
}

.accessibility-statement address {
	margin-top: 1rem;
	font-style: normal;
}

.accessibility-statement a {
	color: rgb(var(--v-theme-primary));
	text-decoration: underline;
}

.accessibility-statement a:hover {
	text-decoration: none;
}

.accessibility-statement p {
	margin-bottom: 0.75rem;
}

.accessibility-statement h3 {
	margin-top: 1.25rem;
	margin-bottom: 0.75rem;
	font-weight: 500;
}
</style>
