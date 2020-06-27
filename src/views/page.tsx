import React from 'react';
import { Layout } from './layout';

interface PageProps {
  title: string;
}

export const Page = ({ title }: PageProps) => {
  return (
    <Layout>
      <p>{title}</p>
      <a href="/about">Go to the about page</a>
    </Layout>
  );
};
