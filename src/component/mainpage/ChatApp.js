import React, { useState, useEffect, useRef } from "react";
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
          repeatDelay: 0.2,
          delay: dot * 0.2,
        }}
        style={{ display: "inline-block" }}
      />
    ))}
  </motion.div>
);

const Message = ({ text, isSender }) => (
  <motion.div
    tabIndex={0}
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
  </motion.div>
);

const ChatSimulator = () => {
  // receiver = user, sender = system
  const senderMessages = [
    "नमस्कार! आम्ही तुमच्या व्यवसायासाठी कस्टम वेबसाइट तयार करतो, ज्यामध्ये Whatapp शेअर नोटिफिकेशन, फेसबुक ॲडसाठी पुश नोटिफिकेशन आणि एफसीएम नोटिफिकेशनचा समावेश आहे.",
    "Whatapp नोटिफिकेशनमुळे तुम्ही थेट तुमच्या ग्राहकांशी संवाद साधू शकता.",
    "एफसीएम म्हणजे Firebase Cloud Messaging. हे मोबाईल अ‍ॅप आणि वेबवरील पुश नोटिफिकेशनसाठी वापरलं जातं.",
    "आम्ही तुमची वेबसाइट आणि ऑफर्स सोशल मीडिया प्लॅटफॉर्मवर प्रभावीपणे दाखवतो, ज्यामुळे तुमच्या व्यवसायाचा प्रसार वाढतो.",
    "तुम्ही आमच्या प्लॅटफॉर्मवरून सहजपणे ऑफर्स तयार करू शकता आणि ग्राहकांना पाठवू शकता.",
    "कस्टम डिझाईन, रेस्पॉन्सिव्ह लेआउट, ग्राहक फीडबॅक फॉर्म, ऑनलाईन बुकिंग आणि नोटिफिकेशन सेटींग्स उपलब्ध आहेत.",
    "योग्य वेळ आणि योग्य ग्राहकांसाठी लक्ष केंद्रीत ऑफर्स पाठवणे महत्वाचे आहे. आम्ही सर्वोत्तम रणनीती सुचवतो.",
    "तुमची व्यवसाय माहिती द्या, मग आम्ही वेबसाइट तयार करतो आणि सेवा सेट करतो.",
    "किंमत तुमच्या व्यवसायाच्या गरजांवर अवलंबून आहे. विविध पॅकेजेस ऑफर करतो.",
    "धन्यवाद! आम्हाला तुमच्याशी काम करण्याची उत्सुकता आहे.",
  ];

  const receiverMessages = [
    "नमस्कार, तुमचं व्यवसायासाठी काय सेवा आहेत?",
    "Whatapp नोटिफिकेशन कसे काम करतात?",
    "एफसीएम नोटिफिकेशन म्हणजे काय?",
    "तुम्ही मार्केटिंग कसे कराल?",
    "मी माझ्या व्यवसायासाठी खास ऑफर्स कशा तयार करू शकतो?",
    "तुमच्या वेबसाइटमध्ये कोणते फीचर्स असतील?",
    "माझ्या व्यवसायासाठी यशस्वी प्रमोशन्स कसे कराल?",
    "मी या सेवांसाठी कशी सुरुवात करावी?",
    "तुमच्या सेवा वापरण्यासाठी काही किंमत आहे का?",
    "धन्यवाद! मला लवकरच संपर्क साधायचा आहे.",
  ];

  // chat array holds {text, isSender}
  const [chat, setChat] = useState([]);
  // typing indicates who is typing: "receiver", "sender" or null when finished
  const [typing, setTyping] = useState("receiver");
  // index to track which pair of messages to send next
  const [messageIndex, setMessageIndex] = useState(0);

  const containerRef = useRef();

  // Scroll chat to bottom on new message
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

    // durations
    const typingDuration = 1000;
    const pauseAfterMessage = 500;

    const timer = setTimeout(() => {
      // Determine message and sender based on who is typing
      const isReceiverTyping = typing === "receiver";

      // Check if message index is valid for current typing side
      const hasMoreMessages = isReceiverTyping
        ? messageIndex < receiverMessages.length
        : messageIndex < senderMessages.length;

      if (!hasMoreMessages) {
        // No more messages, stop typing
        setTyping(null);
        return;
      }

      // Get the message to add
      const newMessage = isReceiverTyping
        ? { text: receiverMessages[messageIndex], isSender: false }
        : { text: senderMessages[messageIndex], isSender: true };

      setChat((c) => [...c, newMessage]);

      if (isReceiverTyping) {
        // After receiver message, set sender typing if sender has messages left
        if (messageIndex < senderMessages.length) {
          setTimeout(() => setTyping("sender"), pauseAfterMessage);
        } else {
          setTyping(null);
        }
      } else {
        // After sender message, set receiver typing if receiver has messages left
        if (messageIndex + 1 < receiverMessages.length) {
          setTimeout(() => setTyping("receiver"), pauseAfterMessage);
        } else {
          setTyping(null);
        }
      }

      // Increase messageIndex only after sender message to keep pair in sync
      if (!isReceiverTyping) {
        setMessageIndex((i) => i + 1);
      }
    }, typingDuration);

    return () => clearTimeout(timer);
  }, [typing, messageIndex]);

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4 py-2 my-2 dark:bg-gray-900">
      <div
        ref={containerRef}
         style={{ fontFamily: "'Oswald', sans-serif", fontWeight:"500" }}
        className="flex flex-col justify-start w-full max-w-xl h-[500px] p-4 dark:bg-gray-900 overflow-y-auto bg-gray-50 font-sans border border-gray-300 rounded-lg shadow-lg"
      >
        <AnimatePresence initial={false}>
          {chat.map(({ text, isSender }, idx) => (
            <Message key={idx} text={text} isSender={isSender} />
          ))}
        </AnimatePresence>

        {typing && <TypingIndicator isSender={typing === "sender"} />}
      </div>
    </div>
  );
};

export default ChatSimulator;
