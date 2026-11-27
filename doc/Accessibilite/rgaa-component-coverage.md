# Couverture RGAA par composant

Ce document définit une méthode de couverture réaliste pour le Design System.
Un test automatisé ne déclare pas à lui seul la conformité RGAA : il apporte une
preuve sur un état et un contexte précis.

## Types de preuves

| Preuve | Outil | Ce qu’elle permet d’établir |
|---|---|---|
| Structure et attributs | Vitest + Vue Test Utils | Relations ARIA, états, rôles, ids, rendu sémantique et événements clavier simulés |
| Règles génériques | Vitest + `vitest-axe` | Violations détectables par axe sur les scénarios montés |
| Comportement navigateur | Cypress Electron | Focus visible, reflow, débordement, zoom simulé, styles calculés et parcours d’états |
| Contraste | Cypress/axe dans un navigateur réel, ou analyseur de contraste | Ratio sur une combinaison thème/état effectivement rendue ; pas une preuve de tous les thèmes |
| Technologies d’assistance | Test manuel NVDA/Firefox ou VoiceOver/Safari | Restitution réelle du nom, du rôle, de l’état et du contenu |
| Page consommatrice | Audit d’intégration | Langue, titre, landmarks, navigation globale, liens, formulaires et contexte des slots |

## Matrice pilote : Accordion

| Critère RGAA | Dépend de | Test automatisé | Preuve restante |
|---|---|---|---|
| 1.2 | Icône décorative | `Accordion.rgaa.a11y.spec.ts` | Vérifier les variantes de slots/icônes |
| 3.1 | Indication d’état | `Accordion.rgaa.a11y.spec.ts` | Revue visuelle des états personnalisés |
| 3.2–3.3 | Tokens du thème et états hover/focus | Partiel | Calcul dans un navigateur réel pour chaque marque/thème/état, ou analyseur manuel ; axe en jsdom ne suffit pas |
| 7.1 | Pattern disclosure et relations ARIA | `Accordion.a11y.spec.ts`, `Accordion.rgaa.a11y.spec.ts` | Lecteur d’écran, notamment panneau fermé |
| 7.3 | Activation et navigation clavier | Tests unitaires existants + `Accordion.rgaa.a11y.spec.ts` | Parcours clavier réel dans Electron |
| 8.2 | Validité et unicité des ids | Test d’unicité dans `Accordion.rgaa.a11y.spec.ts` | Validation HTML d’une page complète et plusieurs instances |
| 9.1 | Titres générés | `Accordion.rgaa.a11y.spec.ts` | Vérifier le niveau fourni par le consommateur |
| 10.1–10.3 | Markup/CSS et contenu | Inspection + axe | Test sans CSS dans un navigateur |
| 10.4 | Reflow au zoom navigateur 200 % | Non couvert par le Cypress component actuel | Vérification manuelle avec le zoom réel du navigateur, ou automatisation dédiée via Playwright/CDP ; `viewport`, `transform: scale()` et `zoom` CSS ne sont pas équivalents |
| 10.5 | Couplage couleurs fond/texte | Partiel | Audit des tokens et thèmes |
| 10.7 | Focus visible | `Accordion.rgaa.cy.ts` | Vérification visuelle sur les thèmes |
| 10.8 | Masquage du contenu fermé | À renforcer | Lecteur d’écran et éléments interactifs dans le slot |
| 10.11 | Reflow 320 px | `Accordion.rgaa.cy.ts` | Vérifier les contenus consommateurs très longs |
| 10.12 | Espacement du texte | `Accordion.rgaa.cy.ts` | Test manuel complémentaire avec les styles utilisateur réels |
| 12.8 | Ordre de tabulation | Assertions de tabindex | Parcours Tab réel |
| 12.9 | Sortie clavier | Assertions structurelles | Parcours clavier réel |

## Matrice pilote : BackBtn

Le classeur `BackBtn.xlsx` couvre 14 critères dans sa version corrigée. Les
tests dédiés couvrent actuellement les contrats structurels et les scénarios
navigateur du thème CNAM.

| Critère RGAA | Dépend de | Test automatisé | Preuve restante |
|---|---|---|---|
| 1.2 | Icône flèche décorative | `BackBtn.rgaa.a11y.spec.ts` | Vérifier les icônes fournies par un slot |
| 3.2 | Couleurs du bouton et du fond | `BackBtn.rgaa.cy.ts` | Étendre uniquement si une nouvelle combinaison CNAM est ajoutée |
| 3.3 | Bordure et indicateur de focus | `BackBtn.rgaa.cy.ts` partiel | Calculer séparément le contraste de la bordure/focus à 3:1 |
| 7.1 | Bouton natif Vuetify et nom accessible | `BackBtn.a11y.spec.ts`, `BackBtn.rgaa.a11y.spec.ts` | Lecteur d’écran avec bouton rendu comme lien |
| 7.3 | Activation native du bouton | `BackBtn.rgaa.a11y.spec.ts` | Parcours clavier réel |
| 8.2 | Attributs HTML générés par `VBtn` | `BackBtn.rgaa.a11y.spec.ts` | Validation HTML d’une page complète |
| 10.1 | Absence d’attributs de présentation | `BackBtn.rgaa.a11y.spec.ts` | Vérification sans CSS |
| 10.2–10.3 | Texte, icône et bouton dans le DOM | `BackBtn.a11y.spec.ts` | Test navigateur avec CSS désactivées |
| 10.4 | Long libellé et zoom 200 % | Zoom 200 % non automatisé ; scénario long libellé séparé | Zoom navigateur réel manuel |
| 10.7 | Focus visible clair | `BackBtn.rgaa.cy.ts` | Contraste du focus calculé à 3:1 |
| 10.11 | Reflow à 320 px | `BackBtn.rgaa.cy.ts` — échec actuel avec un libellé long | Corriger le débordement puis conserver le scénario en CI d’audit |
| 10.12 | Espacement du texte | `BackBtn.rgaa.cy.ts` | Contrôle manuel complémentaire |
| 12.9 | Sortie clavier | `BackBtn.rgaa.a11y.spec.ts` | Parcours clavier réel |

## Règles d’attribution

- Un critère est rattaché à un composant uniquement si le composant produit ou
  contrôle le comportement concerné.
- Un critère dépendant du thème est rattaché au composant comme **partiel** et
  doit être vérifié pour chaque combinaison de tokens supportée.
- Un critère dépendant de la page, d’un slot ou d’une intégration reste dans
  l’audit de la page consommatrice.
- Les critères non vérifiables par axe doivent avoir une preuve dédiée, un test
  navigateur ou une entrée d’audit manuel datée.
- Les tests doivent nommer le critère RGAA dans leur titre afin que le rapport
  de couverture puisse être agrégé sans interprétation implicite.

## Extension à l’ensemble du Design System

La matrice doit être étendue par familles de composants :

- **composants interactifs** : 7.1, 7.3, 10.7, 12.8, 12.9 ;
- **composants de contenu** : 1.x, 3.x, 9.x, 10.x ;
- **composants de formulaires** : 11.x, avec tests de labels, erreurs et suggestions ;
- **composants de navigation** : 6.x, 12.x, 13.2 ;
- **composants de tableaux** : 5.x ;
- **composants multimédia** : 4.x ;
- **composants de page/layout** : 8.x, 9.2, 12.1–12.7, 13.x.

Les composants réutilisant un sous-composant accessible héritent de ses preuves,
mais doivent conserver un test d’intégration pour leurs propres slots, états et
variantes.
