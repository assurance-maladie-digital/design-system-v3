# Champ `engines` retiré

Le champ `engines` de `package.json` (auparavant `node: >=20 <23` et `pnpm: >=10 <11`) est supprimé. Synapse n'impose plus de version de Node ni de pnpm : c'est au projet consommateur (starter kit) de les fixer, en accord avec les contraintes de sécurité des CI Cnam.

Ce retrait n'est pas cassant : aucune installation n'est plus refusée ni signalée par un avertissement à cause de la version de Node ou de pnpm.

Synapse lui-même est construit et testé avec Node `22.23.4` (fixé dans `.nvmrc`) et pnpm `10.33.4` (fixé dans `packageManager`). Node `22.23.4` corrige les failles de la mise à jour de sécurité Node.js du 21 octobre 2026 (dont CVE-2026-111497).
