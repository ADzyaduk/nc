export function useShare() {
    const { openLink } = useTelegram()
    const config = useRuntimeConfig()
    const { t } = useI18n()

    function share(text: string) {
        const botUsername = config.public.telegramBotUsername as string
        const deeplink = botUsername
            ? `https://t.me/${botUsername}?startapp=share`
            : 'https://t.me'
        const url = `https://t.me/share/url?url=${encodeURIComponent(deeplink)}&text=${encodeURIComponent(text)}`
        openLink(url)
    }

    function shareNatalChart(chartJson: {
        sun: { sign: string }
        moon: { sign: string }
        ascendant: { sign: string }
    }) {
        const text = t('share.natal', {
            sun: chartJson.sun.sign,
            moon: chartJson.moon.sign,
            asc: chartJson.ascendant.sign,
        })
        share(text)
    }

    function shareCompatibility(report: {
        scores: { overall: number }
        person1_name?: string | null
        person2_name?: string | null
    }) {
        const text = t('share.compatibility', { score: report.scores.overall })
        share(text)
    }

    function shareTarot(cards: Array<{ name: string }>, _question: string) {
        const cardNames = cards.map(c => c.name).join(' | ')
        const text = t('share.tarot', { cards: cardNames })
        share(text)
    }

    return { shareNatalChart, shareCompatibility, shareTarot }
}
