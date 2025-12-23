// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  TestTubeDiagonal,
  Microscope,
  ClipboardList,
} from "lucide-react";
import CartButton from "./CartButton";

interface Product {
  id: number;
  name: string;
  price: string;
  offer_price?: string;
  category_name?: string;
  reported_on?: string;
  description?: string;
  tests?: any[];
  profiles?: any[];
  package_total_test?:number;
  test_count?: any[]
}

interface ProductCardProps {
  product: Product;
  productType: "LabTest" | "Profile" | "Package";
}

// 🎨 Tag + Icon styles
const getTagColor = (type: string) => {
  switch (type) {
    case "LabTest":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Profile":
      return "bg-green-50 text-green-700 border border-green-200";
    case "Package":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "LabTest":
      return <TestTubeDiagonal className="w-8 h-8 text-blue-600" />;
    case "Profile":
      return <Microscope className="w-8 h-8 text-green-600" />;
    case "Package":
      return <ClipboardList className="w-8 h-8 text-orange-600" />;
    default:
      return <TestTubeDiagonal className="w-8 h-8 text-gray-400" />;
  }
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productType,
}) => {
  const { id, name, price, offer_price, category_name, reported_on, test_count, profiles,package_total_test } =
    product;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTagColor(
              productType
            )} group-hover:scale-110 transition-transform duration-300`}
          >
            {getTypeIcon(productType)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getTagColor(
            productType
          )}`}
        >
          {productType}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {category_name && (
          <p className="text-xs text-gray-500 mb-1">
            Category: {category_name}
          </p>
        )}
        {reported_on && (
          <p className="text-xs text-gray-500 mb-2">
            Reported On: {reported_on}
          </p>
        )}
        {profiles && profiles.length > 0 && (
          <p className="text-xs text-gray-500 mb-2">
            Total Profiles: {profiles.length}
          </p>
        )}
        {productType == 'LabTest' && test_count && (
          <p className="text-xs text-gray-500 mb-2">
            Total Tests: {test_count}
          </p>
        )}
        {productType == 'Package' && package_total_test && (
          <p className="text-xs text-gray-500 mb-2">
            Total Tests: {package_total_test}
          </p>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{offer_price || price}
            </span>
            {offer_price && (
              <>
                <span className="text-sm text-rose-600 line-through">₹{price}</span>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Save ₹{Math.round(parseFloat(price) - parseFloat(offer_price))}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/product-details/${productType.toLowerCase()}/${id}`}
            className="
                      flex-1 text-center rounded-lg py-2 text-sm font-medium
                      text-white bg-primary 
                      transition-all
                      hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                      hover:shadow-md
                      active:scale-95
                    "
          >
            View Details
          </Link>

          <CartButton compact productType={productType} productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
