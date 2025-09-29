export interface IAmeliproTooth {
	currentState: IAmeliproToothState
	previousState?: IAmeliproToothState
	toothNumber: string
}

export interface IAmeliproToothState {
	decayed: boolean
	filled: boolean
	missing: boolean
}

export type AmeliproDentalChartLine = IAmeliproTooth[]
