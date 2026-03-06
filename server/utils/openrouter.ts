import type { NatalChartData, SynastryData, CompatibilityScores } from './schemas'
import type { TarotCard } from './tarot'

interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string
        }
    }>
}

/**
 * Calls OpenRouter API with the configured model.
 * Model is configurable via OPENROUTER_MODEL_ID env var.
 */
export async function callOpenRouter(
    messages: OpenRouterMessage[],
    apiKey: string,
    modelId: string,
): Promise<string> {
    const controller = new AbortController()
    const timeoutMs = 20000
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    let response: OpenRouterResponse
    try {
        response = await $fetch<OpenRouterResponse>('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://natal-chart.app',
                'X-Title': 'Natal Chart',
            },
            body: {
                model: modelId,
                messages,
                max_tokens: 4096,
                temperature: 0.7,
            },
            signal: controller.signal,
        })
    }
    catch (error: any) {
        if (error?.name === 'AbortError') {
            throw createError({
                statusCode: 504,
                statusMessage: `OpenRouter request timed out after ${timeoutMs}ms`,
            })
        }
        throw error
    }
    finally {
        clearTimeout(timeoutId)
    }

    if (!response.choices?.[0]?.message?.content) {
        throw createError({
            statusCode: 502,
            statusMessage: 'Empty response from AI model',
        })
    }

    return response.choices[0].message.content
}

/**
 * Builds the system prompt for natal chart interpretation.
 */
function buildSystemPrompt(locale: string): string {
    const lang = locale === 'ru' ? 'Russian' : 'English'
    return `You are an expert astrologer providing natal chart interpretations.
Respond ONLY in ${lang}.
Write in a warm, insightful, and encouraging tone.
Use astrological terminology but explain it accessibly.

FORMATTING RULES (STRICT — follow exactly):
- Use **bold text** for section titles, followed immediately by the content on the SAME line or a blank line before a new paragraph.
- FORBIDDEN: Never put a section title alone on one line and then start the next line with ": text". This is wrong: 
  BAD: "Personality Overview\\n: Sun in Pisces..."
  GOOD: "**Personality Overview:** Sun in Pisces..."
- For numbered lists, keep number + title + description ALL on ONE SINGLE LINE: "1. **Title**: Description"
- NEVER insert a line break after a colon in a list item.
- Double newline only between main sections/paragraphs.
- Do NOT use markdown headers (##, ###). Use **bold** for section names only.`
}

/**
 * Builds the user prompt with chart data for interpretation.
 */
function buildChartPrompt(chart: NatalChartData, type: 'basic' | 'full', locale: string): string {
    const lang = locale === 'ru' ? 'Russian' : 'English'

    const chartSummary = `
Natal Chart Data:
- Sun: ${chart.sun.sign} at ${chart.sun.degree}° (House ${chart.sun.house})
- Moon: ${chart.moon.sign} at ${chart.moon.degree}° (House ${chart.moon.house})
- Ascendant: ${chart.ascendant.sign} at ${chart.ascendant.degree}°
- Planets: ${chart.planets.map(p => `${p.name} in ${p.sign} (House ${p.house})`).join(', ')}
- Key Aspects: ${chart.aspects.slice(0, 8).map(a => `${a.planet1} ${a.type} ${a.planet2} (orb ${a.orb}°)`).join(', ')}
`

    if (type === 'basic') {
        return `${chartSummary}

Generate a BRIEF natal chart interpretation in ${lang}. Include:
1. **Personality overview** (2-3 sentences)
2. **Key strengths** (2-3 points)
3. **Main challenges** (2-3 points)

Keep it concise — about 300 words total.`
    }

    return `${chartSummary}

Generate a DETAILED natal chart interpretation in ${lang}. Include:
1. **Personality Overview** — deep analysis of Sun, Moon, and Ascendant combination
2. **Strengths** — detailed strengths with planetary explanations
3. **Challenges** — growth areas and how to work with difficult aspects
4. **Love & Relationships** — Venus, Mars, 7th house analysis
5. **Career & Calling** — MC, Saturn, Jupiter, 10th house analysis

Write approximately 800-1000 words. Be specific and personal based on the chart data.`
}

