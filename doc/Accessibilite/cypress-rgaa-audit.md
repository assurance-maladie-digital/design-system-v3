# Commandes Cypress RGAA d’audit

Le support Cypress partagé expose des commandes destinées aux specs `*.rgaa.cy.ts` :

```ts
cy.rgaaFocusVisible('[data-test-id="trigger"]')
cy.rgaaAssertAccessibleName('[role="dialog"]')
cy.rgaaSetAuditViewport(320, 568)
cy.rgaaAssertNoHorizontalOverflow('body')
cy.rgaaAssertHiddenNotFocusable('[aria-hidden="true"]')
```

Ces commandes vérifient le focus, le nom accessible calculable, le reflow au viewport choisi, l’overflow horizontal et l’absence de contrôles actifs dans un contenu masqué.

`rgaaSetAuditViewport` ne simule pas le zoom navigateur à 200 %. Le zoom réel, le contraste perçu et la restitution par lecteur d’écran restent manuels.
