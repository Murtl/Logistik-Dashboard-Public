/**
 * Interface for the data of a Kennzahlkachel
 */
export interface AKennzahlkachelData {
  value: number
  unit?: string
  ps: {
    absolute: number
    percentage: number
  }
  text?: string
  alternativeBottomText?: string
}
