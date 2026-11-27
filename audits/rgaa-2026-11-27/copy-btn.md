# Audit RGAA 4.1.2 — CopyBtn

Périmètre : `src/components/CopyBtn/` et classeur `CopyBtn.xlsx`. Critères historiques : 3.3, 7.1, 7.5, 8.2 et 13.8.

Les contrats ajoutés vérifient le nom accessible du bouton, l'icône décorative et l'unicité de l'identifiant d'instance. Le statut de copie est annoncé par un élément `role="status"`; il doit être vérifié après activation, avec et sans tooltip, ainsi que dans les thèmes CNAM clair/sombre. La gestion du focus et le contraste de l'icône restent des contrôles navigateur.

Statut : aucune non-conformité actuelle reproduite par les contrats DOM ; audit navigateur à compléter.