/**
 * Generates AI interpretation of a natal chart.
 */
export async function generateInterpretation(
    chart: NatalChartData,
    type: 'basic' | 'full',
    apiKey: string,
    modelId: string,
    locale: string = 'ru',
): Promise<string> {
    const messages: OpenRouterMessage[] = [
        { role: 'system', content: buildSystemPrompt(locale) },
        { role: 'user', content: buildChartPrompt(chart, type, locale) },
    ]

    try {
        return await callOpenRouter(messages, apiKey, modelId)
    }
    catch (error: any) {
        console.warn('OpenRouter API failed, using fallback interpretation:', error.message)
        return generateFallbackInterpretation(chart, type, locale)
    }
}

/**
 * Fallback interpretation when AI API is unavailable.
 * Returns a structured placeholder based on the actual chart data.
 */
function generateFallbackInterpretation(chart: NatalChartData, type: 'basic' | 'full', locale: string): string {
    const isRu = locale === 'ru'

    const sun = chart.sun
    const moon = chart.moon
    const asc = chart.ascendant

    if (type === 'basic') {
        if (isRu) {
            return `**Обзор личности**
Ваше Солнце в ${sun.sign} (${sun.degree}°, дом ${sun.house}) наделяет вас яркой индивидуальностью и сильной волей. Луна в ${moon.sign} добавляет эмоциональную глубину и интуицию. Асцендент в ${asc.sign} формирует ваш внешний образ и первое впечатление, которое вы производите на окружающих.

**Сильные стороны**
• Природная харизма и лидерские качества (Солнце в ${sun.sign})
• Глубокая эмоциональная интуиция (Луна в ${moon.sign})
• Умение адаптироваться и находить общий язык с людьми (Асцендент в ${asc.sign})

**Основные вызовы**
• Склонность к перфекционизму и самокритике
• Необходимость балансировать между логикой и эмоциями
• Важно научиться делегировать и доверять другим`
        }

        return `**Personality Overview**
Your Sun in ${sun.sign} (${sun.degree}°, house ${sun.house}) gives you a vibrant individuality and strong willpower. Moon in ${moon.sign} adds emotional depth and intuition. Ascendant in ${asc.sign} shapes your outward image and first impression.

**Key Strengths**
• Natural charisma and leadership qualities (Sun in ${sun.sign})
• Deep emotional intuition (Moon in ${moon.sign})
• Ability to adapt and connect with people (Ascendant in ${asc.sign})

**Main Challenges**
• Tendency toward perfectionism and self-criticism
• Need to balance logic and emotions
• Learning to delegate and trust others`
    }

    // Full report
    if (isRu) {
        return `**Обзор личности**
Ваше Солнце в ${sun.sign} (${sun.degree}°, дом ${sun.house}) — это ядро вашей идентичности. Вы обладаете природной силой и целеустремлённостью, характерной для этого знака. Луна в ${moon.sign} (${moon.degree}°, дом ${moon.house}) раскрывает вашу эмоциональную природу — вы чувствуете мир глубоко и интуитивно. Асцендент в ${asc.sign} (${asc.degree}°) определяет, как вас воспринимает мир — это ваша социальная маска и первое впечатление.

Комбинация Солнца в ${sun.sign} и Луны в ${moon.sign} создаёт уникальный внутренний диалог между вашей сознательной волей и подсознательными потребностями. Это может проявляться как внутреннее напряжение, но также как невероятная глубина характера.

**Сильные стороны**
Солнце в ${sun.sign} наделяет вас решительностью и способностью вести за собой. Вы умеете ставить цели и достигать их. Луна в ${moon.sign} дарит вам эмпатию и понимание человеческой природы. Ваши ${chart.aspects.length} аспектов формируют сложную и многогранную личность с большим потенциалом для роста.

**Вызовы и зоны роста**
Каждая сильная сторона имеет свою тень. Энергия ${sun.sign} может проявляться как упрямство, а чувствительность ${moon.sign} — как эмоциональная нестабильность. Важно осознавать эти тенденции и работать с ними.

**Любовь и отношения**
В отношениях вы ищете баланс между независимостью (${sun.sign}) и эмоциональной близостью (${moon.sign}). Ваш идеальный партнёр — тот, кто уважает вашу свободу и при этом способен на глубокую эмоциональную связь. Асцендент в ${asc.sign} делает вас привлекательным и магнетичным для окружающих.

**Карьера и призвание**
Профессионально вы преуспеваете в областях, где можете проявить свою ${sun.sign}-энергию — лидерство, творчество, инновации. Луна в ${moon.sign} добавляет интуитивное понимание потребностей других, что делает вас эффективным в работе с людьми. Ваше призвание связано с тем, чтобы вдохновлять и направлять.`
    }

    return `**Personality Overview**
Your Sun in ${sun.sign} (${sun.degree}°, house ${sun.house}) forms the core of your identity. You possess natural strength and determination characteristic of this sign. Moon in ${moon.sign} (${moon.degree}°, house ${moon.house}) reveals your emotional nature — you feel the world deeply and intuitively. Ascendant in ${asc.sign} (${asc.degree}°) determines how the world perceives you.

The combination of Sun in ${sun.sign} and Moon in ${moon.sign} creates a unique inner dialogue between your conscious will and subconscious needs. This can manifest as inner tension, but also as incredible depth of character.

**Strengths**
Sun in ${sun.sign} endows you with determination and leadership ability. Moon in ${moon.sign} gives you empathy and understanding of human nature. Your ${chart.aspects.length} aspects form a complex and multifaceted personality with great potential for growth.

**Challenges & Growth Areas**
Every strength has its shadow. The energy of ${sun.sign} can manifest as stubbornness, while ${moon.sign} sensitivity can become emotional instability. It's important to be aware of these tendencies.

**Love & Relationships**
In relationships, you seek balance between independence (${sun.sign}) and emotional closeness (${moon.sign}). Your ideal partner respects your freedom while being capable of deep emotional connection. Ascendant in ${asc.sign} makes you attractive and magnetic to others.

**Career & Calling**
Professionally, you thrive in areas where you can express your ${sun.sign} energy — leadership, creativity, innovation. Moon in ${moon.sign} adds intuitive understanding of others' needs. Your calling involves inspiring and guiding others.`
}

