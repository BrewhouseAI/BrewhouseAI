// OG calculation for all-grain brewing

// potential gravity points per kg malt (approx values)
const maltPPG = {
  "Pilsnermalt": 37,
  "Pale Malt": 36,
  "Munich Malt": 35,
  "Vienna Malt": 35,
  "Vetemalt": 38,
  "Wheat Malt": 38,
  "Oat Malt": 33,
  "Havre": 33
}

export function calculateOG(malts, batchSizeLiters, efficiency = 0.75) {

  if (!malts || malts.length === 0) return null

  let totalGravityPoints = 0

  malts.forEach(malt => {

    if (!malt.weight) return

    const weightKg = parseFloat(malt.weight)

    const ppg = maltPPG[malt.name] || 36

    const gravityPoints = weightKg * ppg * efficiency

    totalGravityPoints += gravityPoints

  })

  const volumeGallons = batchSizeLiters * 0.264172

  const ogPoints = totalGravityPoints / volumeGallons

  const og = 1 + (ogPoints / 1000)

  return og.toFixed(3)

}