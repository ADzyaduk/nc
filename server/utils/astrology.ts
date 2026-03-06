import * as Astronomy from 'astronomy-engine'
import type { NatalChartData, ChartPlanet, ChartHouse, ChartAspect, SynastryData, CompatibilityScores } from './schemas'

/**
 * Real astrology engine using astronomy-engine library.
 * Calculates accurate planetary positions, ascendant, houses, and aspects.
 */

const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const

const PLANET_BODIES: Array<{ name: string; body: Astronomy.Body }> = [
    { name: 'Mercury', body: Astronomy.Body.Mercury },
    { name: 'Venus', body: Astronomy.Body.Venus },
    { name: 'Mars', body: Astronomy.Body.Mars },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { name: 'Saturn', body: Astronomy.Body.Saturn },
    { name: 'Uranus', body: Astronomy.Body.Uranus },
    { name: 'Neptune', body: Astronomy.Body.Neptune },
    { name: 'Pluto', body: Astronomy.Body.Pluto },
]

const ASPECT_TYPES = [
    { name: 'conjunction', angle: 0, orb: 8 },
    { name: 'sextile', angle: 60, orb: 6 },
    { name: 'square', angle: 90, orb: 7 },
    { name: 'trine', angle: 120, orb: 8 },
    { name: 'opposition', angle: 180, orb: 8 },
] as const

/**
 * Get zodiac sign from ecliptic longitude (0-360 degrees).
 */
function getZodiacSign(longitude: number): string {
    const normalized = ((longitude % 360) + 360) % 360
    const signIndex = Math.floor(normalized / 30)
    return ZODIAC_SIGNS[signIndex]!
}

/**
 * Get degree within the sign (0-29).
 */
function getDegreeInSign(longitude: number): number {
    const normalized = ((longitude % 360) + 360) % 360
    return Math.round((normalized % 30) * 10) / 10
}

/**
 * Create a Date object from birth date/time string, treating as UTC.
 * Birth time is local, but we approximate using UTC for simplicity.
 * For precision, timezone conversion would be needed.
 */
function createBirthDate(birthDate: string, birthTime: string): Date {
    return new Date(`${birthDate}T${birthTime}:00Z`)
}

/**
 * Calculate GMST (Greenwich Mean Sidereal Time) in degrees.
 */
function calculateGMST(date: Date): number {
    const jd = date.getTime() / 86400000 + 2440587.5
    const T = (jd - 2451545.0) / 36525.0
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
        + 0.000387933 * T * T - T * T * T / 38710000.0
    gmst = ((gmst % 360) + 360) % 360
    return gmst
}

/**
 * Calculate Local Sidereal Time in degrees.
 */
function calculateLST(date: Date, longitude: number): number {
    const gmst = calculateGMST(date)
    let lst = gmst + longitude
    lst = ((lst % 360) + 360) % 360
    return lst
}

/**
 * Calculate Ascendant from LST and latitude.
 * Uses the standard astrological formula.
 */
function calculateAscendant(date: Date, latitude: number, longitude: number): number {
    const lst = calculateLST(date, longitude)
    const lstRad = lst * Math.PI / 180
    const latRad = latitude * Math.PI / 180

    // Obliquity of the ecliptic (approximately 23.4393°)
    const obliquity = 23.4393 * Math.PI / 180

    // Ascendant formula
    const y = -Math.cos(lstRad)
    const x = Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity)

    let asc = Math.atan2(y, x) * 180 / Math.PI
    asc = ((asc % 360) + 360) % 360

    return asc
}

/**
 * Calculate Placidus house cusps (simplified).
 * Returns 12 house cusp longitudes.
 */
function calculateHouseCusps(ascendant: number): number[] {
    const cusps: number[] = []
    // Equal house system (30° per house from Ascendant)
    for (let i = 0; i < 12; i++) {
        cusps.push(((ascendant + i * 30) % 360 + 360) % 360)
    }
    return cusps
}

/**
 * Determine which house a planet falls in based on house cusps.
 */
function getHouseNumber(planetLongitude: number, houseCusps: number[]): number {
    const normalized = ((planetLongitude % 360) + 360) % 360

    for (let i = 0; i < 12; i++) {
        const cusp = houseCusps[i]!
        const nextCusp = houseCusps[(i + 1) % 12]!

        if (nextCusp > cusp) {
            if (normalized >= cusp && normalized < nextCusp) return i + 1
        }
        else {
            if (normalized >= cusp || normalized < nextCusp) return i + 1
        }
    }
    return 1
}

/**
 * Calculate real natal chart using astronomy-engine.
 */
