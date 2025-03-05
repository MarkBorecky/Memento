import { QuestionSession as QuestionDeck } from "./QuestionSession";

const question1 = {
    cardId: 0,
    question: "what",
    correctAnswer: "that",
    correctAnswerCount: 0,
    promptAnswers: ["this", "that"]
}

describe('test 1 question session', () => {
    test('should asking same question', () => {
        
        const deck = new QuestionDeck([question1])

        expect(deck.nextQuestion()).toBe(question1);
        expect(deck.submitAnswer("this", question1)).toBe(false);
        expect(deck.howManyCorrectAnswers()).toBe(0);
        expect(deck.howManyQuestionsLeft()).toBe(1);
        expect(deck.nextQuestion()).toBe(question1);
    });
    test('should accept answer', () => {
        const deck = new QuestionDeck([question1])
        const question = deck.nextQuestion();

        expect(deck.submitAnswer(question.correctAnswer, question)).toBe(true);
        expect(deck.howManyCorrectAnswers()).toBe(1);
        expect(deck.howManyQuestionsLeft()).toBe(0);
        expect(deck.nextQuestion()).toBe(undefined);
        expect(deck.getAnsweredQestions()[0].correctAnswerCount).toBe(1);
    })
});