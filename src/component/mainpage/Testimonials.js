import { cn } from "@/lib/utils"; // Optional utility for className merging
import Image from "next/image";

const testimonials = [
  {
    name: "स्वप्नील देशमुख",
    title: "फुल-स्टॅक डेव्हलपर, पुणे",
    quote:
      "हा टूल माझ्या टीमसाठी खूप उपयोगी ठरला आहे. याने आम्हाला डिझाइन आणि विकासाचा वेळ वाचवला!",
    date: "2023.08.12",
    avatar: "/Testimonial/aravind-kumar-xqkCgI1oSlg-unsplash.jpg",
  },
  {
    name: "श्रुती कऱ्हाडे",
    title: "UI/UX डिझायनर, मुंबई",
    quote:
      "डिकोसारखा intuitive इंटरफेस पूर्वी कधीच पाहिला नव्हता. प्रत्येक डेव्हलपरसाठी हा आवश्यक आहे.",
    date: "2023.09.21",
    avatar: "/Testimonial/adesh-bankar-t0uFIywV6g4-unsplash.jpg",
  },
  {
    name: "आदित्य शिंदे",
    title: "CTO, टेकव्हीजन",
    quote:
      "डॅशबोर्डवर काम करताना जेव्हा डायनॅमिक गोष्टी हवी असतात, तेव्हा डिको खूपच उपयुक्त ठरतं.",
    date: "2023.07.03",
    avatar: "/Testimonial/md-mahdi-TbRNeMjXCrU-unsplash.jpg",
  },
  {
    name: "मीनल पाटील",
    title: "सॉफ्टवेअर इंजिनिअर, नागपूर",
    quote:
      "साधेपणा आणि कार्यक्षमतेचा उत्तम संगम म्हणजे डिको. आम्ही आता याशिवाय कल्पना करू शकत नाही.",
    date: "2023.10.01",
    avatar: "/Testimonial/pablo-merchan-montes-awqYwKLzpkg-unsplash.jpg",
  },
  {
    name: "राहुल मोहिते",
    title: "फ्रीलान्स वेब डेव्हलपर",
    quote:
      "या टूलमुळे माझे अनेक repetitive task automate झाले. वेळ आणि मेहनत दोन्ही वाचले.",
    date: "2023.06.18",
    avatar: "/Testimonial/md-mahdi-TbRNeMjXCrU-unsplash.jpg",
  },
  {
    name: "नेहा जगताप",
    title: "फ्रंटएंड इंजिनिअर, कोल्हापूर",
    quote:
      "डिकोचा वापर करून मी क्लायंट प्रोजेक्ट्समध्ये गुणवत्ता आणि गती दोन्ही वाढवली आहे.",
    date: "2023.05.29",
    avatar: "/Testimonial/arun-prakash-qJkmXIUV0rQ-unsplash.jpg",
  },
  {
    name: "अमोल काटे",
    title: "टीम लीड, इनोव्हेट टेक",
    quote:
      "डिको आमच्या टीमसाठी गेमचेंजर ठरला आहे. UI घटक तयार करणे आता फार सोपे झाले आहे.",
    date: "2023.04.20",
    avatar: "/public/Testimonial/adesh-bankar-t0uFIywV6g4-unsplash.jpg",
  },
  {
    name: "कविता देशपांडे",
    title: "फ्रंटएंड डिझायनर, औरंगाबाद",
    quote:
      "इंटरफेस स्पष्ट, कोड स्वच्छ आणि वापरण्यास सुलभ! मी प्रत्येक प्रोजेक्टसाठी याचा वापर करते.",
    date: "2023.09.10",
    avatar: "/Testimonial/mahdi-bafande-_7xm_xn4yDI-unsplash.jpg",
  },
  {
    name: "संदीप कदम",
    title: "Web3 डेव्हलपर",
    quote:
      "डिकोमुळे आमचे डिझाइन आणि कोडिंगमध्ये समन्वय अधिक चांगला झाला. Highly recommended!",
    date: "2023.11.02",
    avatar: "/",
  },
  {
    name: "प्रीती शेट्ये",
    title: "UI डिझायनर, सोलापूर",
    quote:
      "डिकोच्या सहाय्याने प्रोटोटायपिंग फार वेगाने करता येते. उपयोगी आणि दर्जेदार टूल आहे!",
    date: "2023.08.06",
    avatar: "/Testimonial/shubham-patel-0BScoftQ6to-unsplash.jpg",
  },
  {
    name: "प्रीती शेट्ये",
    title: "UI डिझायनर, सोलापूर",
    quote:
      "डिकोच्या सहाय्याने प्रोटोटायपिंग फार वेगाने करता येते. उपयोगी आणि दर्जेदार टूल आहे!",
    date: "2023.08.06",
    avatar: "/Testimonial/shubham-sharan-bbMXHBVez0o-unsplash.jpg",
  },
];

