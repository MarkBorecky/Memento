import React, { useState } from "react";
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  signup,
} from "../util/APIUtils";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../config";
import { Button, Form, Input, notification } from "antd";
import { FormInstance } from "antd/lib/form";

type ValidationStatus = "success" | "error" | "validating" | "warning" | "";

interface FieldState {
  value: string;
  validateStatus: ValidationStatus;
  errorMsg: string;
}

const Signup: React.FC = () => {
  const [form] = Form.useForm<FormInstance>();
  const [username, setUsername] = useState<FieldState>({
    value: "",
    validateStatus: "",
    errorMsg: "",
  });
  const [email, setEmail] = useState<FieldState>({
    value: "",
    validateStatus: "",
    errorMsg: "",
  });
  const [password, setPassword] = useState<FieldState>({
    value: "",
    validateStatus: "",
    errorMsg: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    validationFun: (value: string) => Result,
  ) => {
    const { name, value } = event.target;
    const validateStatus = validationFun(value).validateStatus;
    const state = {
      errorMsg: "",
      validateStatus: validateStatus,
      value: value,
    };
    switch (name) {
      case "username":
        setUsername(state);
        break;
      case "email":
        setEmail(state);
        break;
      case "password":
        setPassword(state);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const signupRequest = {
      email: email.value,
      userName: username.value,
      password: password.value,
    };
    try {
      await signup(signupRequest);
      notification.success({
        message: "Polling XxxApp",
        description:
          "Thank you! You're successfully registered. Please Login to continue!",
      });
      navigate("/login");
    } catch (error: any) {
      notification.error({
        message: "Polling XxxApp",
        description:
          error.message || "Sorry! Something went wrong. Please try again!",
      });
    }
  };

  const validateUsernameAvailability = async () => {
    const usernameValidation = validateUsername(username.value);
    if (usernameValidation.validateStatus === "error") {
      setUsername({ ...username, ...usernameValidation });
      return;
    }
    setUsername({ ...username, validateStatus: "validating" });

    try {
      const response = await checkUsernameAvailability(username.value);
      if (response.available) {
        setUsername({ ...username, validateStatus: "success", errorMsg: "" });
      } else {
        setUsername({
          ...username,
          validateStatus: "error",
          errorMsg: "This username is already taken",
        });
      }
    } catch (error) {
      setUsername({ ...username, validateStatus: "success" });
    }
  };

  const validateEmailAvailability = async () => {
    const emailValidation = validateEmail(email.value);
    if (emailValidation.validateStatus === "error") {
      setEmail({ ...email, ...emailValidation });
      return;
    }
    setEmail({ ...email, validateStatus: "validating" });

    try {
      const response = await checkEmailAvailability(email.value);
      if (response.available) {
        setEmail({ ...email, validateStatus: "success", errorMsg: "" });
      } else {
        setEmail({
          ...email,
          validateStatus: "error",
          errorMsg: "This email is already registered",
        });
      }
    } catch (error) {
      setEmail({ ...email, validateStatus: "success" });
    }
  };

  const isFormInvalid = () => {
    return !(
      username.validateStatus === "success" &&
      email.validateStatus === "success" &&
      password.validateStatus === "success"
    );
  };

  // Validation Functions
  const validateName = (name: string): Result => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`,
      };
    }
    return { validateStatus: "success", errorMsg: "" };
  };

  const validateEmail = (email: string): Result => {
    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!email) {
      return { validateStatus: "error", errorMsg: "Email may not be empty" };
    } else if (!EMAIL_REGEX.test(email)) {
      return { validateStatus: "error", errorMsg: "Email not valid" };
    } else if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`,
      };
    }
    return { validateStatus: "success", errorMsg: "" };
  };

  interface Validation {
    validateStatus: ValidationStatus;
  }

  interface FailedValidation extends Validation {
    errorMsg: string;
  }

  type Result = Validation | FailedValidation;

  const validateUsername = (username: string): Result => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`,
      };
    }
    return { validateStatus: "success", errorMsg: "" };
  };

  const validatePassword = (password: string): Result => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`,
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`,
      };
    }
    return { validateStatus: "success", errorMsg: "" };
  };

  return (
    <div className="form-container">
      <h1 className="page-title">Sign Up</h1>
      <div className="form-content">
        <Form form={form} onFinish={handleSubmit} >
          <Form.Item
            label="Username"
            hasFeedback
            validateStatus={username.validateStatus}
            help={username.errorMsg}
          >
            <Input
              size="large"
              name="username"
              autoComplete="off"
              placeholder="A unique username"
              value={username.value}
              onBlur={validateUsernameAvailability}
              onChange={(event) => handleInputChange(event, validateUsername)}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            hasFeedback
            validateStatus={email.validateStatus}
            help={email.errorMsg}
          >
            <Input
              size="large"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="Your email"
              value={email.value}
              onBlur={validateEmailAvailability}
              onChange={(event) => handleInputChange(event, validateEmail)}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={password.validateStatus}
            help={password.errorMsg}
          >
            <Input
              size="large"
              name="password"
              type="password"
              autoComplete="off"
              placeholder="A password between 6 to 20 characters"
              value={password.value}
              onChange={(event) => handleInputChange(event, validatePassword)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="signup-form-button"
              disabled={isFormInvalid()}
            >
              Sign up
            </Button>
            Already registered? <Link to="/login">Login now!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
