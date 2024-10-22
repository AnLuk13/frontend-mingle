import React, { useEffect, useState } from "react";
import ModelViewer from "../ModelViewer/ModelViewer"; // Assuming ModelViewer is in the same folder
import "./ProductItem.css";
import QRCode from "qrcode.react";
import { isIOS } from "react-device-detect";
import CloseBtn from "../Icons/CloseBtn";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MoonLoader } from "react-spinners";

const ProductItem = ({ handleWishlistToggle }) => {
  const { id } = useParams();
  const [qrModalItem, setQrModalItem] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/${id}`,
        );
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={"responseScreen"}>
        <MoonLoader color={"black"} size={60} />
      </div>
    );
  }

  if (!item) {
    return <div className={"responseScreen"}>Product not found!</div>;
  }

  return (
    <div className="productItemContainer">
      <div className={"productItem-title"}>{item.name}</div>
      <div className={"modelViewerInfoBox"}>
        <ModelViewer
          item={item}
          handleWishlistToggle={handleWishlistToggle}
          setQrModalItem={setQrModalItem}
        />

        <div className="infoBox">
          <div className={"itemDescription"}>{item.description}</div>
          <div className={"itemText"}>Price: ${item.price}</div>
          <div className={"itemText"}>Category: {item.category}</div>
          <div className={"itemText"}>Color: {item.color}</div>
          <div className={"itemText"}>Stock: {item.stock}</div>
        </div>
      </div>
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
              <CloseBtn color={"#000"} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
