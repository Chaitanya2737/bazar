import React, { useState } from "react";

const testimonials = [
  {
    name: "राहुल देशमुख",
    location: "पुणे",
    message:
      "माझ्या व्यवसायासाठी हे प्लॅटफॉर्म अत्यंत उपयुक्त ठरले. व्हॉट्सअ‍ॅप शेअरिंगमुळे माझ्या ग्राहकांशी संवाद अधिक सुलभ झाला.",
    rating: 5,
  },
  {
    name: "स्नेहा जोशी",
    location: "नाशिक",
    message: "पुश नोटिफिकेशन्समुळे माझ्या वेबसाइटच्या ट्रॅफिकमध्ये लक्षणीय वाढ झाली आहे.",
    rating: 4,
  },
  {
    name: "अमोल पाटील",
    location: "मुंबई",
    message: "ईमेल सपोर्ट टीमने माझ्या सर्व शंका तत्परतेने सोडवल्या. उत्कृष्ट सेवा!",
    rating: 5,
  },
  {
    name: "प्रिया कदम",
    location: "औरंगाबाद",
    message: "कस्टम सबडोमेनमुळे माझ्या ब्रँडची ओळख अधिक प्रभावी झाली आहे.",
    rating: 4,
  },
  {
    name: "विक्रम शिंदे",
    location: "कोल्हापूर",
    message: "हे प्लॅटफॉर्म वापरणे अत्यंत सोपे आहे आणि त्याचे फीचर्स माझ्या व्यवसायासाठी उपयुक्त आहेत.",
    rating: 5,
  },
  {
    name: "नेहा साळुंखे",
    location: "सोलापूर",
    message: "ग्राहकांना व्हॉट्सअ‍ॅपद्वारे ऑफर्स पाठवणे आता खूप सोपे झाले आहे.",
    rating: 4,
  },
  {
    name: "संदीप मोरे",
    location: "ठाणे",
    message: "पुश नोटिफिकेशन्समुळे माझ्या वेबसाइटवरील ग्राहकांची गुंतवणूक वाढली आहे.",
    rating: 4,
  },
  {
    name: "किरण गायकवाड",
    location: "सातारा",
    message: "ईमेल सपोर्ट टीमने मला वेळेवर मदत केली, ज्यामुळे माझे काम थांबले नाही.",
    rating: 5,
  },
  {
    name: "अनिता देशपांडे",
    location: "नांदेड",
    message: "कस्टम सबडोमेनमुळे माझ्या वेबसाइटचा प्रोफेशनल लुक वाढला आहे.",
    rating: 4,
  },
  {
    name: "महेश भोसले",
    location: "जळगाव",
    message: "हे प्लॅटफॉर्म माझ्या व्यवसायाच्या वाढीसाठी एक महत्त्वपूर्ण साधन ठरले आहे.",
    rating: 5,
  },
  {
    name: "स्वाती पाटील",
    location: "अमरावती",
    message: "व्हॉट्सअ‍ॅप शेअरिंग फीचरमुळे माझ्या उत्पादनांची माहिती ग्राहकांपर्यंत लवकर पोहोचते.",
    rating: 4,
  },
  {
    name: "राजेश नाईक",
    location: "सांगली",
    message: "पुश नोटिफिकेशन्समुळे मी नवीन ऑफर्स ग्राहकांपर्यंत तत्काळ पोहोचवू शकतो.",
    rating: 5,
  },
]

const StarRating = ({ rating }) => {
  return (
    <div className="flex mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.964c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.964a1 1 0 00-.364-1.118L2.04 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const [showAll, setShowAll] = useState(false);

  // Show 3 or all testimonials depending on state
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900 font-sans">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
        आमचे ग्राहक काय म्हणतात
      </h2>

      <div className="max-w-3xl mx-auto space-y-8">
        {displayedTestimonials.map(({ name, location, message, rating }, idx) => {
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          return (
            <blockquote
              key={idx}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg font-sans">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{location}</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">“{message}”</p>
              <StarRating rating={rating} />
            </blockquote>
          );
        })}
      </div>

      {!showAll && testimonials.length > 3 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            अधिक पहा
          </button>
        </div>
      )}
    </section>
  );
};

export default Testimonials;