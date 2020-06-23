import React from 'react';
import { Head } from '@react-ssr/nestjs-express';

interface PageProps {
  title: string;
}

const Page = ({ title }: PageProps) => {
  return (
    <React.Fragment>
      <Head>
        <title>An example of @react-ssr/nestjs-express</title>
      </Head>
      <p>{title}</p>
      <a href="/about">Go to the about page</a>
    </React.Fragment>
  );
};

export default Page;
