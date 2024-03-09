'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);

      // Send form data to backend API route
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        body: formDataToSend, // Use FormData instead of JSON.stringify
      });

      if (response.ok) {
        // Close the modal after successful submission
        closeModal();
        // Display a confirmation message to the user
        alert("Thank you for contacting us! We'll reply to you at the earliest.");
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // You can display an error message to the user if needed
      alert('Oops! Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <button onClick={openModal}>Contact Form</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit">Submit</button>
          <button onClick={closeModal}>Close</button>
        </form>
      </Modal>
    </>
  );
};

export default ContactForm;
