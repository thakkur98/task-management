import React from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
const Header = ({  setTheme, userDetail , theme}) => {
  const Navigate = useNavigate();
  const  logout=  () => {
    localStorage.setItem("userName", "");
     Navigate("/login");
     
  }
  const toggleTheme = () => {
    setTheme((prev) => (prev === "Dark" ? "Light" : "Dark"));
  };

  return (
    <HeaderStyled theme={theme}>
      <div className="logo">Task Manager</div>
      <nav className="nav-links">
         <button onClick={toggleTheme}>
        {theme === "Dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
       {userDetail ? (
        <>
        <p>{`Welcome ${userDetail}`}</p>
        <p className="logout-btn" onClick={logout}>Logout</p>
        </>
        
        ) : (<>
        <a href="/login">Sign In</a>
        <a href="/signup">Sign Up</a>
       </> )}  
             
        
        
      </nav>
    </HeaderStyled>
  );
};

export default Header;

const HeaderStyled = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({theme}) => (theme === "Dark" ? "#1e1e1e" : "teal")};
  color: ${({theme}) => (theme === "Dark" ? "#f0f0f0" : "#fff")};

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    .logout-btn{
      cursor: pointer;
    }

    a {
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      transition: 0.3s;

      &:hover {
        color: #000;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;

    .nav-links {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;
