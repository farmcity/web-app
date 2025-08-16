import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
            Invest in <span className="text-green-600">Real Farms</span>,
            <br />Earn <span className="text-blue-600">Real Yields</span>
          </h1>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            FarmCity brings real-world agriculture to DeFi. Own fractions of productive farms 
            through ERC1155 tokens and earn sustainable returns from actual crop harvests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/marketplace"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              Explore Farms
            </Link>
            <Link
              href="/docs"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">$8.8M+</div>
            <div className="text-gray-700 mt-2 font-medium">Total Value Locked</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">4</div>
            <div className="text-gray-700 mt-2 font-medium">Active Farms</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">20.5%</div>
            <div className="text-gray-700 mt-2 font-medium">Average APY</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl">🚜</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Real Farm Ownership</h3>
            <p className="text-gray-700">
              Own tokenized shares of actual farms with verified GPS coordinates and live monitoring.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparent Yields</h3>
            <p className="text-gray-700">
              Track your farm's performance with real-time data, weather updates, and harvest reports.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainable Impact</h3>
            <p className="text-gray-700">
              Support regenerative agriculture and earn returns while helping the environment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
