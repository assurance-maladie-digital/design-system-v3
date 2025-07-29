.PHONY: help install dev build storybook build-storybook test lint lint-fix clean setup type-check

# Couleurs pour une meilleure lisibilité
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[0;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Détection du gestionnaire de paquets (pnpm est préféré car utilisé dans le projet)
PACKAGE_MANAGER := $(shell which pnpm >/dev/null 2>&1 && echo "pnpm" || (which npm >/dev/null 2>&1 && echo "npm" || echo ""))

help: ## Affiche l'aide
	@echo "${BLUE}Design System v3 - CNAM${NC}"
	@echo "${YELLOW}Utilisation:${NC}"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-15s${NC} %s\n", $$1, $$2}'
	@echo ""
	@echo "${YELLOW}Gestionnaire de paquets détecté:${NC} ${GREEN}$(PACKAGE_MANAGER)${NC}"
	@echo ""
	@echo "${YELLOW}Note:${NC} Ce projet utilise pnpm comme gestionnaire de paquets par défaut."
	@echo "Si pnpm n'est pas installé, vous pouvez l'installer avec: ${GREEN}npm install -g pnpm${NC}"
	@echo "${YELLOW}Pour Windows:${NC} Pour windows: installer make et l'utiliser avec: ${GREEN}git bash${NC}"

check-package-manager:
	@if [ -z "$(PACKAGE_MANAGER)" ]; then \
		echo "${RED}Aucun gestionnaire de paquets (pnpm ou npm) n'a été trouvé.${NC}"; \
		echo "${YELLOW}Veuillez installer pnpm:${NC} ${GREEN}npm install -g pnpm${NC}"; \
		exit 1; \
	fi

install: check-package-manager ## Installe les dépendances du projet
	@echo "${BLUE}Installation des dépendances...${NC}"
	@$(PACKAGE_MANAGER) install

dev: check-package-manager ## Lance le serveur de développement
	@echo "${BLUE}Démarrage du serveur de développement...${NC}"
	@$(PACKAGE_MANAGER) run dev

build: check-package-manager ## Construit le projet pour la production
	@echo "${BLUE}Construction du projet...${NC}"
	@$(PACKAGE_MANAGER) run build

storybook: check-package-manager ## Lance Storybook pour le développement
	@echo "${BLUE}Démarrage de Storybook...${NC}"
	@$(PACKAGE_MANAGER) run storybook

build-storybook: check-package-manager ## Construit Storybook pour la production
	@echo "${BLUE}Construction de Storybook...${NC}"
	@$(PACKAGE_MANAGER) run build-storybook

test: check-package-manager ## Exécute les tests unitaires
	@echo "${BLUE}Exécution des tests unitaires...${NC}"
	@$(PACKAGE_MANAGER) run test:unit

lint: check-package-manager ## Vérifie le code avec ESLint et Stylelint
	@echo "${BLUE}Vérification du code avec ESLint...${NC}"
	@$(PACKAGE_MANAGER) run lint
	@echo "${BLUE}Vérification du style avec Stylelint...${NC}"
	@$(PACKAGE_MANAGER) run lint:style

lint-fix: check-package-manager ## Corrige automatiquement les problèmes de linting
	@echo "${BLUE}Correction automatique des problèmes de linting...${NC}"
	@$(PACKAGE_MANAGER) run lint:fix

clean: ## Nettoie les fichiers générés (dist et storybook-static)
	@echo "${BLUE}Nettoyage des fichiers générés...${NC}"
	@rm -rf dist
	@rm -rf storybook-static
	@echo "${GREEN}Nettoyage terminé.${NC}"

setup: install ## Configure le projet pour le développement (installation + hooks git)
	@echo "${BLUE}Configuration des hooks git...${NC}"
	@$(PACKAGE_MANAGER) run prepare
	@echo "${GREEN}Configuration terminée. Le projet est prêt pour le développement.${NC}"

type-check: check-package-manager ## Vérifie les types TypeScript
	@echo "${BLUE}Vérification des types TypeScript...${NC}"
	@$(PACKAGE_MANAGER) vue-tsc -p tsconfig.app.json
	@echo "${GREEN}Vérification des types terminée.${NC}"

# Par défaut, affiche l'aide
.DEFAULT_GOAL := help 