export function calculateNatalChart(
    birthDate: string,
    birthTime: string,
    latitude: number,
    longitude: number,
): NatalChartData {
    const date = createBirthDate(birthDate, birthTime)

    // Calculate Ascendant
    const ascLongitude = calculateAscendant(date, latitude, longitude)
    const ascendant = {
        sign: getZodiacSign(ascLongitude),
        degree: getDegreeInSign(ascLongitude),
    }

    // Calculate house cusps (equal house system)
    const houseCusps = calculateHouseCusps(ascLongitude)

    // Calculate Sun position
    const sunPos = Astronomy.SunPosition(date)
    const sunLongitude = sunPos.elon
    const sunHouse = getHouseNumber(sunLongitude, houseCusps)
    const sun: ChartPlanet = {
        name: 'Sun',
        sign: getZodiacSign(sunLongitude),
        degree: getDegreeInSign(sunLongitude),
        house: sunHouse,
    }

    // Calculate Moon position
    const moonPos = Astronomy.EclipticGeoMoon(date)
    const moonLongitude = moonPos.lon
    const moonHouse = getHouseNumber(moonLongitude, houseCusps)
    const moon: ChartPlanet = {
        name: 'Moon',
        sign: getZodiacSign(moonLongitude),
        degree: getDegreeInSign(moonLongitude),
        house: moonHouse,
    }

    // Calculate other planets
    const planets: ChartPlanet[] = [sun, moon]
    const allLongitudes: Array<{ name: string; longitude: number }> = [
        { name: 'Sun', longitude: sunLongitude },
        { name: 'Moon', longitude: moonLongitude },
    ]

    for (const { name, body } of PLANET_BODIES) {
        const longitude_deg = Astronomy.EclipticLongitude(body, date)
        const house = getHouseNumber(longitude_deg, houseCusps)

        planets.push({
            name,
            sign: getZodiacSign(longitude_deg),
            degree: getDegreeInSign(longitude_deg),
            house,
        })

        allLongitudes.push({ name, longitude: longitude_deg })
    }

    // Generate houses
    const houses: ChartHouse[] = houseCusps.map((cusp, i) => ({
        number: i + 1,
        sign: getZodiacSign(cusp),
        degree: getDegreeInSign(cusp),
    }))

    // Calculate aspects between all planet pairs
    const aspects: ChartAspect[] = []
    for (let i = 0; i < allLongitudes.length; i++) {
        for (let j = i + 1; j < allLongitudes.length; j++) {
            const p1 = allLongitudes[i]!
            const p2 = allLongitudes[j]!

            let diff = Math.abs(p1.longitude - p2.longitude)
            if (diff > 180) diff = 360 - diff

            for (const aspect of ASPECT_TYPES) {
                const orbVal = Math.abs(diff - aspect.angle)
                if (orbVal <= aspect.orb) {
                    aspects.push({
                        planet1: p1.name,
                        planet2: p2.name,
                        type: aspect.name,
                        degree: aspect.angle,
                        orb: Math.round(orbVal * 10) / 10,
                    })
                    break
                }
            }
        }
    }

    return {
        sun,
        moon,
        ascendant,
        planets,
        houses,
        aspects,
    }
}

// ---- Synastry / Compatibility ----

/**
 * Aspect harmony weights for score calculation.
 * Positive = harmonious, negative = tense.
 */
const ASPECT_HARMONY: Record<string, number> = {
    conjunction: 0.8,  // strong but neutral-positive
    trine: 1.0,        // highly harmonious
    sextile: 0.7,      // mildly harmonious
    square: -0.6,      // tense
    opposition: -0.4,  // polarizing but can complement
}

/**
 * Defines which cross-chart planet pairs contribute to each category.
 */
const CATEGORY_PAIRS: Record<string, Array<[string, string]>> = {
    emotional: [
        ['Moon', 'Moon'], ['Moon', 'Venus'], ['Moon', 'Sun'],
        ['Venus', 'Venus'], ['Moon', 'Mercury'],
    ],
    passion: [
        ['Mars', 'Venus'], ['Mars', 'Mars'], ['Sun', 'Mars'],
        ['Venus', 'Pluto'], ['Mars', 'Pluto'],
    ],
    communication: [
        ['Mercury', 'Mercury'], ['Mercury', 'Moon'], ['Mercury', 'Sun'],
        ['Mercury', 'Venus'], ['Mercury', 'Jupiter'],
    ],
    values: [
        ['Saturn', 'Venus'], ['Jupiter', 'Saturn'], ['Sun', 'Sun'],
        ['Jupiter', 'Jupiter'], ['Saturn', 'Moon'],
    ],
}

