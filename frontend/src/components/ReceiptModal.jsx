import React, { useState } from "react";
import { pdfService } from "../services/pdfService";

export default function ReceiptModal({ receipt, onClose }) {
  const [downloading, setDownloading] = useState(false);

  if (!receipt) return null;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await pdfService.downloadReceipt(receipt);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl text-center animate-fadeIn">
        <h2 className="text-xl font-semibold text-indigo-600 mb-3">
          🎉 Checkout Successful!
        </h2>

        <p className="text-gray-600 mb-2">
          <strong>Total:</strong> ₹{receipt.total}
        </p>
        <p className="text-gray-500 text-sm mb-4">
          {new Date(receipt.timestamp).toLocaleString()}
        </p>

        <div className="max-h-48 overflow-y-auto mb-4 border-t pt-2 text-left">
          {receipt.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-gray-700 text-sm border-b last:border-none py-1"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.subtotal}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={`${
              downloading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded-md font-medium transition-colors`}
          >
            {downloading ? "Downloading..." : "Download PDF"}
          </button>

          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
