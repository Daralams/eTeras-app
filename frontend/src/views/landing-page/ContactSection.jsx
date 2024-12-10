import axios from "axios";
import React, { useState } from "react";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [messege, setMessege] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const sending = await axios.post(`http://localhost:3000/api/send-email`, {
        name,
        phone,
        email,
        company,
        messege,
      });
      if (sending.status == 201) {
        alert("Success kekirim ngafff");
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  return (
    <section className="py-12 px-6 md:px-12 bg-slate-100">
      <div className="flex flex-col justify-center text-center mb-8">
        <div className="lg:mx-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Contact <span className="text-indigo-600">Us</span>
          </h2>
          <p className="mt-3 text-sm md:text-lg text-gray-600 font-light">
            Your feedback and support mean the world to us as we continue to
            improve and innovate. Whether you have suggestions, questions, or
            just want to say hi, reach out and let us grow together. Be a part
            of shaping the future of our platform!
          </p>
        </div>
      </div>

      <form className="max-w-xl mx-auto space-y-6" onSubmit={sendEmail}>
        <div className="flex flex-col md:flex-row gap-4">
          <label htmlFor="name" className="md:w-1/3 text-gray-700 font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="md:w-2/3 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <label htmlFor="name" className="md:w-1/3 text-gray-700 font-medium">
            Phone Number
          </label>
          <input
            type="number"
            name="phone"
            className="md:w-2/3 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <label htmlFor="email" className="md:w-1/3 text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="md:w-2/3 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <label htmlFor="email" className="md:w-1/3 text-gray-700 font-medium">
            Company
          </label>
          <input
            type="text"
            name="company"
            className="md:w-2/3 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <label
            htmlFor="message"
            className="md:w-1/3 text-gray-700 font-medium"
          >
            Message
          </label>
          <textarea
            name="message"
            className="md:w-2/3 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Message"
            rows="4"
            value={messege}
            onChange={(e) => setMessege(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactSection;
