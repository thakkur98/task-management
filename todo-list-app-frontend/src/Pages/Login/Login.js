import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const Navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
       try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        console.log("Login Success:", data);

        // Save token for protected API calls
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);

        // Navigate to Dashboard
        Navigate("/");

      } catch (error) {
        console.error("Login Error:", error.message);
      }
    },
  });

  return (
    <LoginStyled>
      <div className="form-container">
        <form onSubmit={formik.handleSubmit}>
          <h2>Login</h2>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="error">{formik.errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error">{formik.errors.password}</p>
            )}
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </LoginStyled>
  );
};

export default Login;

const LoginStyled = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;

  .form-container {
    background: #fff;
    padding: 2rem 3rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    width: 350px;

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;

      label {
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      input {
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 1rem;
      }

      .error {
        color: red;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }
    }

    button {
      width: 100%;
      padding: 0.6rem;
      border: none;
      border-radius: 5px;
      background: teal;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        background: #006666;
      }
    }
  }
`;
