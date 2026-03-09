// IBU calculation using Tinseth formula

export function calculateIBU(hops, og, batchSizeLiters) {

  if (!hops || hops.length === 0) return 0
  if (!og) return 0

  const volumeLiters = batchSizeLiters
  const gravity = parseFloat(og)

  let totalIBU = 0

  hops.forEach(hop => {

    if (!hop.weight || !hop.time) return

    const weightGrams = parseFloat(hop.weight)
    const timeMinutes = parseFloat(hop.time)

    // assume alpha acid if not provided
    const alphaAcid = hop.alpha || 0.10

    // Tinseth utilization
    const utilization =
      (1.65 * Math.pow(0.000125, gravity - 1)) *
      ((1 - Math.exp(-0.04 * timeMinutes)) / 4.15)

    const ibu =
      (weightGrams * alphaAcid * utilization * 1000) /
      volumeLiters

    totalIBU += ibu

  })

  return totalIBU.toFixed(1)

}