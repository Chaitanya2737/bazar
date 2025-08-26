"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const DisplayOffer = () => {
  const [offers, setOffers] = useState([]);

  const fetchOffer = async () => {
    try {
      const response = await axios.get("/api/user/siteoffer/displayoffer");
      console.log(response.data);
      setOffers(response.data?.offers || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchOffer();
  }, []);

  


  const openWhatsApp = (contact) => {
    if (!contact) return;
    const phone = contact.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {offers.length === 0 ? (
        <p className="text-center text-gray-500">No current offers</p>
      ) : (
        offers.map((offer) => (
          <Card key={offer._id} className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{offer.title}</CardTitle>
              {offer.businessNameName && (
                <p className="text-sm text-gray-500">{offer.businessNameName}</p>
              )}
            </CardHeader>
           
            {offer.contact && (
              <CardFooter>
                <Button
                  onClick={() => openWhatsApp(offer.contact)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 w-full"
                >
                  <MessageCircle size={18} />
                  Contact on WhatsApp
                </Button>
              </CardFooter>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default DisplayOffer;
