import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Formulaires/PasswordField/Accessibilité',
}

export const Legende: StoryObj = {
	args: {
		icon: checkIcon,
	},
	render: (args) => {
		return {
			components: { VIcon },
			setup() {
				return { args }
			},
			template: `
			  <p style="color: grey;font-size: 11px; margin-bottom: 12px;">Date de conception: 20/11/2024</p>
			  <div>
				<p>Le tableau ci-dessous liste nos recommandations suivant les <a target="blank" style="color:#0C41BD;" href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/#contenu">catégories du RGAA</a>.</p>
				<p style="margin-bottom: 12px;font-weight:bold;">Pour rappel le composant seul ne garantie pas
				   l'accessibilité du site.</p>
			</div>
				<div class="mt-4">
                  <p>Rapport d'audit manuel : <a href="/audits/PasswordField.xlsx" style="color:#0C41BD;">rapport</a></p>
                  <p style="color: grey; font-size: 14px">Correctifs associés (<a
                      href="https://github.com/assurance-maladie-digital/design-system-v3/issues/898" target="_blank"
                      style="color:#0C41BD;"
                  >issue #898</a>)</p>
                </div>
                
                <div class="mt-6">
                  <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Spécificité - Source technique</h3>
                  
                  <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="font-weight: 500; margin-bottom: 8px;">Les champs de formulaires doivent avoir une étiquette</p>
                    <p style="margin-bottom: 8px;">Techniquement, il est communément utilisé la balise "label" avec les attributs "for" et "id".
                    Celle-ci doit être pertinente et accolée au champ associé.</p>
                    <p style="font-size: 13px; color: #0C41BD;">
                      <a href="https://www.accede-web.com/notices/html-et-css/formulaires/utiliser-la-balise-label-ainsi-que-les-attributs-for-et-id-pour-etiqueter-les-champs-avec-intitule-visible/" 
                         target="_blank" style="color: inherit;">
                        Documentation accede-web
                      </a>
                    </p>
                  </div>
                  
                  <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="font-weight: 500; margin-bottom: 8px;">Remplissage automatique des champs</p>
                    <p style="margin-bottom: 8px;">Selon la finalité du champ, le remplissage automatique est possible (attribut "autocomplete").</p>
                    <p style="font-size: 13px; color: #0C41BD;">
                      <a href="https://www.accede-web.com/notices/html-et-css/formulaires/utiliser-lattribut-autocomplete-pour-faciliter-le-remplissage-automatique-des-champs/" 
                         target="_blank" style="color: inherit;">
                        Documentation accede-web
                      </a>
                    </p>
                  </div>
                  
                  <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="font-weight: 500; margin-bottom: 8px;">Aide à la saisie</p>
                    <p style="margin-bottom: 8px;">En cas d'aide à la saisie, l'inscription est visible dans un message ou présente dans l'étiquette. Il doit être rattaché au libellé ou situé dans le passage de texte associé au champ.</p>
                    <p style="font-size: 13px; color: #0C41BD;">
                      <a href="https://www.accede-web.com/notices/html-et-css/formulaires/integrer-les-aides-a-la-saisie-directement-dans-les-balises-label/" 
                         target="_blank" style="color: inherit;">
                        Documentation accede-web
                      </a>
                    </p>
                  </div>
                  
                  <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="font-weight: 500; margin-bottom: 8px;">Champs obligatoires</p>
                    <p style="margin-bottom: 8px;">Les champs obligatoires possèdent l'une et/ou l'autre condition :</p>
                    <ul style="margin-bottom: 8px; padding-left: 20px;">
                      <li>un intitulé visible permettant de l'identifier comme tel</li>
                      <li>un attribut "required" ou 'aria-required="true"'</li>
                    </ul>
                    <p style="margin-bottom: 8px;">Il doit être rattaché au libellé ou situé dans le passage de texte associé au champ.</p>
                    <p style="font-size: 13px; color: #0C41BD;">
                      <a href="https://www.accede-web.com/notices/html-et-css/formulaires/integrer-required-ou-aria-requiredtrue-dans-les-champs-obligatoires/" 
                         target="_blank" style="color: inherit;">
                        Documentation accede-web
                      </a>
                    </p>
                  </div>
                  
                  <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="font-weight: 500; margin-bottom: 8px;">Gestion des erreurs</p>
                    <p style="margin-bottom: 8px;">En cas d'erreur, le champ possède l'une et/ou l'autre condition :</p>
                    <ul style="margin-bottom: 8px; padding-left: 20px;">
                      <li>un message visible permet de l'identifier comme tel</li>
                      <li>un attribut 'aria-invalid="true"'</li>
                    </ul>
                    <p style="margin-bottom: 8px;">Il doit être rattaché au libellé ou situé dans le passage de texte associé au champ.</p>
                    <p style="margin-bottom: 8px;">Par ailleurs, s'il s'agit d'une erreur de type ou format, l'information est retranscrite dans le message d'erreur avec des exemples de valeurs attendues autre que celle de l'aide à la saisie.</p>
                    <p style="font-size: 13px; color: #0C41BD;">
                      <a href="https://www.accede-web.com/notices/html-et-css/formulaires/integrer-les-messages-derreur-et-les-suggestions-de-correction-directement-dans-les-balises-label/" 
                         target="_blank" style="color: inherit;">
                        Documentation accede-web
                      </a>
                    </p>
                  </div>
                  
                  <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="font-weight: 500; margin-bottom: 8px;">Spécificités des champs de mot de passe</p>
                    <p style="margin-bottom: 8px;">Le copier-coller doit être possible dans un champ d'authentification. Cela permet notamment de faciliter l'utilisation d'un gestionnaire de mot de passe.</p>
                    <p style="margin-bottom: 16px; font-size: 13px; color: #0C41BD;">
                      <a href="https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html" 
                         target="_blank" style="color: inherit;">
                        Documentation W3C
                      </a>
                    </p>
                    <p style="margin-bottom: 8px;">Il faut pouvoir démasquer le mot de passe lors de la saisie. Cela permet d'améliorer les chances de réussite pour certaines personnes souffrant de troubles cognitifs ou ayant des difficultés à saisir correctement un mot de passe.</p>
                    <p style="font-size: 13px; color: #0C41BD;">
                      <a href="https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html" 
                         target="_blank" style="color: inherit;">
                        Documentation W3C
                      </a>
                    </p>
                  </div>
                </div>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
