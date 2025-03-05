import { useState } from "react";
import { Question, QuestionSession as CardDeck } from "../../model/QuestionSession"

export const ClosedQuestionTest = (testProps: { cards: Question[] }) => {
    const [deck] = useState<CardDeck>(new CardDeck(testProps.cards));
    const [currentQuestion, setCurrentQuestion] = useState<Question|undefined>();
    const [finished, setFinished] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);


    function selectAnswer(answer: string, question: Question): void {
        deck.submitAnswer(answer, question);
        setShowAnswer(true);

        setTimeout(() => {
            console.log("dupa blada")
            setShowAnswer(false);
            if (deck.howManyQuestionsLeft() === 0) {
                setFinished(true);
            } else {
                setCurrentQuestion(deck.nextQuestion())
            }
        }, 2000);
    }

    if(!currentQuestion) {
        setCurrentQuestion(deck.nextQuestion());
    }

    return <>
            <p>question {deck.howManyCorrectAnswers()} of {deck.size()}</p>
            { !finished && currentQuestion && <div>
                <h3>{currentQuestion.question}</h3>
                {showAnswer && <h3>correct answer is {currentQuestion.correctAnswer}</h3>}
                {
                    currentQuestion.promptAnswers!.map((prompt, index) => <button onClick={e => selectAnswer(prompt, currentQuestion)}>{index}. {prompt}</button>)
                }
            </div>
            }
            { finished && <>koniec</>}
    </>
}