/**
 * City geocoding API using OpenStreetMap Nominatim.
 * Returns city suggestions with coordinates.
 */
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const q = String(query.q || '').trim()

    if (!q || q.length < 2) {
        return { cities: [] }
    }

    try {
        const results = await $fetch<Array<{
            display_name: string
            lat: string
            lon: string
            type: string
            address?: {
                city?: string
                town?: string
                village?: string
                state?: string
                country?: string
            }
        }>>('https://nominatim.openstreetmap.org/search', {
            params: {
                q,
                format: 'json',
                addressdetails: 1,
                limit: 6,
                'accept-language': 'ru,en',
                featuretype: 'city',
            },
            headers: {
                'User-Agent': 'OpunaApp/1.0',
            },
        })

        const cities = results.map((r) => {
            const cityName = r.address?.city || r.address?.town || r.address?.village || ''
            const state = r.address?.state || ''
            const country = r.address?.country || ''

            // Build display label
            const parts = [cityName, state, country].filter(Boolean)
            const label = parts.length > 0 ? parts.join(', ') : r.display_name.split(',').slice(0, 3).join(',')

            return {
                label,
                latitude: parseFloat(r.lat),
                longitude: parseFloat(r.lon),
            }
        })

        // Deduplicate by label
        const unique = cities.filter((c, i, arr) =>
            arr.findIndex(x => x.label === c.label) === i,
        )

        return { cities: unique }
    }
    catch {
        return { cities: [] }
    }
})
