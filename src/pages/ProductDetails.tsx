import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  TestTubeDiagonal,
  Microscope,
  ClipboardList,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { globalApi, customerApi } from "../api/axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Product {
  id: number;
  name: string;
  category_name?: string;
  description?: string;
  reported_on?: string;
  method?: string;
  sample_type?: string;
  price: string;
  offer_price?: string;
  is_featured?: boolean;
  tests_included?: { id: number; name: string }[];
}

const getTagColor = (type: string) => {
  switch (type) {
    case "labtest":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "profile":
      return "bg-green-50 text-green-700 border border-green-200";
    case "package":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "labtest":
      return <TestTubeDiagonal className="w-10 h-10 text-blue-600" />;
    case "profile":
      return <Microscope className="w-10 h-10 text-green-600" />;
    case "package":
      return <ClipboardList className="w-10 h-10 text-orange-600" />;
    default:
      return <TestTubeDiagonal className="w-10 h-10 text-gray-400" />;
  }
};

const ProductDetails: React.FC = () => {
  const { product_type, id } = useParams<{ product_type: string; id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const currentType = product_type as "labtest" | "profile" | "package";

  // ✅ Correct endpoint mapping
  const endpointMap: Record<"labtest" | "profile" | "package", string> = {
    labtest: `client/lab-tests/${id}/`,
    profile: `client/lab-profiles/${id}/`,
    package: `client/lab-packages/${id}/`,
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await globalApi.get<Product>(endpointMap[currentType]);
      setProduct(res);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Unable to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product_type && id) fetchProduct();
  }, [product_type, id]);

  // ✅ Add to cart using API directly
  const handleAddToCart = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.info("Please login to add items to your cart.");
      return;
    }

    if (!product) return;

    try {
      await customerApi.post("carts/", {
        product_type:
          currentType === "labtest"
            ? "LabTest"
            : currentType === "profile"
            ? "Profile"
            : "Package",
        product_id: product.id,
      });

      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      console.error("Add to cart failed:", error);
      const msg =
        error.response?.data?.error || "Unable to add item to cart right now.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Catalog
        </button>

        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading...</div>
        ) : !product ? (
          <div className="text-center text-gray-600 py-16">
            Product not found.
          </div>
        ) : (
          <>
            {/* Product Overview */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 md:p-10 mb-10 grid md:grid-cols-2 gap-8">
              {/* Left Info */}
              <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center ${getTagColor(
                      currentType
                    )}`}
                  >
                    {getTypeIcon(currentType)}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getTagColor(
                        currentType
                      )}`}
                    >
                      {currentType}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {product.description || "Detailed information coming soon."}
                </p>

                <div className="text-sm text-gray-600 space-y-1">
                  {product.category_name && (
                    <p>
                      <strong>Category:</strong> {product.category_name}
                    </p>
                  )}
                  {product.reported_on && (
                    <p>
                      <strong>Reported On:</strong> {product.reported_on}
                    </p>
                  )}
                  {product.method && (
                    <p>
                      <strong>Method:</strong> {product.method}
                    </p>
                  )}
                  {product.sample_type && (
                    <p>
                      <strong>Sample Type:</strong> {product.sample_type}
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing / Action */}
              <div className="flex flex-col justify-center bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.offer_price || product.price}
                  </span>
                  {product.offer_price && (
                    <>
                      <span className="text-gray-500 line-through text-lg">
                        ₹{product.price}
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Save ₹
                        {Math.round(
                          parseFloat(product.price) -
                            parseFloat(product.offer_price)
                        )}
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center bg-primary text-white py-3 rounded-lg hover:bg-secondary transition-all font-medium"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Optional Sections */}
            <div className="space-y-8">
              {product.tests_included && product.tests_included.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Tests Included
                  </h2>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {product.tests_included.map((t) => (
                      <li key={t.id}>{t.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Preparation Instructions
                </h2>
                <p className="text-gray-700">
                  Please follow the specific preparation guidelines provided by
                  your doctor or our diagnostic team before sample collection.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Similar Tests
                </h2>
                <p className="text-gray-600">
                  Coming soon — you’ll see related or recommended diagnostics
                  here based on your selection.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
