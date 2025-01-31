import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Timeline } from 'lucide-react';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={siteConfig.title}
      description="Digital edition of Filippo Cavriana's correspondence from the State Archives of Florence, Mantua, and the BnF">
      
      {/* Hero Section */}
      <header className="bg-emerald-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Filippo Cavriana: The Secret Correspondence
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              The first comprehensive digital edition of manuscript letters from a physician-spy at the heart of 16th-century European politics
            </p>
            <div className="flex justify-center gap-4">
              <Link
                className="bg-emerald-700 text-white px-6 py-3 rounded-md hover:bg-emerald-800 font-medium"
                to="/docs/intro">
                Browse the Letters
              </Link>
              <Link
                className="bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-800 font-medium"
                to="/docs/about">
                About the Project
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-6">
          
          {/* Project Overview */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Project Overview</h2>
            <p className="text-gray-700 mb-4">
              This digital edition presents letters from Filippo Cavriana (1536-1606), drawn from the archives of Florence, Mantua, and Paris. As a physician at the French court and a Medici spy, Cavriana's correspondence provides unique insights into the French Wars of Religion and 16th-century European politics.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Complete Edition</h3>
              <p className="text-gray-600">Full TEI-XML encoding with semantic markup and named entity recognition</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Phased Release</h3>
              <p className="text-gray-600">Regular content updates from 2024-2026, with ongoing peer review</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Open Access</h3>
              <p className="text-gray-600">Licensed under Creative Commons BY 4.0 for research and teaching</p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Timeline className="w-5 h-5 text-emerald-700" />
              <h2 className="text-2xl font-bold text-gray-900">Project Timeline</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Development and content publication spanning from late 2024 through early 2026
            </p>
            <Link
              className="text-emerald-700 hover:text-emerald-800 font-medium"
              to="/docs/about#release-schedule">
              View Release Schedule →
            </Link>
          </div>

        </div>
      </main>

      {/* Citation Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">How to Cite</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-4 font-mono text-sm">
              Godbarge, Clément. 2025. "Filippo Cavriana's Secret Correspondence (1563-1589)." St Andrews: University of St Andrews. https://pantagrueliste.github.io/CavrianaCorr_FrontEnd/
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
