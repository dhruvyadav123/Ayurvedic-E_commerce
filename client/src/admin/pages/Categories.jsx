export default function Categories() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-bold mb-4">Categories</h2>
      <input className="border p-2 mr-2" placeholder="New Category" />
      <button className="bg-primary text-white px-4 py-2 rounded">
        Add
      </button>
    </div>
  );
}
