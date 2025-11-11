import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const Navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }

        if (!response.ok) throw new Error(data.message || text);

        localStorage.setItem("token", data.token);
         localStorage.setItem("userName", data.user.name);
        Navigate("/");
      } catch (error) {
        console.error("Signup Error:", error.message);
      }
    },
  });

  return (
    <SignupStyled>
      <div className="form-container">
        <form onSubmit={formik.handleSubmit}>
          <h2>Sign Up</h2>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="error">{formik.errors.name}</p>
            )}
          </div>

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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="error">{formik.errors.confirmPassword}</p>
              )}
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </SignupStyled>
  );
};

export default Signup;

const SignupStyled = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;

  .form-container {
    background: #fff;
    padding: 2rem 3rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    width: 400px;

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
