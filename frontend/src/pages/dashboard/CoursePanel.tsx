import { CourseInfo } from "./DashboardView";
import { Button, Flex, Progress } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CoursePanel.css";

interface CoursePanelProps {
  course: CourseInfo;
}

export const CoursePanel = (props: CoursePanelProps) => {
  const navigate = useNavigate();

  return (
    <div className="CoursePanel">
      <div className="nameAndButtons">
        <p>{props.course.name}</p>
        <Button className="learnButton" onClick={() => navigate(`/courses/${props.course.id}/learning`)}>learn</Button>
      </div>
      <Flex gap="small" vertical>
        <Progress percent={30} />
      </Flex>
    </div>
  );
};
