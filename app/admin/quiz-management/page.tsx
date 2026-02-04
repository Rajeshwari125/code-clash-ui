'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Eye, Trash2, FileQuestion, Users, Clock, Calendar, AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  title: string;
  numberOfQuestions: number;
  timeLimit: number;
  questions: Question[];
}

interface Quiz {
  id: number;
  title: string;
  questions: number;
  status: string;
  code: string;
  participants: number;
  duration: number;
  created: string;
  questionsData?: Question[];
}

const INITIAL_QUIZZES: Quiz[] = [];

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showQuestionEntry, setShowQuestionEntry] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Load quizzes from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuizzes = localStorage.getItem('quizzes');
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
      }
    }
  }, []);

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }
  }, [quizzes]);

  // Form states
  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    numberOfQuestions: 0,
    timeLimit: 0,
    questions: []
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const stats = {
    total: quizzes.length,
    active: quizzes.filter(q => q.status === 'Active').length,
    completed: quizzes.filter(q => q.status === 'Completed').length,
    drafts: quizzes.filter(q => q.status === 'Draft').length,
  };

  // Step 1: Basic quiz info
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const titleInput = (document.getElementById('quizTitle') as HTMLInputElement).value;
    const questionsInput = (document.getElementById('numQuestions') as HTMLInputElement).value;
    const timeLimitInput = (document.getElementById('timeLimit') as HTMLInputElement).value;

    if (titleInput && questionsInput && timeLimitInput) {
      setQuizData({
        title: titleInput,
        numberOfQuestions: parseInt(questionsInput),
        timeLimit: parseInt(timeLimitInput),
        questions: []
      });
      setCurrentQuestionIndex(0);
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
      setShowCreateModal(false);
      setShowQuestionEntry(true);
    } else {
      alert('Please fill all fields!');
    }
  };

  // Step 2: Add question
  const handleSaveQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      alert('Please fill all question and option fields!');
      return;
    }

    const updatedQuestions = [...quizData.questions];
    if (currentQuestionIndex < quizData.questions.length) {
      updatedQuestions[currentQuestionIndex] = currentQuestion;
    } else {
      updatedQuestions.push(currentQuestion);
    }

    setQuizData({ ...quizData, questions: updatedQuestions });

    // Check if this is the last question
    if (currentQuestionIndex + 1 >= quizData.numberOfQuestions) {
      // All questions completed - save quiz
      handleFinishQuiz(updatedQuestions);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  // Step 3: Finish and save to database
  const handleFinishQuiz = (questions: Question[]) => {
    const code = `${quizData.title.substring(0, 3).toUpperCase()}${String(quizzes.length + 1).padStart(3, '0')}`;

    const newQuiz: Quiz = {
      id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1,
      title: quizData.title,
      questions: quizData.numberOfQuestions,
      status: 'Draft',
      code: code,
      participants: 0,
      duration: quizData.timeLimit,
      created: new Date().toISOString().split('T')[0],
      questionsData: questions
    };

    setQuizzes([...quizzes, newQuiz]);

    // Show success message with code
    alert(`✅ Quiz Created Successfully!\n\nQuiz Title: ${quizData.title}\nQuiz Code: ${code}\nTotal Questions: ${quizData.numberOfQuestions}\nTime Limit: ${quizData.timeLimit} minutes\n\nYou can now activate this quiz for participants!`);

    // Reset all states
    setQuizData({ title: '', numberOfQuestions: 0, timeLimit: 0, questions: [] });
    setCurrentQuestionIndex(0);
    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    setShowQuestionEntry(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      if (quizData.questions[currentQuestionIndex - 1]) {
        setCurrentQuestion(quizData.questions[currentQuestionIndex - 1]);
      }
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowEditModal(true);
  };

  const handleDeleteClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedQuiz) {
      setQuizzes(quizzes.filter(q => q.id !== selectedQuiz.id));
      alert(`Quiz "${selectedQuiz.title}" deleted successfully!`);
      setSelectedQuiz(null);
      setShowDeleteDialog(false);
    }
  };

  const handleView = (quiz: Quiz) => {
    let message = `Quiz Details:\n\nTitle: ${quiz.title}\nCode: ${quiz.code}\nQuestions: ${quiz.questions}\nDuration: ${quiz.duration} minutes\nParticipants: ${quiz.participants}\nStatus: ${quiz.status}\nCreated: ${quiz.created}`;

    if (quiz.questionsData && quiz.questionsData.length > 0) {
      message += '\n\nQuestions:';
      quiz.questionsData.forEach((q, index) => {
        message += `\n\n${index + 1}. ${q.question}`;
        q.options.forEach((opt, optIndex) => {
          message += `\n   ${String.fromCharCode(65 + optIndex)}. ${opt}${optIndex === q.correctAnswer ? ' ✓' : ''}`;
        });
      });
    }

    alert(message);
  };

  const actionButton = (
    <Button
      onClick={() => setShowCreateModal(true)}
      className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 gap-2 shadow-md hover:shadow-lg transition-all"
    >
      <Plus size={20} />
      <span className="hidden sm:inline">Create Quiz</span>
    </Button>
  );

  return (
    <AdminLayout title="Quiz Management" actionButton={actionButton}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Quizzes</p>
            <p className="text-3xl font-bold text-accent">{stats.total}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Active</p>
            <p className="text-3xl font-bold text-green-500">{stats.active}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Completed</p>
            <p className="text-3xl font-bold text-blue-500">{stats.completed}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Drafts</p>
            <p className="text-3xl font-bold text-orange-500">{stats.drafts}</p>
          </div>
        </Card>
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <Card className="p-12 text-center border-border/50">
          <FileQuestion size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No quizzes created yet</h3>
          <p className="text-muted-foreground mb-6">Create your first quiz to get started!</p>
          <Button onClick={() => setShowCreateModal(true)} className="bg-accent text-accent-foreground">
            <Plus size={20} className="mr-2" />
            Create Quiz
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{quiz.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${quiz.status === 'Active' ? 'bg-green-500/20 text-green-500' :
                      quiz.status === 'Completed' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-orange-500/20 text-orange-500'
                      }`}>
                      {quiz.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileQuestion size={16} />
                      <span>{quiz.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{quiz.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{quiz.participants} Participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{quiz.created}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                      Code: {quiz.code}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(quiz)}>
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(quiz)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(quiz)} className="text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Quiz Modal - Step 1: Basic Info */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-8 bg-card relative">
            <h2 className="text-2xl font-bold mb-6">Create New Quiz</h2>
            <form onSubmit={handleContinue}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quiz Title</label>
                  <Input id="quizTitle" placeholder="e.g., Python Basics" className="w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Questions</label>
                  <Input id="numQuestions" type="number" placeholder="e.g., 20" min="1" className="w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                  <Input id="timeLimit" type="number" placeholder="e.g., 30" min="1" className="w-full" required />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-accent text-accent-foreground">
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Question Entry Modal - Step 2: Enter Questions */}
      {showQuestionEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-8 bg-card relative max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Add Questions - {quizData.title}</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quizData.numberOfQuestions}
              </p>
              <div className="mt-2 bg-secondary rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / quizData.numberOfQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question {currentQuestionIndex + 1}</label>
                <Input
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Enter your question here"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="font-semibold w-8">{String.fromCharCode(65 + index)}.</span>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Select the correct answer by clicking the radio button</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {currentQuestionIndex > 0 && (
                <Button type="button" variant="outline" onClick={handlePreviousQuestion}>
                  <ArrowLeft size={16} className="mr-2" />
                  Previous
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSaveQuestion}
                className="flex-1 bg-accent text-accent-foreground"
              >
                {currentQuestionIndex + 1 >= quizData.numberOfQuestions ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Finish & Save Quiz
                  </>
                ) : (
                  <>
                    Save & Next
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-8 bg-card">
            <div className="flex items-center gap-3 mb-4 text-destructive">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-bold">Delete Quiz</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{selectedQuiz.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} className="flex-1 bg-destructive text-destructive-foreground">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
