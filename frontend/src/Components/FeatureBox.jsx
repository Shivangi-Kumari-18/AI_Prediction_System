export default function FeatureBox() {
  return (
    <div className="mt-10 opacity-0 hover:opacity-100 transition-opacity duration-500">
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="p-4 border rounded shadow">
          <h3 className="font-semibold">Risk Analysis</h3>
          <p>Detect patterns from attendance, marks, and fees.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3 className="font-semibold">Early Alerts</h3>
          <p>Send automatic alerts to mentors.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3 className="font-semibold">Counseling Support</h3>
          <p>Provide personalized guidance.</p>
        </div>
      </div>
    </div>
  );
}