// ---- Compatibility / Synastry Interpretation ----

/**
 * Builds the system prompt for compatibility interpretation.
 */
function buildCompatibilitySystemPrompt(locale: string): string {
    const lang = locale === 'ru' ? 'Russian' : 'English'
    return `You are an expert astrologer specializing in synastry and relationship compatibility.
Respond ONLY in ${lang}.
Write in a warm, insightful, and balanced tone — highlight strengths and gently address challenges.
Use astrological terminology but explain it accessibly.

FORMATTING RULES (STRICT — follow exactly):
- Use **bold text** for section titles, followed immediately by the content on the SAME line or a blank line before a new paragraph.
- FORBIDDEN: Never put a section title alone on one line and then start the next line with ": text". This is wrong:
  BAD: "Emotional Bond\\n: Moon in Pisces..."
  GOOD: "**Emotional Bond:** Moon in Pisces..."
- Do NOT use markdown headers (##, ###). Use **bold** for section names only.
- Double newline only between main sections/paragraphs.`
}

/**
 * Builds the user prompt with synastry data for compatibility interpretation.
 */
function buildCompatibilityPrompt(synastry: SynastryData, type: 'basic' | 'full', locale: string): string {
    const lang = locale === 'ru' ? 'Russian' : 'English'
    const { chart1, chart2, crossAspects, scores } = synastry

    const chartSummary = `
Synastry Data:

Person 1:
- Sun: ${chart1.sun.sign} at ${chart1.sun.degree}° (House ${chart1.sun.house})
- Moon: ${chart1.moon.sign} at ${chart1.moon.degree}° (House ${chart1.moon.house})
- Ascendant: ${chart1.ascendant.sign} at ${chart1.ascendant.degree}°
- Venus: ${chart1.planets.find(p => p.name === 'Venus')?.sign ?? 'unknown'}
- Mars: ${chart1.planets.find(p => p.name === 'Mars')?.sign ?? 'unknown'}

Person 2:
- Sun: ${chart2.sun.sign} at ${chart2.sun.degree}° (House ${chart2.sun.house})
- Moon: ${chart2.moon.sign} at ${chart2.moon.degree}° (House ${chart2.moon.house})
- Ascendant: ${chart2.ascendant.sign} at ${chart2.ascendant.degree}°
- Venus: ${chart2.planets.find(p => p.name === 'Venus')?.sign ?? 'unknown'}
- Mars: ${chart2.planets.find(p => p.name === 'Mars')?.sign ?? 'unknown'}

Key Cross-Aspects: ${crossAspects.slice(0, 12).map(a => `${a.planet1} ${a.type} ${a.planet2} (orb ${a.orb}°)`).join(', ')}

Compatibility Scores:
- Overall: ${scores.overall}%
- Emotional: ${scores.emotional}%
- Passion: ${scores.passion}%
- Communication: ${scores.communication}%
- Values: ${scores.values}%
`

    if (type === 'basic') {
        return `${chartSummary}

Generate a BRIEF compatibility interpretation in ${lang}. Include:
1. **Overall connection** (2-3 sentences — what draws these two together)
2. **Strongest bond** (1-2 sentences — their best compatibility area)
3. **Growth area** (1-2 sentences — what to work on)

Keep it concise — about 300 words total.`
    }

    return `${chartSummary}

Generate a DETAILED compatibility interpretation in ${lang}. Include:
1. **Overall Connection** — what draws them together, core dynamic
2. **Emotional Bond** — Moon-Moon, Moon-Venus synastry analysis
3. **Passion & Attraction** — Mars-Venus, physical chemistry
4. **Communication Style** — Mercury interaspects, how they talk and listen
5. **Shared Values & Long-Term** — Saturn, Jupiter aspects, staying power
6. **Growth Advice** — practical tips for strengthening the relationship

Write approximately 800-1000 words. Be specific based on the synastry data.`
}

