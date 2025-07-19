import React from "react";

function Privacy() {
  return (
    <div
      className="max-w-4xl mx-auto px-2 sm:px-6 py-8 sm:py-12 text-gray-800 bg-white rounded-lg shadow-md"
      style={{ background: "#f9fafb", borderRadius: "1rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
    >
      <h1
        className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900"
        style={{ letterSpacing: "0.02em" }}
      >
        Privacy Policy
      </h1>

      <p className="text-sm sm:text-base text-gray-600">
        <strong>Effective Date:</strong> [10-05-2025]
      </p>

      <p className="mt-4 text-base sm:text-lg leading-relaxed">
        At Invest Mango, we are committed to protecting your privacy and
        ensuring that your personal information is handled safely and
        responsibly. This Privacy Policy outlines how we collect, use, disclose,
        and protect the information you provide to us when you visit our
        website, use our services, or interact with us in any way.
      </p>

      {/* Section 1 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2" style={{marginTop: '2rem'}}>1. Information Collected From Interactive Forms</h2>
      <p className="mt-2 text-base leading-relaxed">
        When you voluntarily send us electronic mail / fillup the form, we will keep a record of this information so that we can respond to you. We only collect information from you when you register on our site or fill out a form. Also, when filling out a form on our site, you may be asked to enter your: name, e-mail address or phone number. You may, however, visit our site anonymously. In case you have submitted your personal information and contact details, we reserve the rights to Call, SMS, Email or WhatsApp about our products and offers, even if your number has DND activated on it.
      </p>

      {/* Section 2 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">2. Information We Collect</h2>
      <p className="mt-2 text-base leading-relaxed">
        We may collect personal information such as your name, email address,
        phone number, location or address, investment preferences, and any other
        information you voluntarily provide via forms, chats, or phone calls. In
        addition, we automatically collect data such as your IP address, browser
        type and version, device information, pages visited, time spent on the
        site, and data collected through cookies and tracking technologies.
      </p>

      {/* Section 3 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">3. How We Use Your Information</h2>
      <p className="mt-2 text-base leading-relaxed">
        Your data is used to provide property recommendations and investment
        options, respond to your inquiries or service requests, send
        newsletters, updates, and promotional offers (only if you have opted
        in), improve website performance and user experience, conduct market
        research and analysis, and comply with legal obligations.
      </p>

      {/* Section 4 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">4. Sharing Your Information</h2>
      <p className="mt-2 text-base leading-relaxed">
        We do not sell your personal information. However, we may share it with
        trusted developers and real estate partners to facilitate property
        inquiries, service providers who support our marketing, data analysis,
        or IT functions, and legal or regulatory authorities when required by
        law or for legal processes.
      </p>

      {/* Section 5 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">5. Data Security</h2>
      <p className="mt-2 text-base leading-relaxed">
        We implement industry-standard security measures to protect your
        information from unauthorized access, alteration, disclosure, or
        destruction. Despite our efforts, no method of online transmission or
        storage is completely secure.
      </p>

      {/* Section 6 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">6. Cookies & Tracking Technologies</h2>
      <p className="mt-2 text-base leading-relaxed">
        We use cookies to understand user behavior, personalize content, and
        enable essential website functionalities. You can manage or disable
        cookies through your browser settings at any time.
      </p>

      {/* Section 7 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">7. Your Rights</h2>
      <p className="mt-2 text-base leading-relaxed">
        You have the right to access, correct, or delete your personal data, opt
        out of marketing communications, and request a copy of the data we hold
        about you. To exercise these rights, please contact us at:
        <a
          href="mailto:info@investmango.com"
          className="text-blue-700 underline ml-1 hover:text-blue-900"
          style={{ wordBreak: "break-all" }}
        >
          info@investmango.com
        </a>
      </p>

      {/* Section 8 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">8. Third Party Links</h2>
      <p className="mt-2 text-base leading-relaxed">
        Our website may include links to third-party websites. We are not
        responsible for the privacy practices or content of those sites.
      </p>

      {/* Section 9 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">9. Children’s Privacy</h2>
      <p className="mt-2 text-base leading-relaxed">
        Our services are not intended for children under the age of 18, and we
        do not knowingly collect personal information from minors.
      </p>

      {/* Section 10 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">10. Changes to this Policy</h2>
      <p className="mt-2 text-base leading-relaxed">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page along with the revised effective date.
      </p>

      {/* Section 11 */}
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-gray-800 border-l-4 border-blue-500 pl-2">11. Contact Us</h2>
      <p className="mt-2 text-base leading-relaxed">
        <strong>Invest Mango</strong>
        <br />
        Email:{" "}
        <a
          href="mailto:info@investmango.com"
          className="text-blue-700 underline hover:text-blue-900"
          style={{ wordBreak: "break-all" }}
        >
          info@investmango.com
        </a>
        <br />
        Website:{" "}
        <a
          href="https://www.investmango.com"
          className="text-blue-700 underline hover:text-blue-900"
          target="_blank"
          rel="noopener noreferrer"
          style={{ wordBreak: "break-all" }}
        >
          https://www.investmango.com
        </a>
      </p>
    </div>
  );
}

export default Privacy;
