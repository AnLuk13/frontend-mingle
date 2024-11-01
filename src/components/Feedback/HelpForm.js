import React, { useState } from "react";
import "./HelpForm.css";
import emailjs from "emailjs-com"; // Asigură-te că ai instalat EmailJS: npm install emailjs-com

const HelpForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "YOUR_SERVICE_ID", // ID-ul serviciului din EmailJS
        "YOUR_TEMPLATE_ID", // ID-ul șablonului din EmailJS
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "YOUR_USER_ID", // ID-ul tău de utilizator din EmailJS
      )
      .then(
        (result) => {
          console.log("Mesaj trimis:", result.text);
          alert("Mesajul tău a fost trimis cu succes!");
        },
        (error) => {
          console.log("Eroare la trimiterea mesajului:", error.text);
          alert("A apărut o eroare. Te rugăm să încerci din nou.");
        },
      );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="help-container">
        <h2>Asistență Personalizată</h2>
        <form className="help-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nume:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="subject">Subiect:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Mesaj:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Trimite</button>
        </form>
      </div>
    </div>
  );
};

export default HelpForm;
