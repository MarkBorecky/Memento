import React, { useEffect, useState } from "react";
import { ACCESS_TOKEN, API_BASE_URL } from "../../config";
import { NavBar } from "../../layout/NavBar";
import { CoursePanel } from "./CoursePanel";

interface DashboardViewProps {
  isAuthenticated: boolean;
  userId: number | undefined;
}

export interface CourseInfo {
  id: number;
  name: string;
  languageA: string;
  languageB: string;
  cardsAmount: number;
  learntItems: number;
  learningItems: number;
}

export const DashboardView = (props: DashboardViewProps) => {
  const [courses, setCourses] = useState<CourseInfo[]>([]);

  const token = localStorage.getItem(ACCESS_TOKEN);

  const options = {
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    method: "GET",
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/${props.userId}/courses`, options)
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  return (
    <div>
      <NavBar isAuthenticated={props.isAuthenticated} />
      <ul style={{listStyleType: "none"}}>
        {courses.map((course) => (
          <li key={course.id}>
            <CoursePanel course={course} />
          </li>
        ))}
      </ul>
    </div>
  );
};
