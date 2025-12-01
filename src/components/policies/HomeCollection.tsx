import PolicyPage from "../../pages/PolicyPage";

const HomeCollection = () => {
  return (
    <PolicyPage
      title="Home Sample Collection Policy"
      content={
        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Last Updated */}
          <p className="text-sm text-gray-500">
            <strong className="text-gray-700">Last Updated:</strong> 26-Oct-2025
          </p>

          {/* Intro */}
          <p>
            <strong>DrPathCare</strong> is committed to offering safe, convenient,
            and professional home sample collection services across our service areas.
            This policy outlines the procedures, responsibilities, and guidelines
            for customers and phlebotomists during home collection appointments.
          </p>

          {/* 1. Booking */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              1. Booking a Home Collection Appointment
            </h3>

            <p>You can book home sample collection through:</p>

            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Website: <strong>www.drpathcare.com</strong></li>
              <li>Customer Care: <strong>0120-4207810</strong></li>
              <li>WhatsApp / SMS booking</li>
              <li>Partner clinics or authorized phlebotomists</li>
            </ul>

            <p className="mt-3 font-medium text-gray-900">Required details at the time of booking:</p>

            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Full name</li>
              <li>Mobile number</li>
              <li>Complete address with landmark</li>
              <li>Preferred date & time</li>
              <li>Test details</li>
              <li>Fasting requirement confirmation (if applicable)</li>
            </ul>
          </section>

          {/* 2. Confirmation */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              2. Appointment Confirmation
            </h3>

            <ul className="list-disc pl-6 space-y-1">
              <li>You will receive a confirmation message / WhatsApp with booking ID.</li>
              <li>A phlebotomist will be assigned.</li>
              <li>You may receive a pre-visit call for address verification & fasting instructions.</li>
              <li>
                If our calls are marked as spam or blocked, the customer must call back or 
                share an alternate number.
              </li>
            </ul>
          </section>

          {/* 3. Home Visit */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              3. Home Visit & Sample Collection
            </h3>

            <p className="font-medium text-gray-900">Our Phlebotomists Will:</p>

            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Arrive within the scheduled time slot</li>
              <li>Carry valid ID card and collection kit</li>
              <li>Follow hygiene, PPE, and safety guidelines</li>
              <li>Collect samples professionally and label them accurately</li>
              <li>Ensure sample integrity and proper sealing</li>
            </ul>

            <p className="font-medium text-gray-900 mt-3">Customer Responsibilities:</p>

            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Be present at the scheduled time</li>
              <li>Follow fasting instructions (if required)</li>
              <li>Provide accurate medical & contact information</li>
              <li>Ensure a clean and safe environment for collection</li>
            </ul>
          </section>

          {/* 4. Delays */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              4. Delays & Rescheduling
            </h3>

            <p>Delays might occur due to:</p>

            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Traffic or weather conditions</li>
              <li>High booking volume</li>
              <li>Incorrect or unreachable contact details</li>
            </ul>

            <p className="mt-2">
              In such cases, you will be notified and a new slot will be arranged 
              at no extra cost.
            </p>
          </section>

          {/* 5. Payment */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              5. Payment Policy
            </h3>

            <p>We accept:</p>

            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>UPI</li>
              <li>Online payment</li>
              <li>Wallet</li>
              <li>Credit/Debit Cards</li>
              <li>Cash (if applicable)</li>
            </ul>

            <p className="mt-3">
              Full payment is required before processing the sample.  
              If partial payment is made, the sample may be collected but 
              testing will begin only after full payment.
            </p>
          </section>

          {/* 6. Rejection */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              6. Sample Rejection Conditions
            </h3>

            <p>A sample may be rejected if:</p>

            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Fasting was not followed</li>
              <li>Insufficient sample quantity</li>
              <li>Clotted or hemolyzed sample</li>
              <li>Incorrect booking details</li>
              <li>Delay in reaching the lab (rare)</li>
            </ul>

            <p className="mt-2">
              A repeat sample may be required — re-collection charges may apply.
            </p>
          </section>

          {/* 7. Report Delivery */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              7. Report Delivery
            </h3>

            <p>Reports are typically delivered via:</p>

            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>WhatsApp</li>
              <li>Email</li>
              <li>Website login</li>
            </ul>

            <p className="mt-2">Hard copies are available upon request (charges may apply).</p>

            <p className="mt-2">
              Delays may occur due to QC checks, machine re-runs, or technical issues.
              We aim to keep customers informed in such cases.
            </p>
          </section>

          {/* 8. Cancellation */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              8. Cancellation & Refund
            </h3>

            <p>
              Cancellations follow our official Cancellation Policy and Refund Policy:
            </p>

            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Before home visit → Full refund</strong></li>
              <li><strong>After visit but before processing → Partial refund</strong></li>
              <li><strong>After processing → No refund</strong></li>
            </ul>
          </section>

          {/* 9. Safety */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              9. Safety & Confidentiality
            </h3>

            <ul className="list-disc pl-6 space-y-1">
              <li>Secure and confidential handling of all medical data</li>
              <li>Hygienic and sealed sample kits</li>
              <li>Trained and certified phlebotomists</li>
              <li>Secure transport to certified labs</li>
            </ul>
          </section>

          {/* 10. Contact */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              10. Contact Us
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

export default HomeCollection;
