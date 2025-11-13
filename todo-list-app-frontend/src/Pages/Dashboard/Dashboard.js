import React, { useState, useEffect } from "react";
import Header from "../../Component/Header/Header";
import Footer from "../../Component/Footer/Footer";
import styled from "styled-components";
import AddTask from "../AddTask/AddTask";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editTask, setEditTask] = useState({});
  const [editOrAdd , setEditOrAdd] = useState("");
  const [userDetail , setUserDetail] = useState("");
  const [theme , setTheme] = useState("Light");
  const [role , setRole] = useState("");
  const handleEdit = (task) => {
    setOpenAdd(true);
    setEditOrAdd("Edit");
    setEditTask(task);
  };
   const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      userName && setUserDetail(userName);
      const userRole = localStorage.getItem("userRole");
      setRole(userRole);
      const response = await fetch("https://task-management-10-r6hg.onrender.com/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks");
      }

      setTasks(data); 
    } catch (error) {
      console.error("Fetch Tasks Error:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  const handleDelete = async (id) => {
     try {
    const token = localStorage.getItem("token"); 

    const response = await fetch(`https://task-management-10-r6hg.onrender.com/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Delete failed");
    }

    console.log("Task deleted:", data);
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

  } catch (error) {
    console.error("Delete Error:", error.message);
  }
  };

  const handleAddTask = () =>{
      setOpenAdd(true);
      setEditOrAdd("Add");
      setEditTask(""); 
  }
  if(!userDetail){
    return( 
      <>
       <Header userDetail={userDetail} setTheme={setTheme} theme={theme}/>
       <p style={{height: "100vh", textAlign: "center", fontSize:"30px", fontWeight: "600"}}>Please Sign in first</p>
       <Footer theme={theme}/>
      </>      
  )
  }else{
 return (
    <>
      <Header userDetail={userDetail} setTheme={setTheme} theme={theme}/>
      <DashboardStyle  theme={theme}>
        <head>
          <title>Dashboard | Task Management App</title>
          <meta name="description" content="View, manage, and track all your tasks efficiently on the Task Management Dashboard. Organized, fast, and user-friendly." />
          <meta name="keywords" content="task dashboard, task manager, productivity app, todo app, task tracker" />          
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <div className="dashboard-header">
          <h2>Task</h2>
          <button onClick ={ handleAddTask}className="add-task-btn">+ Add Task</button>
        </div>

        <div className="tasks-grid">
          {tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span
                className={
                  task.status === "Completed"
                    ? "status completed"
                    : "status pending"
                }
              >
                {task.status}
              </span>

              <div className="task-actions">
                <button className="edit" onClick={() => handleEdit(task)}>
                  Edit
                </button>
               {role === "admin" && <button
                  className="delete"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>}
              </div>
            </div>
          ))}
        </div>
      </DashboardStyle>
      {openAdd && (
        <ModalWrapper>
          <ModalContent>
            <button className="close-btn" onClick={() => {setEditTask(""); setOpenAdd(false)}}>
              ×
            </button>
            <AddTask editOrAdd={editOrAdd} editTask={editTask} setEditTask={setEditTask} setTasks={setTasks} setOpenAdd={setOpenAdd} tasks={tasks}/>
          </ModalContent>
        </ModalWrapper>
      )}

      <Footer  theme={theme}/>
    </>
  );
  }

 
};

export default Dashboard;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #333;
  }
`;

const DashboardStyle = styled.div`
  min-height: calc(100vh - 120px); // Adjust for header + footer
  padding: 2rem;
  background: #fff;

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      margin: 0;
    }

    .add-task-btn {
      padding: 0.5rem 1rem;
      background: ${(theme) => theme === "Light" ? "teal": "#000"  };
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        background: #006666;
      }
    }
  }

  .tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;

    .task-card {
      background: #fff;
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .task-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        .edit {
          color: blue;
        }
        .delete {
          color: red;
        }
      }

      h3 {
        margin: 0;
        font-size: 1.1rem;
      }

      p {
        font-size: 0.9rem;
        color: #555;
      }

      .status {
        align-self: flex-start;
        padding: 0.2rem 0.5rem;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: 500;
        color: #fff;

        &.pending {
          background: orange;
        }

        &.completed {
          background: green;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    .tasks-grid {
      grid-template-columns: 1fr;
    }
  }
`;
