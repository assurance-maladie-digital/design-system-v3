/**
 * Types pour les composants CalendarMode
 */

/**
 * Type représentant une valeur de date qui peut être une Date, un tableau de Dates ou null
 * Utilisé pour les opérations internes du CalendarMode avec des objets Date
 */
export type DateObjectValue = Date | (Date | null)[] | null

/**
 * @deprecated Utilisez DateObjectValue pour les objets Date ou importez DateModelValue depuis useDateInitializationDayjs pour les chaînes
 */
export type DateValue = DateObjectValue
