import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Digital edition of Filippo Cavriana's correspondence from the State Archives of Florence, Mantua, and the BnF">
      <Head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="055d972b-27a9-478f-9aa1-bb581f4c92bb"></script>
      </Head>
      <header className={styles.hero}>
        <div className={styles.container}>
          <h1>{siteConfig.title}</h1>
          <p>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/intro">
              Browse the Letters
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  );
}