export default function FloatingTestimonials() {
  return (
    <>
      <section className="relative rounded-2xl bg-gradient-to-br from-[#96caed] via-white/50 to-pink-50 dark:from-gray-900 dark:via-white/50 dark:to-gray-900 dark:text-white  py-24 overflow-hidden">
        <div className="relative max-w-[100%] h-[500px] ">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={cn(
                "absolute bg-white w-[200px] md:w-full dark:bg-gray-400 dark:text-white rounded-2xl p-6 shadow-2xl transition-transform duration-300 ease-in-out max-w-sm",
                i === 0 &&
                  "top-1/2 left-1/2  transform   scale-100 z-120 opacity-100 shadow-[0_15px_60px_rgba(0,0,0,0.3)]",
                i === 1 &&
                  "top-[45%] left-[48%]  transform -translate-x-1/2 -translate-y-1/2   scale-95 z-110 opacity-100 shadow-[0_15px_60px_rgba(0,0,0,0.3)]",
                i === 2 &&
                  "top-[30%] right-[46%] transform -translate-x-1/2 -translate-y-1/2  scale-90 z-100 opacity-100 shadow-[0_15px_60px_rgba(0,0,0,0.3)]",
                i === 3 &&
                  "bottom-[60%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 -rotate-2  scale-90 z-20 opacity-80",
                i === 4 &&
                  "top-[15%] left-[65%] transform -translate-x-1/2 -translate-y-1/2  rotate-4 scale-90 z-20 opacity-90",

                i === 5 &&
                  "top-[70%] right-[40%] transform -translate-x-1/2 -translate-y-1/2  scale-90 z-20 opacity-100",

                i === 6 &&
                  "top-[30%] right-[46%] transform -translate-x-1/2 -translate-y-1/2  scale-90 z-100 opacity-0 ", // Adjusted z-index for better visibility
                i === 7 &&
                  "top-[45%] left-[72%] transform -translate-x-1/2 -translate-y-1/2  scale-90 z-10 opacity-80",
                i === 8 &&
                  "top-[90%] right-[20%] transform -translate-x-1/2 -translate-y-1/2 -rotate-2 scale-90 z-10 opacity-60",
                i === 9 &&
                  "top-[95%] left-[75%] transform -translate-x-1/2 -translate-y-1/2  scale-90 z-10 opacity-60",
                i === 10 &&
                  "top-[95%] right-[50%] transform -translate-x-1/2 -translate-y-1/2  scale-90 z-10 opacity-60",
                i === 11 &&
                  "bottom-[10%] right-[60%] transform -translate-x-1/2 -translate-y-1/2  scale-90 z-20 opacity-80 shadow-[0_15px_60px_rgba(0,0,0,0.3)]"
              )}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                {" "}
                <Image
                  src={t.avatar || "/placeholder.svg"}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-xl w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover"
                />{" "}
                <div>
                  {" "}
                  <p className="font-semibold text-gray-900 text-sm sm:text-sm md:text-base leading-tight">
                    {t.name}
                  </p>{" "}
                  <p className="text-gray-900 text-[10px] sm:text-xs md:text-sm leading-tight">
                    {t.title}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <p className="text-gray-700 italic text-[10px] sm:text-xs md:text-sm leading-tight">
                {t.quote}
              </p>{" "}
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 mt-1 sm:mt-2 md:mt-3">
                {t.date}
              </p>{" "}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
