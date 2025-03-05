export interface Question {
    cardId: number,
    question: string,
    correctAnswer: string,
    correctAnswerCount: number,
    promptAnswers?: string[]
}

export class QuestionSession {
    private questionsToAsk: Question[];
    private answeredQuestions: Question[];
    private currentQuestion: Question | undefined;

    constructor(questions: Question[]) {
        this.questionsToAsk = questions;
        this.answeredQuestions = [];
    }

    howManyQuestionsLeft(): number {
        return this.questionsToAsk.length + (this.currentQuestion ? 1 : 0);
    }

    howManyCorrectAnswers(): number {
        return this.answeredQuestions.length;
    }

    nextQuestion(): Question {
        this.currentQuestion = this.questionsToAsk.shift();
        return this.currentQuestion!
    }

    submitAnswer(answer: string, question: Question): boolean {
        this.currentQuestion = undefined;
        if (answer === question.correctAnswer) {
            question.correctAnswerCount++;
            this.answeredQuestions.push(question);
            return true;
        }

        this.questionsToAsk.push(question)
        return false;
    }

    getAnsweredQestions(): Question[] {
        return this.answeredQuestions;
    }
    
    size(): number {
        return this.howManyCorrectAnswers() + this.howManyQuestionsLeft();
    }
}