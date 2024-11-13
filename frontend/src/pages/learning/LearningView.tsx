import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN, API_BASE_URL } from "../../config";

interface LearningViewProps {
  isAuthenticated: boolean;
  userId: number | undefined;
}

interface FlashCard {
  valueA: string;
  valueB: string;
  correctAnswerCount: number;
}

enum State {
  INITIALIZATION,
  CORRECT_ANSWER,
  INCORRECT_ANSWER,
  WAITING_FOR_ANSWER,
  END_LEARNING_SESSION,
}

interface SessionState {
  input: string;
  currentFlashCard: FlashCard;
  passedFlashCards: FlashCard[];
  flashCardsToAsk: FlashCard[];
  state: State;
}

const emptyFlashCard = {
  valueA: "",
  valueB: "",
  correctAnswerCount: 0,
};

const INITIAL_STATE: SessionState = {
  input: "",
  currentFlashCard: emptyFlashCard,
  passedFlashCards: [],
  flashCardsToAsk: [],
  state: State.INITIALIZATION,
};

export const LearningView = (props: LearningViewProps) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [session, setSession] = useState<SessionState>(INITIAL_STATE);

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
          state: State.WAITING_FOR_ANSWER,
        });
      });
  }, []);

  const createCorrectAnswerSessionState = (
    session: SessionState,
  ): SessionState => ({
    state: State.CORRECT_ANSWER,
    passedFlashCards: [...session.passedFlashCards, session.currentFlashCard],
    currentFlashCard: emptyFlashCard,
    flashCardsToAsk: session.flashCardsToAsk,
    input: session.input,
  });

  const createIncorrectAnswerSessionState = (
    session: SessionState,
  ): SessionState => ({
    state: State.INCORRECT_ANSWER,
    passedFlashCards: session.passedFlashCards,
    currentFlashCard: emptyFlashCard,
    flashCardsToAsk: [...session.flashCardsToAsk, session.currentFlashCard],
    input: session.input,
  });

  const createWaitingForAnswerOrEndSessionState = (
    session: SessionState,
  ): SessionState => {
    const nextFlashCard = session.flashCardsToAsk[0];
    if (!nextFlashCard) {
      return {
        state: State.END_LEARNING_SESSION,
        currentFlashCard: emptyFlashCard,
        flashCardsToAsk: [],
        passedFlashCards: session.passedFlashCards,
        input: "",
      };
    }

    return {
      state: State.WAITING_FOR_ANSWER,
      currentFlashCard: nextFlashCard,
      flashCardsToAsk: session.flashCardsToAsk.slice(
        1,
        session.flashCardsToAsk.length,
      ),
      passedFlashCards: session.passedFlashCards,
      input: "",
    };
  };

  function acceptAnswer(session: SessionState) {
    if (session.state !== State.WAITING_FOR_ANSWER) {
      throw Error(
        "Incorrect state. Cannot accept answer if state is not WAITING_FOR_ANSWER",
      );
    }
    const isAnswerCorrect = session.input === session.currentFlashCard.valueA;

    const newSessionState = isAnswerCorrect
      ? createCorrectAnswerSessionState(session)
      : createIncorrectAnswerSessionState(session);

    setSession(newSessionState);

    setTimeout(
      () =>
        setSession((session) =>
          createWaitingForAnswerOrEndSessionState(session),
        ),
      1000,
    );
  }

  function getSessionStatistics() {
    const { passedFlashCards, flashCardsToAsk, currentFlashCard } = session;
    const passedQuestionAmount = passedFlashCards.length;
    const allQuestionsAmount =
      flashCardsToAsk.length +
      passedFlashCards.length +
      (currentFlashCard.valueA !== "" ? 1 : 0);

    return `${passedQuestionAmount}/${allQuestionsAmount}`;
  }

  const learningPanel = session.currentFlashCard &&
    session.state !== State.END_LEARNING_SESSION && (
      <div>
        <h5>cards: {getSessionStatistics()}</h5>
        <label>{session.currentFlashCard.valueB}</label>
        {session.state === State.INCORRECT_ANSWER && (
          <>
            <s style={{ color: "red" }}>{session.input}</s>
            <p style={{ color: "green" }}>{session.currentFlashCard.valueA}</p>
          </>
        )}
        {session.state === State.CORRECT_ANSWER && (
          <p style={{ color: "green" }}>{session.input}</p>
        )}
        <input
          value={session.input}
          onChange={(event) =>
            setSession({
              ...session,
              input: event.target.value,
            })
          }
          // onKeyUp={() => acceptAnswer(currentFlashCard, input)}
        />
        <button onClick={() => acceptAnswer(session)}>Answer</button>
      </div>
    );

  const summaryPanel = session.state === State.END_LEARNING_SESSION && (
      <div>
          {session.passedFlashCards.map(card => (
              <>
                  {JSON.stringify(card)}
                  <button onClick={() => navigate('/dashboard')}> go to dashboard</button>
              </>
          ))}
      </div>
  )

  return (
    <div>
      <h1>
        Learning... {State[session.state]},{" "}
        {JSON.stringify(session.currentFlashCard)}
      </h1>
      {learningPanel}
      {summaryPanel}
    </div>
  );
};
