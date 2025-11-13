import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "styled-components";

const AddTask = ({
  editOrAdd,
  editTask,
  setTasks,
  setOpenAdd,
  tasks,
  setEditTask,
}) => {
  const formik = useFormik({
    initialValues: {
      title: editTask ? editTask.title : "",
      description: editTask ? editTask.description : "",
      status: editTask ? editTask.status : "Pending",
    },
     enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");

        if (editTask) {
          const response = await fetch( 
            `https://task-management-10-r6hg.onrender.com/api/tasks/${editTask._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(values),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Update failed");
          }

          // Update frontend state
          const updatedTasks = tasks.map((item) =>
            item._id === editTask._id ? data : item
          );
          setTasks(updatedTasks);
        } else {
          const response = await fetch(`https://task-management-10-r6hg.onrender.com/api/tasks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Create failed");
          }
          setTasks((prev) => [...prev, data]);
        }

        setOpenAdd(false);
        setEditTask(null);
      } catch (error) {
        console.error("Task Error:", error.message);
      }
    },
  });

  return (
    <AddTaskStyled>
      <form onSubmit={formik.handleSubmit}>
        <h2>{editOrAdd}</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="error">{formik.errors.title}</p>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="error">{formik.errors.description}</p>
          )}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit">Add Task</button>
      </form>
    </AddTaskStyled>
  );
};

export default AddTask;

const AddTaskStyled = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 2rem auto;

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

    input,
    textarea,
    select {
      padding: 0.5rem;
      border-radius: 5px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    textarea {
      resize: vertical;
      min-height: 80px;
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
`;
