<script setup lang="ts">
	defineOptions({
		name: 'DeclarationAccessibilityPage',
	})

	interface VerifiedPage {
		name: string
		url?: string
	}

	withDefaults(defineProps<{
		entityName: string
		schemaUrl?: string
		actionsRealisedUrl?: string
		planActionsUrl?: string
		siteName: string
		siteUrl: string
		conformityLevel: 'non' | 'partiellement' | 'totalement'
		auditEntity?: string
		rgaaCriteriaRespectedPercent?: number | null
		siteConformityPercent?: number | null
		auditGridUrl?: string
		contactEmail: string
		contactPhone?: string
		defenderName?: string
		defenderAddress?: string
		defenderPostalCode?: string
		nonConformities?: string[]
		exemptions?: string[]
		nonObligatoryContents?: string[]
		declarationDate?: string
		updateDate?: string
		technologies?: string[]
		testEnvironments?: string[]
		accessibilityTools?: string[]
		verifiedPages?: VerifiedPage[]
	}>(), {
		schemaUrl: '',
		actionsRealisedUrl: '',
		planActionsUrl: '',
		auditEntity: '',
		rgaaCriteriaRespectedPercent: null,
		siteConformityPercent: null,
		auditGridUrl: '',
		contactPhone: '',
		defenderName: 'Défenseur des droits',
		defenderAddress: 'Libre réponse 71120',
		defenderPostalCode: '75342 Paris CEDEX 07',
		nonConformities: () => [],
		exemptions: () => [],
		nonObligatoryContents: () => [],
		declarationDate: '',
		updateDate: '',
		technologies: () => [],
		testEnvironments: () => [],
		accessibilityTools: () => [],
		verifiedPages: () => [],
	})
</script>

<template>
	<div class="accessibility-statement">
		<section class="engagement">
			<p>
				<strong>{{ entityName }}</strong> s'engage à rendre ses sites internet, intranet, extranet et ses progiciels accessibles (et ses applications mobiles et mobilier urbain numérique) conformément à l'article 47 de la loi n°2005-102 du 11 février 2005.
			</p>

			<p>À cette fin, <strong>{{ entityName }}</strong> met en œuvre la stratégie et les actions suivantes :</p>

			<ul>
				<li v-if="schemaUrl">
					Schéma pluriannuel de mise en accessibilité 2022-2024 <a :href="schemaUrl">[url]</a> ;
				</li>
				<li v-if="actionsRealisedUrl">
					Actions réalisées en 2020-2021 <a :href="actionsRealisedUrl">[url]</a> ;
				</li>
				<li v-if="planActionsUrl">
					Plan d'actions 2022-2024 <a :href="planActionsUrl">[url]</a>.
				</li>
			</ul>

			<p>Cette déclaration d'accessibilité s'applique à <a :href="siteUrl">{{ siteUrl }}</a>.</p>
		</section>

		<section class="conformity">
			<h2>État de conformité</h2>
			<p>
				<a :href="siteUrl">{{ siteName }}</a> est <strong>{{ conformityLevel }}</strong> conforme avec le référentiel général d'amélioration de l'accessibilité (RGAA), version 4 en raison des non-conformités et des dérogations énumérées ci-dessous.
			</p>
		</section>

		<section
			v-if="auditEntity || rgaaCriteriaRespectedPercent !== null"
			class="test-results"
		>
			<h2>Résultats des tests</h2>
			<p>
				L'audit de conformité réalisé par {{ auditEntity }} révèle que :
			</p>
			<ul>
				<li v-if="rgaaCriteriaRespectedPercent !== null">
					{{ rgaaCriteriaRespectedPercent }}% des critères du RGAA version 4 sont respectés ;
				</li>
				<li v-if="siteConformityPercent !== null">
					Le taux moyen de conformité du site s'élève à {{ siteConformityPercent }}% ;
				</li>
				<li v-if="auditGridUrl">
					Accès à la grille d'audit RGAA <a :href="auditGridUrl">[url]</a> pour télécharger la grille d'audit.
				</li>
			</ul>
		</section>

		<section class="non-accessible-content">
			<h2 v-if="nonConformities && nonConformities.length > 0">
				Contenus non accessibles
			</h2>

			<div
				v-if="nonConformities && nonConformities.length > 0"
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
				v-if="exemptions && exemptions.length > 0"
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
				v-if="nonObligatoryContents && nonObligatoryContents.length > 0"
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
			v-if="declarationDate || technologies.length > 0 || testEnvironments.length > 0 || accessibilityTools.length > 0 || verifiedPages.length > 0"
			class="declaration-establishment"
		>
			<h2>Établissement de cette déclaration d'accessibilité</h2>

			<p v-if="declarationDate || updateDate">
				Cette déclaration a été établie le {{ declarationDate }}.
				<span v-if="updateDate"> Elle a été mise à jour le {{ updateDate }}.</span>
			</p>

			<div
				v-if="technologies && technologies.length > 0"
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
				v-if="testEnvironments && testEnvironments.length > 0"
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
				v-if="accessibilityTools && accessibilityTools.length > 0"
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
				v-if="verifiedPages && verifiedPages.length > 0"
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
					Contacter par téléphone : <a :href="`tel:${contactPhone}`">{{ contactPhone }}</a>
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
						{{ defenderName }}<br>
						{{ defenderAddress }}<br>
						{{ defenderPostalCode }}
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
	color: var(--v-primary);
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

a {
	color: rgb(var(--v-theme-primary)) !important;
	text-decoration: none !important;
}

a:hover {
	text-decoration: none;
}
</style>
