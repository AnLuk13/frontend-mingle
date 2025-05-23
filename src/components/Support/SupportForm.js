import React, { useState } from "react";
import "./SupportForm.css";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await emailjs.send(
        "",
        "",
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "",
      );

      console.log("Message sent:", result.text);
      toast.success("Your message has been sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending a message!");
    }
  };

  return (
    <main className="main-supportForm_container">
      <div className="supportForm-title" style={{ textAlign: "center" }}>
        support Form
      </div>
      <form onSubmit={handleSubmit} className="supportForm-container">
        <div className="input-div">
          <label className="input-label" htmlFor="name">
            Name
          </label>
          <input
            className="supportForm-inputCustom"
            name="name"
            id="name"
            type="text"
            placeholder="Enter your name"
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div className="input-div">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            className="supportForm-inputCustom"
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        <div className="input-div">
          <label className="input-label" htmlFor="subject">
            Subject
          </label>
          <input
            className="supportForm-inputCustom"
            name="subject"
            id="subject"
            type="text"
            placeholder="Enter the subject"
            onChange={handleChange}
            value={formData.subject}
          />
        </div>

        <div className="input-div">
          <label htmlFor="message" className="input-label">
            Message
          </label>
          <textarea
            className="supportForm-inputCustom supportFormTextArea"
            name="message"
            id="message"
            placeholder="Enter your message"
            onChange={handleChange}
            value={formData.message}
          />
        </div>

        <button className="supportForm-button">Send Message</button>
      </form>
    </main>
  );
};

export default SupportForm;