/**
 * Generates AI interpretation of synastry data.
 */
export async function generateCompatibilityInterpretation(
    synastry: SynastryData,
    type: 'basic' | 'full',
    apiKey: string,
    modelId: string,
    locale: string = 'ru',
): Promise<string> {
    const messages: OpenRouterMessage[] = [
        { role: 'system', content: buildCompatibilitySystemPrompt(locale) },
        { role: 'user', content: buildCompatibilityPrompt(synastry, type, locale) },
    ]

    try {
        return await callOpenRouter(messages, apiKey, modelId)
    }
    catch (error: any) {
        console.warn('OpenRouter API failed for compatibility, using fallback:', error.message)
        return generateFallbackCompatibility(synastry, type, locale)
    }
}

// ---- Tarot Reading Interpretation ----

function buildTarotSystemPrompt(locale: string): string {
    const lang = locale === 'ru' ? 'Russian' : 'English'
    return `You are a mystical tarot reader with deep knowledge of the Major Arcana and decades of experience interpreting the cards.
Respond ONLY in ${lang}.
Write in a mystical, wise, and compassionate tone — like an experienced oracle sharing sacred wisdom.

IMPORTANT INTERPRETATION RULES:
- You will receive the FULL MEANING of each card. Use this meaning as the foundation for your interpretation.
- Adapt the card's meaning to the querent's SPECIFIC QUESTION — do not give a generic reading.
- Each card's meaning shifts depending on its POSITION in the spread (Situation, Challenge, or Advice).
- Connect the three cards into a COHERENT NARRATIVE — they tell a story together, not three separate stories.
- Be concrete and actionable, especially in the Advice section.

The spread uses three positions:
1. Situation — the current state of affairs, what energies surround the querent now
2. Challenge — the main obstacle, difficulty, or what blocks progress
3. Advice — guidance, recommended action, and wisdom for moving forward

FORMATTING RULES (STRICT — follow exactly):
- Use **bold text** for section titles, followed immediately by the content on the SAME line or a blank line before a new paragraph.
- FORBIDDEN: Never put a section title alone on one line and then start the next line with ": text".
- Do NOT use markdown headers (##, ###). Use **bold** for section names only.
- Double newline only between main sections/paragraphs.
- Write approximately 500-700 words total.`
}

