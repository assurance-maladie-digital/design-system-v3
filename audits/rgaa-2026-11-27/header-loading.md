# Audit RGAA 4.1.2 — HeaderLoading

Le classeur `HeaderLoading.xlsx` n’a pas de structure v2 standard. Les contrats ajoutés vérifient la différence entre skeleton autonome annoncé (`role="alert"`, `aria-live`) et skeleton décoratif inline (`aria-hidden`). La relation avec `aria-busy` du conteneur consommateur reste à vérifier manuellement.
