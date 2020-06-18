import React from 'react';
import { Head } from '@react-ssr/nestjs-express';

interface IndexProps {
  message: string,
  statusCode: number,
}

const Index = ({ message, statusCode }: IndexProps) => {
  return (
    <React.Fragment>
      <Head>
        <title>{statusCode} - {message}</title>
      </Head>
      <h1>Error</h1>
      <p>{message}</p>
    </React.Fragment>
  );
};

export default Index;
