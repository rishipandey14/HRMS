const pendingRequests = [
  {
    id: 1,
    description: 'User Research Research th....',
    appliedTo: { name: 'Thor Odinson', avatar: 'https://i.pravatar.cc/80?img=12' },
    from: '15 Jun 2025',
    to: '15 Aug 2025',
    leaveType: 'Planned Leave',
  },
  {
    id: 2,
    description: 'User Research Research th....',
    appliedTo: { name: 'Thor Odinson', avatar: 'https://i.pravatar.cc/80?img=12' },
    from: '15 Jun 2025',
    to: '15 Aug 2025',
    leaveType: 'Planned Leave',
  },
  {
    id: 3,
    description: 'User Research Research th....',
    appliedTo: { name: 'Thor Odinson', avatar: 'https://i.pravatar.cc/80?img=12' },
    from: '15 Jun 2025',
    to: '15 Aug 2025',
    leaveType: 'Planned Leave',
  },
];
function ReguPendingList() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {/* Thin blue top line like the design */}
        <div className="h-1 bg-sky-500" />

        {/* Desktop / Tablet table */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead>
                <tr className="text-xs font-semibold text-gray-600 bg-white">
                  <th className="text-left px-5 py-4">Description</th>
                  <th className="text-left px-5 py-4">Applied to</th>
                  <th className="text-left px-5 py-4">From Date</th>
                  <th className="text-left px-5 py-4">To Date</th>
                  <th className="text-left px-5 py-4">Leave Type</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {pendingRequests.map((r) => (
                  <tr key={r.id} className="bg-white">
                    <td className="px-5 py-4">
                      <div className="max-w-[320px] truncate text-sm text-gray-800">
                        {r.description}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.appliedTo.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-800">
                          {r.appliedTo.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">{r.from}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{r.to}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{r.leaveType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: stacked cards (responsive) */}
        <div className="sm:hidden divide-y divide-gray-200">
          {pendingRequests.map((r) => (
            <div key={r.id} className="p-4">
              <div className="text-sm font-medium text-gray-900 truncate">
                {r.description}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src={r.appliedTo.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm text-gray-800">{r.appliedTo.name}</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div>
                  <div className="text-gray-400">From</div>
                  <div className="text-gray-700 text-sm">{r.from}</div>
                </div>
                <div>
                  <div className="text-gray-400">To</div>
                  <div className="text-gray-700 text-sm">{r.to}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-400">Leave Type</div>
                  <div className="text-gray-700 text-sm">{r.leaveType}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
export default ReguPendingList;