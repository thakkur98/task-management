import React from "react";
import { styled } from "styled-components";

const Footer = ({theme}) => {
  return (
    <FooterStyled theme={theme} >       

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      </div>
    </FooterStyled>
  );
};

export default Footer;

const FooterStyled = styled.footer`
  background: ${ ({theme}) => theme === "Dark" ? "#000" : "teal" };
  color: ${ ({theme}) => theme === "Dark" ? "#fff" : "#fff" };;
  padding: 5px;;
  font-family: sans-serif;

  .footer-bottom {
    text-align: center;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
      align-items: center;
      text-align: center;

      .footer-section {
        margin: 1rem 0;
      }
    }
  }
`;
