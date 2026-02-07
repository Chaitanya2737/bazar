"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Globe,
  MessageSquare,
  Bell,
  Instagram,
  ChevronDown,
} from "lucide-react";
import Head from "next/head";
import AdminSponsorCard from "./AdminSponsorCard";
import Testimonials from "./Testimonials";
import Footer from "../user/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Maincomp() {
  const router = useRouter();

  // ✅ Simplified active tab state
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    { id: "tab1", label: "Application" },
    { id: "tab2", label: "Web" },
    { id: "tab3", label: "Marketing" },
    { id: "tab4", label: "Technical Support" },
  ];

  const brands = [
    { src: "/trusted-by/image.png", name: "जय बाळूमामा यात्री निवास" },
    {
      src: "/trusted-by/image copy.png",
      name: "वाघमोडे बंधू यांचे हॉटेल सुनिल",
    },
    { src: "/trusted-by/image copy 2.png", name: "श्री दत्त प्रसन्न प्रा. लि" },
    { src: "/trusted-by/image copy 3.png", name: "SAI HILLS HOLLYDAYS" },
    {
      src: "/trusted-by/image copy 4.png",
      name: "राधेशाम गोल्ड अँड सिल्व्हर,",
    },
    { src: "/trusted-by/image copy 6.png", name: "पाटील ई - मोटर्स," },
    { src: "/trusted-by/image copy 7.png", name: "सोनाई ई मोटर्स," },
  ];

  const items = [
    {
      title: "Bazar.SH म्हणजे काय?",
      content:
        "Bazar.SH हे एक स्मार्ट डिजिटल बिझनेस प्लॅटफॉर्म आहे जे तुम्हाला तुमच्या ग्राहकांशी WhatsApp, SMS आणि Push Notifications द्वारे जोडण्यास मदत करते. तसेच हे मार्केटिंग, विश्लेषण (Analytics) आणि AI-आधारित साधनं उपलब्ध करून देते.",
    },
    {
      title: "Bazar.SH वापरण्यासाठी तांत्रिक ज्ञान आवश्यक आहे का?",
      content:
        "नाही! Bazar.SH कोणत्याही तांत्रिक पार्श्वभूमी नसलेल्या व्यक्तीसाठीसुद्धा सोपं आणि वापरण्यास सुलभ आहे. डॅशबोर्ड अत्यंत साधा, मोबाइल-फ्रेंडली आणि जलद प्रतिसाद देणारा आहे.",
    },
    {
      title: "मी दररोज WhatsApp आणि SMS संदेश पाठवू शकतो का?",
      content:
        "होय! आमच्या प्रणालीद्वारे तुम्ही अमर्याद WhatsApp संदेश आणि दररोज 100 पर्यंत SMS पाठवू शकता — ऑफर, अपडेट्स आणि प्रमोशन्ससाठी आदर्श उपाय.",
    },
    {
      title: "Bazar.SH मध्ये विश्लेषण (Analytics) आणि अहवाल मिळतात का?",
      content:
        "नक्कीच. तुम्हाला ग्राहक सहभाग, संदेश पोहोच आणि ऑफर परफॉर्मन्स याचे रिअल-टाइम विश्लेषण मिळते, ज्यामुळे व्यवसाय निर्णय अधिक अचूक घेता येतात.",
    },
    {
      title: "Bazar.SH मध्ये कोणती मार्केटिंग साधने आहेत?",
      content:
        "WhatsApp ऑफर शेअरिंग, Instagram प्रमोशन्स, Push Notifications आणि AI-आधारित इनसाइट्सद्वारे तुम्ही तुमची पोहोच आणि ग्राहक संवाद वाढवू शकता.",
    },
    {
      title: "Bazar.SH इतर प्लॅटफॉर्मपेक्षा वेगळं कसं आहे?",
      content:
        "Bazar.SH हे एकाच ठिकाणी संवाद, ऑटोमेशन, विश्लेषण आणि AI एकत्र आणतं — त्यामुळे वेगवेगळी अॅप्स वापरण्याची गरज राहत नाही.",
    },
    {
      title: "माझा डेटा Bazar.SH वर सुरक्षित आहे का?",
      content:
        "होय. आम्ही तुमचा डेटा संरक्षित ठेवण्यासाठी उच्च दर्जाच्या सुरक्षा मानकांचं पालन करतो. सर्व माहिती एन्क्रिप्टेड आणि सुरक्षित स्वरूपात साठवली जाते.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubmit = () => { 

    
    const phoneNumber = "918421679469";
    const message = `
Hello Vedayana Technology Pvt. Ltd. 👋

I’m interested in the bazar.sh project.
Please contact me at your earliest convenience.

Thank you.
`;

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 rounded-2xl shadow-lg ">
      <Head>
        <title>Your Digital Platform - Custom Subdomains & More</title>
        <meta
          name="description"
          content="Create your own subdomain with powerful features like WhatsApp offer sharing and push notifications."
        />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-rgb(188 226 234)/40 via-pink-100/10 to-rgb(190 226 234 / 46%) dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 transition-colors duration-500 rounded-3xl shadow-[0_10px_40px_rgba(255,0,128,0.15)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-snug">
              ग्राहकांशी सतत संपर्कात राहा –{" "}
              <span className="block text-pink-600 dark:text-orange-500 text-5xl md:text-6xl tracking-wide mt-2">
                कॉल, SMS आणि WhatsApp द्वारे
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bazar.SH तुमच्या व्यवसायाला अधिक स्मार्ट बनवतो! कॉल आल्याबरोबर
              ग्राहकाला तुमच्या व्यवसायाची माहिती, ऑफर्स आणि सेवा ऑटोमॅटिक SMS व
              WhatsApp मेसेजद्वारे पोहोचवली जाते. आता प्रत्येक कॉल एक संधी ठरवा
              – ग्राहकांशी सतत संपर्कात राहा, नवे ग्राहक मिळवा आणि तुमचा ऑनलाईन
              व्यवसाय झपाट्याने वाढवा.
            </p>

            <Button
              className="bg-pink-600 dark:bg-orange-500 dark:text-white"
              onClick={handleSubmit}
            >
               डेमो साठी येथे क्लिक करा 
            </Button>
          </div>

          <div className="relative w-full h-96 sm:h-[28rem] md:h-[42rem] mx-auto rounded-2xl shadow-2xl overflow-hidden">
            <Image
              src="/Where creativity meets conversion.jpg"
              alt="Bazar.SH promotional visual"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          तुमच्या व्यवसायाला गती देणारी खास वैशिष्ट्ये{" "}
          <span className="text-pink-600 dark:text-orange-400">
            || डिजिटल मार्केटिंगसाठी उपयुक्त साधने
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                <Instagram className="mr-2 h-6 w-6 text-pink-600" />
                इंस्टाग्राम जाहिराती
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                फेसबुक आणि इंस्टाग्राम जाहिरातींमधून तुमच्या उत्पादनांची
                प्रसिद्धी वाढवा आणि विक्री दुप्पट करा.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                <MessageSquare className="mr-2 h-6 w-6 text-pink-600" />
                WhatsApp ऑफर शेअरिंग
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                ग्राहकांशी थेट WhatsApp वरून ऑफर्स आणि प्रमोशन्स शेअर करा —
                तत्काळ प्रतिसाद मिळवा आणि संपर्क वाढवा.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                <Bell className="mr-2 h-6 w-6 text-pink-600" />
                पुश नोटिफिकेशन्स
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                FCM-चालित नोटिफिकेशनद्वारे ग्राहकांना रिअल-टाइम अपडेट्स, ऑफर्स
                आणि सूचना पाठवा — ग्राहक संपर्क जिवंत ठेवा.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ✅ Tabs Section */}
      <div className="flex justify-center mb-12 px-2">
        <div
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-full p-2 shadow-xl border border-gray-100 dark:border-gray-800 
      flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide max-w-full sm:max-w-3xl md:max-w-5xl 
      whitespace-nowrap no-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300
          ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Tab Content */}
      <div className="grid grid-cols-1 gap-12 lg:gap-16 mb-20 text-center">
        {activeTab === "tab1" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-3xl rounded-2xl p-[2px] bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 shadow-2xl">
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 shadow-inner">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
                  📱 Application Features
                </h1>

                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  तुमच्या व्यवसायासाठी खास तयार केलेले मोबाईल — जे तुम्ही ग्राहक
                  संपर्क साधते! समान{" "}
                  <span className="font-semibold text-pink-600 dark:text-orange-400">
                    100 मोफत SMS
                  </span>
                  , अमर्याद WhatsApp मेसेजेस आणि रिअल-टाइम बिझनेस अपडेट्स पाठ
                  करणे सज्ज. प्रत्येक, मेसेज किंवा ग्राहक कॉलवर त्वरित
                  प्रत्युत्तर — कोणतीही लीड वाया जाणार नाही!
                </p>

                <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside text-left md:text-center">
                  <li>📩 दररोज 100 फ्री प्रमोशनल SMS</li>
                  <li>💬 अमर्याद WhatsApp ऑटो-मेसेजिंग सुविधा</li>
                  <li>⚡ ऑटो रिप्लाय व ग्राहक प्रोफाइल अपडेट्स</li>
                  <li>📊 कॉल व मेसेज ट्रॅकिंगसाठी इनबिल्ट ॲनालिटिक्स</li>
                  <li>🛍️ स्वतःचे ब्रँडेड सबडोमेन (उदा. yourshop.bazar.sh)</li>
                </ul>

                <p className="mt-6 text-center text-pink-600 dark:text-orange-400 font-semibold">
                  प्रत्येक कॉल बनवा बिझनेसची नवी संधी — फक्त{" "}
                  <span className="text-blue-600 dark:text-orange-400">
                    Bazar.SH
                  </span>{" "}
                  सोबत!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tab2" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-3xl rounded-2xl p-[2px] bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 shadow-2xl">
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 shadow-inner">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
                  💻 Website Features
                </h1>

                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  तुमच्या व्यवसायासाठी आधुनिक, जलद आणि आकर्षक वेबसाइट — जिथे
                  प्रत्येक क्लिक मोजला जातो! इनबिल्ट डॅशबोर्ड, अ‍ॅनालिटिक्स, आणि
                  इमेज अपलोडिंग सुविधा यामुळे संपूर्ण नियंत्रण तुमच्याच हातात.
                </p>

                <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside text-left md:text-center">
                  <li>
                    📊{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      रिअल-टाइम अ‍ॅनालिटिक्स:
                    </span>{" "}
                    व्हिजिट्स, क्लिक्स, आणि कस्टमर बिहेव्हिअर ट्रॅक करा.
                  </li>
                  <li>
                    📈{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      स्मूथ डॅशबोर्ड:
                    </span>{" "}
                    सर्व डेटा एकाच ठिकाणी — सोप्या आणि सुंदर UI मध्ये.
                  </li>
                  <li>
                    🖼️{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      इमेज अपलोडिंग:
                    </span>{" "}
                    उत्पादनांच्या फोटोंसाठी क्लाऊड सपोर्ट आणि ऑटो-कंप्रेशन.
                  </li>
                  <li>
                    🔔{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      लाईव्ह नोटिफिकेशन्स:
                    </span>{" "}
                    नवीन ऑर्डर, रिव्ह्यू आणि संदेश त्वरित दिसतात.
                  </li>
                  <li>
                    🔒{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      सुरक्षित लॉगिन सिस्टम:
                    </span>{" "}
                    आधुनिक सुरक्षा प्रोटोकॉल्ससह युजर डेटा सुरक्षित.
                  </li>
                  <li>
                    🛍️{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      ऑफर आणि कॅम्पेन मॅनेजमेंट:
                    </span>{" "}
                    ऑफर्स तयार करा, वेळापत्रक सेट करा आणि ऑटोमॅटिकली पब्लिश करा.
                  </li>
                </ul>

                <p className="mt-6 text-center text-pink-600 dark:text-orange-400 font-semibold">
                  एकच वेबसाइट, सर्व सुविधा —{" "}
                  <span className="text-blue-600 dark:text-orange-400">
                    Bazar.SH
                  </span>{" "}
                  सोबत तुमचा डिजिटल ब्रँड तयार करा!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tab3" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-3xl rounded-2xl p-[2px] bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 shadow-2xl">
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 shadow-inner">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
                  📣 Marketing Features
                </h1>

                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  तुमच्या व्यवसायाच्या जाहिरातींना नवा वेग द्या — इंस्टाग्राम,
                  फेसबुक, व्हॉट्सअॅप आणि इतर सोशल मीडिया प्लॅटफॉर्मवरून तुमच्या
                  ब्रँडची ओळख वाढवा. स्वयंचलित कॅम्पेन आणि रिअल-टाइम
                  अ‍ॅनालिटिक्समुळे प्रत्येक जाहिरात अधिक परिणामकारक बनते.
                </p>

                <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside text-left md:text-center">
                  <li>
                    📸{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      Instagram & Facebook Ads:
                    </span>{" "}
                    तुमची उत्पादने सोशल मीडियावर प्रमोट करा आणि हजारो नवीन
                    ग्राहकांपर्यंत पोहोचा.
                  </li>
                  <li>
                    💬{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      WhatsApp Marketing:
                    </span>{" "}
                    ग्राहकांना थेट ऑफर्स आणि अपडेट्स पाठवा — अधिक इंटरॅक्शन,
                    अधिक कन्व्हर्जन्स!
                  </li>
                  <li>
                    🧠{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      Smart Campaign Automation:
                    </span>{" "}
                    वेळ वाचवा आणि ऑटोमॅटिक जाहिरात वितरण करा योग्य
                    प्रेक्षकांसाठी.
                  </li>
                  <li>
                    📊{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      Performance Analytics:
                    </span>{" "}
                    प्रत्येक कॅम्पेनचे परिणाम ट्रॅक करा — क्लिक रेट्स, रीच, आणि
                    कन्व्हर्जन डेटा एका ठिकाणी.
                  </li>
                  <li>
                    🎯{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      Targeted Audience Reach:
                    </span>{" "}
                    योग्य वयोगट, क्षेत्र, आणि आवडीनुसार जाहिराती पोहोचवा.
                  </li>
                  <li>
                    🧩{" "}
                    <span className="font-semibold text-pink-600 dark:text-orange-400">
                      Cross-Platform Integration:
                    </span>{" "}
                    इंस्टाग्राम, फेसबुक, व्हॉट्सअॅप, आणि वेबसाइट एकत्र कनेक्ट
                    करून एकसंध मार्केटिंग अनुभव.
                  </li>
                </ul>

                <p className="mt-6 text-center text-pink-600 dark:text-orange-400 font-semibold">
                  सोशल मीडियावर तुमचा ब्रँड झळकवा –{" "}
                  <span className="text-blue-600 dark:text-orange-400">
                    Bazar.SH Marketing Hub
                  </span>{" "}
                  सोबत प्रत्येक पोस्ट एक संधी!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tab4" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-3xl rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-2xl">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 shadow-inner">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
                  🧠 Technical Support
                </h1>

                <p className="mt-4 text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  तुमचा डिजिटल प्रवास अखंडित राहावा म्हणून आमची सपोर्ट टीम 24/7
                  तुमच्या सेवेत आहे. सिस्टीम अपडेट्सपासून इंटिग्रेशन
                  सपोर्टपर्यंत — आम्ही प्रत्येक समस्येचं समाधान देतो, तेही
                  तत्काळ.
                </p>

                <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside text-left md:text-center">
                  <li>
                    ⚙️{" "}
                    <span className="font-semibold text-blue-600 dark:text-indigo-400">
                      24/7 Expert Assistance:
                    </span>{" "}
                    कोणत्याही वेळी तांत्रिक मदत उपलब्ध — फक्त एक मेसेज किंवा कॉल
                    दूर.
                  </li>
                  <li>
                    🧩{" "}
                    <span className="font-semibold text-blue-600 dark:text-indigo-400">
                      API & Integration Help:
                    </span>{" "}
                    तृतीय-पक्ष सेवा, पेमेंट गेटवे, आणि इतर सिस्टीम
                    इंटिग्रेशनसाठी तज्ञ मार्गदर्शन.
                  </li>
                  <li>
                    🐞{" "}
                    <span className="font-semibold text-blue-600 dark:text-indigo-400">
                      Bug Fix & Maintenance:
                    </span>{" "}
                    तुमच्या वेबसाइट आणि अ‍ॅप्ससाठी तत्काळ बग फिक्सिंग,
                    सिक्युरिटी अपडेट्स आणि बॅकअप व्यवस्थापन.
                  </li>
                  <li>
                    🚀{" "}
                    <span className="font-semibold text-blue-600 dark:text-indigo-400">
                      Deployment & Server Setup:
                    </span>{" "}
                    सुरक्षित सर्व्हर होस्टिंग, डोमेन सेटअप आणि ऑटोमेटेड
                    डिप्लॉयमेंट सपोर्ट.
                  </li>
                  <li>
                    📞{" "}
                    <span className="font-semibold text-blue-600 dark:text-indigo-400">
                      Customer Query Support:
                    </span>{" "}
                    ग्राहकांच्या अडचणींवर त्वरित उत्तर — उच्च दर्जाची
                    ग्राहकसेवा.
                  </li>
                  <li>
                    🔒{" "}
                    <span className="font-semibold text-blue-600 dark:text-indigo-400">
                      Security & Data Protection:
                    </span>{" "}
                    नियमित सिक्युरिटी स्कॅन आणि डेटा सेफ्टी चेक्ससह विश्वसनीय
                    प्रणाली.
                  </li>
                </ul>

                <p className="mt-6 text-center text-blue-600 dark:text-indigo-400 font-semibold">
                  तुमच्या प्रत्येक प्रोजेक्टसाठी आमची टीम नेहमी तयार –{" "}
                  <span className="text-purple-600 dark:text-purple-400">
                    Bazar.SH Technical Support Hub
                  </span>{" "}
                  तुमच्या मागे ठामपणे उभी आहे.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Animated brand carousel */}
      <section className="relative py-16 bg-white dark:bg-gray-800 overflow-hidden">
        <motion.h2
          className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="relative inline-block">
            🤝 Trusted by{" "}
            <span className="text-pink-600 dark:text-orange-400">
              Leading Businesses
            </span>
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-orange-400 to-pink-600 rounded-full"
              animate={{ scaleX: [0, 1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            ></motion.span>
          </span>
        </motion.h2>

        {/* Animated logo strip */}
        <motion.div
          className="flex gap-16 items-center justify-center whitespace-nowrap "
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-40 h-24 my-10 flex flex-col justify-center items-center opacity-90 hover:opacity-100 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="relative w-100 h-100 mb-2">
                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
              <h1 className="text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide">
                {brand.name}
              </h1>
            </motion.div>
          ))}
        </motion.div>

        {/* Glow border at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-400 via-orange-400 to-pink-400 animate-pulse"></div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-gray-900 text-center relative overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72  rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            🚀 We’re Evolving Every Day
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Bazar.SH दररोज नवनवीन सुधारणा करत आहे — वापरकर्त्यांचा अनुभव अधिक
            उत्तम बनवण्यासाठी आणि व्यवसायांना अधिक प्रभावी पोहोच मिळवून
            देण्यासाठी आम्ही AI-चालित साधने तयार करत आहोत. आमचं उद्दिष्ट स्पष्ट
            आहे: तुमचा व्यवसाय डिजिटल युगात पुढे नेणं आणि ग्राहकांशी अधिक
            स्मार्टपणे जोडणं.
          </p>

          <motion.div
            className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.08 }}
          >
            Coming Soon: AI Tools for Smart Reach 🤖
          </motion.div>
        </div>
      </section>

      <section>
        <Testimonials />
      </section>

      <section className="py-16 px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">FAQ Section</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left font-medium text-lg"
                  onClick={() => toggle(index)}
                >
                  {item.title}
                  <motion.span
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-gray-600 dark:text-gray-300">
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
