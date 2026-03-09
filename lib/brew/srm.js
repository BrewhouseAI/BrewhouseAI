// Beer color calculation using the Morey equation

// Approximate Lovibond values for common malts
const maltColor = {
  "Pilsnermalt": 2,
  "Pale Malt": 3,
  "Vienna Malt": 4,
  "Munich Malt": 10,
  "Vetemalt": 2,
  "Wheat Malt": 2,
  "Havre": 2,
  "Oats": 2,
  "Crystal Malt": 60,
  "Chocolate Malt": 350,
  "Roasted Barley": 500
}

export function calculateSRM(malts, batchSizeLiters) {

  if (!malts || malts.length === 0) return null

  const volumeGallons = batchSizeLiters * 0.264172

  let mcu = 0

  malts.forEach(malt => {

    if (!malt.weight) return

    const weightKg = parseFloat(malt.weight)
    const weightLb = weightKg * 2.20462

    const lovibond = maltColor[malt.name] || 5

    mcu += (weightLb * lovibond) / volumeGallons

  })

  const srm = 1.4922 * Math.pow(mcu, 0.6859)

  return srm.toFixed(1)

}