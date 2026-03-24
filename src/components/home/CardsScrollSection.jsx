"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";

import { useI18n } from "../i18n/I18nProvider";

import card1 from "../../assets/Images/AGAR.svg";
import card2 from "../../assets/Images/Nigat.svg";
import card3 from "../../assets/Images/amana.svg";
import card4 from "../../assets/Images/GoldCard.png";

export default function CardsScrollSection() {
  const { t } = useI18n();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollSectionRef = useRef(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const cardsData = [
    {
      id: 0,
      name: t("home.cards.cards.visa.name"),
      subName: t("home.cards.cards.visa.subName"),
      image: card4,
      desc: t("home.cards.cards.visa.desc"),
    },
    {
      id: 1,
      name: t("home.cards.cards.agar.name"),
      subName: t("home.cards.cards.agar.subName"),
      image: card1,
      desc: t("home.cards.cards.agar.desc"),
    },
    {
      id: 2,
      name: t("home.cards.cards.nigat.name"),
      subName: t("home.cards.cards.nigat.subName"),
      image: card2,
      desc: t("home.cards.cards.nigat.desc"),
    },
    {
      id: 3,
      name: t("home.cards.cards.amana.name"),
      subName: t("home.cards.cards.amana.subName"),
      image: card3,
      desc: t("home.cards.cards.amana.desc"),
    },
  ];

  const cardDetailsById = {
    0: {
      image: card4,
      title: t("home.cards.details.visa.title"),
      subtitle: t("home.cards.details.visa.subtitle"),
      description: t("home.cards.details.visa.description"),
      features: [
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.visa.features.f1.title"),
          desc: t("home.cards.details.visa.features.f1.desc"),
        },
        {
          icon: <FaShieldAlt />,
          title: t("home.cards.details.visa.features.f2.title"),
          desc: t("home.cards.details.visa.features.f2.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.visa.features.f3.title"),
          desc: t("home.cards.details.visa.features.f3.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.visa.features.f4.title"),
          desc: t("home.cards.details.visa.features.f4.desc"),
        },
      ],
    },
    1: {
      image: card1,
      title: t("home.cards.details.agar.title"),
      subtitle: t("home.cards.details.agar.subtitle"),
      description: t("home.cards.details.agar.description"),
      features: [
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.agar.features.f1.title"),
          desc: t("home.cards.details.agar.features.f1.desc"),
        },
        {
          icon: <FaShieldAlt />,
          title: t("home.cards.details.agar.features.f2.title"),
          desc: t("home.cards.details.agar.features.f2.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.agar.features.f3.title"),
          desc: t("home.cards.details.agar.features.f3.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.agar.features.f4.title"),
          desc: t("home.cards.details.agar.features.f4.desc"),
        },
      ],
    },
    2: {
      image: card2,
      title: t("home.cards.details.nigat.title"),
      subtitle: t("home.cards.details.nigat.subtitle"),
      description: t("home.cards.details.nigat.description"),
      features: [
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.nigat.features.f1.title"),
          desc: t("home.cards.details.nigat.features.f1.desc"),
        },
        {
          icon: <FaShieldAlt />,
          title: t("home.cards.details.nigat.features.f2.title"),
          desc: t("home.cards.details.nigat.features.f2.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.nigat.features.f3.title"),
          desc: t("home.cards.details.nigat.features.f3.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.nigat.features.f4.title"),
          desc: t("home.cards.details.nigat.features.f4.desc"),
        },
      ],
    },
    3: {
      image: card3,
      title: t("home.cards.details.amana.title"),
      subtitle: t("home.cards.details.amana.subtitle"),
      description: t("home.cards.details.amana.description"),
      features: [
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.amana.features.f1.title"),
          desc: t("home.cards.details.amana.features.f1.desc"),
        },
        {
          icon: <FaShieldAlt />,
          title: t("home.cards.details.amana.features.f2.title"),
          desc: t("home.cards.details.amana.features.f2.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.amana.features.f3.title"),
          desc: t("home.cards.details.amana.features.f3.desc"),
        },
        {
          icon: <FaCheckCircle />,
          title: t("home.cards.details.amana.features.f4.title"),
          desc: t("home.cards.details.amana.features.f4.desc"),
        },
      ],
    },
  };

  const activeCard = cardsData[activeCardIndex];
  const activeCardDetails = cardDetailsById[activeCard.id];

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollSectionRef.current) return;

      const rect = scrollSectionRef.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const fullyScrolled = -rect.top;

      if (fullyScrolled >= 0 && fullyScrolled <= elementHeight - viewportHeight) {
        const progress = fullyScrolled / (elementHeight - viewportHeight);
        setScrollProgress(progress * 100);

        const slotSize = 100 / (cardsData.length - 1);
        const index = Math.min(
          Math.floor((progress * 100) / slotSize + 0.5),
          cardsData.length - 1,
        );
        setActiveCardIndex(index);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cardsData.length]);

  return (
    <section
      className="relative h-[400vh] md:h-[350vh] bg-white"
      ref={scrollSectionRef}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-[5%] py-10 md:py-0 isolate">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center w-full max-w-[1200px] gap-2 md:gap-20 h-full max-h-[900px] mx-auto">
          <div className="flex-[1.1] flex justify-center items-center relative z-[1] h-[35vh] sm:h-[45vh] md:h-[500px] w-full [perspective:2000px] mt-2 md:mt-0">
            {cardsData.map((card, idx) => {
              const totalCards = cardsData.length;
              const slotSize = 100 / (totalCards - 1);
              const cardActivePoint = idx * slotSize;

              let translateY = 600;
              let opacity = 0;
              let scale = 1;
              const zIndex = 10 + idx;

              const baseRotation = -5.5;
              const rotation = baseRotation;

              if (scrollProgress >= cardActivePoint) {
                const cardsAhead = (scrollProgress - cardActivePoint) / slotSize;
                translateY = -cardsAhead * 35;
                scale = Math.max(0.75, 1 - cardsAhead * 0.08);
                opacity = 1;
              } else {
                const startShowing = Math.max(
                  0,
                  (idx - 1) * slotSize + slotSize * 0.15,
                );
                const endShowing = cardActivePoint;

                if (scrollProgress >= startShowing) {
                  const progressInSlot =
                    (scrollProgress - startShowing) / (endShowing - startShowing);
                  const easedProgress = 1 - Math.pow(1 - progressInSlot, 3);
                  translateY = 600 * (1 - easedProgress);
                  scale = 0.85 + easedProgress * 0.15;
                  opacity = Math.min(1, progressInSlot * 2.5);
                }
              }

              return (
                <div
                  key={card.id}
                  className="absolute inset-x-0 mx-auto w-[75%] sm:w-[80%] md:w-[85%] max-w-[520px] rounded-[16px] sm:rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:shadow-[0_30px_70px_rgba(0,0,0,0.2)] will-change-transform bg-white border border-slate-100 transition-transform duration-200 ease-out"
                  style={{
                    transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.name}
                    className="w-full h-auto block"
                    priority={idx === 0}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex-[0.9] flex flex-col justify-end md:justify-center items-center md:items-start opacity-100 translate-y-0 px-4 sm:px-6 md:px-0 md:pl-5 w-full mb-4 md:mb-0 relative z-[20]">
            <div className="w-[100px] sm:w-[150px] md:w-[180px] bg-slate-100 h-1 sm:h-1.5 rounded-full mb-6 relative overflow-hidden">
              <div
                className="w-full h-full bg-gradient-to-r from-orange-600 to-orange-400 origin-left transition-transform duration-300 ease-out will-change-transform"
                style={{ transform: `scaleX(${scrollProgress / 100})` }}
              ></div>
            </div>

            <div className="relative w-full h-auto min-h-[220px] sm:min-h-[250px] md:h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCardIndex}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center md:text-left absolute inset-0 flex flex-col items-center md:items-start"
                >
                  <motion.h2
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xl sm:text-2xl md:text-3xl font-black text-[#004360] mb-3 leading-tight tracking-tight"
                  >
                    {cardsData[activeCardIndex].name}{" "}
                    <span className="text-[#004360] font-bold">
                      {cardsData[activeCardIndex].subName}
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xs sm:text-sm md:text-base text-slate-500 font-normal leading-relaxed mb-4 md:mb-6 max-w-[450px] mx-auto md:mx-0"
                  >
                    {cardsData[activeCardIndex].desc}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#ea5c0b] text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg shadow-[#ea5c0b]/20 hover:bg-[#004360] hover:-translate-y-1 hover:shadow-xl transition-all w-fit uppercase tracking-wider md:tracking-widest mt-2 md:mt-0"
                    onClick={() => setIsCardModalOpen(true)}
                    type="button"
                  >
                    {t("home.cards.buttons.exploreDetails")}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
        <DialogContent className="max-w-[1050px] p-0 overflow-hidden bg-white rounded-[20px] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]">
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] min-h-[600px]">
              <div className="relative bg-[#f8fafc] p-12 lg:p-16 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#ff6b0b_0%,transparent_50%)]" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full max-w-[320px]"
                >
                  <div className="absolute inset-0 bg-[#ff6b0b]/10 blur-[60px] rounded-full scale-125 animate-pulse" />
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <Image
                      src={activeCardDetails.image}
                      alt={activeCardDetails.title}
                      className="relative w-full h-auto drop-shadow-[0_45px_65px_rgba(0,0,0,0.25)]"
                      priority
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-12 text-center relative z-10"
                >
                  <p className="text-[10px] font-black tracking-[4px] uppercase text-slate-400 mb-2">
                    {t("home.cards.modal.securityGrade")}
                  </p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="p-10 lg:p-20 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-600 mb-6 w-fit"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {activeCardDetails.subtitle}
                  </span>
                </motion.div>

                <DialogHeader className="text-left">
                  <DialogTitle className="text-4xl lg:text-6xl font-black text-[#003460] leading-tight mb-8 tracking-tighter">
                    {activeCardDetails.title}
                  </DialogTitle>
                </DialogHeader>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="text-slate-400 text-lg leading-relaxed mb-12 max-w-xl font-medium"
                >
                  {activeCardDetails.description}
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                  {activeCardDetails.features.map((f, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.08 + i * 0.03,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      key={i}
                      className="group flex gap-5 items-start"
                    >
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                        {f.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#003460] mb-1.5">
                          {f.title}
                        </h4>
                        <p className="text-[13px] text-slate-400 leading-snug">
                          {f.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
