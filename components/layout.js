import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./header";
import Head from "next/head";
// import "semantic-ui-css/semantic.min.css";

const Layout = (props) => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
      </Head>

      <Header />
      {props.children}
    </Container>
  );
};
export default Layout;
