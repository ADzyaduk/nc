export function useScoreAnimation() {
    function animateScore(target: number, setter: (v: number) => void, delay: number = 0) {
        setTimeout(() => {
            let current = 0
            const step = Math.ceil(target / 40)
            const interval = setInterval(() => {
                current = Math.min(current + step, target)
                setter(current)
                if (current >= target) clearInterval(interval)
            }, 25)
        }, delay)
    }

    function getCircleDashArray(score: number, radius: number = 45): string {
        const circumference = 2 * Math.PI * radius
        const filled = (score / 100) * circumference
        return `${filled} ${circumference - filled}`
    }

    return {
        animateScore,
        getCircleDashArray,
    }
}
