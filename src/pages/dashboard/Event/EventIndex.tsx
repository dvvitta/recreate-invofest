import { Link } from "react-router-dom";

export default function EventIndex() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
          <p className="text-gray-500 text-sm mt-1">Keep track of all your upcoming events</p>
        </div>
        <Link
          to="/dashboard/event/create"
          className="bg-red-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98]"
        >
          + Add New Event
        </Link>
      </div>

      {/* Table Placeholder */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">Event Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="py-12 text-center text-gray-400 text-sm italic">
                No events found. Click "Add New Event" to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}