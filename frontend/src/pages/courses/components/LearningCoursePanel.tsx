import { Button, Flex, Progress, Tooltip } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LearningCoursePanel.css";
import { CourseInfo } from "../model/CourseInfo";

interface CoursePanelProps {
  course: CourseInfo;
}

export const LearningCoursePanel = (props: CoursePanelProps) => {
  const navigate = useNavigate();
  
  const { learntItems, learningItems, cardsAmount } = props.course;
  const totalProgress = Number.parseFloat(Math.round(((learntItems + learningItems) / cardsAmount) * 100).toFixed(2));
  const finished = (learntItems / cardsAmount) * 100;
  const todo = cardsAmount - ( learningItems + learntItems );

  return (
    <div className="CoursePanel">
      <div className="nameAndButtons">
        <p>{props.course.name}</p>
        <Button className="learnButton" onClick={() => navigate(`/courses/${props.course.id}/learning`)}>learn</Button>
        <Button className="learnButton" onClick={() => navigate(`/courses/${props.course.id}`)}>show</Button>
      </div>
      <Flex gap="small" vertical>
          <Tooltip title={`${learntItems} done / ${learningItems} in progress / ${todo} todo`}>
              <Progress percent={totalProgress} success={{ percent: finished }} />
          </Tooltip>
      </Flex>
    </div>
  );
};
