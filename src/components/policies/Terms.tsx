import PolicyPage from "../../pages/PolicyPage";

const Terms = () => {
  return (
    <PolicyPage
      title="Terms & Conditions"
      content={
        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Last Updated */}
          <p className="text-sm text-gray-500">
            <strong className="text-gray-700">Last Updated:</strong> 26-Nov-2025
          </p>

          {/* Intro */}
          <p>
            Welcome to <strong>DrPathCare.com</strong>, operated by 
            <strong> Routine Path Lab Private Limited</strong>. By accessing our
            website, booking a test, or using our services, you agree to the
            following Terms & Conditions.
          </p>

          {/* Section Block */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">1. Services Provided</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Home sample collection</li>
              <li>Diagnostic testing at certified laboratories</li>
              <li>Reports delivered via Email / WhatsApp / Website</li>
              <li>Customer support & assistance (non-medical)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">2. User Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be at least 18 years old to use our services.</li>
              <li>All booking information must be accurate and complete.</li>
              <li>Do not misuse, tamper with, or exploit website features.</li>
              <li>Test accuracy depends on proper sample preparation & medical history.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">3. Booking & Payments</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>A valid mobile number and email ID are required for bookings.</li>
              <li>Payments may be collected before or after sample collection.</li>
              <li>All payments are processed securely via authorized gateways.</li>
              <li>
                Once the sample is processed, payment is <strong>non-refundable</strong> 
                except under specific refund conditions.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">4. Home Sample Collection</h3>
            <p>
              Collection timings depend on availability and may be affected by
              traffic, weather, or unforeseen delays. Users must be available at 
              the provided address and time slot.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">5. Test Reports & Delivery</h3>
            <p>
              Reports are shared within the standard turnaround time but delays 
              may occur due to medical or system-related issues. Reports are meant 
              for informational purposes only and should be interpreted by a 
              qualified doctor.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">6. Accuracy of Test Results</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Biological variations may affect test results.</li>
              <li>Re-testing may be recommended if medically required.</li>
              <li>We are not liable for decisions made without a doctor’s consultation.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">7. Cancellation & Refund Policy</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Before sample collection → Full refund</strong></li>
              <li><strong>After sample collection → No refund</strong></li>
              <li>Refunds issued only for duplicate payments or unprocessed samples.</li>
              <li>Processing time: <strong>7–10 business days</strong>.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">8. Privacy & Data Protection</h3>
            <p>
              We collect personal information solely to provide diagnostic services.
              Your data is stored securely and is never shared with third parties 
              except for internal laboratory workflows or legal compliance.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">9. Limitation of Liability</h3>
            <p>
              DrPathCare is not responsible for medical decisions based on reports 
              without consulting a doctor, or for delays caused by external factors. 
              Our liability is limited to the amount paid for the service.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">10. Changes to Services</h3>
            <p>
              We may modify, update, or discontinue parts of the service 
              without prior notice.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">11. Intellectual Property</h3>
            <p>
              All website content—including text, graphics, images, and branding—
              belongs to Routine Path Lab Pvt. Ltd. Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">12. Governing Law</h3>
            <p>
              These terms are governed by Indian law. All disputes fall under the 
              jurisdiction of Delhi/NCR courts.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2">13. Contact Information</h3>
            <div className="space-y-1">
              <p><strong>DrPathCare (Routine Path Lab Pvt. Ltd.)</strong></p>
              <p>Email: info@drpathcare.com</p>
              <p>Phone: 0120-4207810</p>
              <p>Address: E-113, Second Floor, Sector-6, Noida – 201301</p>
            </div>
          </section>
        </div>
      }
    />
  );
};

export default Terms;
