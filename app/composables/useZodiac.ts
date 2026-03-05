/**
 * Composable for zodiac sign translations and icons.
 * Translates English zodiac sign names to the current locale.
 */

const zodiacData: Record<string, { ru: string; icon: string; element: string }> = {
    Aries: { ru: 'Овен', icon: '♈', element: 'fire' },
    Taurus: { ru: 'Телец', icon: '♉', element: 'earth' },
    Gemini: { ru: 'Близнецы', icon: '♊', element: 'air' },
    Cancer: { ru: 'Рак', icon: '♋', element: 'water' },
    Leo: { ru: 'Лев', icon: '♌', element: 'fire' },
    Virgo: { ru: 'Дева', icon: '♍', element: 'earth' },
    Libra: { ru: 'Весы', icon: '♎', element: 'air' },
    Scorpio: { ru: 'Скорпион', icon: '♏', element: 'water' },
    Sagittarius: { ru: 'Стрелец', icon: '♐', element: 'fire' },
    Capricorn: { ru: 'Козерог', icon: '♑', element: 'earth' },
    Aquarius: { ru: 'Водолей', icon: '♒', element: 'air' },
    Pisces: { ru: 'Рыбы', icon: '♓', element: 'water' },
}

const elementColors: Record<string, string> = {
    fire: 'text-red-400',
    earth: 'text-emerald-400',
    air: 'text-sky-400',
    water: 'text-blue-400',
}

const elementBgColors: Record<string, string> = {
    fire: 'bg-red-500/15 border-red-500/30',
    earth: 'bg-emerald-500/15 border-emerald-500/30',
    air: 'bg-sky-500/15 border-sky-500/30',
    water: 'bg-blue-500/15 border-blue-500/30',
}

const planetData: Record<string, { ru: string; emoji: string }> = {
    Sun: { ru: 'Солнце', emoji: '☀️' },
    Moon: { ru: 'Луна', emoji: '🌙' },
    Mercury: { ru: 'Меркурий', emoji: '☿️' },
    Venus: { ru: 'Венера', emoji: '♀️' },
    Mars: { ru: 'Марс', emoji: '♂️' },
    Jupiter: { ru: 'Юпитер', emoji: '♃' },
    Saturn: { ru: 'Сатурн', emoji: '♄' },
    Uranus: { ru: 'Уран', emoji: '⛢' },
    Neptune: { ru: 'Нептун', emoji: '♆' },
    Pluto: { ru: 'Плутон', emoji: '♇' },
}

export function useZodiac() {
    const { locale } = useI18n()

    function translateSign(sign: string): string {
        if (locale.value === 'ru') {
            return zodiacData[sign]?.ru || sign
        }
        return sign
    }

    function translatePlanet(name: string): string {
        if (locale.value === 'ru') {
            return planetData[name]?.ru || name
        }
        return name
    }

    function getPlanetEmoji(name: string): string {
        return planetData[name]?.emoji || '⭐'
    }

    function getSignIcon(sign: string): string {
        return zodiacData[sign]?.icon || '⭐'
    }

    function getSignElement(sign: string): string {
        return zodiacData[sign]?.element || 'fire'
    }

    function getElementColor(sign: string): string {
        const element = getSignElement(sign)
        return elementColors[element] || 'text-violet-400'
    }

    function getElementBgColor(sign: string): string {
        const element = getSignElement(sign)
        return elementBgColors[element] || 'bg-violet-500/15 border-violet-500/30'
    }

    return {
        translateSign,
        translatePlanet,
        getPlanetEmoji,
        getSignIcon,
        getSignElement,
        getElementColor,
        getElementBgColor,
    }
}
