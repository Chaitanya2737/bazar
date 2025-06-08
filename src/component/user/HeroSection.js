import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto
                 bg-white bg-opacity-20
                 backdrop-blur-lg
                 rounded-xl
                 shadow-xl"
    >
      <div className="md:w-1/2 text-center md:text-left p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-900">
          आमच्या सेवांवर विश्वास ठेवा!
        </h1>
        <p className="text-lg text-gray-900 mb-8 max-w-md">
          दर्जेदार सेवा देऊन, ग्राहकांच्या समाधानासाठी आम्ही सदैव प्रयत्नशील आहोत. आमच्या सेवांमुळे ग्राहक परत परत आनंदाने येतात.
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            सेवा सुरू करा
          </button>
          <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
            ग्राहकांचे अभिप्राय वाचा
          </button>
        </div>
      </div>
      <div className="md:w-1/2 mb-10 md:mb-0">
        <Image
          src="/horizontal-shot-happy-friends-point-fingers-you-gesture-indoor-make-choice-have-positive-expressions.jpg"
          alt="आनंदी ग्राहक आणि खरेदीदार"
          className="w-full rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>
    </section>
  );
}
