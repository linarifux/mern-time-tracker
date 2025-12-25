import { motion } from "framer-motion";

export default function InvoiceCreationCard({ 
  clients, 
  selectedClient, 
  setSelectedClient, 
  onCreate, 
  disabled,
  isCreating 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Adjusted: p-6 mobile / p-8 desktop. rounded-2xl mobile / 3xl desktop
      className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Responsive Heading Size */}
      <h2 className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-3">
        <span className="text-3xl md:text-4xl">💸</span> Get Paid
      </h2>

      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1 mb-2 block">
            Who owes you money?
          </label>
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              // Added text-base for mobile touch targets
              className="w-full px-4 py-3.5 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all cursor-pointer appearance-none"
            >
              <option value="">Select a Client (The Victim)</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              ▼
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreate}
          disabled={disabled || isCreating}
          // Adjusted: w-full on mobile, w-auto on desktop
          className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all md:min-w-[200px] ${
            disabled || isCreating
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/20"
          }`}
        >
          {isCreating ? (
            <>
              <span className="animate-spin text-xl">🌀</span> Printing Money...
            </>
          ) : disabled ? (
            "🚫 Select Sessions"
          ) : (
            "💰 Generate Invoice"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}