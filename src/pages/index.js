import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Digital edition of Filippo Cavriana's correspondence">
      <main className="bg-emerald-200 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {siteConfig.title}
            </h1>
            <p className="text-xl mb-8">
              A digital edition of manuscript letters found in the archives of Florence, Mantua, and the BnF
            </p>
            <div className="flex justify-center gap-4">
              <Link
                className="bg-emerald-700 text-white px-6 py-2 rounded-md hover:bg-emerald-800"
                to="/docs/intro">
                Read the Letters
              </Link>
              <Link
                className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-800"
                to="/blog">
                Visit the Blog
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
