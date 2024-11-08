import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN, API_BASE_URL } from "../../config";

interface LearningViewProps {
  isAuthenticated: boolean;
  userId: number | undefined;
}

interface FlashCard {
  valueA: string;
  valueB: string;
}

export const LearningView = (props: LearningViewProps) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [flashCards, setFlashCard] = useState<FlashCard[]>([]);

  const token = localStorage.getItem(ACCESS_TOKEN);

  const options = {
    headers: new Headers({
      "Content-Type": "application/json",
      Authentication: `Bearer ${token}`,
    }),
    method: "GET",
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/${props.userId}/courses/${courseId}`, options)
      .then((res) => res.json())
      .then((data) => setFlashCard(data));
  }, []);

  return (
    <div>
      <h1>Learning...</h1>
    </div>
  );
};
