import { marked } from 'marked'

marked.setOptions({
    breaks: true,
    gfm: true,
})

function normalizeReportText(content: string): string {
    if (!content) return ''

    let cleaned = content

    cleaned = cleaned.replace(/([^\n]+)\n+[ \t]*:[ \t]*/g, '$1: ')
    cleaned = cleaned.replace(/(^|\n)[ \t]*:[ \t]*/g, '$1')
    cleaned = cleaned.replace(/^(\d+\.)[ \t]*\n[ \t]*/gm, '$1 ')
    cleaned = cleaned.replace(/([^\n])\n(\d+\.)/g, '$1\n\n$2')
    cleaned = cleaned.replace(/([^\n])\n(\*\*[^*]+\*\*[ \t]*\n)/g, '$1\n\n$2')

    return cleaned
}

const PROSE_WRAPPER_CLASSES = [
    'prose prose-sm prose-invert',
    'prose-p:text-violet-200/90 prose-headings:text-indigo-300',
    'prose-strong:text-violet-100 prose-strong:font-semibold',
    'prose-ul:text-violet-200/90 prose-ol:text-violet-200/90',
    'prose-li:my-0.5 prose-li:leading-snug',
    'max-w-none space-y-2',
].join(' ')

export const useReportRenderer = () => {
    const renderMarkdown = (content?: string): string => {
        if (!content) return ''

        try {
            const cleaned = normalizeReportText(content)
            const html = marked.parse(cleaned) as string
            return `<div class="${PROSE_WRAPPER_CLASSES}">${html}</div>`
        }
        catch (e) {
            console.error('Error parsing markdown:', e)
            return content
        }
    }

    const cleanContent = (content?: string): string => normalizeReportText(content ?? '')

    return {
        renderMarkdown,
        cleanContent,
    }
}
