<header
  className="relative bg-cover bg-center bg-no-repeat py-16 flex items-center"
  style={{
    backgroundImage: `url(${useBaseUrl('img/banner.webp')})`,
    minHeight: '35vh',  // Reduce height
    backgroundSize: 'contain',  // Scale without excessive cropping
    backgroundPosition: 'center top',  // Adjust positioning
  }}
>
  {/* Darker overlay for better readability */}
  <div className="absolute inset-0 bg-black bg-opacity-70"></div>

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
