import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProductsDetails } from "../../lib/redux/features/productsSlice";
import ModelViewer from "../ModelViewer/ModelViewer";
import "./ProductList.css";
import LazyLoad from "react-lazyload";
import { MoonLoader } from "react-spinners";
import QRCode from "qrcode.react";
import CloseBtn from "../Icons/CloseBtn";
import { isIOS } from "react-device-detect";
import Select from "react-select";
import { sortOptions } from "../../lib/consts/consts";
import { customSelectStyles } from "../../lib/consts/selectCustomStyles";

const ProductList = ({ handleWishlistToggle }) => {
  const productsDetails = useSelector(selectProductsDetails);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [qrModalItem, setQrModalItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    if (productsDetails?.items?.length) {
      setFilteredProducts(productsDetails.items);
      setCategories([
        { label: "All", value: "All" },
        ...Array.from(
          new Set(productsDetails.items.map((product) => product.category)),
        ).map((category) => ({ label: category, value: category })),
      ]);
    }
  }, [productsDetails?.items]);

  const handleCategoryChange = (selectedOption) => {
    let products = productsDetails.items;
    if (selectedOption.value !== "All") {
      products = products.filter(
        (product) => product.category === selectedOption.value,
      );
    }
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  };

  const handleSort = (selectedOption) => {
    const sortedProducts = [...filteredProducts];
    switch (selectedOption.value) {
      case "A-Z":
        setFilteredProducts(
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name)),
        );
        break;
      case "Z-A":
        setFilteredProducts(
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name)),
        );
        break;
      case "low-to-high":
        setFilteredProducts(sortedProducts.sort((a, b) => a.price - b.price));
        break;
      case "high-to-low":
        setFilteredProducts(sortedProducts.sort((a, b) => b.price - a.price));
        break;
      default:
        break;
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = productsDetails.items.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) &&
        (categories.find((cat) => cat.label === "All") ||
          product.category === categories.find((cat) => cat.value)?.value),
    );
    setFilteredProducts(filtered); // Apply search query to the product list
  };

  if (productsDetails?.status === "loading") {
    return (
      <div className={"responseScreen"}>
        <MoonLoader color={"black"} size={60} />
      </div>
    );
  }

  if (productsDetails?.status === "failed") {
    return (
      <div className={"responseScreen"}>
        <div style={{ fontSize: 35, fontWeight: "bold" }}>
          {productsDetails.error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 80 }}>
      <div className="title-btns-container">
        <div className={"collection-title"}>Collection</div>
        <div className="filter-sort-btns">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <Select
            styles={customSelectStyles}
            options={categories}
            placeholder="Categories"
            onChange={handleCategoryChange}
            defaultValue={{ value: "All", label: "All" }}
          />
          <Select
            styles={customSelectStyles}
            options={sortOptions}
            placeholder="Sort by"
            onChange={handleSort}
            defaultValue={{ label: "A-Z", value: "A-Z" }}
          />
        </div>
      </div>

      <section className="list-view">
        {filteredProducts.map((item, idx) => (
          <LazyLoad key={idx}>
            <ModelViewer
              item={item}
              handleWishlistToggle={handleWishlistToggle}
              setQrModalItem={setQrModalItem}
            />
          </LazyLoad>
        ))}
      </section>
      {qrModalItem && (
        <div className="modal-overlay" onClick={() => setQrModalItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>QR Code for {qrModalItem.name}</h3>
            <QRCode
              id={qrModalItem.name}
              value={`${process.env.REACT_APP_BASE_URL}/products/${qrModalItem._id}`}
              size={300}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin
            />
            <button className="close-btn" onClick={() => setQrModalItem(null)}>
              <CloseBtn />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
