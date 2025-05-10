import React from 'react';

function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p><strong>Effective Date:</strong> [10-05-2025]</p>

      <p className="mt-4">
        Invest Mango is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your data.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <ul className="list-disc list-inside">
        <li><strong>Personal Information:</strong> Name, phone number, email address, location, etc.</li>
        <li><strong>Property Preferences:</strong> Budget, location, configuration, etc.</li>
        <li><strong>Usage Data:</strong> Device, browser, session activity, etc.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p>To respond to inquiries, send updates, and improve services. To comply with legal obligations.</p>

      <h2 className="text-xl font-semibold mt-6">3. Cookies & Tracking</h2>
      <p>We use cookies and tracking tools like Google Analytics and Meta Pixel for performance and advertising.</p>

      <h2 className="text-xl font-semibold mt-6">4. Data Sharing & Disclosure</h2>
      <p>We do not sell data. We may share data with service providers, developers, and authorities under legal obligations.</p>

      <h2 className="text-xl font-semibold mt-6">5. Data Retention</h2>
      <p>We retain data as long as necessary or required by law.</p>

      <h2 className="text-xl font-semibold mt-6">6. Data Security</h2>
      <p>We use appropriate security measures to protect your data.</p>

      <h2 className="text-xl font-semibold mt-6">7. User Rights</h2>
      <p>You may request access, correction, or deletion of your data by contacting us.</p>

      <h2 className="text-xl font-semibold mt-6">8. Children’s Privacy</h2>
      <p>This website is not intended for users under 18 years of age.</p>

      <h2 className="text-xl font-semibold mt-6">9. Changes to this Policy</h2>
      <p>We may update this Policy. Changes will be posted with a revised “Effective Date.”</p>

      <h2 className="text-xl font-semibold mt-6">10. Contact Us</h2>
      <p>
        <strong>Invest Mango</strong><br />
        Email: <a href="mailto:contact@investmango.com" className="text-blue-600 underline">contact@investmango.com</a><br />
        Website: <a href="https://www.investmango.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.investmango.com</a>
      </p>
    </div>
  );
}

export default Privacy;
