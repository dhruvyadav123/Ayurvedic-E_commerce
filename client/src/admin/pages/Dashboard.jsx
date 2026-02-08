import StatCard from "../components/StatCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-green-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center md:text-left">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Products" value="120" />
        <StatCard title="Orders" value="350" />
        <StatCard title="Users" value="980" />
        <StatCard title="Revenue" value="₹2.5L" />
      </div>
    </div>
  );
}
