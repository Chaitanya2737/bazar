import React, { useState, useEffect, useRef , useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypingIndicator = ({ isSender }) => (
  <motion.div
    initial={{ opacity: 0, x: isSender ? 30 : -30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: isSender ? 30 : -30 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className={`flex gap-1 my-2 ${isSender ? "justify-end pr-3" : "justify-start pl-3"}`}
  >
    {[1, 2, 3].map((dot) => (
      <motion.span
        key={dot}
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          repeat: Infinity,
          duration: 1.4,
          ease: "easeInOut",
          delay: dot * 0.2,
        }}
      />
    ))}
  </motion.div>
);

const Message = ({ text, isSender }) => (
  <motion.article
    role="article"
    aria-label={isSender ? "Sender message" : "Receiver message"}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
    className={`
      my-1.5 max-w-[70%] p-3 rounded-xl text-sm break-words
      ${
        isSender
          ? "bg-blue-300 self-end hover:bg-blue-400 focus:bg-blue-500"
          : "bg-gray-300 self-start hover:bg-gray-400 focus:bg-gray-500"
      }
      transition-colors duration-200 ease-in-out cursor-pointer
      outline-none
    `}
  >
    {text}
  </motion.article>
);

const ChatSimulator = () => {
const senderMessages = useMemo(() => [
  "नमस्कार! आम्ही तुमच्या व्यवसायासाठी कस्टम वेबसाइट तयार करतो...",
  "Whatapp नोटिफिकेशनमुळे तुम्ही थेट तुमच्या ग्राहकांशी संवाद साधू शकता.",
  "एफसीएम म्हणजे Firebase Cloud Messaging...",
  "आम्ही तुमची वेबसाइट आणि ऑफर्स सोशल मीडिया प्लॅटफॉर्मवर दाखवतो...",
  "तुम्ही आमच्या प्लॅटफॉर्मवरून सहजपणे ऑफर्स तयार करू शकता...",
  "कस्टम डिझाईन, रेस्पॉन्सिव्ह लेआउट, ग्राहक फीडबॅक फॉर्म...",
  "योग्य वेळ आणि योग्य ग्राहकांसाठी ऑफर्स पाठवणे महत्त्वाचे आहे...",
  "तुमची व्यवसाय माहिती द्या, मग आम्ही वेबसाइट तयार करतो...",
  "किंमत तुमच्या व्यवसायाच्या गरजांवर अवलंबून आहे...",
  "धन्यवाद! आम्हाला तुमच्याशी काम करण्याची उत्सुकता आहे.",
], []);

const receiverMessages = useMemo(() => [
  "नमस्कार, तुमचं व्यवसायासाठी काय सेवा आहेत?",
  "Whatapp नोटिफिकेशन कसे काम करतात?",
  "एफसीएम नोटिफिकेशन म्हणजे काय?",
  "तुम्ही मार्केटिंग कसे कराल?",
  "मी ऑफर्स कशा तयार करू शकतो?",
  "तुमच्या वेबसाइटमध्ये कोणते फीचर्स असतील?",
  "प्रमोशन्स कसे कराल?",
  "मी कशी सुरुवात करू?",
  "किंमत काय आहे?",
  "धन्यवाद! मला संपर्क साधायचा आहे。",
], []);


  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(null);
  const [isClicked, setClicked] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const containerRef = useRef();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (containerRef.current) {
      const timeout = setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [chat]);

  useEffect(() => {
    if (!typing) return;

    const typingDuration = 1000;

    const timer = setTimeout(() => {
      const isReceiverTyping = typing === "receiver";
      const maxIndex = Math.min(senderMessages.length, receiverMessages.length);

      if (messageIndex >= maxIndex) {
        setTyping(null);
        return;
      }

      const newMessage = isReceiverTyping
        ? { text: receiverMessages[messageIndex], isSender: false }
        : { text: senderMessages[messageIndex], isSender: true };

      setChat((prev) => [...prev, newMessage]);

      if (isReceiverTyping) {
        setTyping("sender");
      } else {
        setMessageIndex((i) => i + 1);
        setTyping("receiver");
      }
    }, typingDuration);

    return () => clearTimeout(timer);
  }, [typing, messageIndex, senderMessages, receiverMessages]);

  const handleFocus = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setChat([]);
      setMessageIndex(0);
      setTyping("receiver");
    }
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-8" aria-label="ग्राहक संवाद चॅट सिम्युलेटर">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white text-gray-900">
        स्मार्ट ग्राहक संवाद सिम्युलेटर
      </h1>
      <p className="text-center mb-8 text-gray-700 dark:text-gray-300">
        आमचा चॅट सिम्युलेटर तुमच्या व्यवसायाच्या ग्राहकांशी प्रभावी संवाद साधण्यासाठी आहे। येथे तुम्ही WhatsApp नोटिफिकेशन्स, पुश सूचनांद्वारे तुमचा व्यवसाय वाढवू शकता।
      </p>

      <div
        ref={containerRef}
        tabIndex={0}
        onFocus={handleFocus}
        style={{ fontFamily: "'Oswald', sans-serif", fontWeight: "500" }}
        className="flex flex-col justify-start w-full h-[500px] p-4 dark:bg-gray-900 overflow-y-auto bg-gray-50 font-sans border border-gray-300 rounded-lg shadow-lg outline-none"
        role="log"
        aria-live="polite"
      >
        {!isClicked && (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300 font-sans font-semibold">
              To know more
            </p>
            <button
              className="font-sans bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:bg-blue-700 transition-colors duration-200"
              onClick={() => setClicked(true)}
            >
              Click me
            </button>
          </div>
        )}

        {isClicked && (
          <>
            <AnimatePresence initial={false}>
              {chat.map(({ text, isSender }, idx) => (
                <Message key={idx} text={text} isSender={isSender} />
              ))}
            </AnimatePresence>

            {typing && <TypingIndicator isSender={typing === "sender"} />}
          </>
        )}
      </div>
    </section>
  );
};

export default ChatSimulator;