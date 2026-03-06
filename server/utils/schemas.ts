import { z } from 'zod'

// ---- Request Schemas ----

export const telegramAuthSchema = z.object({
    initData: z.string().min(1, 'initData is required'),
})

export const generateChartSchema = z.object({
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
    birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
    birthCity: z.string().min(1, 'City is required').max(200),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    telegramId: z.string().min(1),
})

export const generateReportSchema = z.object({
    birthChartId: z.string().uuid(),
    type: z.enum(['basic', 'full']),
    telegramId: z.string().min(1),
    locale: z.enum(['ru', 'en']).default('ru'),
})

export const getReportSchema = z.object({
    telegramId: z.string().min(1),
})

export const verifyPaymentSchema = z.object({
    reportId: z.string().uuid(),
    telegramId: z.string().min(1),
    telegramPaymentId: z.string().optional(),
})

// ---- Response Types ----

export interface ChartPlanet {
    name: string
    sign: string
    degree: number
    house: number
}

export interface ChartHouse {
    number: number
    sign: string
    degree: number
}

export interface ChartAspect {
    planet1: string
    planet2: string
    type: string
    degree: number
    orb: number
}

export interface NatalChartData {
    sun: ChartPlanet
    moon: ChartPlanet
    ascendant: { sign: string; degree: number }
    planets: ChartPlanet[]
    houses: ChartHouse[]
    aspects: ChartAspect[]
}

// ---- Compatibility / Synastry ----

export interface CompatibilityScores {
    overall: number
    emotional: number
    passion: number
    communication: number
    values: number
}

export interface SynastryData {
    chart1: NatalChartData
    chart2: NatalChartData
    crossAspects: ChartAspect[]
    scores: CompatibilityScores
}

export const personBirthDataSchema = z.object({
    name: z.string().max(100).optional(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
    birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
    birthCity: z.string().min(1, 'City is required').max(200),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
})

export const generateCompatibilitySchema = z.object({
    person1: personBirthDataSchema,
    person2: personBirthDataSchema,
    telegramId: z.string().min(1),
    locale: z.enum(['ru', 'en']).default('ru'),
})

// ---- Tarot ----

export const tarotReadingSchema = z.object({
    question: z.string().min(1, 'Question is required').max(500),
    telegramId: z.string().min(1),
    locale: z.enum(['ru', 'en']).default('ru'),
})
