import Image from "next/image";
import React from "react";

const page = () => {
const sections = [
    {
        title: "Our Vision",
        text:
            "To empower every small and medium business with cutting-edge digital tools that simplify website creation, enhance customer reach, and drive growth through smart, localized marketing — all in one powerful, user-friendly platform.",
        img: "/about-us/andrew-neel-ute2XAFQU2I-unsplash.jpg",
    },
    {
        title: "Our Mission",
        text:
            "Our mission is to simplify digital growth for small and medium businesses by offering a unified platform where they can create websites, run marketing campaigns via SMS, WhatsApp, and Meta, and engage customers through personalized push notifications — all without needing technical expertise.",
        img: "/about-us/andrew-neel-ute2XAFQU2I-unsplash.jpg",
    },
];

return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {sections.map(({ title, text, img }, idx) => (
                <div key={title}>
                    <h1>{title}</h1>
                    <p>{text}</p>
                    <Image src={img} height={100} width={100} alt={"title"} />
                </div>
            ))}
        </div>
    </div>
);
};

export default page;