function buildTarotReadingPrompt(question: string, cards: TarotCard[], locale: string): string {
    const lang = locale === 'ru' ? 'Russian' : 'English'
    const isRu = locale === 'ru'

    const positions = isRu
        ? ['Ситуация', 'Препятствие', 'Совет']
        : ['Situation', 'Challenge', 'Advice']

    const cardDescriptions = cards.map((card, i) => {
        const name = isRu ? card.nameRu : card.name
        const keywords = isRu ? card.keywordsRu.join(', ') : card.keywords.join(', ')
        const meaning = isRu ? card.meaningRu : card.meaning
        return `--- Position ${i + 1}: ${positions[i]} ---
Card: ${name} (${card.name})
Keywords: ${keywords}
Card Meaning: ${meaning}`
    }).join('\n\n')

    return `Querent's question: "${question}"

TAROT SPREAD (Situation — Challenge — Advice):

${cardDescriptions}

Generate a tarot reading interpretation in ${lang}. Structure:
1. **${positions[0]}** — interpret the first card's meaning in relation to the querent's question. How does this card describe their current situation? What energies are at play right now?
2. **${positions[1]}** — interpret the second card as the obstacle. What aspect of this card's meaning reveals what is blocking the querent? What inner or outer challenge must they face?
3. **${positions[2]}** — interpret the third card as guidance. Based on this card's wisdom, what specific actions or mindset shifts should the querent adopt?
4. **${isRu ? 'Итог' : 'Summary'}** — weave all three cards together into one cohesive message. How do they tell a unified story from situation through challenge to advice?

CRITICAL: Base your interpretation on the card meanings provided above. Adapt them specifically to the querent's question — do not give a generic reading.`
}

export async function generateTarotInterpretation(
    question: string,
    cards: TarotCard[],
    apiKey: string,
    modelId: string,
    locale: string = 'ru',
): Promise<string> {
    const messages: OpenRouterMessage[] = [
        { role: 'system', content: buildTarotSystemPrompt(locale) },
        { role: 'user', content: buildTarotReadingPrompt(question, cards, locale) },
    ]

    return await callOpenRouter(messages, apiKey, modelId)
}

/**
 * Fallback compatibility interpretation when AI API is unavailable.
 */
