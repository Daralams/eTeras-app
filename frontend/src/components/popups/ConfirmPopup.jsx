import React, { useState } from "react";
import { LuAlertTriangle } from "react-icons/lu";
import PopupSuccess from "./PopupSuccess";

const ConfirmPopup = ({
  title,
  message,
  onConfirmDelete,
  onCloseConfirmBox,
}) => {
  const deleteItem = () => {
    onConfirmDelete();
    onCloseConfirmBox();
  };

  return (
    <>
      <style>
        {`
          /* Modal fade-in effect */
          .fade-in {
            opacity: 0;
            animation: fadeIn 0.3s forwards;
          }

          .fade-out {
            opacity: 1;
            animation: fadeOut 0.3s forwards;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
      </style>
      <>
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity duration-300"
          aria-hidden="true"
          onClick={onCloseConfirmBox}
        ></div>

        {/* Modal */}
        <div
          className="fixed z-10 inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white rounded-lg shadow-xl transform transition-all w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 fade-in">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 sm:mb-0">
                <LuAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-center sm:text-left sm:ml-4">
                <h3
                  className="text-lg font-medium text-gray-900"
                  id="modal-headline"
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{message}</p>
              </div>
            </div>
            <div className="mt-5 sm:flex sm:flex-row-reverse">
              <button
                onClick={deleteItem}
                className="w-full sm:w-auto inline-flex justify-center rounded-md px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-300"
              >
                Delete
              </button>
              <button
                onClick={onCloseConfirmBox}
                className="mt-3 w-full sm:w-auto inline-flex justify-center rounded-md px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ConfirmPopup;
