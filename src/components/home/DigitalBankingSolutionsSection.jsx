"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useI18n } from "../i18n/I18nProvider";

import {
  FaChartLine,
  FaCreditCard,
  FaMobileAlt,
  FaPause,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaWallet,
  FaWifi,
} from "react-icons/fa";

import efoyita from "../../assets/Images/Home Page/Efoyta.png";
import ebirr from "../../assets/Images/Home Page/ebirr-4-web.jpg";
import mobileBanking from "../../assets/Images/Home Page/mobile banking.png";
import internetBanking from "../../assets/Images/Home Page/internate banking.png";
import cardBanking from "../../assets/Images/Home Page/card banking.png";

export default function DigitalBankingSolutionsSection() {
  const { t } = useI18n();

  const [dispaly, setDisplay] = useState(1);
  const [prevDisplay, setPrevDisplay] = useState(null);
  const [tabProgress, setTabProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const TAB_DURATION = 6000;
  const TICK_INTERVAL = 30;
  const SLIDE_DURATION = 1100;

  const slideTransition = {
    duration: SLIDE_DURATION / 1000,
    ease: "easeInOut",
  };

  const displayRef = useRef(1);
  useEffect(() => {
    displayRef.current = dispaly;
  }, [dispaly]);

  const ebankingTabs = [
    { id: 1, label: t("home.digitalBanking.tabs.t1"), icon: <FaChartLine /> },
    { id: 2, label: t("home.digitalBanking.tabs.t2"), icon: <FaWallet /> },
    { id: 3, label: t("home.digitalBanking.tabs.t3"), icon: <FaMobileAlt /> },
    { id: 4, label: t("home.digitalBanking.tabs.t4"), icon: <FaWifi /> },
    { id: 5, label: t("home.digitalBanking.tabs.t5"), icon: <FaCreditCard /> },
  ];

  const triggerTransition = (currentId, nextId) => {
    setPrevDisplay(currentId);
    setDisplay(nextId);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setPrevDisplay(null);
      setTabProgress(0);
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    if (isTransitioning || isPaused) return;
    const increment = (TICK_INTERVAL / TAB_DURATION) * 100;
    const interval = setInterval(() => {
      setTabProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          const current = displayRef.current;
          const nextId = current >= 5 ? 1 : current + 1;
          triggerTransition(current, nextId);
          return 100;
        }
        return next;
      });
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [dispaly, isTransitioning, isPaused]);

  const handleTabClick = (id) => {
    if (id === dispaly || isTransitioning) return;
    triggerTransition(dispaly, id);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const nextId = dispaly >= 5 ? 1 : dispaly + 1;
    triggerTransition(dispaly, nextId);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    const prevId = dispaly <= 1 ? 5 : dispaly - 1;
    triggerTransition(dispaly, prevId);
  };

  const pClass = "text-[14px] sm:text-[15px] text-slate-500 leading-[1.85]";

  const imgWrap = (src, alt) => (
    <div className="relative flex justify-center items-center py-6 md:py-0">
      <div className="absolute w-[70%] h-[60%] bg-gradient-to-br from-orange-200/40 to-[#004360]/10 rounded-full blur-[50px] pointer-events-none" />
      <Image
        src={src}
        alt={alt}
        className="relative max-w-full h-auto max-h-[240px] sm:max-h-[300px] lg:max-h-[420px] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.10)] rounded-2xl"
        priority={false}
      />
    </div>
  );

  const textBlock = (badge, title, subtitle, children, link) => (
    <div className="flex flex-col justify-center text-center lg:text-left items-center lg:items-start px-2 lg:px-0 py-6 lg:py-0">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50/90 border border-orange-100/80 text-[#ff6b0b] text-[11px] font-extrabold tracking-[1.5px] uppercase mb-4 shadow-sm">
        <span className="w-1 h-1 rounded-full bg-[#ff6b0b]" />
        {badge}
      </div>
      <h3 className="text-[26px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#004360] mb-2 leading-[1.15] tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <h4 className="text-[15px] sm:text-[17px] font-bold text-[#ff6b0b] mb-4 tracking-wide">
          {subtitle}
        </h4>
      )}
      <div className="space-y-3 mb-6">{children}</div>
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12] text-white text-[13px] font-bold shadow-[0_6px_20px_rgba(255,107,11,0.3)] hover:shadow-[0_8px_28px_rgba(255,107,11,0.45)] hover:brightness-105 transition-all duration-300"
        >
          {link.label} <span className="text-[10px]">→</span>
        </a>
      )}
    </div>
  );

  const renderContent = (id) => {
    const panels = {
      1: (
        <>
          {textBlock(t("home.digitalBanking.panels.p1.badge"), t("home.digitalBanking.panels.p1.title"), null, (
            <>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p1.p1")}
              </p>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p1.p2")}
              </p>
            </>
          ))}
          {imgWrap(efoyita, "Efoyta Digital Lending")}
        </>
      ),
      2: (
        <>
          {textBlock(
            t("home.digitalBanking.panels.p2.badge"),
            t("home.digitalBanking.panels.p2.title"),
            t("home.digitalBanking.panels.p2.subtitle"),
            <>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p2.p1")}
              </p>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p2.p2Prefix")}
                <strong className="text-[#004360] font-bold">{t("home.digitalBanking.panels.p2.p2Strong")}</strong>
                {t("home.digitalBanking.panels.p2.p2Middle")}
                <a
                  href="https://wegagenmyaccount.ebirr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff6b0b] font-semibold hover:underline"
                >
                  {t("home.digitalBanking.panels.p2.p2LinkLabel")}
                </a>
                {t("home.digitalBanking.panels.p2.p2Suffix")}
              </p>
            </>,
            { href: "https://wegagenmyaccount.ebirr.com", label: t("home.digitalBanking.panels.p2.linkLabel") },
          )}
          {imgWrap(ebirr, "Wegagen E-Birr")}
        </>
      ),
      3: (
        <>
          {textBlock(
            t("home.digitalBanking.panels.p3.badge"),
            t("home.digitalBanking.panels.p3.title"),
            t("home.digitalBanking.panels.p3.subtitle"),
            <>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p3.p1")}
              </p>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p3.p2Prefix")}
                <strong className="text-[#004360] font-bold">{t("home.digitalBanking.panels.p3.p2Strong")}</strong>
                {t("home.digitalBanking.panels.p3.p2Suffix")}
              </p>
            </>,
          )}
          {imgWrap(mobileBanking, "Mobile Banking")}
        </>
      ),
      4: (
        <>
          {textBlock(
            t("home.digitalBanking.panels.p4.badge"),
            t("home.digitalBanking.panels.p4.title"),
            t("home.digitalBanking.panels.p4.subtitle"),
            <p className={pClass}>
              {t("home.digitalBanking.panels.p4.p1")}
            </p>,
            { href: "https://www.wegagenbanksc.com.et:4443/", label: t("home.digitalBanking.panels.p4.linkLabel") },
          )}
          {imgWrap(internetBanking, "Internet Banking")}
        </>
      ),
      5: (
        <>
          {textBlock(
            t("home.digitalBanking.panels.p5.badge"),
            t("home.digitalBanking.panels.p5.title"),
            t("home.digitalBanking.panels.p5.subtitle"),
            <>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p5.p1")}
              </p>
              <p className={pClass}>
                {t("home.digitalBanking.panels.p5.p2")}
              </p>
            </>
          )}
          {imgWrap(cardBanking, "Card Banking")}
        </>
      ),
    };

    return panels[id] || null;
  };

  return (
    <div className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 py-[70px] md:py-[100px] overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[130px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[#004360]/8 rounded-full blur-[140px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-orange-100/15 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 z-10">
        <div className="text-center mb-10 md:mb-14" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#ff6b0b] text-[11px] font-extrabold tracking-[2px] uppercase mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b0b] animate-pulse" />
            {t("home.digitalBanking.header.badge")}
          </div>
          <h2 className="text-[32px] sm:text-[40px] md:text-[50px] font-extrabold text-[#004360] tracking-[-1.5px] leading-[1.1] mb-4">
            {t("home.digitalBanking.header.titlePrefix")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12]">
              {t("home.digitalBanking.header.titleAccent")}
            </span>{" "}
            {t("home.digitalBanking.header.titleSuffix")}
          </h2>
          <p className="text-[15px] md:text-[17px] text-slate-500 max-w-[600px] mx-auto leading-[1.9]">
            {t("home.digitalBanking.header.description")}
          </p>
        </div>

        <div
          className="flex justify-center flex-wrap gap-2 md:gap-3 mb-8 md:mb-10 relative z-10"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {ebankingTabs.map((tab) => {
            const isActive = dispaly === tab.id;
            const isExiting = prevDisplay === tab.id;
            const circumference = 2 * Math.PI * 18;
            let dash = 0;
            if (isExiting) dash = circumference;
            else if (isActive)
              dash = isTransitioning ? 0 : (tabProgress / 100) * circumference;

            return (
              <button
                key={tab.id}
                className={`group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-[1.5px] font-semibold text-[12px] sm:text-[13px] whitespace-nowrap transition-all duration-300 cursor-pointer ${isActive ? "border-[#ff6b0b] text-[#ff6b0b] bg-gradient-to-br from-orange-50 to-orange-50/30 shadow-[0_4px_20px_rgba(255,107,11,0.12)] scale-[1.02]" : "border-slate-200 text-slate-500 bg-white/70 backdrop-blur-md hover:border-[#ff6b0b]/60 hover:text-[#ff6b0b] hover:bg-orange-50/50 hover:scale-[1.01]"}`}
                onClick={() => handleTabClick(tab.id)}
                type="button"
              >
                <svg width="32" height="32" viewBox="0 0 36 36" className="shrink-0">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={isActive ? "rgba(255,107,11,0.15)" : "#f1f5f9"}
                    strokeWidth="2.5"
                  />
                  {(isActive || isExiting) && (
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={isActive ? "#ff6b0b" : "#cbd5e1"}
                      strokeWidth="2.5"
                      strokeDasharray={`${dash} ${circumference}`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                      style={{ transition: "stroke-dasharray 0.03s linear" }}
                    />
                  )}
                  <foreignObject x="7" y="7" width="22" height="22">
                    <div className="flex items-center justify-center w-[22px] h-[22px] text-[11px] text-inherit">
                      {tab.icon}
                    </div>
                  </foreignObject>
                </svg>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div
          className="relative overflow-hidden rounded-[24px] md:rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/60 shadow-[0_24px_80px_rgba(0,0,0,0.07),_0_0_0_1px_rgba(255,107,11,0.06)]"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" />

          <div className="absolute top-5 right-5 md:top-7 md:right-8 z-50 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.07)] border border-slate-100/80">
            <button
              className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full text-slate-400 hover:bg-slate-50 hover:text-[#004360] transition-all duration-200"
              onClick={handlePrev}
              title={t("home.digitalBanking.controls.prev")}
              type="button"
            >
              <FaChevronLeft size={11} />
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#ff6b0b] to-[#ff8f12] text-white shadow-[0_4px_12px_rgba(255,107,11,0.35)] hover:shadow-[0_6px_18px_rgba(255,107,11,0.5)] hover:scale-105 transition-all duration-300"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? t("home.digitalBanking.controls.play") : t("home.digitalBanking.controls.pause")}
              type="button"
            >
              {isPaused ? (
                <FaPlay size={11} className="ml-0.5" />
              ) : (
                <FaPause size={11} />
              )}
            </button>
            <button
              className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full text-slate-400 hover:bg-slate-50 hover:text-[#004360] transition-all duration-200"
              onClick={handleNext}
              title={t("home.digitalBanking.controls.next")}
              type="button"
            >
              <FaChevronRight size={11} />
            </button>
          </div>

          <AnimatePresence initial={false} mode="sync">
            {isTransitioning && prevDisplay && (
              <motion.div
                key={`exit-${prevDisplay}`}
                className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 lg:gap-16 px-5 sm:px-8 lg:px-14 xl:px-[70px] pt-14 pb-8 lg:py-14 xl:py-[70px]"
                style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1, willChange: "transform" }}
                initial={{ x: "0%" }}
                animate={{ x: "-100%" }}
                exit={{ x: "-100%" }}
                transition={slideTransition}
              >
                {renderContent(prevDisplay)}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={`enter-${dispaly}-${isTransitioning ? "t" : "s"}`}
            className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 lg:gap-16 px-5 sm:px-8 lg:px-14 xl:px-[70px] pt-14 pb-8 lg:py-14 xl:py-[70px]"
            style={{ position: "relative", zIndex: 2, willChange: "transform" }}
            initial={isTransitioning ? { x: "100%" } : false}
            animate={{ x: "0%" }}
            transition={slideTransition}
          >
            {renderContent(dispaly)}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
