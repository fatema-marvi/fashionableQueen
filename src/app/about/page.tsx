import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Fashionable Queen</h1>

      {/* About Content */}
      <div className="text-lg text-gray-700">
        <p>
          Welcome to <strong>Fashionable Queen  </strong>, where we bring you the best in quality fashion
          for  women. We specialize in offering both stitched and unstitched garments that are
          designed to fit your unique style. Whether you are looking for trendy apparel or comfortable
          essentials, we have something for everyone.
        </p>

        <p className="mt-4">
          In addition to clothing, we also provide a range of fashion accessories, including stylish
          bags and premium-quality bedsheets. We are committed to offering only the best products at
          affordable prices, ensuring that our customers always feel satisfied with their purchases.
        </p>

        <p className="mt-4">
          Thank you for choosing <strong>Fashionable Queen</strong> — where quality meets style.
        </p>
      </div>

      {/* Social Media Links */}
      <div className="mt-10 text-center">
        <p className="text-xl text-gray-800">Follow us on:</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://www.facebook.com/share/1BRSci1zDF" // Replace with your Facebook page link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faFacebookF} size="2x" />
          </a>

          <a
            href="https://wa.me/c/923232979158" // Replace with your WhatsApp link
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700"
          >
            <FontAwesomeIcon icon={faWhatsapp} size="2x" />
          </a>

          {/* <a
            href="https://www.instagram.com/fabscollection2020" // Replace with your Instagram link
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
