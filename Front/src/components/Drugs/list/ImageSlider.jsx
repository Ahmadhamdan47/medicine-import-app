import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import "./ImageSlider.css";

const ImageSlider = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [pinchDistance, setPinchDistance] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isModalOpen) {
        if (event.key === "ArrowRight") {
          handleNextSlide();
        } else if (event.key === "ArrowLeft") {
          handlePrevSlide();
        }
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        const x1 = event.touches[0].clientX;
        const y1 = event.touches[0].clientY;
        const x2 = event.touches[1].clientX;
        const y2 = event.touches[1].clientY;

        setPinchDistance(Math.hypot(x2 - x1, y2 - y1));
      } else {
        setTouchStartX(event.touches[0].clientX);
        setTouchStartY(event.touches[0].clientY);
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length === 2) {
        const x1 = event.touches[0].clientX;
        const y1 = event.touches[0].clientY;
        const x2 = event.touches[1].clientX;
        const y2 = event.touches[1].clientY;

        const newPinchDistance = Math.hypot(x2 - x1, y2 - y1);
        const pinchDelta = newPinchDistance - pinchDistance;

        setPinchDistance(newPinchDistance);

        setZoomLevel((prevZoom) => {
          const newZoom = prevZoom + pinchDelta / 100;
          return Math.min(Math.max(newZoom, 1), 3); // Adjust the maximum zoom level
        });
      } else {
        const touchDeltaX = event.touches[0].clientX - touchStartX;
        const touchDeltaY = event.touches[0].clientY - touchStartY;

        if (Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
          // Horizontal swipe, handle as navigation
          if (touchDeltaX > 50) {
            handlePrevSlide();
          } else if (touchDeltaX < -50) {
            handleNextSlide();
          }
        } else {
          // Vertical swipe, handle as zoom or pan
          // Implement panning here
        }
      }
    };

    const handleTouchEnd = () => {
      // Reset pinch-related state
      setPinchDistance(0);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isModalOpen, touchStartX, touchStartY, pinchDistance]);

  const openModal = (index) => {
    setCurrentSlide(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset zoom level when closing modal
    setZoomLevel(1);
  };

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("overlay")) {
      closeModal();
    }
  };

  const openFullScreen = () => {
    const imageElement = document.getElementById("fullscreen-image");
    if (imageElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.style.backgroundColor = "";
        imageElement.requestFullscreen();
      }
    }
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + images.length) % images.length
    );
  };

  return (
    <div className="image-slider-container flex flex-col w-full justify-center">
      <Carousel
        showArrows
        showStatus={false}
        showThumbs
        infiniteLoop
        width="100%"
        autoPlay={false}
        onClickItem={(index) => openModal(index)}
        selectedItem={currentSlide}
        className="carousel-wrapper flex flex-col justify-center items-center rounded-xl border border-black-text dark:border-green-pri"
      >
        {images.map((image, index) => (
          <div key={index} className="carousel-slide mb-[-1em]">
            <img
              src={image.imageUrl}
              alt={`Medicine Image ${index + 1}`}
              className="carousel-image"
            />
          </div>
        ))}
      </Carousel>

      {isModalOpen && (
        <div
          onClick={handleOverlayClick}
          className="overlay p-4 lg:pt-16 fixed inset-0 z-50 flex items-center justify-center bg-black-bg bg-opacity-60 overflow-hidden"
        >
          <div className="relative bg-white-bg dark:bg-black-contents max-w-screen-2xl mx-auto rounded-lg overflow-hidden shadow-lg cursor-pointer">
            <div className="text-center p-4 relative">
              <span
                className="absolute top-0 right-2 text-green-pri hover:text-green-sec text-3xl cursor-pointer"
                onClick={closeModal}
              >
                &times;
              </span>
              <img
                id="fullscreen-image"
                src={images[currentSlide].imageUrl}
                alt={`Preview Image ${currentSlide + 1}`}
                className="object-contain cursor-pointer"
                onClick={openFullScreen}
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
            <button
              className="absolute top-1/2 transform -translate-y-1/2 left-2 text-4xl lg:text-6xl text-green-pri cursor-pointer"
              onClick={handlePrevSlide}
            >
              {"<"}
            </button>
            <button
              className="absolute top-1/2 transform -translate-y-1/2 right-2 text-4xl lg:text-6xl text-green-pri cursor-pointer"
              onClick={handleNextSlide}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
