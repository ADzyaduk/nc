export function useShare() {
    const { openLink } = useTelegram()
    const config = useRuntimeConfig()
    const { translateSign } = useZodiac()

    function share(text: string, startParam?: string) {
        const botUsername = config.public.telegramBotUsername as string
        const param = startParam || 'open'
        const deeplink = botUsername
            ? `https://t.me/${botUsername}?startapp=${param}`
            : 'https://t.me'
        const url = `https://t.me/share/url?url=${encodeURIComponent(deeplink)}&text=${encodeURIComponent(text)}`
        openLink(url)
    }

    function shareNatalChart(
        chartJson: { sun: { sign: string }; moon: { sign: string }; ascendant: { sign: string } },
        chartId: string,
    ) {
        const sun = translateSign(chartJson.sun.sign)
        const moon = translateSign(chartJson.moon.sign)
        const asc = translateSign(chartJson.ascendant.sign)
        const text = `🌌 Моя натальная карта\n\n☀️ Солнце: ${sun} | 🌙 Луна: ${moon} | ⬆️ Асцендент: ${asc}\n\nСмотри мою карту 👇`
        share(text, `chart_${chartId.replace(/-/g, '')}`)
    }

    function shareCompatibility(report: {
        id: string
        scores: { overall: number }
        person1_name?: string | null
        person2_name?: string | null
    }) {
        const names = [report.person1_name, report.person2_name].filter(Boolean).join(' & ')
        const text = names
            ? `💫 ${names} — совместимость ${report.scores.overall}%\n\nЭмоции · Страсть · Общение · Ценности\n\nПосмотри наш результат 👇`
            : `💫 Наша совместимость: ${report.scores.overall}%\n\nЭмоции · Страсть · Общение · Ценности\n\nПосмотри результат 👇`
        share(text, `compat_${report.id.replace(/-/g, '')}`)
    }

    function shareTarot(cards: Array<{ name: string }>, _question: string) {
        const cardNames = cards.map(c => c.name).join(' | ')
        const text = `🔮 Мой расклад Таро\n\n🃏 ${cardNames}\n\nУзнай свой ответ у карт!`
        share(text)
    }

    return { shareNatalChart, shareCompatibility, shareTarot }
}
