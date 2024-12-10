import React from "react";
import smartphone from "../../../public/assets/smartphone.png";
import devices from "../../../public/assets/devices.png";

const ContentSection = () => {
  return (
    <>
      <section className="flex gap-4 flex-col-reverse md:flex-row items-center justify-between py-12 px-6 md:px-12 mb-4">
        <div className="text-center md:text-left md:w-1/2 p-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            "Your World, Your Story, Your{" "}
            <span className="text-indigo-600">Way!</span>"
          </h2>
          <p className="text-sm md:text-lg text-gray-600 mb-6">
            Step into a platform where your voice matters. Chat seamlessly with
            friends, share your thoughts through posts, engage in lively
            discussions with comments, and showcase your unique personality with
            a custom profile. Everything you need to express, connect, and
            thrive is right here—designed just for you!
          </p>
        </div>

        <div className="flex justify-end md:w-1/2 cursor-pointer">
          <img src={smartphone} alt="smartphone mockup" className="mx-auto" />
        </div>
      </section>
      <section className="flex gap-4 flex-col-reverse md:flex-row items-center justify-between py-12 px-6 md:px-12 bg-slate-200">
        <div className="flex justify-end md:w-1/2 bg-white py-4 shadow-lg rounded-xl cursor-pointer">
          <img src={devices} alt="Devices" className="md:w-3/4 mx-auto " />
        </div>
        <div className="text-center md:text-left md:w-1/2 p-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            "Designed for every <span className="text-indigo-600">screen</span>"
          </h2>
          <p className="text-sm md:text-lg text-gray-600 mb-6">
            Our platform adapts seamlessly, perfectly crafted for any device,
            anytime, anywhere!
          </p>
        </div>
      </section>
    </>
  );
};

export default ContentSection;
