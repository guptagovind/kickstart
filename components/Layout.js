import React from 'react';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';

import Header from './Header'


export default props => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"/>
      </Head>
      <Header/>
      {props.children}
    </Container>
  );
};

