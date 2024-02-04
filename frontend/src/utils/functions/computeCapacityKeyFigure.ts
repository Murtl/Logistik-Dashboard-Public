import type { AKeyModel } from '@/utils/types/aKeyModel'
import type { Ref } from 'vue'

/**
 * @description Compute the capacity key figure
 * @param keyFigures the key figures
 * @param keyFigureName the name of the key figure
 * @param totalNumber the total number of the key figure
 */
export const computeCapacityKeyFigure = (
  keyFigures: AKeyModel[],
  keyFigureName: string,
  totalNumber: Ref<number>
) => {
  let avgValue = 0
  keyFigures.forEach((kpi) => {
    if (kpi.name === keyFigureName) {
      totalNumber.value = 0
      kpi.values.forEach((value) => {
        avgValue = avgValue + value.value[0].avg
        totalNumber.value += value.value[0].capacity
      })
      avgValue = avgValue / kpi.values.length
    }
  })
  return parseFloat(avgValue.toFixed(2))
}

/**
 * @description Compute the capacity key figure for the tour
 * @param keyFigures the key figures
 * @param keyFigureName the name of the key figure
 */
export const computeCapacityKeyFigureTour = (keyFigures: AKeyModel[], keyFigureName: string) => {
  let avgValue = 0
  keyFigures.forEach((kpi) => {
    if (kpi.name === keyFigureName) {
      kpi.values.forEach((value) => {
        avgValue = avgValue + value.value
      })
    }
  })
  return parseFloat(avgValue.toFixed(2))
}
