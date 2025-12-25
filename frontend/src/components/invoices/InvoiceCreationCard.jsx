import { motion } from "framer-motion";

export default function InvoiceCreationCard({ clients, selectedClient, setSelectedClient, onCreate, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
        <span className="text-4xl">💸</span> Get Paid
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1 mb-2 block">
            Who owes you money?
          </label>
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all cursor-pointer appearance-none"
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
          whileTap={{ scale: 0.98 }}
          onClick={onCreate}
          disabled={disabled}
          className={`px-8 py-3.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all ${
            disabled
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/20"
          }`}
        >
          {disabled ? "🚫 Select Sessions First" : "💰 Generate Invoice"}
        </motion.button>
      </div>
    </motion.div>
  );
}