import { describe, it, expect } from 'vitest'
import { toKebabCase } from '../toKebabCase'

describe('toKebabCase', () => {
	it('retourne une chaîne vide si value est vide', () => {
		expect(toKebabCase('')).toBe('')
	})

	it('convertit camelCase en kebab-case', () => {
		expect(toKebabCase('camelCase')).toBe('camel-case')
	})

	it('convertit PascalCase en kebab-case', () => {
		expect(toKebabCase('PascalCase')).toBe('pascal-case')
	})

	it('convertit plusieurs mots camelCase', () => {
		expect(toKebabCase('myVariableName')).toBe('my-variable-name')
	})

	it('convertit plusieurs mots PascalCase', () => {
		expect(toKebabCase('MyVariableName')).toBe('my-variable-name')
	})

	it('gère les acronymes contigus (HTMLFile -> html-file)', () => {
		expect(toKebabCase('HTMLFile')).toBe('html-file')
	})

	it('gère les acronymes en début (XMLParser)', () => {
		expect(toKebabCase('XMLParser')).toBe('xml-parser')
	})

	it('gère les acronymes en fin (parseHTML)', () => {
		expect(toKebabCase('parseHTML')).toBe('parse-html')
	})

	it('laisse une chaîne déjà en minuscules inchangée', () => {
		expect(toKebabCase('alreadylower')).toBe('alreadylower')
	})

	it('met en minuscules une chaîne tout en majuscules', () => {
		expect(toKebabCase('UPPER')).toBe('upper')
	})

	it('gère un seul caractère', () => {
		expect(toKebabCase('A')).toBe('a')
	})

	it('gère les chiffres dans camelCase (myVar2Name)', () => {
		expect(toKebabCase('myVar2Name')).toBe('my-var2-name')
	})
})
