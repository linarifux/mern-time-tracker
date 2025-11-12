import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function SessionTable({ sessions, onDelete, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-900/30 transition-all overflow-x-auto"
    >
      {" "}
      <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
        {" "}
        <span className="bg-cyan-500/10 p-2 rounded-full">📜</span>
        Recent Sessions{" "}
      </h3>
      {sessions.length === 0 ? (
        <p className="text-gray-500 text-sm">No sessions logged yet.</p>
      ) : (
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-gray-800/60 text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Client</th>
              <th className="py-3 px-4 text-left">Start</th>
              <th className="py-3 px-4 text-left">End</th>
              <th className="py-3 px-4 text-left">Hours</th>
              <th className="py-3 px-4 text-left">Notes</th>
              <th className="py-3 px-4 text-left">Tag</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <motion.tr
                key={s._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors"
              >
                <td className="py-2 px-4 whitespace-nowrap">
                  {dayjs(s.startTime).format("YYYY-MM-DD")}
                </td>
                <td className="py-2 px-4 whitespace-nowrap font-medium text-cyan-300">
                  {s.clientId?.name || "—"}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {dayjs(s.startTime).format("HH:mm")}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {s.endTime ? dayjs(s.endTime).format("HH:mm") : "—"}
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-cyan-300 font-semibold">
                  {s.totalHours?.toFixed?.(2) ?? "—"}
                </td>
                <td
                  className="py-2 px-4 max-w-[200px] truncate"
                  title={s.notes}
                >
                  {s.notes || "—"}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">{s.tag || "—"}</td>
                <td className="py-2 px-4 text-center flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-gray-200 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md text-sm text-white font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}
