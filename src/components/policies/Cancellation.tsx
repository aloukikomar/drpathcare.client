import PolicyPage from "../../pages/PolicyPage";

const Cancellation = () => {
  return (
    <PolicyPage
      title="Cancellation Policy"
      content={
        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Last Updated */}
          <p className="text-sm text-gray-500">
            <strong className="text-gray-700">Last Updated:</strong> 26-Oct-2025
          </p>

          {/* Intro */}
          <p>
            At <strong>DrPathCare</strong>, we understand that plans can change.
            This Cancellation Policy ensures transparency and helps you understand
            your options when modifying or cancelling a booking.
          </p>

          {/* 1. Cancellation by Customer */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              1. Cancellation by Customer
            </h3>

            {/* a */}
            <p className="font-medium text-gray-900">a) Before Sample Collection</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>100% cancellation allowed.</li>
              <li>Full refund for online payments.</li>
            </ul>

            {/* b */}
            <p className="font-medium text-gray-900 mt-3">
              b) After Sample Collection but Before Processing
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Partial refund may be issued.</li>
              <li>Sample collection/visit charges may be deducted.</li>
            </ul>

            {/* c */}
            <p className="font-medium text-gray-900 mt-3">c) After Test Processing Has Started</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cancellation is not allowed.</li>
              <li>No refund will be provided.</li>
              <li>
                If cancelled after the phlebotomist arrives, a{" "}
                <strong>₹200 conveyance charge</strong> applies.
              </li>
            </ul>

            {/* d */}
            <p className="font-medium text-gray-900 mt-3">d) Wrong Test Booked</p>
            <p>You may modify or cancel the booking <strong>before sample collection</strong> at no extra charge.</p>
          </section>

          {/* 2. Cancellation by DrPathCare */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              2. Cancellation by DrPathCare
            </h3>
            <p>We may cancel your booking due to:</p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Incorrect or invalid customer details.</li>
              <li>Unavailability of phlebotomist.</li>
              <li>Technical or sample-related issues.</li>
              <li>Unsafe or unreachable collection location.</li>
            </ul>

            <p className="mt-2">
              In such cases, you will be informed immediately and offered a{" "}
              <strong>full refund</strong>.
            </p>
          </section>

          {/* 3. How to Request */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              3. How to Request a Cancellation
            </h3>
            <p>Please contact us through any of the following:</p>

            <ul className="list-disc pl-6 space-y-1">
              <li>Email: <strong>info@drpathcare.com</strong></li>
            <li>Phone: <strong>0120-4207810</strong></li>
            <li>WhatsApp: <strong>918505805058</strong></li>
            </ul>

            <p className="mt-2">Please share:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Booking ID / Order ID</li>
              <li>Registered mobile number</li>
              <li>Reason for cancellation</li>
            </ul>
          </section>

          {/* 4. Refund */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              4. Refund for Cancellations
            </h3>
            <p>
              Refunds are processed according to our Refund Policy. Standard processing
              time is <strong>3–7 working days</strong>.
            </p>
          </section>

          {/* 5. Important Notes */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              5. Important Notes
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Refunds are issued only to the original payment method.</li>
              <li>Cash payments are refunded via bank transfer.</li>
              <li>No refund is provided for customer-caused delays (wrong address, no response, etc.).</li>
            </ul>
          </section>

          {/* 6. Contact */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">6. Contact Us</h3>
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

export default Cancellation;
