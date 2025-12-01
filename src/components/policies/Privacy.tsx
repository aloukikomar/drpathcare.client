import PolicyPage from "../../pages/PolicyPage";

const Privacy = () => {
  return (
    <PolicyPage
      title="Privacy Policy"
      content={
        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Last Updated */}
          <p className="text-sm text-gray-500">
            <strong className="text-gray-700">Last Updated:</strong> 26-Oct-2025
          </p>

          {/* Intro */}
          <p>
            <strong>DrPathCare</strong> (Routine Path Lab Private Limited) is committed
            to protecting your personal information and maintaining complete transparency
            in how your data is collected, used, and secured.
          </p>

          <p>
            By accessing our website, mobile applications, or using our home sample
            collection services, you agree to the practices described in this Privacy Policy.
          </p>

          {/* 1. Information We Collect */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              1. Information We Collect
            </h3>

            <p className="font-medium text-gray-900">a) Personal Information</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full Name</li>
              <li>Mobile Number</li>
              <li>Email Address</li>
              <li>Home Collection Address</li>
              <li>Age / Gender</li>
              <li>Government ID (if required for verification)</li>
            </ul>

            <p className="font-medium text-gray-900 mt-3">b) Health Information</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Medical test requests</li>
              <li>Test reports</li>
              <li>Doctor prescriptions (if uploaded)</li>
            </ul>

            <p className="font-medium text-gray-900 mt-3">c) Payment Information</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Transaction details (UPI / Wallet / Bank transfer)</li>
              <li>We <strong>do not store card details</strong> on our servers.</li>
            </ul>

            <p className="font-medium text-gray-900 mt-3">d) Technical Information</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Cookies & usage analytics</li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              2. How We Use Your Information
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Booking & scheduling tests</li>
              <li>Home sample collection</li>
              <li>Generating & delivering reports</li>
              <li>Customer support & follow-up</li>
              <li>Billing and payment confirmations</li>
              <li>Improving our website and user experience</li>
              <li>Ensuring legal and regulatory compliance</li>
            </ul>
          </section>

          {/* 3. How We Share Your Information */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              3. How We Share Your Information
            </h3>

            <p>We do <strong>not</strong> sell your personal information to anyone.</p>

            <p className="mt-2">Information may be shared only with:</p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Authorized phlebotomists</li>
              <li>NABL / partner laboratories</li>
              <li>Payment gateway processors</li>
              <li>Government authorities (if legally required)</li>
              <li>SMS / Email / WhatsApp service providers</li>
            </ul>

            <p className="mt-2">
              All partners follow strict confidentiality and data protection standards.
            </p>
          </section>

          {/* 4. Data Security */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              4. How We Store & Protect Your Data
            </h3>
            <p>
              All data and reports are stored on secure, encrypted servers with access
              restricted to authorized personnel only. Medical information is handled in
              full compliance with Indian health data security regulations.
            </p>
          </section>

          {/* 5. Cookies */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">5. Cookies</h3>
            <p>We use cookies to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Enhance website usability</li>
              <li>Improve login and navigation</li>
              <li>Analyze performance & traffic</li>
            </ul>
            <p className="mt-2">
              You may disable cookies through your browser settings.
            </p>
          </section>

          {/* 6. User Rights */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">6. Your Rights</h3>
            <p>You may request to:</p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Update or correct inaccurate information</li>
              <li>Request deletion (post mandatory retention period)</li>
              <li>Withdraw consent at any time</li>
              <li>Ask how your data is used or processed</li>
            </ul>

            <p className="mt-2">
              Contact: <strong>info@drpathcare.com</strong>  
              <br /> Phone: <strong>0120-4207810</strong>
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">7. Data Retention</h3>
            <p>
              Test records & reports are stored for a minimum of 
              <strong> 3 years</strong> as per medical guidelines.  
              After this period, you may request deletion.
            </p>
          </section>

          {/* 8. Third-Party Links */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">8. Third-Party Links</h3>
            <p>
              Our website may include links to external websites. We are not responsible
              for their privacy practices or content.
            </p>
          </section>

          {/* 9. Updates */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">9. Updates to This Policy</h3>
            <p>
              This Privacy Policy may be updated periodically. Any changes will be posted
              on this page with a revised "Last Updated" date.
            </p>
          </section>

          {/* 10. Contact Info */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">10. Contact Information</h3>

            <div className="space-y-1">
              <p><strong>DrPathCare (Routine Path Lab Pvt. Ltd.)</strong></p>
              <p>Email: info@drpathcare.com</p>
              <p>Phone: 0120-4207810</p>
              <p>Website: www.drpathcare.com</p>
              <p>Address: E-113, Second Floor, Sector-6, Noida-201301</p>
            </div>
          </section>

          {/* 11. Identity & Fraud Awareness */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              11. Privacy Policy – Identity & Fraud Awareness
            </h3>

            <p>
              Several companies may operate with names similar to ours. We are not liable 
              for fraud, miscommunication, or losses caused by third parties misusing 
              similar identities.
            </p>

            <p className="mt-2">
              Please verify that you are interacting only with 
              <strong> official DrPathCare representatives</strong> before sharing
              personal information or making payments.
            </p>
          </section>

        </div>
      }
    />
  );
};

export default Privacy;
