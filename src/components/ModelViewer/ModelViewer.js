import React, { useRef, useState, useEffect } from "react";
import LazyLoad from "react-lazyload";
import Help from "./Help";
import { useSelector } from "react-redux";
import { selectWishlist } from "../../lib/redux/features/sliceSelectors";
import Select from "react-select";
import { customSelectStylesModelViewer } from "../../lib/consts/selectCustomStyles";
import { Link } from "react-router-dom";

const ModelViewer = ({ item, handleWishlistToggle, setQrModalItem }) => {
  const [display, setDisplay] = useState(false);
  const [ARSupported, setARSupported] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [viewerWidth, setViewerWidth] = useState(420);
  const wishlist = useSelector(selectWishlist);

  const model = useRef();
  const currency = item.currency === "USD" ? "$" : "€";
  const [variants, setVariants] = useState([
    { label: "Default", value: "Default" },
  ]);

  const updateViewerWidth = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 500) {
      setViewerWidth(300);
    } else {
      setViewerWidth(420);
    }
  };

  useEffect(() => {
    updateViewerWidth();
    window.addEventListener("resize", updateViewerWidth);
  }, []);

  const toggle = () => {
    if (!document.fullscreenElement) {
      model.current.requestFullscreen();
    } else if (document.exitFullscreen) document.exitFullscreen();
  };

  const handleAnnotateClick = (annotation) => {
    const { target, position } = annotation;
    model.current.cameraTarget = position;
    model.current.orbit = target;
  };

  useEffect(() => {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      setARSupported(true);
    }
  }, []);

  useEffect(() => {
    const modelViewer = model.current;
    if (modelViewer) {
      modelViewer.addEventListener("load", () => {
        const availableVariants = modelViewer?.availableVariants || [];

        // Only add unique variants
        setVariants((prev) => {
          const newVariants = availableVariants.map((variant) => ({
            label: variant,
            value: variant,
          }));

          // Filter out duplicates
          const uniqueVariants = newVariants.filter(
            (newVar) => !prev.some((prevVar) => prevVar.value === newVar.value),
          );

          return [...prev, ...uniqueVariants];
        });
      });
    }
  }, []);

  useEffect(() => {
    if (wishlist) {
      const isInWishlist = wishlist.some(
        (wishlistItem) => wishlistItem._id === item._id,
      );
      setIsInWishlist(isInWishlist);
    }
  }, [item, wishlist]);

  const handleShowQR = () => {
    setQrModalItem(item);
  };

  const sliceName = (name) => {
    if (name.length > 18) {
      return `${name.slice(0, 18)}...`;
    } else return name;
  };

  return (
    <div className="model-view">
      <model-viewer
        key={item.id}
        ref={model}
        style={{
          background: "#f1efeb",
          boxSizing: "border-box",
          borderRadius: 28,
          width: viewerWidth,
          height: 456,
        }}
        src={`${item.modelSrc}`}
        ios-src={`${item.iOSSrc}`}
        ar
        alt="A 3D model"
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
      >
        {ARSupported && (
          <button slot="ar-button" className="arbutton">
            View live AR
          </button>
        )}

        <button className="fullscreen-btn" onClick={toggle}>
          &#x26F6;<span>full screen</span>
        </button>

        {display ? (
          <>
            <button
              className={document.fullscreenElement ? "close fz" : "close"}
              onClick={() => setDisplay(false)}
            >
              &#10006;
            </button>
            <Help />
          </>
        ) : (
          <button className="help-btn" onClick={() => setDisplay(true)}>
            ?<span>help</span>
          </button>
        )}

        <button
          className="annotate-btn"
          onClick={() => setAnnotate((prevState) => !prevState)}
        >
          i
        </button>

        {annotate &&
          item.annotations.map((annotate, idx) => (
            <button
              key={idx}
              className="Hotspot"
              slot={annotate.slot}
              data-position={annotate.position}
              data-normal={annotate.normal}
              data-orbit={annotate.orbit}
              data-target={annotate.target}
              data-visibility-attribute="visible"
              onClick={() => handleAnnotateClick(annotate)}
            >
              <div className="HotspotAnnotation">{annotate.title}</div>
            </button>
          ))}

        <div className="controls variant_div">
          <Select
            styles={customSelectStylesModelViewer}
            options={variants}
            placeholder="Select..."
            onChange={(option) => (model.current.variantName = option.value)}
          />
        </div>
      </model-viewer>

      <LazyLoad>
        <div className="qr-sec">
          <div className="product-details">
            <div className="product-detailsBox">
              <Link to={`/products/${item._id}`} className="pname">
                {sliceName(item.name)}
              </Link>
              <div className="priceCurrency">
                {item.discount ? (
                  <>
                    <span className="originalPrice">{`${
                      item.price + 20
                    }${currency}`}</span>
                    <span className="priceCurrency">{`${item.price}${currency}`}</span>
                  </>
                ) : (
                  `${item.price}${currency}`
                )}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {!ARSupported && (
                <button className="show-qr-btn" onClick={handleShowQR}>
                  Show QR
                </button>
              )}
              <button
                className="add-icon"
                onClick={() => handleWishlistToggle(item)}
              >
                <div style={{ fontSize: 35, boxSizing: "border-box" }}>
                  {isInWishlist ? "-" : "+"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </LazyLoad>
    </div>
  );
};

export default ModelViewer;
