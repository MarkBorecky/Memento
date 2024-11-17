import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ACCESS_TOKEN, API_BASE_URL} from "../../config";

interface LearningViewProps {
    isAuthenticated: boolean;
    userId: number | undefined;
}

interface FlashCard {
    valueA: string;
    valueB: string;
    correctAnswerCount: number;
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
    passedFlashCards: FlashCard[];
    flashCardsToAsk: FlashCard[];
    correctAnswer: string;
    progress: string;
}
    | {
    type: "INCORRECT_ANSWER";
    passedFlashCards: FlashCard[];
    flashCardsToAsk: FlashCard[];
    usersAnswer: string;
    correctAnswer: string;
    progress: string;
}
    | {
    type: "WAITING_FOR_ANSWER";
    input: string;
    currentFlashCard: FlashCard;
    passedFlashCards: FlashCard[];
    flashCardsToAsk: FlashCard[];
    progress: string;
}
    | {
    type: "END_LEARNING_SESSION";
    passedFlashCards: FlashCard[];
    progress: "100%";
};

export const LearningView = (props: LearningViewProps) => {
    const {courseId} = useParams<{ courseId: string }>();
    const [session, setSession] = useState<LearningSessionState>({
        type: "INITIALIZATION",
        progress: "0%",
    });

    useEffect(() => {
        console.log("use effect")
        if (session.type === "CORRECT_ANSWER" || session.type === "INCORRECT_ANSWER") {
            setTimeout(() => refreshState(), 1000);
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
            .then((data: FlashCard[]) => {
                const flashCard = data.shift();
                if (!flashCard) {
                    throw Error("flashCard is undefined!");
                }
                setSession({
                    input: "",
                    currentFlashCard: flashCard,
                    passedFlashCards: [],
                    flashCardsToAsk: data,
                    type: "WAITING_FOR_ANSWER",
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

    function refreshState() {
        console.log('refress', session.type)
        setWaitingForAnswerOrEndSessionState()
    }

    const setWaitingForAnswerOrEndSessionState = () => {
        assertStateOr(session, "CORRECT_ANSWER", "INCORRECT_ANSWER");

        const areThereCardToLearn = session.flashCardsToAsk.length !== 0;

        const endLearningSession: LearningSessionState = {
            type: "END_LEARNING_SESSION",
            passedFlashCards: session.passedFlashCards,
            progress: "100%",
        };

        const correctAnswers = session.passedFlashCards.length;
        const allFlashCards = correctAnswers + session.flashCardsToAsk.length;
        const progress = `${correctAnswers * 100 / allFlashCards}%`;

        const waitingForAnswer: LearningSessionState = {
            type: "WAITING_FOR_ANSWER",
            currentFlashCard: session.flashCardsToAsk[0],
            flashCardsToAsk: session.flashCardsToAsk.slice(
                1,
                session.flashCardsToAsk.length,
            ),
            passedFlashCards: session.passedFlashCards,
            input: "",
            progress: progress,
        };

        setSession(areThereCardToLearn ? waitingForAnswer : endLearningSession);
    };

    function acceptAnswer(session: LearningSessionState) {
        assertState(session, "WAITING_FOR_ANSWER");
        const isAnswerCorrect = session.input === session.currentFlashCard.valueA;

        function setCorrenctAnserState() {
            assertState(session, "WAITING_FOR_ANSWER");

            const correctAnswers = session.passedFlashCards.length + 1;
            const allFlashCards = correctAnswers + session.flashCardsToAsk.length;
            const progress = `${(correctAnswers * 100) / allFlashCards}%`;

            setSession({
                type: "CORRECT_ANSWER",
                correctAnswer: session.input,
                passedFlashCards: [
                    ...session.passedFlashCards,
                    session.currentFlashCard,
                ],
                flashCardsToAsk: session.flashCardsToAsk,
                progress: progress,
            });
        }

        function setIncorrectAnserState() {
            assertState(session, "WAITING_FOR_ANSWER");

            const correctAnswers = session.passedFlashCards.length;
            const allFlashCards = correctAnswers + session.flashCardsToAsk.length + 1;
            const progress = `${(correctAnswers * 100) / allFlashCards}%`;

            setSession({
                type: "INCORRECT_ANSWER",
                usersAnswer: session.input,
                correctAnswer: session.currentFlashCard.valueA,
                passedFlashCards: session.passedFlashCards,
                flashCardsToAsk: [...session.flashCardsToAsk, session.currentFlashCard],
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
        <h5>{session.currentFlashCard.valueB}</h5>
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
                // onKeyUp={() => acceptAnswer(currentFlashCard, input)}
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
                        session.passedFlashCards.map((card) => (
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
