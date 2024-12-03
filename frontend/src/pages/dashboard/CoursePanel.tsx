import { CourseInfo } from "./DashboardView";
import {Button, Flex, Progress, Tooltip} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CoursePanel.css";

interface CoursePanelProps {
  course: CourseInfo;
}

export const CoursePanel = (props: CoursePanelProps) => {
  const navigate = useNavigate();
  
  const { learntItems, learningItems, cardsAmount } = props.course;
  const totalProgress = Number.parseFloat(Math.round(learntItems + learningItems / cardsAmount).toFixed(2));
  const finished = learntItems / cardsAmount;
  const todo = cardsAmount - ( learningItems + learntItems );

  return (
    <div className="CoursePanel">
      <div className="nameAndButtons">
        <p>{props.course.name}</p>
        <Button className="learnButton" onClick={() => navigate(`/courses/${props.course.id}/learning`)}>learn</Button>
      </div>
      <Flex gap="small" vertical>
          <Tooltip title={`${learntItems} done / ${learningItems} in progress / ${todo}`}>
              <Progress percent={totalProgress} success={{ percent: finished }} />
          </Tooltip>
      </Flex>
    </div>
  );
};
