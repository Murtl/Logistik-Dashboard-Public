/**
 * type for the key figures
 */
export type AKeyModel = {
  name: string
  text: string
  unit: string
  values: { date: string; tourCount?: number; value: any }[]
}
