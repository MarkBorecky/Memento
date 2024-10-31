import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { COURSES_PATH } from "../../config";
import { CourseInfo } from "./CoursesProvider";

interface CourseDetailsProps {
  isAuthenticated: boolean;
}

interface Course {
  details: CourseInfo;
  flashCards: FlashCard[];
}

interface FlashCard {
  id: number;
  valueA: string;
  valueB: string;
}

export const CourseDetails = (props: CourseDetailsProps) => {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      const response = await fetch(`${COURSES_PATH}/${id}`);
      const data = await response.json();
      setCourse(data);
      setIsLoading(false);
    };
    fetchCourseDetails();
  }, []);

  return (
    <div>
      {isLoading ? (
        <h5>IS LOADING...</h5>
      ) : (
        <div>
          <h1>{course?.details.name}</h1>
          <button onClick={() => console.log("nauka!!!")}>Ucz si?</button>
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
