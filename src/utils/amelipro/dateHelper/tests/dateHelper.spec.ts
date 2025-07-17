import { describe, it, expect } from 'vitest'
import { padTo2Digits, dateMatchFrIso, dateMatchIso, parseDate, dateToFormatFr, stringToDate, parseDateToFr, dateToBasicFormat } from '../dateHelper'

describe('dateHelper', () => {
	it('padTo2digits adds a "0" before a single number and make it a string', () => {
		const value = 2
		expect(padTo2Digits(value)).toEqual('02')
	})

	it('wrong value does not match the date ISO', () => {
		const value = '20/04/1976'
		expect(dateMatchIso(value)).toBeFalsy()
	})

	it('value matches the date FR ISO', () => {
		const value = '20/04/1976'
		expect(dateMatchFrIso(value)).toBeTruthy()
	})

	it('good value matches the date ISO', () => {
		const value = '1976-04-20'
		expect(dateMatchIso(value)).toBeTruthy()
	})

	it('transform a string into an array of [year, month, day]', () => {
		const value = '1976-04-20'
		expect(parseDate(value)).toEqual(['1976', '04', '20'])
	})

	it('transform a string into an array of [day, month, year]', () => {
		const value = '20/04/1976'
		expect(parseDateToFr(value)).toEqual(['20', '04', '1976'])
	})

	it('dateToFormatFr transform a "yyyy-mm-dd" date into a "dd/mm/yyyy" date', () => {
		const value = '1976-04-20'
		expect(dateToFormatFr(value)).toEqual('20/04/1976')
	})

	it('dateToFormatFr transform a "dd/mm/yyyy" date into a "yyyy-mm-dd" date', () => {
		const value = '20/04/1976'
		expect(dateToBasicFormat(value)).toEqual('1976-04-20')
	})

	it('stringToDate transform a string "yyyy-mm-dd" date into a object Date"', () => {
		const value = '1976-04-20'
		expect(stringToDate(value)).toBeInstanceOf(Date)
	})
})
