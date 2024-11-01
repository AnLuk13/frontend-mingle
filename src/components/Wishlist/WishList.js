import React, { useState } from "react";
import "./WishList.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUserId,
  selectWishlist,
} from "../../lib/redux/features/sliceSelectors";
import LazyLoad from "react-lazyload";
import ModelViewer from "../ModelViewer/ModelViewer";
import QRCode from "qrcode.react";
import CloseBtn from "../Icons/CloseBtn";

const WishList = ({ handleWishlistToggle }) => {
  const userId = useSelector(selectUserId);
  const wishlist = useSelector(selectWishlist);
  const isEmpty = wishlist.length === 0;
  const [qrModalItem, setQrModalItem] = useState(null);

  const EmptyCart = () => {
    return (
      <div className="empty-cart-container">
        <div>
          <div className="cart-title">Your cart is empty</div>
        </div>
        <div className="go-back-box">
          <Link to="/" className="go-back">
            Go back
          </Link>
        </div>
      </div>
    );
  };

  const FilledWishList = () => {
    return (
      <>
        <div className={"cart-title"}>Your cart</div>
        <div className="wishlist-items">
          {wishlist.map((item, idx) => (
            <LazyLoad key={idx}>
              <ModelViewer
                setQrModalItem={setQrModalItem}
                item={item}
                handleWishlistToggle={handleWishlistToggle}
              />
            </LazyLoad>
          ))}
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
                <button
                  className="close-btn"
                  onClick={() => setQrModalItem(null)}
                >
                  <CloseBtn />
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div style={{ marginTop: 80 }}>
      <div className="cart-container">
        <div className="cart-items-container">
          {userId == null ? (
            <>
              <div className={"cart-title"}>Login first</div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to={"/sign-in"} className="shop-btn">
                  Login
                </Link>
              </div>
            </>
          ) : isEmpty ? (
            <EmptyCart />
          ) : (
            <>
              <FilledWishList />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;
