import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ACCESS_TOKEN, API_BASE_URL } from "../../config";
import { CloseSquareOutlined } from "@ant-design/icons";
import "./LearningView.css";
import { Flex, Progress } from "antd";

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

interface Progress {
  id: string;
  count: number;
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

function getHeaders() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  return new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
}

function createProgressRequest(passedQuestions: Question[]) {
  console.log(JSON.stringify(passedQuestions));
  const progressMap = passedQuestions
    .map((question: Question) => question.flashCardId)
    .reduce((res: Record<FlashCardId, number>, id: FlashCardId) => {
      res[id] = res[id] + 1 || 1;
      return res;
    }, {});

  const progressArray = Object.entries(progressMap).map(([id, progress]) => ({
    id: id,
    correctAnswersCount: progress,
  }));

  return {
    flashCardsProgress: progressArray,
  };
}

export const LearningView = (props: LearningViewProps) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [session, setSession] = useState<LearningSessionState>({
    type: "INITIALIZATION",
    progress: "0%",
  });

  const COURSE_URL = `${API_BASE_URL}/users/${props.userId}/courses/${courseId}`;

  const THRESHOLD = 6;

  function goToDashBoard() {
    sendProgressToBackend();
    navigate("/dashboard");
  }

  function prepareQuestions(flashCards: FlashCard[]): Question[] {
    const questionMatrix: Question[][] = flashCards.map((card: FlashCard) =>
      prepareAllQuestionsForCardUntilEndOfThreshold(card),
    );

    const transposedMatrixOfFlashCards = transposeMatrix(questionMatrix);

    return transposedMatrixOfFlashCards.flatMap((row: Question[]) => row);
  }

  function transposeMatrix(matrix: Question[][]) {
    return matrix[0].map((_, columnIndex) =>
      matrix.map((row: Question[]) => row[columnIndex]),
    );
  }

  function prepareAllQuestionsForCardUntilEndOfThreshold(
    flashCard: FlashCard,
  ): Question[] {
    if (flashCard.correctAnswerCount >= THRESHOLD) {
      return [];
    }
    return Array.from(
      { length: THRESHOLD - flashCard.correctAnswerCount },
      () => ({
        question: flashCard.valueB,
        correctAnswer: flashCard.valueA,
        flashCardId: flashCard.id,
      }),
    );
  }

  useEffect(() => {
    if (
      session.type === "CORRECT_ANSWER" ||
      session.type === "INCORRECT_ANSWER"
    ) {
      setTimeout(() => setWaitingForAnswerOrEndSessionState(), 3000);
    }
  }, [session]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(COURSE_URL, {
      headers: getHeaders(),
      method: "GET",
    })
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
      throw new Error(`State should be ${expectedType}`);
    }
  }

  function assertStateIsNot<TType extends string>(
    state: { type: string },
    notExpectedType: TType,
  ): asserts state is Exclude<StateMember<string>, StateMember<TType>> {
    if (notExpectedType === state.type) {
      throw new Error(`State should not be ${notExpectedType}`);
    }
  }

  function assertStateOr<TType extends string>(
    state: { type: string },
    expectedTypeA: TType,
    expectedTypeB: TType,
  ): asserts state is StateMember<TType> {
    if (expectedTypeA !== state.type && expectedTypeB !== state.type) {
      throw new Error(`State is either ${expectedTypeA} nor ${expectedTypeB}`);
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

  function setCorrenctAnserState() {
    assertState(session, "WAITING_FOR_ANSWER");

    const correctAnswers = session.passedQuestions.length + 1;
    const allFlashCards = correctAnswers + session.questionsToAsk.length;
    const progress = `${((correctAnswers * 100) / allFlashCards).toFixed(2)}%`;

    setSession({
      type: "CORRECT_ANSWER",
      correctAnswer: session.input,
      passedQuestions: [...session.passedQuestions, session.currentQuestion],
      questionsToAsk: session.questionsToAsk,
      progress: progress,
    });
  }

  function sendProgressToBackend() {
    assertStateIsNot(session, "INITIALIZATION");
    if (session.type === "INITIALIZATION") {
      throw Error();
    }

    const passedQuestions = session.passedQuestions;

    if (passedQuestions.length === 0) {
      console.log("No progress to persist");
      return;
    }

    const progressRequest = createProgressRequest(passedQuestions);
    fetch(COURSE_URL, {
      headers: getHeaders(),
      method: "POST",
      body: JSON.stringify(progressRequest),
    })
      .then((res) => res.json())
      .then((json) => console.log(JSON.stringify(json)));
  }

  function setIncorrectAnswerState() {
    assertState(session, "WAITING_FOR_ANSWER");

    const correctAnswers = session.passedQuestions.length;
    const allFlashCards = correctAnswers + session.questionsToAsk.length + 1;
    const progress = `${((correctAnswers * 100) / allFlashCards).toFixed(2)}%`;

    setSession({
      type: "INCORRECT_ANSWER",
      usersAnswer: session.input,
      correctAnswer: session.currentQuestion.correctAnswer,
      passedQuestions: session.passedQuestions,
      questionsToAsk: [...session.questionsToAsk, session.currentQuestion],
      progress: progress,
    });
  }

  function acceptAnswer(session: LearningSessionState) {
    assertState(session, "WAITING_FOR_ANSWER");
    console.log(
      `intpu ${session.input}, correct answer ${session.currentQuestion.correctAnswer}`,
    );
    const isAnswerCorrect =
      session.input === session.currentQuestion.correctAnswer;

    if (isAnswerCorrect) {
      setCorrenctAnserState();
    } else {
      setIncorrectAnswerState();
    }
    // TODO: encapsulate deducing if answer is correct inside function to set state and use one type for both cases
  }

  const isSessionActive =
    session.type !== "INITIALIZATION" &&
    session.type !== "END_LEARNING_SESSION";

  const questionPanel = session.type === "WAITING_FOR_ANSWER" && (
    <p style={{ fontSize: "40px" }}>{session.currentQuestion.question}</p>
  );

  const correctAnswerFeedback = session.type === "CORRECT_ANSWER" && (
    <p style={{ color: "green", fontSize: "20px" }}>{session.correctAnswer}</p>
  );

  const wrongAnswerFeedback = session.type === "INCORRECT_ANSWER" && (
    <>
      <s style={{ color: "red", fontSize: "20px" }}>{session.usersAnswer}</s>
      <p style={{ color: "green", fontSize: "20px" }}>
        {session.correctAnswer}
      </p>
    </>
  );

  const learningPanel = session.type === "WAITING_FOR_ANSWER" && (
    <div>
      <input
        style={{ fontSize: "40px" }}
        value={session.input}
        onChange={(event) => {
          assertState(session, "WAITING_FOR_ANSWER");
          setSession({
            ...session,
            input: event.target.value,
          });
        }}
        onKeyDown={(event) => {
          console.log(event)
          if (event.key === "Enter") {
            acceptAnswer(session);
          }
        }}
      />
      {/*<button*/}
      {/*  style={{ fontSize: "40px" }}*/}
      {/*  onClick={() => acceptAnswer(session)}*/}
      {/*>*/}
      {/*  Check Answer*/}
      {/*</button>*/}
    </div>
  );

  const summaryPanel = session.type === "END_LEARNING_SESSION" && (
    <div>
      {
        <>
          <h5>cards:</h5>
          {session.passedQuestions.map((card) => (
            <>{JSON.stringify(card)}</>
          ))}
          <button
            onClick={() => {
              sendProgressToBackend();
              navigate("/dashboard");
            }}
          >
            go to dashboard
          </button>
          <button
            onClick={() => {
              sendProgressToBackend();
              navigate(`/courses/${courseId}/learning`);
            }}
          >
            continue leraning
          </button>
        </>
      }
    </div>
  );

  return (
    <div className="LearningPanel">
      <div className="right">
        <CloseSquareOutlined onClick={() => goToDashBoard()} />
      </div>
      <div className="Banner">
        <div className="centerText">
          {questionPanel}
          {correctAnswerFeedback}
          {wrongAnswerFeedback}
        </div>
        <div className="right">
          {isSessionActive && (
            <Flex gap="small" wrap justify="flex-end">
              <Progress type="circle" percent={75} />
            </Flex>
          )}
        </div>
      </div>
      <div className="input">{learningPanel}</div>
      {summaryPanel}
    </div>
  );
};
