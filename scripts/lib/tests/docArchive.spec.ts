import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { addVersion, readVersions, writeVersions } from '../docArchive.mjs'

let dir: string
let file: string

describe('docArchive', () => {
	beforeEach(() => {
		dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-archive-'))
		file = path.join(dir, 'versions.json')
	})

	afterEach(() => {
		fs.rmSync(dir, { recursive: true, force: true })
	})

	describe('addVersion', () => {
		it('ajoute la version, la plus récente en premier', () => {
			expect(addVersion(['1.2.2', '1.1.6'], '1.2.10')).toEqual(['1.2.10', '1.2.2', '1.1.6'])
			expect(addVersion(['1.2.2'], '1.1.6')).toEqual(['1.2.2', '1.1.6'])
		})

		it('n\'ajoute pas deux fois la même version', () => {
			expect(addVersion(['1.2.2', '1.2.1'], '1.2.2')).toEqual(['1.2.2', '1.2.1'])
		})

		it('refuse une version mal formée', () => {
			expect(() => addVersion([], 'v1.2.2')).toThrow('Version invalide')
			expect(() => addVersion([], '1.2.0-beta')).toThrow('Version invalide')
		})
	})

	describe('readVersions', () => {
		it('renvoie une liste vide si le fichier est absent ou invalide', () => {
			expect(readVersions(file)).toEqual([])
			fs.writeFileSync(file, '<html>')
			expect(readVersions(file)).toEqual([])
			fs.writeFileSync(file, '{"versions":[]}')
			expect(readVersions(file)).toEqual([])
		})

		it('ignore les entrées mal formées', () => {
			fs.writeFileSync(file, JSON.stringify(['1.2.2', 'v1.2.1', 12, '1.2.0']))
			expect(readVersions(file)).toEqual(['1.2.2', '1.2.0'])
		})
	})

	describe('writeVersions', () => {
		it('crée versions.json à la première archive', () => {
			expect(writeVersions(file, '1.2.1')).toEqual(['1.2.1'])
			expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual(['1.2.1'])
		})

		it('complète la liste existante', () => {
			writeVersions(file, '1.2.1')
			writeVersions(file, '1.2.2')
			writeVersions(file, '1.1.6')

			expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual(['1.2.2', '1.2.1', '1.1.6'])
		})
	})
})
