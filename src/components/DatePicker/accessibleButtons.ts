/**
 * Directive pour ajouter des attributs d'accessibilité aux boutons de navigation du DatePicker
 */

// Utiliser un WeakMap pour stocker les observers associés aux éléments
// Cela évite les problèmes de typage avec l'ajout de propriétés personnalisées aux éléments DOM
const observers = new WeakMap<HTMLElement, MutationObserver>()

export const vAccessibleButtons = {
  mounted(el: HTMLElement) {
    // Fonction pour ajouter des aria-labels aux boutons de navigation
    const addAccessibilityAttributes = () => {
      // Trouver les boutons de navigation par leurs attributs data-testid
      const prevMonthButton = el.querySelector('button[data-testid="prev-month"]')
      const nextMonthButton = el.querySelector('button[data-testid="next-month"]')

      // Ajouter aria-label au bouton "mois précédent"
      if (prevMonthButton && !prevMonthButton.hasAttribute('aria-label')) {
        prevMonthButton.setAttribute('aria-label', 'Mois précédent')
      }

      // Ajouter aria-label au bouton "mois suivant"
      if (nextMonthButton && !nextMonthButton.hasAttribute('aria-label')) {
        nextMonthButton.setAttribute('aria-label', 'Mois suivant')
      }
    }

    // Exécuter immédiatement pour les boutons déjà présents
    addAccessibilityAttributes()

    // Observer les changements dans le DOM pour détecter les nouveaux boutons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Vérifier si des boutons de navigation ont été ajoutés
          addAccessibilityAttributes()
        }
      })
    })

    // Observer les changements dans l'élément et ses enfants
    observer.observe(el, {
      childList: true,
      subtree: true
    })

    // Stocker l'observer dans le WeakMap pour pouvoir le déconnecter plus tard
    observers.set(el, observer)
  },
  
  // Déconnecter l'observer lorsque l'élément est démonté
  unmounted(el: HTMLElement) {
    const observer = observers.get(el)
    if (observer) {
      observer.disconnect()
      observers.delete(el)
    }
  }
}
