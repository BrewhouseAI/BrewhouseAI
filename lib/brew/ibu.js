export function calculateIBU(hops, og, batchSizeLiters) {

  if (!hops || hops.length === 0) return 0
  if (!og) return 0

  const gravity = parseFloat(og)
  const volume = parseFloat(batchSizeLiters)

  let totalIBU = 0

  hops.forEach(hop => {

    if (!hop.weight || !hop.time) return

    const weight = parseFloat(hop.weight)
    const time = parseFloat(hop.time)

    if (isNaN(weight) || isNaN(time)) return

    const alpha = hop.alpha || 0.10

    const utilization =
      (1.65 * Math.pow(0.000125, gravity - 1)) *
      ((1 - Math.exp(-0.04 * time)) / 4.15)

    const ibu =
      (weight * alpha * utilization * 1000) / volume

    totalIBU += ibu

  })

  return totalIBU.toFixed(1)

}