/**
 * Get all ecliptic longitudes from a natal chart as a map.
 */
function getLongitudesMap(chart: NatalChartData): Map<string, number> {
    const map = new Map<string, number>()
    for (const planet of chart.planets) {
        // Reconstruct longitude from sign + degree
        const signIndex = ZODIAC_SIGNS.indexOf(planet.sign as typeof ZODIAC_SIGNS[number])
        if (signIndex !== -1) {
            map.set(planet.name, signIndex * 30 + planet.degree)
        }
    }
    // Add ascendant
    const ascIndex = ZODIAC_SIGNS.indexOf(chart.ascendant.sign as typeof ZODIAC_SIGNS[number])
    if (ascIndex !== -1) {
        map.set('Ascendant', ascIndex * 30 + chart.ascendant.degree)
    }
    return map
}

/**
 * Calculate cross-chart aspects between two natal charts.
 */
function calculateCrossAspects(chart1: NatalChartData, chart2: NatalChartData): ChartAspect[] {
    const longs1 = getLongitudesMap(chart1)
    const longs2 = getLongitudesMap(chart2)
    const crossAspects: ChartAspect[] = []

    for (const [name1, lon1] of longs1) {
        for (const [name2, lon2] of longs2) {
            let diff = Math.abs(lon1 - lon2)
            if (diff > 180) diff = 360 - diff

            for (const aspect of ASPECT_TYPES) {
                const orbVal = Math.abs(diff - aspect.angle)
                if (orbVal <= aspect.orb) {
                    crossAspects.push({
                        planet1: name1,
                        planet2: name2,
                        type: aspect.name,
                        degree: aspect.angle,
                        orb: Math.round(orbVal * 10) / 10,
                    })
                    break
                }
            }
        }
    }

    return crossAspects
}

/**
 * Calculate a category score (0-100) from cross-aspects relevant to that category.
 */
function calculateCategoryScore(
    crossAspects: ChartAspect[],
    pairs: Array<[string, string]>,
): number {
    let totalWeight = 0
    let harmonySum = 0
    let matchCount = 0

    for (const aspect of crossAspects) {
        // Check if this aspect matches any pair (bidirectional)
        const isRelevant = pairs.some(([a, b]) =>
            (aspect.planet1 === a && aspect.planet2 === b)
            || (aspect.planet1 === b && aspect.planet2 === a),
        )

        if (!isRelevant) continue

        matchCount++
        const harmony = ASPECT_HARMONY[aspect.type] ?? 0
        // Closer orb = stronger influence
        const orbStrength = 1 - (aspect.orb / 10)
        const weight = Math.abs(harmony) * orbStrength

        totalWeight += weight
        harmonySum += harmony * orbStrength
    }

    if (matchCount === 0) {
        // No relevant aspects found — neutral score
        return 50
    }

    // Normalize to 0-100 range
    // harmonySum / totalWeight gives -1 to +1 ratio
    const ratio = totalWeight > 0 ? harmonySum / totalWeight : 0
    // Map from [-1, 1] to [15, 95] — avoid extremes
    const score = Math.round(((ratio + 1) / 2) * 80 + 15)
    return Math.max(10, Math.min(98, score))
}

/**
 * Calculate synastry between two people.
 * Returns both natal charts, cross-aspects, and compatibility scores.
 */
export function calculateSynastry(
    person1: { birthDate: string; birthTime: string; latitude: number; longitude: number },
    person2: { birthDate: string; birthTime: string; latitude: number; longitude: number },
): SynastryData {
    // Generate both natal charts
    const chart1 = calculateNatalChart(person1.birthDate, person1.birthTime, person1.latitude, person1.longitude)
    const chart2 = calculateNatalChart(person2.birthDate, person2.birthTime, person2.latitude, person2.longitude)

    // Calculate cross-chart aspects
    const crossAspects = calculateCrossAspects(chart1, chart2)

    // Calculate category scores
    const emotional = calculateCategoryScore(crossAspects, CATEGORY_PAIRS.emotional!)
    const passion = calculateCategoryScore(crossAspects, CATEGORY_PAIRS.passion!)
    const communication = calculateCategoryScore(crossAspects, CATEGORY_PAIRS.communication!)
    const values = calculateCategoryScore(crossAspects, CATEGORY_PAIRS.values!)

    // Overall = weighted average
    const overall = Math.round(
        emotional * 0.30
        + passion * 0.25
        + communication * 0.25
        + values * 0.20,
    )

    const scores: CompatibilityScores = {
        overall,
        emotional,
        passion,
        communication,
        values,
    }

    return { chart1, chart2, crossAspects, scores }
}

