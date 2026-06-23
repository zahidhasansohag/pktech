import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/DashboardCard";

export default function Home() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-4 gap-6">

          <DashboardCard
            title="Today's Sales"
            value="৳15,250"
          />

          <DashboardCard
            title="Monthly Profit"
            value="৳42,500"
          />

          <DashboardCard
            title="Products"
            value="250"
          />

          <DashboardCard
            title="Low Stock"
            value="8"
          />

        </div>

      </div>

    </div>
  );
}