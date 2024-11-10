import React, { useEffect, useState } from "react";

const PopupSuccess = ({ state, title, message, onClose }) => {
  const [hiddenPopup, setHiddenPopup] = useState(!state);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state) {
      setHiddenPopup(false);
      setProgress(0);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        closePopUp();
      }, 5000);

      // Update progress every 50 ms
      const interval = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 50);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [state]);

  const closePopUp = () => {
    setHiddenPopup(true);
    onClose();
  };

  return (
    <>
      {!hiddenPopup && (
        <div
          role="alert"
          className="fixed top-4 right-4 z-50 rounded-xl border border-gray-100 bg-white p-4 shadow-lg transition-transform duration-300 ease-out transform scale-100 opacity-100"
          style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
        >
          <div className="flex items-start gap-4">
            <span className="text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>

            <div className="flex-1">
              <strong className="block font-medium text-gray-900">
                {title}
              </strong>

              <p className="mt-1 text-sm text-gray-700">{message}</p>
            </div>

            <button
              className="text-gray-500 transition hover:text-gray-600"
              onClick={closePopUp}
            >
              <span className="sr-only">Dismiss popup</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Progress Bar */}
          <div className="relative mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PopupSuccess;
