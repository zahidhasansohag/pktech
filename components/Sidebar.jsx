import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white p-5">

      <h1 className="text-3xl font-bold mb-10">
        PK TECH
      </h1>

      <ul className="space-y-5">

        <li>
          <Link href="/">🏠 Dashboard</Link>
        </li>

        <li>
          <Link href="/products">📦 Products</Link>
        </li>

        <li>
          <Link href="/sales">💰 Sales</Link>
        </li>

        <li>
          <Link href="/customers">👥 Customers</Link>
        </li>

        <li>
          <Link href="/reports">📊 Reports</Link>
        </li>

        <li>
          <Link href="/settings">⚙ Settings</Link>
        </li>

      </ul>

    </div>
  );
}