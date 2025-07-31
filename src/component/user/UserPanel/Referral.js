import React from 'react';
import { Button } from "@/components/ui/button"; // adjust path if needed
import { FaWhatsapp, FaEnvelope, FaCopy } from "react-icons/fa";

const Referral = () => {
  const referralCode = "Bazar@2255";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied!");
  };

  const shareText = `Join this amazing app using my referral code ${referralCode}!`;

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg p-6 rounded-xl mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">Invite & Earn</h2>

      <div className="flex justify-between items-center border p-3 rounded-md bg-gray-100">
        <span className="font-mono text-lg">{referralCode}</span>
        <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2">
          <FaCopy /> Copy
        </Button>
      </div>

      <div className="flex justify-around">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="gap-2">
            <FaWhatsapp /> WhatsApp
          </Button>
        </a>

        <a
          href={`mailto:?subject=Join Now&body=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" className="gap-2">
            <FaEnvelope /> Email
          </Button>
        </a>
      </div>

      <div className="border-t pt-4">
        <p className="text-gray-500 text-sm">You earn ₹100 for every friend who signs up using your code.</p>
      </div>
    </div>
  );
};

export default Referral;