function generateFallbackCompatibility(synastry: SynastryData, type: 'basic' | 'full', locale: string): string {
    const { chart1, chart2, scores } = synastry
    const isRu = locale === 'ru'

    const sun1 = chart1.sun.sign
    const sun2 = chart2.sun.sign
    const moon1 = chart1.moon.sign
    const moon2 = chart2.moon.sign

    if (type === 'basic') {
        if (isRu) {
            return `**Общая связь**
Союз ${sun1} и ${sun2} — это сочетание двух разных энергий, каждая из которых привносит уникальные качества в отношения. Ваша общая совместимость составляет ${scores.overall}%, что говорит о хорошем потенциале для гармоничных отношений.

**Сильнейшая связь**
Эмоциональная совместимость (${scores.emotional}%) показывает, что Луна в ${moon1} и Луна в ${moon2} создают глубокое подсознательное понимание между вами. Вы интуитивно чувствуете потребности друг друга.

**Зона роста**
Обратите внимание на сферу коммуникации (${scores.communication}%). Работа над открытым и честным диалогом укрепит ваши отношения и поможет преодолевать разногласия.`
        }

        return `**Overall Connection**
The union of ${sun1} and ${sun2} brings together two distinct energies, each contributing unique qualities to the relationship. Your overall compatibility is ${scores.overall}%, indicating good potential for a harmonious bond.

**Strongest Bond**
Emotional compatibility (${scores.emotional}%) shows that Moon in ${moon1} and Moon in ${moon2} create a deep subconscious understanding between you. You intuitively sense each other's needs.

**Growth Area**
Pay attention to communication (${scores.communication}%). Working on open and honest dialogue will strengthen your relationship and help overcome disagreements.`
    }

    if (isRu) {
        return `**Общая связь**
Союз ${sun1} и ${sun2} создаёт динамичное партнёрство. Ваша общая совместимость ${scores.overall}% отражает баланс гармоничных и напряжённых аспектов между вашими картами. Это не просто число — это карта потенциала ваших отношений.

**Эмоциональная связь** (${scores.emotional}%)
Луна в ${moon1} встречает Луну в ${moon2} — это создаёт уникальный эмоциональный танец. Вы по-разному переживаете чувства, но именно это различие может стать источником глубины в ваших отношениях. Важно научиться принимать эмоциональный язык друг друга.

**Страсть и притяжение** (${scores.passion}%)
Энергия Mars и Venus между вашими картами определяет химию притяжения. ${sun1} привносит свою стихию, а ${sun2} — свою. Вместе вы создаёте мощный энергетический обмен, который держит пламя отношений живым.

**Стиль общения** (${scores.communication}%)
Mercury в ваших картах показывает, как вы обмениваетесь мыслями и идеями. Открытый диалог и готовность слушать — ключ к преодолению любых разногласий. Помните: разные стили общения — это не слабость, а возможность для роста.

**Общие ценности** (${scores.values}%)
Saturn и Jupiter в ваших картах определяют долгосрочный потенциал. Эти серьёзные планеты показывают, насколько ваши жизненные цели и ценности совпадают. Работа над общим видением будущего укрепит фундамент отношений.

**Советы для роста**
Помните, что совместимость — это не приговор, а карта возможностей. Используйте сильные стороны ваших отношений как фундамент и работайте над зонами роста с терпением и любовью.`
    }

    return `**Overall Connection**
The union of ${sun1} and ${sun2} creates a dynamic partnership. Your overall compatibility of ${scores.overall}% reflects the balance of harmonious and tense aspects between your charts. This is a map of your relationship's potential.

**Emotional Bond** (${scores.emotional}%)
Moon in ${moon1} meets Moon in ${moon2} — this creates a unique emotional dance. You experience feelings differently, but this very difference can become a source of depth in your relationship. Learning to accept each other's emotional language is key.

**Passion & Attraction** (${scores.passion}%)
The Mars-Venus energy between your charts defines your chemistry. ${sun1} brings one element, ${sun2} brings another. Together you create a powerful energetic exchange that keeps the flame of your relationship alive.

**Communication Style** (${scores.communication}%)
Mercury in your charts shows how you exchange thoughts and ideas. Open dialogue and willingness to listen are the keys to overcoming any disagreements. Remember: different communication styles are not a weakness but an opportunity for growth.

**Shared Values** (${scores.values}%)
Saturn and Jupiter in your charts determine long-term potential. These serious planets show how aligned your life goals and values are. Working on a shared vision for the future will strengthen your relationship's foundation.

**Growth Advice**
Remember, compatibility is not a verdict but a map of possibilities. Use the strengths of your relationship as a foundation and work on growth areas with patience and love.`
}

