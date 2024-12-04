import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { ACCESS_TOKEN, API_BASE_URL, COURSES_PATH } from "../../config";
import { User } from "../../user/profile/Profile";
import {CourseInfo} from "./model/CourseInfo";

interface CourseDetailsProps {
  user: User | null;
}

interface Course {
  details: CourseInfo;
  flashCards: FlashCard[];
  // isInUsersLearningCollection: boolean
}

interface FlashCard {
  id: number;
  valueA: string;
  valueB: string;
}

export const CourseDetails = (props: CourseDetailsProps) => {

  const navigate = useNavigate();
  const navigateToLearningView = (courseId: number) => navigate(`/courses/${courseId}/learning`);
  
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCourseToLearningCollectionAndNavigateToLearningView = (
    userId: number,
    courseId: number,
  ): void => {
    const learningPath = `/users/${userId}/courses/${courseId}`;
    const url = `${API_BASE_URL}${learningPath}`;
    const token = localStorage.getItem(ACCESS_TOKEN);
    const options = {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: "PATCH",
    };
    fetch(url, options)
      .then((response) => navigateToLearningView(courseId))
      .catch((error) => setError);
  };


  // TODO: use other hook to avoid fetching same resources every time when component is refreshed or mounted
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      const response = await fetch(`${COURSES_PATH}/${courseId}`);
      const data = await response.json();
      setCourse(data);
      setIsLoading(false);
    };
    fetchCourseDetails();
  }, []);

  console.log(`props ${JSON.stringify(props)}`)

  return (
    <div>
      {isLoading ? (
        <h5>IS LOADING...</h5>
      ) : (
          <div>

            <h1>{course?.details.name}</h1>
            {props.user ? (
                // if course is in User's learning collection then we should display button to just navigate to Learning view
                <button
                    onClick={() =>
                        addCourseToLearningCollectionAndNavigateToLearningView(
                            props.user!.id,
                            course!.details.id,
                        )
                    }
                >
                  Start to learn
                </button>
            ) : (
                <div></div>
            )}
            <table>
              <caption>karty</caption>
              <thead>
              <tr>
                <th scope="col">{course?.details.languageA}</th>
                <th scope="col">{course?.details.languageB}</th>
              </tr>
              </thead>
              <tbody>
              {course?.flashCards.map((card: FlashCard) => (
                  <tr key={card.id}>
                    <td>{card.valueA}</td>
                    <td>{card.valueB}</td>
                  </tr>
              ))}
              </tbody>
            </table>

          </div>
      )}
    </div>
  );
};
