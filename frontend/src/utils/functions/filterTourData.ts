import type { ATourDataType } from '@/utils/types/aTourDataType'

/**
 * @description Filter the tour data by the filter array
 * @param tourData the tour data to filter
 * @param filterArray the filter array
 * @returns the filtered tour data
 */
export const filterTourData = (
  tourData: ATourDataType[],
  filterArray: string[]
): ATourDataType[] => {
  if (tourData.length === 0) {
    return tourData
  }
  return tourData.filter((item) => {
    if (filterArray[0] === '') {
      return true
    }
    if (
      item.transportOperator.toLowerCase().includes(filterArray[0].toLowerCase()) ||
      item.tourNumber.toLowerCase().includes(filterArray[0].toLowerCase())
    ) {
      if (filterArray.length > 1) {
        return item.tourNumber.toLowerCase().includes(filterArray[1].toLowerCase())
      }
      return true
    }
    return false
  })
}
