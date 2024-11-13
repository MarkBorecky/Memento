import React, {useEffect, useState} from "react";
import {ACCESS_TOKEN, API_BASE_URL} from "../../config";
import {NavBar} from "../../layout/NavBar";
import { useNavigate } from "react-router-dom";
import {Button} from "antd";

interface DashboardViewProps {
    isAuthenticated: boolean;
    userId: number | undefined;
}

export interface CourseInfo {
    id: number;
    name: string;
    languageA: string;
    languageB: string;
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

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE_URL}/users/${props.userId}/courses`, options)
            .then((res) => res.json())
            .then((data) => setCourses(data));
    }, []);

    return (
        <div>
            <NavBar isAuthenticated={props.isAuthenticated}/>
            <h1>Dashboard</h1>
            <ul>
                {courses.map((course) => (
                    <li key={course.id}>
                        <div>
                            <h1>{course.name}</h1>
                            <Button onClick={() => navigate(`/courses/${course.id}/learning`)}>learn</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
