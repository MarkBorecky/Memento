import React, { useEffect, useState } from "react";
import { CoursesProvider, manageState } from "./CoursesProvider";
import { NavBar } from "../../layout/NavBar";
import { CourseInfo } from "./model/CourseInfo";
import { useNavigate } from "react-router-dom";
import {Button, Typography} from "antd";

const dataProvider = new CoursesProvider();

interface CoursesProps {
  isAuthenticated: boolean;
}

interface CoursePanelProps {
  course: CourseInfo;
}

const CoursePanel = ({ course }: CoursePanelProps) => {
  const navigate = useNavigate();

  const { Paragraph } = Typography;

  return (
      <div className="CoursePanel">
        <Paragraph>{course.authorName}</Paragraph>
            <div className="nameAndButtons">
              <Paragraph className="courseName">{course.name}</Paragraph>
              <Button
                  className="learnButton"
                  onClick={() => navigate(`/courses/${course.id}/learning`)}
              >
                learn
              </Button>
              <Button
                  className="learnButton"
                  onClick={() => navigate(`/courses/${course.id}`)}
              >
                show
              </Button>
            </div>
      </div>
);
};

export const CoursesView = (props: CoursesProps) => {
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
      <Button type="primary" onClick={() => navigate("/courses/create")}>Create new course</Button>
      <ul style={{listStyleType: "none"}}>
        {courses.map((course) => (
            <li key={course.id}>
              <CoursePanel course={course}/>
            </li>
        ))}
      </ul>
    </div>
  );
};
