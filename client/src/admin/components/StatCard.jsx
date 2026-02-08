import { FaBox, FaShoppingCart, FaUsers, FaRupeeSign } from "react-icons/fa";

export default function StatCard({ title, value }) {
  // Choose icon based on title
  let Icon;
  switch (title.toLowerCase()) {
    case "products":
      Icon = FaBox;
      break;
    case "orders":
      Icon = FaShoppingCart;
      break;
    case "users":
      Icon = FaUsers;
      break;
    case "revenue":
      Icon = FaRupeeSign;
      break;
    default:
      Icon = FaBox;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4 hover:shadow-2xl transition-shadow">
      <div className="p-4 bg-green-100 rounded-full text-green-700">
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <p className="text-2xl font-bold text-green-800">{value}</p>
      </div>
    </div>
  );
}
