import { useParams } from "react-router-dom";

interface LearningViewProps {
  isAuthenticated: boolean;
  userId: number | undefined;
}

export const LearningView = (props: LearningViewProps) => {
  const { courseId } = useParams<{ courseId: string }>();
  return (
    <div>
      <h1>Learning...</h1>
    </div>
  );
};
