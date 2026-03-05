import { marked } from 'marked'

/**
 * Normalizes report text: fixes AI artifacts like "Title\n: Content" or lines starting with ": ".
 * Used both before markdown render and for plain-text previews (e.g. compatibility locked snippet).
 */
function normalizeReportText(content: string): string {
    if (!content) return ''

    let cleaned = content

    // Step 1: Join "Title\n: Content" or "Title\n\n: Content" → "Title: Content"
    // Handles one or more newlines between title and ": text"
    cleaned = cleaned.replace(/([^\n]+)\n+[ \t]*:[ \t]*/g, '$1: ')

    // Step 2: Strip any remaining line that starts with ": " (standalone, e.g. at doc start or after blank line)
    cleaned = cleaned.replace(/(^|\n)[ \t]*:[ \t]*/g, '$1')

    // Step 3: Fix numbered list items split across lines: "1.\nContent" → "1. Content"
    cleaned = cleaned.replace(/^(\d+\.)[ \t]*\n[ \t]*/gm, '$1 ')

    // Step 4: Ensure double newline before numbered list items for proper parsing
    cleaned = cleaned.replace(/([^\n])\n(\d+\.)/g, '$1\n\n$2')

    // Step 5: Ensure double newline before bold section headings
    cleaned = cleaned.replace(/([^\n])\n(\*\*[^*]+\*\*[ \t]*\n)/g, '$1\n\n$2')

    return cleaned
}

/**
 * Parses markdown text from the AI report and converts it into HTML.
 *
 * Actual AI output pattern observed:
 *   "Обзор личности\n: Content..."   (Title on own line, then ": Content" on next)
 *   "**Bold Title**\n: Content..."    (Bold title, then ": Content")
 *   "1.\n**Title**: Description"      (Number split from content)
 */
export const useReportRenderer = () => {
    const renderMarkdown = (content?: string): string => {
        if (!content) return ''

        try {
            const cleaned = normalizeReportText(content)

            // Configure marked
            marked.setOptions({
                breaks: true,
                gfm: true,
            })

            const html = marked.parse(cleaned) as string

            return `<div class="prose prose-sm prose-invert
                prose-p:text-violet-200/90 prose-headings:text-indigo-300
                prose-strong:text-violet-100 prose-strong:font-semibold
                prose-ul:text-violet-200/90 prose-ol:text-violet-200/90
                prose-li:my-0.5 prose-li:leading-snug
                max-w-none space-y-2">
                ${html}
            </div>`
        }
        catch (e) {
            console.error('Error parsing markdown:', e)
            return content
        }
    }

    /** Plain-text cleaned content (no HTML). Use for short previews where markdown is not rendered. */
    const cleanContent = (content?: string): string => normalizeReportText(content ?? '')

    return {
        renderMarkdown,
        cleanContent,
    }
}
