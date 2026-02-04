import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Quiz {
    id: number
    title: string
    questions: number
    status: 'Active' | 'Completed' | 'Draft'
    code: string
    participants: number
    duration: number
    created: string
    questions_data: any
}

export interface Participant {
    id: number
    team: string
    college: string
    members: any
    status: 'Active' | 'Completed'
    joined: string
    email: string
    score?: number
}

export interface QuizResult {
    id: number
    quiz_id: number
    participant_id: number
    rank: number
    team: string
    score: number
    correct: number
    total: number
    time: string
    college: string
    submitted_at: string
}

// Quiz Operations
export async function getQuizzes() {
    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created', { ascending: false })

    if (error) throw error
    return data
}

export async function getQuizByCode(code: string) {
    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('code', code)
        .single()

    if (error) throw error
    return data
}

export async function createQuiz(quiz: Omit<Quiz, 'id'>) {
    const { data, error } = await supabase
        .from('quizzes')
        .insert([quiz])
        .select()

    if (error) throw error
    return data[0]
}

export async function updateQuiz(id: number, updates: Partial<Quiz>) {
    const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) throw error
    return data[0]
}

export async function deleteQuiz(id: number) {
    const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Participant Operations
export async function getParticipants() {
    const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('joined', { ascending: false })

    if (error) throw error
    return data
}

export async function createParticipant(participant: Omit<Participant, 'id'>) {
    const { data, error } = await supabase
        .from('participants')
        .insert([participant])
        .select()

    if (error) throw error
    return data[0]
}

export async function updateParticipant(id: number, updates: Partial<Participant>) {
    const { data, error } = await supabase
        .from('participants')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) throw error
    return data[0]
}

export async function deleteParticipant(id: number) {
    const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Quiz Results Operations
export async function getQuizResults(quizId?: number) {
    let query = supabase
        .from('quiz_results')
        .select('*')
        .order('score', { ascending: false })

    if (quizId) {
        query = query.eq('quiz_id', quizId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
}

export async function createQuizResult(result: Omit<QuizResult, 'id'>) {
    const { data, error } = await supabase
        .from('quiz_results')
        .insert([result])
        .select()

    if (error) throw error
    return data[0]
}
