# Audit RGAA 4.1.2 — DownloadBtn

Périmètre : `src/components/DownloadBtn/` et classeur `DownloadBtn.xlsx`. Critères historiques : 3.2, 3.3 et 7.1.

Les contrats ajoutés vérifient l'icône décorative, le bouton natif nommé et l'annonce `aria-live="polite"` pendant le téléchargement. Les états succès/erreur, le focus visible, le contraste et le comportement avec un libellé long doivent être rejoués dans le navigateur CNAM.

Statut : aucune non-conformité actuelle reproduite par les contrats DOM ; audit navigateur à compléter.
