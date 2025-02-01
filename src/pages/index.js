import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Digital edition of Filippo Cavriana's correspondence from the State Archives of Florence, Mantua, and the BnF"
    >
      {/* Hero Banner */}
      <header
        className="relative bg-cover bg-center bg-no-repeat py-16 flex items-center"
        style={{
          backgroundImage: "url(${useBaseUrl('img/banner.webp')})",
          minHeight: '50vh'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Hero Text Container */}
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Filippo Cavriana: The Secret Correspondence
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            The first comprehensive digital edition of manuscript letters from a physician-spy at the heart of 16th-century European politics
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.location.href='/docs/intro'}
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-medium"
            >
              Browse the Letters
            </button>
            <button
              onClick={() => window.location.href='/docs/intro'}
              className="bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
            >
              About the Project
            </button>
          </div>
        </div>
      </header>

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
    </Layout>
  );
}
