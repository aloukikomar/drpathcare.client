import PolicyPage from "../../pages/PolicyPage";

const Refund = () => {
  return (
    <PolicyPage
      title="Refund Policy"
      content={
        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Last Updated */}
          <p className="text-sm text-gray-500">
            <strong className="text-gray-700">Last Updated:</strong> 26-Oct-2025
          </p>

          {/* Intro */}
          <p>
            At <strong>DrPathCare</strong>, we strive to provide accurate and 
            reliable diagnostic services. If any issue arises with your booking, 
            sample collection, or payment, this Refund Policy outlines the conditions 
            under which refunds may be granted.
          </p>

          {/* 1. Eligibility for Refund */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              1. Eligibility for Refund
            </h3>

            <p className="font-medium text-gray-900">a) Test Not Performed</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The sample was not collected.</li>
              <li>The test could not be performed due to technical issues.</li>
              <li>The booking was cancelled by DrPathCare.</li>
            </ul>

            <p className="font-medium text-gray-900 mt-3">b) Duplicate Payment</p>
            <p>If you were charged more than once for the same booking, the extra amount will be refunded.</p>

            <p className="font-medium text-gray-900 mt-3">c) Test Cancelled by Customer</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Before sample collection → 100% refund</strong></li>
              <li>
                <strong>After collection but before processing → Partial refund</strong> 
                (sample collection/visit charges may apply)
              </li>
              <li><strong>After testing has started → No refund</strong></li>
            </ul>

            <p className="font-medium text-gray-900 mt-3">d) Wrong Test Booked</p>
            <p>
              You may request cancellation or modification before sample collection 
              for a full refund.
            </p>
          </section>

          {/* 2. Non-Refundable Conditions */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              2. Non-Refundable Conditions
            </h3>

            <p>A refund will <strong>not</strong> be issued if:</p>

            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The sample is rejected due to fasting or preparation issues.</li>
              <li>Incorrect address or contact information was provided.</li>
              <li>Report delivery is delayed due to QC re-runs or medical reasons.</li>
              <li>The sample is already processed or the report is delivered.</li>
            </ul>
          </section>

          {/* 3. Refund Method */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              3. Refund Method
            </h3>

            <p>Refunds will be issued to the original mode of payment:</p>

            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>UPI</li>
              <li>Wallet</li>
              <li>Net Banking</li>
              <li>Debit/Credit Card</li>
            </ul>

            <p className="mt-2">
              For cash payments, refunds will be completed through a bank transfer.
            </p>
          </section>

          {/* 4. Refund Timeline */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              4. Refund Timeline
            </h3>

            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Online payments:</strong> 3–5 working days</li>
              <li><strong>Bank transfers:</strong> 5–7 working days</li>
            </ul>

            <p className="mt-2">
              Processing times may vary depending on your bank or payment provider.
            </p>
          </section>

          {/* 5. How to Request a Refund */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              5. How to Request a Refund
            </h3>

            <p>You can request a refund through:</p>

            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Email: <strong>info@drpathcare.com</strong></li>
              <li>Phone: <strong>0120-4207810</strong></li>
              <li>WhatsApp (your booking number)</li>
            </ul>

            <p className="mt-2">Please include:</p>

            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Booking ID / Order ID</li>
              <li>Payment receipt</li>
              <li>Reason for refund</li>
            </ul>
          </section>

          {/* 6. Contact Information */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              6. Contact Us
            </h3>

            <div className="space-y-1">
              <p><strong>DrPathCare (Routine Path Lab Pvt. Ltd.)</strong></p>
              <p>Email: info@drpathcare.com</p>
              <p>Phone: 0120-4207810</p>
              <p>Website: www.drpathcare.com</p>
              <p>Address: E-113, Second Floor, Sector-6, Noida-201301</p>
            </div>
          </section>

        </div>
      }
    />
  );
};

export default Refund;
