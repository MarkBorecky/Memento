import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN, API_BASE_URL } from "../../config";

interface LearningViewProps {
  isAuthenticated: boolean;
  userId: number | undefined;
}

type FlashCardId = `${number}-${number}-${number}`;

interface FlashCard {
    id: FlashCardId;
    valueA: string;
    valueB: string;
    correctAnswerCount: number;
}

interface Question {
    question: string;
    correctAnswer: string;
    flashCardId: FlashCardId;

}

type StateMember<TType extends string> = {
    type: TType;
};

type LearningSessionState =
    | {
    type: "INITIALIZATION";
    progress: "0%";
}
    | {
    type: "CORRECT_ANSWER";
    passedQuestions: Question[];
    questionsToAsk: Question[];
    correctAnswer: string;
    progress: string;
}
    | {
    type: "INCORRECT_ANSWER";
    passedQuestions: Question[];
    questionsToAsk: Question[];
    usersAnswer: string;
    correctAnswer: string;
    progress: string;
}
    | {
    type: "WAITING_FOR_ANSWER";
    input: string;
    currentQuestion: Question;
    passedQuestions: Question[];
    questionsToAsk: Question[];
    progress: string;
}
    | {
    type: "END_LEARNING_SESSION";
    passedQuestions: Question[];
    progress: "100%";
};

