/**
 * Types pour les composants DatePicker
 */

/**
 * Type représentant une valeur de date qui peut être une Date, un tableau de Dates ou null
 * Utilisé pour les opérations internes du DatePicker avec des objets Date
 */
export type DateObjectValue = Date | (Date | null)[] | null

/**
 * Alias pour maintenir la compatibilité avec le code existant
 * @deprecated Utilisez DateObjectValue pour les objets Date ou importez DateValue depuis useDateInitializationDayjs pour les chaînes
 */
export type DateValue = DateObjectValue
