import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  TestTubeDiagonal,
  Microscope,
  ClipboardList,
  ArrowLeft,
  Home,
  Clock,
} from "lucide-react";
import { globalApi } from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import CartButton from "../components/CartButton";
import { useToast } from "../context/ToastManager";

// Tag Color
const getTagColor = (type: string) => {
  switch (type) {
    case "labtest":
      return "bg-primary/10 text-primary border border-primary/30";
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
      return <TestTubeDiagonal className="w-12 h-12 text-primary" />;
    case "profile":
      return <Microscope className="w-12 h-12 text-green-600" />;
    case "package":
      return <ClipboardList className="w-12 h-12 text-orange-600" />;
    default:
      return <TestTubeDiagonal className="w-12 h-12 text-gray-400" />;
  }
};

const ProductDetails = () => {
  const { product_type, id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { showToast } = useToast();

  const type = product_type as "labtest" | "profile" | "package";

  const endpointMap = {
    labtest: `client/lab-tests/${id}/`,
    profile: `client/lab-profiles/${id}/`,
    package: `client/lab-packages/${id}/`,
  };

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await globalApi.get(endpointMap[type]);
        setProduct(res);
      } catch (err) {
        showToast("Unable to load product.", "error");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, type]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => window.location.reload()}
      />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* BACK */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary mb-5"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading...</div>
        ) : !product ? (
          <div className="py-20 text-center text-gray-500">Not found</div>
        ) : (
          <>
            {/* =========================== */}
            {/* HEADER SECTION (New Clean Compact Design) */}
            {/* =========================== */}
            <div className="bg-white rounded-xl border shadow-sm p-6 md:p-6 mb-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* LEFT SIDE — ICON + TITLE */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {getTypeIcon(type)}
                  </div>

                  {/* TITLE + TAGS */}
                  <div>
                    <h1 className="text-lg md:text-lg font-bold text-gray-900 leading-snug">
                      {product.name}
                    </h1>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getTagColor(type)}`}
                      >
                        {type}
                      </span>

                      {product.category_name && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                          {product.category_name}
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* RIGHT SIDE — PRICE + ADD BUTTON */}
                <div
                  className="
    w-full md:w-auto 
    bg-gray-50 border rounded-xl p-4 
    flex flex-col items-center md:items-end
    text-center md:text-right
  "
                >
                  {/* PRICE BLOCK */}
                  <div className="flex flex-col items-center md:items-end">

                    <div className="flex flex-wrap justify-center md:justify-end items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.offer_price || product.price}
                      </span>

                      {product.offer_price && (
                        <>
                          <span className="text-gray-500 line-through text-sm">
                            ₹{product.price}
                          </span>

                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            Save ₹
                            {Math.round(
                              parseFloat(product.price) - parseFloat(product.offer_price)
                            )}
                          </span>
                        </>
                      )}
                    </div>

                    {/* BUTTON */}
                    <div className="mt-3 w-full">
                      <CartButton productType={
                        (type === "labtest")
                          ? "LabTest"
                          : type === "profile"
                            ? "Profile"
                            : "Package"
                            } productId={product.id} />
                    </div>


                  </div>
                </div>

              </div>
            </div>


            {/* =========================== */}
            {/* KNOW MORE SECTION */}
            {/* =========================== */}
            <section>
              <div className="rounded-3xl p-6 md:p-6 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-sm">

                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                  Know more about this test
                </h2>

                {/* Description */}
                {product.description && (
                  <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm mb-6 text-gray-700">
                    {product.description}
                  </div>
                )}

                {/* INFO CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  <InfoCard
                    title="Sample Type"
                    value={product.sample_type || "Not specified"}
                    icon={<TestTubeDiagonal className="w-6 h-6 text-primary" />}
                  />

                  <InfoCard
                    title="Preparation"
                    value={product.special_instruction || "No special preparation required."}
                    icon={<Clock className="w-6 h-6 text-primary" />}
                  />

                  <InfoCard
                    title="Method"
                    value={product.method || "—"}
                    icon={<Microscope className="w-6 h-6 text-primary" />}
                  />

                  <InfoCard
                    title="Reported On"
                    value={product.reported_on || "—"}
                    icon={<Clock className="w-6 h-6 text-primary" />}
                  />

                  <InfoCard
                    title="Temperature"
                    value={product.temperature || "—"}
                    icon={<Home className="w-6 h-6 text-primary" />}
                  />

                  <InfoCard
                    title="Who collects sample?"
                    value="Experienced phlebotomist at your home"
                    icon={<Home className="w-6 h-6 text-primary" />}
                  />

                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

const InfoCard = ({ title, value, icon }: any) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

export default ProductDetails;
