import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const bannerUrl = useBaseUrl('img/banner.webp');
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Digital edition of Filippo Cavriana's correspondence from the State Archives of Florence, Mantua, and the BnF"
    >
      <div className="relative">
        {/* Hero Banner */}
        <div
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            height: '60vh'
          }}
        >
          {/* Title Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center mx-auto max-w-4xl px-4">
              {/* Semi-transparent dark background for text */}
              <div className="bg-black bg-opacity-70 p-8 rounded-lg">
                <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  Filippo Cavriana: The Secret Correspondence
                </h1>
                <p className="text-xl text-white mb-8 drop-shadow-lg">
                  The first comprehensive digital edition of manuscript letters from a physician-spy at the heart of 16th-century European politics
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    to="/docs/intro"
                    className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
                  >
                    Browse the Letters
                  </Link>
                  <Link
                    to="/docs/intro"
                    className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800"
                  >
                    About the Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <main className="py-16 bg-[#242526] text-gray-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl font-bold mb-6 text-white">Project Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                This digital edition presents letters from Filippo Cavriana (1536-1606), drawn from the archives of Florence, Mantua, and Paris. As a physician at the French court and a Medici spy, Cavriana's correspondence provides unique insights into the French Wars of Religion and 16th-century European politics.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#1c1e21] p-8 rounded-lg">
                <h3 className="font-bold mb-3 text-white text-lg">Complete Edition</h3>
                <p className="text-gray-300">
                  Full TEI-XML encoding with semantic markup and named entity recognition
                </p>
              </div>
              <div className="bg-[#1c1e21] p-8 rounded-lg">
                <h3 className="font-bold mb-3 text-white text-lg">Phased Release</h3>
                <p className="text-gray-300">
                  Regular content updates from 2024-2026, with ongoing peer review
                </p>
              </div>
              <div className="bg-[#1c1e21] p-8 rounded-lg">
                <h3 className="font-bold mb-3 text-white text-lg">Open Access</h3>
                <p className="text-gray-300">
                  Licensed under Creative Commons BY 4.0 for research and teaching
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* How to Cite */}
        <section className="bg-[#1c1e21] py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-white">How to Cite</h2>
              <div className="bg-[#242526] p-6 rounded-lg mb-4 font-mono text-sm text-gray-300">
                Godbarge, Clément. 2025. "Filippo Cavriana's Secret Correspondence (1563-1589)."
                St Andrews: University of St Andrews. https://pantagrueliste.github.io/CavrianaCorr_FrontEnd/
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
