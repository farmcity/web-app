import Navbar from "@/components/layout/Navbar";

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FarmCity Documentation</h1>
          <p className="text-xl text-gray-600">Learn how to invest in real-world farms through blockchain technology</p>
        </div>

        <div className="grid gap-8">
          {/* Getting Started */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Getting Started</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                FarmCity enables you to invest in real-world agricultural projects through ERC1155 tokens.
                Each token represents fractional ownership of a specific farm operation.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How it Works:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Connect your Web3 wallet (MetaMask, WalletConnect, etc.)</li>
                <li>• Browse verified farms in our marketplace</li>
                <li>• Purchase ERC1155 tokens representing farm shares</li>
                <li>• Earn yields from actual farm harvests and operations</li>
                <li>• Monitor your investments through real-time farm data</li>
              </ul>
            </div>
          </div>

          {/* ERC1155 Tokens */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">ERC1155 Farm Tokens</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Our platform utilizes ERC1155 multi-token standard for representing farm ownership shares.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Token Benefits:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• <strong>Fractional Ownership:</strong> Own shares of expensive agricultural assets</li>
                <li>• <strong>Transferable:</strong> Trade your farm tokens on secondary markets</li>
                <li>• <strong>Transparent:</strong> All transactions recorded on blockchain</li>
                <li>• <strong>Yield-Bearing:</strong> Receive returns from farm operations</li>
                <li>• <strong>Diversified:</strong> Hold multiple farm types in one wallet</li>
              </ul>
            </div>
          </div>

          {/* Farm Verification */}
          {/* <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Farm Verification Process</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Every farm on FarmCity undergoes rigorous verification to ensure legitimacy and transparency.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Includes:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• GPS coordinate verification and satellite imagery</li>
                <li>• Legal ownership and land title verification</li>
                <li>• Soil quality and water rights assessment</li>
                <li>• Financial audits of farm operations</li>
                <li>• Crop insurance and risk assessment</li>
                <li>• Ongoing monitoring through IoT sensors</li>
              </ul>
            </div>
          </div> */}

          {/* Risk & Returns */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Understanding Risks & Returns</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Agricultural investments carry inherent risks but offer potential for stable returns.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Factors:</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Weather and climate conditions</li>
                    <li>• Market price fluctuations</li>
                    <li>• Crop diseases and pests</li>
                    <li>• Regulatory changes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Sources:</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Crop harvest revenue sharing</li>
                    <li>• Land appreciation value</li>
                    <li>• Carbon credit programs</li>
                    <li>• Token appreciation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help you navigate the world of agricultural DeFi investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href='mailto:admin@farmcity.dev' target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Contact Support
              </a>
              <a href="https://discord.gg/JUtwaB87kx" target="_blank" rel="noopener noreferrer" className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}