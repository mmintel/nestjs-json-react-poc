import React from 'react';
import { Head } from '@react-ssr/nestjs-express';

interface PageProps {
  data: PageData
}

interface PageData {
  title: string;
}

const Page = ({ data }: PageProps) => {
  return (
    <React.Fragment>
      <Head>
        <title>An example of @react-ssr/nestjs-express</title>
      </Head>
      <p>{data.title}</p>
      <a href="/about">Go to the about page</a>
    </React.Fragment>
  );
};

export default Page;
