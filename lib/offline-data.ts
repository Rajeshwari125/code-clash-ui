
export const OFFLINE_QUIZ = {
    id: 99999,
    title: 'Code Clash (Offline)',
    questions: 1,
    status: 'Active',
    code: 'COD138', // Updated to match your screenshot
    participants: 0,
    duration: 30, // minutes
    created: new Date().toISOString(),
    questions_data: [
        {
            question: "Question 1",
            options: [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            correctAnswer: 0
        }
    ]
};

export const OFFLINE_QUIZ_CODE = 'COD138';
