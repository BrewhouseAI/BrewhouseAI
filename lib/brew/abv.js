export function calculateABV(og, fg) {

  if (!og || !fg) return null

  const ogNum = parseFloat(og)
  const fgNum = parseFloat(fg)

  if (isNaN(ogNum) || isNaN(fgNum)) {
    return null
  }

  const abv = (ogNum - fgNum) * 131.25

  return abv.toFixed(2)

}