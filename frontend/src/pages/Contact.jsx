import React from 'react';
import Navbar from '../components/Navbar';   // adjust path if needed
import Footer from '../components/Footer';   // make sure Footer exists
import ContactUs from '../components/ContactUs';

const Contact = () => {
  return (
    <div>
      <Navbar />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Contact;
