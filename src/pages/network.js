import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import NetworkGraph from '@site/src/components/NetworkGraph';
import network from '@site/src/data/network.json';
import authorities from '@site/src/data/authorities.json';
import styles from './network.module.css';

const {entities} = authorities;
const {nodes = [], edges = []} = network;

const nameOf = (id) => entities[id]?.name || id;

export default function Network() {
  return (
    <Layout
      title="Network"
      description="The people of the correspondence as the Medici Archive records them, connected by the documents that name them together.">
      <main className={styles.page}>
        <header className={styles.masthead}>
          <h1 className={styles.title}>Network</h1>
          <p className={styles.description}>
            The people Cavriana names, placed among the documents of the Medici Archive. Two
            people are joined when the same document names them both. That is a fact about the
            archive rather than a claim about acquaintance, and most of these ties are being
            written <em>about</em> together; the ones that are letters between the two are drawn
            differently and counted separately.
          </p>
          <p className={styles.description}>
            The archive reaches far beyond these letters, so the picture is of whole careers, not
            of the years 1566–1574 alone. It is worth reading against the{' '}
            <Link to="/people">index</Link>, where the same people are counted by how often
            Cavriana himself names them — the two orders are not the same.
          </p>
        </header>

        {nodes.length === 0 ? (
          <p className={styles.empty}>The network has not been generated yet.</p>
        ) : (
          <>
            <NetworkGraph nodes={nodes} edges={edges} />

            <section>
              <h2 className={styles.sectionTitle}>Who sits closest to whom</h2>
              <ol className={styles.list}>
                {nodes.map((n) => (
                  <li key={n.id} id={`net-${n.id}`} className={styles.entry}>
                    <div className={styles.head}>
                      <h3 className={styles.name}>
                        <Link to={`/people#${n.id}`}>{n.sortName}</Link>
                      </h3>
                      <span className={styles.count}>
                        {n.mentions > 0
                          ? `${n.mentions} mention${n.mentions === 1 ? '' : 's'} in the letters`
                          : 'not named in the letters'}
                      </span>
                    </div>
                    <p className={styles.near}>
                      {n.nearest.map((m, i) => (
                        <React.Fragment key={m.id}>
                          {i > 0 && ' · '}
                          <Link to={`#net-${m.id}`}>{nameOf(m.id)}</Link>
                          <span className={styles.shared}>
                            {' '}
                            {m.shared}
                            {m.direct > 0 && `, ${m.direct} by letter`}
                          </span>
                        </React.Fragment>
                      ))}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </main>
    </Layout>
  );
}
