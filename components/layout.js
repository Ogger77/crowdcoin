import React from "react";
import { Container } from "semantic-ui-react";
import Header from "../components/header";
import "semantic-ui-css/semantic.min.css";

const Layout = (props) => {
  return (
    <Container>
      <Header />
      {props.children}
    </Container>
  );
};
export default Layout;
