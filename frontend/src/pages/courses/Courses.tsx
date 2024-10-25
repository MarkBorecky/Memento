import React, { useEffect, useState } from "react";
import { Course, CoursesProvider, manageState } from "./CoursesProvider";
import { NavBar } from "../../layout/NavBar";
import {Link} from "react-router-dom";

const dataProvider = new CoursesProvider();

interface CoursesProps {
  isAuthenticated: boolean;
}

export const Courses = (props: CoursesProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consumeResult = manageState(setLoading, setCourses, setError);

  useEffect(() => {
    const subscription = dataProvider
      .getData()
      .subscribe((result) => consumeResult(result));

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  return (
    <div>
      <NavBar isAuthenticated={props.isAuthenticated} />
      <h1>Kursy</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <Link to={`/courses/${course.id}`}>{course.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
