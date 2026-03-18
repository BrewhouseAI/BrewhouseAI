// ------------------------------------------------
// HOP DATABASE
// ------------------------------------------------

export const hopDatabase = {

  // Noble hops
  "saaz": { aa: 3.5 },
  "tettnang": { aa: 4.5 },
  "hallertau mittelfruh": { aa: 4 },
  "hallertau": { aa: 4 },
  "spalt": { aa: 4.5 },

  // German
  "hersbrucker": { aa: 3.5 },
  "perle": { aa: 7 },
  "tradition": { aa: 6 },
  "select": { aa: 5 },
  "saphir": { aa: 4 },

  // English
  "east kent goldings": { aa: 5 },
  "goldings": { aa: 5 },
  "fuggles": { aa: 4.5 },
  "challenger": { aa: 7 },
  "target": { aa: 10 },
  "northdown": { aa: 8 },

  // Classic American
  "cascade": { aa: 6 },
  "centennial": { aa: 10 },
  "amarillo": { aa: 9 },
  "liberty": { aa: 4 },
  "willamette": { aa: 5 },

  // High alpha
  "magnum": { aa: 13 },
  "warrior": { aa: 16 },
  "columbus": { aa: 15 },
  "tomahawk": { aa: 15 },
  "zeus": { aa: 15 },

  // Modern IPA
  "citra": { aa: 12 },
  "mosaic": { aa: 11 },
  "simcoe": { aa: 13 },
  "azacca": { aa: 15 },
  "eldorado": { aa: 15 },
  "idaho 7": { aa: 13 },
  "talus": { aa: 9 },
  "sabro": { aa: 14 },
  "strata": { aa: 12 },

  // NZ / AU
  "galaxy": { aa: 14 },
  "nelson sauvin": { aa: 12 },
  "motueka": { aa: 7 },
  "riwaka": { aa: 6 },
  "wai-iti": { aa: 3 },

  "vic secret": { aa: 14 },
  "topaz": { aa: 17 },
  "summer": { aa: 6 },

  "pacific jade": { aa: 12 },
  "pacific gem": { aa: 15 },
  "rakau": { aa: 10 },

  // Experimental
  "hbc 472": { aa: 8 },
  "hbc 586": { aa: 13 },
  "hbc 630": { aa: 16 },

  // Dual purpose
  "chinook": { aa: 13 },
  "nugget": { aa: 13 },
  "apollo": { aa: 18 },
  "summit": { aa: 17 },

  // European aroma
  "styrian goldings": { aa: 5 },
  "lubelski": { aa: 4 },
  "premiant": { aa: 9 }

}



// ------------------------------------------------
// YEAST DATABASE
// ------------------------------------------------

export const yeastDatabase = {

  // Ale
  "us-05": { attenuation: "78%", temp: "18-22C" },
  "wlp001": { attenuation: "75%", temp: "18-21C" },
  "wy1056": { attenuation: "75%", temp: "18-21C" },

  "wlp002": { attenuation: "70%", temp: "18-20C" },
  "wy1968": { attenuation: "71%", temp: "18-20C" },

  "s-04": { attenuation: "75%", temp: "18-20C" },
  "nottingham": { attenuation: "77%", temp: "16-22C" },

  // Belgian
  "wlp500": { attenuation: "75%", temp: "19-24C" },
  "wy1214": { attenuation: "74%", temp: "20-24C" },
  "wlp530": { attenuation: "78%", temp: "19-23C" },

  // Wheat
  "wlp300": { attenuation: "73%", temp: "18-22C" },
  "wy3068": { attenuation: "74%", temp: "18-23C" },

  // Lager
  "w34/70": { attenuation: "80%", temp: "9-13C" },
  "wlp830": { attenuation: "74%", temp: "10-13C" },
  "wy2124": { attenuation: "73%", temp: "9-13C" },

  "s-23": { attenuation: "75%", temp: "12-15C" },

  // Kveik
  "voss kveik": { attenuation: "77%", temp: "30-40C" },
  "hornindal": { attenuation: "78%", temp: "30-38C" }

}



// ------------------------------------------------
// OG CALCULATION
// ------------------------------------------------

export function calculateOG(malts, batchSize = 20, efficiency = 0.75) {

  let gravityPoints = 0

  malts.forEach(malt => {

    const weightKg = parseFloat(malt.weight) || 0
    const potential = 300

    gravityPoints += weightKg * potential

  })

  gravityPoints = gravityPoints * efficiency

  const og = 1 + gravityPoints / (batchSize * 1000)

  return og.toFixed(3)

}



// ------------------------------------------------
// IBU CALCULATION
// ------------------------------------------------

export function calculateIBU(hops, batchSize = 20) {

  let ibu = 0

  hops.forEach(hop => {

    const weight = parseFloat(hop.weight) || 0
    const time = parseFloat(hop.time) || 0

    const name = (hop.name || "").toLowerCase()

    let alphaAcid = 0.08

    for (const key in hopDatabase) {

      if (name.includes(key)) {

        alphaAcid = hopDatabase[key].aa / 100
        break

      }

    }

    const utilization = 1 - Math.exp(-0.04 * time)
    const utilizationFactor = utilization / 4.15

    ibu += (weight * alphaAcid * utilizationFactor * 1000) / batchSize

  })

  return Math.round(ibu)

}



// ------------------------------------------------
// MALT COLOR DATABASE
// ------------------------------------------------

const maltColor = {

  // Base
  "pilsner malt": 2,
  "pale ale malt": 3,
  "maris otter": 3,
  "vienna malt": 4,
  "munich malt": 9,

  // Wheat
  "wheat malt": 2,
  "flaked wheat": 2,
  "flaked oats": 2,

  // Crystal
  "crystal 10": 10,
  "crystal 20": 20,
  "crystal 40": 40,
  "crystal 60": 60,
  "crystal 80": 80,
  "crystal 120": 120,

  // Specialty
  "biscuit malt": 23,
  "aromatic malt": 26,
  "victory malt": 25,
  "melanoidin malt": 20,

  // Dark
  "brown malt": 65,
  "chocolate malt": 350,
  "pale chocolate malt": 200,
  "dark chocolate malt": 450,
  "roasted barley": 500,
  "black malt": 500,
  "carafa i": 300,
  "carafa ii": 400,
  "carafa iii": 500

}



// ------------------------------------------------
// SRM CALCULATION
// ------------------------------------------------

export function calculateSRM(malts, batchSize = 20) {

  let mcu = 0

  malts.forEach(malt => {

    const weightKg = parseFloat(malt.weight) || 0
    const name = (malt.name || "").toLowerCase()

    let lovibond = 2

    for (const key in maltColor) {

      if (name.includes(key)) {

        lovibond = maltColor[key]
        break

      }

    }

    const weightLb = weightKg * 2.20462
    const volumeGal = batchSize * 0.264172

    mcu += (weightLb * lovibond) / volumeGal

  })

  const srm = 1.4922 * Math.pow(mcu, 0.6859)

  return Math.round(srm)

}