export const LearningView = (props: LearningViewProps) => {
    const {courseId} = useParams<{ courseId: string }>();
    const [session, setSession] = useState<LearningSessionState>({
        type: "INITIALIZATION",
        progress: "0%",
    });

    const THRESHOLD = 6;

    function prepareQuestions(flashCards: FlashCard[]): Question[] {
        const questionMatrix: Question[][] = flashCards.map((card: FlashCard) => prepareAllQuestionsForCardUntilEndOfThreshold(card))

        const transposedMatrixOfFlashCards = transposeMatrix(questionMatrix);

        return transposedMatrixOfFlashCards.flatMap((row: Question[]) => row)
    }
    
    function transposeMatrix(matrix: Question[][]) {
        return matrix[0].map((_, columnIndex) => matrix
            .map((row: Question[]) => row[columnIndex]))
    }

    function prepareAllQuestionsForCardUntilEndOfThreshold(flashCard: FlashCard): Question[] {
        if (flashCard.correctAnswerCount >= THRESHOLD) {
            return [];
        }
        return Array.from({length: THRESHOLD - flashCard.correctAnswerCount}, () => ({
            question: flashCard.valueB,
            correctAnswer: flashCard.valueA,
            flashCardId: flashCard.id
        }));
    }

    useEffect(() => {
        if (session.type === "CORRECT_ANSWER" || session.type === "INCORRECT_ANSWER") {
            setTimeout(() => setWaitingForAnswerOrEndSessionState(), 1000);
        }
    }, [session]);

    const navigate = useNavigate();

    const options = {
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        }),
        method: "GET",
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/users/${props.userId}/courses/${courseId}`, options)
            .then((res) => res.json())
            .then((flashCards: FlashCard[]) => {
                const questions: Question[] = prepareQuestions(flashCards);

                const question = questions.shift();
                if (!question) {
                    throw Error("flashCard is undefined!");
                }
                setSession({
                    type: "WAITING_FOR_ANSWER",
                    input: "",
                    currentQuestion: question,
                    passedQuestions: [],
                    questionsToAsk: questions,
                    progress: session.progress,
                });
            });
    }, []);

    function assertState<TType extends string>(
        state: { type: string },
        expectedType: TType,
    ): asserts state is StateMember<TType> {
        if (expectedType !== state.type) {
            throw new Error("skjdhfkjsd");
        }
    }

    function assertStateOr<TType extends string>(
        state: { type: string },
        expectedTypeA: TType,
        expectedTypeB: TType,
    ): asserts state is StateMember<TType> {
        if (expectedTypeA !== state.type && expectedTypeB !== state.type) {
            throw new Error("skjdhfkjsd");
        }
    }

    const setWaitingForAnswerOrEndSessionState = () => {
      assertStateOr(session, "CORRECT_ANSWER", "INCORRECT_ANSWER");

      const areThereCardToLearn = session.questionsToAsk.length !== 0;

      const endLearningSession: LearningSessionState = {
        type: "END_LEARNING_SESSION",
        passedQuestions: session.passedQuestions,
        progress: "100%",
      };

      const correctAnswers = session.passedQuestions.length;
      const allFlashCards = correctAnswers + session.questionsToAsk.length;
      const progress = `${(correctAnswers * 100) / allFlashCards}%`;

      const waitingForAnswer: LearningSessionState = {
        type: "WAITING_FOR_ANSWER",
        currentQuestion: session.questionsToAsk[0],
        questionsToAsk: session.questionsToAsk.slice(
          1,
          session.questionsToAsk.length,
        ),
        passedQuestions: session.passedQuestions,
        input: "",
        progress: progress,
      };

      setSession(areThereCardToLearn ? waitingForAnswer : endLearningSession);
    };

    function acceptAnswer(session: LearningSessionState) {
        assertState(session, "WAITING_FOR_ANSWER");
        const isAnswerCorrect = session.input === session.currentQuestion.question;

        function setCorrenctAnserState() {
            assertState(session, "WAITING_FOR_ANSWER");

            const correctAnswers = session.passedQuestions.length + 1;
            const allFlashCards = correctAnswers + session.questionsToAsk.length;
            const progress = `${(correctAnswers * 100) / allFlashCards}%`;

            setSession({
                type: "CORRECT_ANSWER",
                correctAnswer: session.input,
                passedQuestions: [
                    ...session.passedQuestions,
                    session.currentQuestion,
                ],
                questionsToAsk: session.questionsToAsk,
                progress: progress,
            });
        }

        function setIncorrectAnserState() {
            assertState(session, "WAITING_FOR_ANSWER");

            const correctAnswers = session.passedQuestions.length;
            const allFlashCards = correctAnswers + session.questionsToAsk.length + 1;
            const progress = `${(correctAnswers * 100) / allFlashCards}%`;

            setSession({
                type: "INCORRECT_ANSWER",
                usersAnswer: session.input,
                correctAnswer: session.currentQuestion.correctAnswer,
                passedQuestions: session.passedQuestions,
                questionsToAsk: [...session.questionsToAsk, session.currentQuestion],
                progress: progress,
            });
        }

        if (isAnswerCorrect) {
            setCorrenctAnserState();
        } else {
            setIncorrectAnserState();
        }
        // TODO: encapsulate deducing if answer is correct inside function to set state and use one type for both cases
    }

    const isSessionActive =
        session.type !== "INITIALIZATION" &&
        session.type !== "END_LEARNING_SESSION";

    const progressPanel = isSessionActive && (
        <h5>progress: {session.progress}</h5>
    );

    const questionPanel = session.type === "WAITING_FOR_ANSWER" && (
        <h5>{session.currentQuestion.question}</h5>
    );

    const correctAnswerFeedback = session.type === "CORRECT_ANSWER" && (
        <p style={{color: "green"}}>{session.correctAnswer}</p>
    );

    const wrongAnswerFeedback = session.type === "INCORRECT_ANSWER" && (
        <>
            <s style={{color: "red"}}>{session.usersAnswer}</s>
            <p style={{color: "green"}}>{session.correctAnswer}</p>
        </>
    );

    const learningPanel = session.type === "WAITING_FOR_ANSWER" && (
        <div>
            <input
                value={session.input}
                onChange={(event) => {
                    assertState(session, "WAITING_FOR_ANSWER");
                    setSession({
                        ...session,
                        input: event.target.value,
                    });
                }}
                // onKeyUp={() => acceptAnswer(currentQuestion, input)}
            />
            <button onClick={() => acceptAnswer(session)}>Answer</button>
        </div>
    );

    const summaryPanel = session.type === "END_LEARNING_SESSION" && (
        <div>
            {
                <>
                    <h5>cards:</h5>
                    {
                        session.passedQuestions.map((card) => (
                            <>
                                {JSON.stringify(card)}
                            </>
                        ))
                    }
                    <button onClick={() => {
                        // send progress to backend
                        navigate("/dashboard")
                    }}>
                        go to dashboard
                    </button>
                    <button onClick={() => {
                        // send progress to backend
                        navigate(`/courses/${courseId}/learning`)
                    }}>
                        continue leraning
                    </button>
                </>

            }
        </div>
    );

    return (
        <div>
            {progressPanel}
            {questionPanel}
            {correctAnswerFeedback}
            {wrongAnswerFeedback}
            {learningPanel}
            {summaryPanel}
        </div>
    );
};
