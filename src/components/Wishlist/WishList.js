import React from "react";
import "./WishList.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUserId,
  selectWishlist,
} from "../../lib/redux/features/sliceSelectors";
import LazyLoad from "react-lazyload";
import ModelViewer from "../ModelViewer/ModelViewer";

const WishList = ({ onRemoveItem }) => {
  const userId = useSelector(selectUserId);
  const wishlist = useSelector(selectWishlist);
  const isEmpty = wishlist.length === 0;

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
                item={item}
                addToWishlist={() => {}}
                removeFromWishlist={onRemoveItem}
              />
            </LazyLoad>
          ))}
        </div>
      </>
    );
  };

  return (
    <div style={{ marginTop: 80 }}>
      <div className="container">
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
