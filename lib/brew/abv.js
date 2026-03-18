export function calculateABV(og, fg) {

  const ogNum = parseFloat(og)
  const fgNum = parseFloat(fg)

  if (isNaN(ogNum) || isNaN(fgNum)) return null

  const abv = (ogNum - fgNum) * 131.25

  return abv.toFixed(2)

}