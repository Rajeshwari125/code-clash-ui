
export const OFFLINE_QUIZ = {
    id: 99999,
    title: 'Offline Challenge',
    questions: 5,
    status: 'Active',
    code: 'OFFLINE',
    participants: 0,
    duration: 30, // minutes
    created: new Date().toISOString(),
    questions_data: [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Hyper Transfer Markup Language",
                "Home Tool Markup Language"
            ],
            correctAnswer: 0
        },
        {
            question: "Which language is used for styling web pages?",
            options: [
                "HTML",
                "CSS",
                "JavaScript",
                "Python"
            ],
            correctAnswer: 1
        },
        {
            question: "Which is not a JavaScript Framework?",
            options: [
                "React",
                "Angular",
                "Vue",
                "Django"
            ],
            correctAnswer: 3
        },
        {
            question: "What is the output of 2 + '2' in JavaScript?",
            options: [
                "4",
                "22",
                "NaN",
                "Error"
            ],
            correctAnswer: 1
        },
        {
            question: "Which company developed React?",
            options: [
                "Google",
                "Amazon",
                "Facebook (Meta)",
                "Microsoft"
            ],
            correctAnswer: 2
        }
    ]
};

export const OFFLINE_QUIZ_CODE = 'OFFLINE';
