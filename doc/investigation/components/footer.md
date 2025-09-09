# Investigation : Famille Footer

## Composants concernés

- FooterBar (générique)
- AmeliproFooter

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les footers.

## Synthèse des props, slots et événements

| Composant      | Props principales (extraits)                                                                 | Slots principaux           | Événements principaux           |
|----------------|---------------------------------------------------------------------------------------------|----------------------------|---------------------------------|
| FooterBar      | a11yCompliance, linkItems, items, sitemapRoute, cguRoute, cookiesRoute, legalNoticeRoute, a11yStatementRoute, hideSitemapLink, hideCguLink, hideCookiesLink, hideLegalNoticeLink, hideA11yLink, version, hideLogo, hideSocialMediaLinks, socialMediaLinks, light | logo, prepend, append, default | (aucun événement émis)          |
| AmeliproFooter | a11yCompliance, a11yHref, a11yTarget, a11yTo, aboutHref, aboutTarget, aboutTo, backOffice, backOfficeText, cguHref, cguTarget, cguTo, configurationHref, configurationTarget, configurationTo, legalNoticeHref, legalNoticeTarget, legalNoticeTo, noA11y, noAbout, noCgu, noConfiguration, noLegalNotice, noLinkA11y, noPhone, noSiteMap, phoneLink, siteMapHref, siteMapTarget, siteMapTo, uniqueId, version | (aucun slot nommé)         | click-phone, site-map-event, about-event, config-event, legal-notice-event, cgu-event, a11y-event |

## Proposition de fusion/enrichissement

- **Fusionner la logique de footer** : Créer un composant universel, paramétrable par props pour couvrir les besoins Amelipro et génériques (liens, réseaux sociaux, version, accessibilité, événements, etc.).
- **Modulariser les fonctionnalités** : Utiliser des slots nommés et des props avancées pour permettre la personnalisation (logo, prepend, append, gestion des liens, événements).
- **Supprimer les doublons** : Après migration des usages, supprimer les composants spécifiques devenus inutiles.
- **Documenter les cas d’usage spécifiques** : Si certains usages Amelipro sont très spécifiques, les intégrer comme options ou extensions du composant universel.

## Détails techniques, similitudes et différences

### FooterBar

- **Props** : gestion des liens, accessibilité, affichage du logo, réseaux sociaux, version, personnalisation
- **Slots** : `logo`, `prepend`, `append`, `default`
- **Événements** : aucun événement émis
- **Fonctionnalités** : affichage du footer, personnalisation avancée, responsive, gestion des liens et réseaux sociaux

### AmeliproFooter

- **Props** : gestion fine des liens (CGU, mentions légales, accessibilité, à propos, configuration, plan de site, téléphone), affichage back office, version, personnalisation
- **Slots** : aucun slot nommé
- **Événements** : nombreux événements pour chaque action sur les liens/boutons
- **Fonctionnalités** : affichage du footer, gestion des liens, accessibilité, responsive, personnalisation avancée

---

### Synthèse des points communs

- Gestion des liens principaux (CGU, mentions légales, accessibilité, plan de site, etc.)
- Personnalisation via props
- Affichage responsive
- Gestion de la version

### Synthèse des différences

- FooterBar propose des slots pour enrichir le contenu (logo, prepend, append, default)
- AmeliproFooter émet des événements pour chaque action utilisateur
- FooterBar gère les réseaux sociaux, AmeliproFooter gère le téléphone et le back office
- Style et tokens propres à chaque famille

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Footer.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
