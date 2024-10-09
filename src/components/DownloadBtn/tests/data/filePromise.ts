import { type AxiosResponse } from 'axios'

/** Returns a promise that returns a file */
export function filePromise(): Promise<AxiosResponse<Blob>> {
	return new Promise((resolve) => {
		resolve({
			data: new File(['test'], 'attestation.txt', { type: 'text/plain' }),
			status: 200,
			statusText: 'OK',
			headers: {
				'content-type': 'text/plain',
				'content-disposition': 'attachment; filename="attestation.txt"',
			},
			config: {
				headers: {
					Accept: 'application/json, text/plain, */*',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
				} as any,
			},
		})
	})
}

export function filePromiseError(): Promise<AxiosResponse<Blob>> {
	return new Promise((_, reject) => {
		reject({
			response: {
				data: 'error',
				status: 500,
				statusText: 'Internal Server Error',
				headers: {},
				config: {},
			},
		})
	})
}

export function filePromiseNoHeaders(): Promise<AxiosResponse<Blob>> {
	return new Promise((resolve) => {
		resolve({
			data: new File(['test'], 'attestation.txt', { type: 'text/plain' }),
			status: 200,
			statusText: 'OK',
			headers: {},
			config: {
				headers: {
					Accept: 'application/json, text/plain, */*',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
				} as any,
			},
		})
	})
}
