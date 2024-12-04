import { User } from "../../user/profile/Profile";

import {Button, Form, Input, notification, Select} from "antd";
import React, {useState} from "react";
import {FormInstance} from "antd/lib/form";
import {addCourse, CourseRequest, Language, signup} from "../../util/APIUtils";
import {useNavigate} from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

interface CourseFormProps {
  user: User;
}


export const CourseForm = ({ user }: CourseFormProps) => {
    const [form] = Form.useForm<FormInstance>();

    const [name, setName] = useState<string|undefined>();
    const [teachingLanguage, setTeachingLanguage] = useState<Language|undefined>();
    const [baseLanguage, setBaseLanguage] = useState<Language|undefined>();

    const navigate = useNavigate();

    function isFormInvalid() {
        return !(
            name !== undefined &&
            teachingLanguage !== undefined &&
            baseLanguage !== undefined
        );
    }

    async function handleSubmit() {
        const courseRequest: CourseRequest = {
            name: name!,
            teachingLanguage: teachingLanguage!,
            baseLanguage: baseLanguage!
        }
        try {
            const newCourseId = await addCourse(courseRequest);
            notification.success({
                message: "Polling XxxApp",
                description:
                    "Thank you! You're successfully registered. Please Login to continue!",
            });
            navigate(`/courses/${newCourseId}`);
        } catch (error: any) {
            notification.error({
                message: "Polling XxxApp",
                description:
                    error.message || "Sorry! Something went wrong. Please try again!",
            });
        }
    }
  return (
    <div className="form-container">
      <h1 className="page-title">Create a Course</h1>
      <div className="form-content">
        <Form
          {...formItemLayout}
          form={form}
          style={{ maxWidth: 600 }}
          initialValues={{ variant: "filled" }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="Name"
            rules={[
              { required: true, message: "Please write the course name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="teaching"
            name="teaching"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Select
              style={{ width: "100%" }}
              options={[
                { value: "POLISH", label: "Polish" },
                { value: "FINNISH", label: "Finnish" },
                { value: "SWEDISH", label: "Swedish" },
                { value: "ENGLISH", label: "English" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="for"
            name="for"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Select
              style={{ width: "100%" }}
              options={[
                { value: "POLISH", label: "Polish" },
                { value: "FINNISH", label: "Finnish" },
                { value: "SWEDISH", label: "Swedish" },
                { value: "ENGLISH", label: "English" },
              ]}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={isFormInvalid()}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
