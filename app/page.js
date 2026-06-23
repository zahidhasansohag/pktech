import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-8">PK TECH</h1>

        <ul className="space-y-4">
          <li><Link href="/">🏠 Dashboard</Link></li>
          <li><Link href="/products">📦 Products</Link></li>
          <li><Link href="/sales">💰 Sales</Link></li>
          <li><Link href="/customers">👥 Customers</Link></li>
          <li><Link href="/reports">📊 Reports</Link></li>
          <li><Link href="/settings">⚙ Settings</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Today's Sales</h2>
            <p className="text-2xl font-bold text-green-600">
              ৳15,250
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Monthly Profit</h2>
            <p className="text-2xl font-bold text-blue-600">
              ৳42,500
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Products</h2>
            <p className="text-2xl font-bold">
              250
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Low Stock</h2>
            <p className="text-2xl font-bold text-red-500">
              8
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}