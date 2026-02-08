import { Link } from "react-router-dom";

const products = [
  { name: "Juice", slug: "juice", img: "/images/juice.webp" },
  { name: "Churna", slug: "churna", img: "/images/churna.webp" },
  { name: "Powder", slug: "powder", img: "/images/power.webp" },
  { name: "Tablet", slug: "tablet", img: "/images/tablet.webp" },
  { name: "Bhasma", slug: "bhasma", img: "/images/bhasma.webp" },
  { name: "Guggul", slug: "guggul", img: "/images/guggul.webp" },
  { name: "Skin Care", slug: "skin-care", img: "/images/Skincare.webp" },
  { name: "Hair Care", slug: "hair-care", img: "/images/Haircare.webp" },
  { name: "Herbal Oil", slug: "herbal-oil", img: "/images/herbal.webp" },
  { name: "Edible Oil", slug: "edible-oil", img: "/images/edible oil.webp" },
  { name: "Exclusive", slug: "exclusive", img: "/images/exclusive.webp" },
];

export default function Products() {
  return (
    <div className="bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 min-h-screen py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">
        Our Ayurvedic Products 🌿
      </h1>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((item, index) => (
          <Link
            key={item.slug}
            to={`/category/${item.slug}`}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer">
              <div className="overflow-hidden rounded-t-2xl">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-40 object-cover group-hover:scale-110 transition duration-300"
                />
              </div>

              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-green-700 group-hover:text-yellow-600">
                  {item.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
