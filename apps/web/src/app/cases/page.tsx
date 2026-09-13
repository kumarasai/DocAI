export default function Cases() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cases</h2>
          <p className="text-zinc-400 mt-1">Manage property registration and loan documentation cases.</p>
        </div>
        <a href="/cases/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
          + Create Case
        </a>
      </div>

      <div className="border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex gap-4">
          <input 
            type="text" 
            placeholder="Search cases..." 
            className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <select className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500">
            <option>All Statuses</option>
            <option>DRAFT</option>
            <option>PROCESSING</option>
            <option>NEEDS_REVIEW</option>
            <option>APPROVED</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Case ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Transaction Type</th>
                <th className="px-6 py-4 font-medium">Property Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "CASE-2026-00182", customer: "Ravi Kumar", type: "House Purchase", loc: "Bhimavaram", status: "NEEDS_REVIEW", statusColor: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
                { id: "CASE-2026-00181", customer: "Priya Sharma", type: "Mortgage", loc: "Hyderabad", status: "PROCESSING", statusColor: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
                { id: "CASE-2026-00180", customer: "Amit Patel", type: "Plot Purchase", loc: "Vizag", status: "APPROVED", statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                { id: "CASE-2026-00179", customer: "Sneha Reddy", type: "Construction Loan", loc: "Vijayawada", status: "DRAFT", statusColor: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20" },
              ].map((c) => (
                <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-medium text-zinc-200">{c.id}</td>
                  <td className="px-6 py-4">{c.customer}</td>
                  <td className="px-6 py-4">{c.type}</td>
                  <td className="px-6 py-4">{c.loc}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${c.statusColor}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
