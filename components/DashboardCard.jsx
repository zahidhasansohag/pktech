export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-gray-500 text-sm">
        {title}
      </h2>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>
    </div>
  );
}