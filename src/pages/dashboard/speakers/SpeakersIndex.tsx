import { Link } from "react-router-dom";

export default function SpeakerIndex() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Speakers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your event speakers here</p>
        </div>
        <Link
          to="/dashboard/speakers/create"
          className="bg-red-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98]"
        >
          + Add New Speaker
        </Link>
      </div>

      {/* Table Placeholder */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="py-12 text-center text-gray-400 text-sm italic">
                No speakers found. Click "Add New Speaker" to create one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}