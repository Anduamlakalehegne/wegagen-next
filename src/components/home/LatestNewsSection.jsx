"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { FaArrowRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useI18n } from "../i18n/I18nProvider";

import news from "../../assets/Images/defualt.bmp";

const apiUrl =
  "https://weg.back.strapi.wegagen.com/api/news?populate=*&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=3";

export default function LatestNewsSection() {
  const { t } = useI18n();
  const [newsData, setNewsData] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  // shape: { type: 'news' | 'loading' | 'error', data?: {...} }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
  };

  useEffect(() => {
    let cancelled = false;

    const registerLoader = async () => {
      try {
        if (typeof window === "undefined") return;
        const mod = await import("ldrs");
        if (cancelled) return;
        mod.spiral.register();
      } catch (_) {}
    };

    registerLoader();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        setNewsData(json.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeModal]);

  const closeModal = () => setActiveModal(null);

  const preloadImage = (url) => {
    if (!url) return;
    const img = new window.Image();
    img.src = url;
  };

  const newsDetail = async (newsId, cachedData = null) => {
    const openModal = (attributes) => {
      const publishDate = attributes.createdAt
        ? format(parseISO(attributes.createdAt), "MMMM dd, yyyy")
        : "Recent News";
      setActiveModal({ type: "news", data: { ...attributes, publishDate } });
    };

    if (cachedData) {
      openModal(cachedData.attributes || cachedData);
      try {
        const res = await fetch(
          `https://weg.back.strapi.wegagen.com/api/news/${newsId}?populate=*`,
        );
        const full = await res.json();
        if (full?.data?.attributes) openModal(full.data.attributes);
      } catch (_) {}
      return;
    }

    setActiveModal({ type: "loading" });
    try {
      const res = await fetch(
        `https://weg.back.strapi.wegagen.com/api/news/${newsId}?populate=*`,
      );
      const full = await res.json();
      openModal(full.data.attributes);
    } catch (error) {
      console.error("Error fetching detailed news:", error);
      setActiveModal({ type: "error" });
    }
  };

  return (
    <>
      <div className="relative bg-gradient-to-b from-slate-50 via-white to-white py-[70px] md:py-[100px] overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-100/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#004360]/5 rounded-full blur-[110px] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 z-10">
          <div
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 md:mb-14"
            data-aos="fade-up"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#ff6b0b] text-[11px] font-extrabold tracking-[2px] uppercase mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b0b] animate-pulse" />
                {t("home.latestNews.header.badge")}
              </div>
              <h2 className="text-[32px] sm:text-[38px] md:text-[48px] font-extrabold text-[#004360] tracking-[-1.5px] leading-[1.1]">
                {t("home.latestNews.header.titlePrefix")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12]">
                  {t("home.latestNews.header.titleAccent")}
                </span>{" "}
                {t("home.latestNews.header.titleSuffix")}
              </h2>
              <p className="text-[14px] md:text-[16px] text-slate-400 mt-3 max-w-[480px] leading-[1.8]">
                {t("home.latestNews.header.description")}
              </p>
            </div>

            <div className="hidden sm:flex shrink-0" data-aos="fade-left">
              <Link href="/News" className="no-underline">
                <button className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#004360] text-white text-[13px] font-bold shadow-[0_8px_24px_rgba(0,67,96,0.2)] hover:shadow-[0_12px_32px_rgba(0,67,96,0.3)] hover:-translate-y-0.5 transition-all duration-300" type="button">
                  {t("home.latestNews.buttons.viewAll")}
                  <FaArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </Link>
            </div>
          </div>

          {newsData.length > 0 ? (
            <>
              <div className="hidden md:grid md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 mb-6 lg:mb-8">
                {newsData[0] &&
                  (() => {
                    const item = newsData[0];
                    const txt =
                      item.attributes.description[0]?.children
                        .map((c) => c.text)
                        .join(" ") ||
                      "";
                    const excerpt =
                      txt.slice(0, 180) + (txt.length > 180 ? "…" : "");
                    const date = item.attributes.createdAt
                      ? format(parseISO(item.attributes.createdAt), "MMM dd, yyyy")
                      : "";
                    const readMins = Math.max(
                      1,
                      Math.ceil(txt.split(" ").length / 200),
                    );
                    const featuredUrl = item.attributes.featured_image?.data
                      ? `https://weg.back.strapi.wegagen.com${item.attributes.featured_image.data.attributes.url}`
                      : null;
                    return (
                      <div
                        className="group relative bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-[0_6px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col will-change-transform cursor-pointer"
                        data-aos="fade-right"
                        onClick={() => newsDetail(item.id, item)}
                        onMouseEnter={() => preloadImage(featuredUrl)}
                      >
                        <div className="relative overflow-hidden h-[320px] lg:h-[380px] shrink-0">
                          <Image
                            src={featuredUrl || news}
                            alt={item.attributes.title}
                            fill
                            sizes="(min-width: 1024px) 800px, 100vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] will-change-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                          <span className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm text-[#ff6b0b] text-[10px] font-extrabold px-3 py-1 rounded-full tracking-[1px] uppercase shadow-sm">
                            Banking News
                          </span>
                          {date && (
                            <span className="absolute top-4 right-4 z-10 bg-[#ff6b0b]/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                              {date}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col flex-1 p-6 lg:p-7">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {readMins} min read
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-[11px] text-slate-400 font-medium">
                              Wegagen Bank
                            </span>
                          </div>
                          <h3 className="text-[20px] lg:text-[22px] font-extrabold text-[#004360] leading-[1.35] mb-3 line-clamp-2 group-hover:text-[#ff6b0b] transition-colors duration-300">
                            {item.attributes.title}
                          </h3>
                          <p className="text-[14px] text-slate-500 leading-[1.75] flex-1 mb-5 line-clamp-3">
                            {excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-[12px] font-extrabold tracking-[1px] uppercase text-slate-400 group-hover:text-[#ff6b0b] transition-colors duration-300">
                            {t("home.latestNews.buttons.readFull")}
                            <FaArrowRight
                              size={11}
                              className="transition-transform duration-300 group-hover:translate-x-1.5"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                        </div>
                      </div>
                    );
                  })()}

                <div className="flex flex-col gap-6">
                  {newsData.slice(1, 3).map((item, idx) => {
                    const txt =
                      item.attributes.description[0]?.children
                        .map((c) => c.text)
                        .join(" ") ||
                      "";
                    const excerpt =
                      txt.slice(0, 100) + (txt.length > 100 ? "…" : "");
                    const date = item.attributes.createdAt
                      ? format(parseISO(item.attributes.createdAt), "MMM dd, yyyy")
                      : "";
                    const featuredUrl = item.attributes.featured_image?.data
                      ? `https://weg.back.strapi.wegagen.com${item.attributes.featured_image.data.attributes.url}`
                      : null;
                    return (
                      <div
                        key={item.id}
                        className="group relative bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col will-change-transform cursor-pointer flex-1"
                        data-aos="fade-left"
                        data-aos-delay={idx * 100}
                        onClick={() => newsDetail(item.id, item)}
                        onMouseEnter={() => preloadImage(featuredUrl)}
                      >
                        <div className="relative overflow-hidden h-[155px] shrink-0">
                          <Image
                            src={featuredUrl || news}
                            alt={item.attributes.title}
                            fill
                            sizes="400px"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07] will-change-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                          {date && (
                            <span className="absolute top-2.5 right-3 z-10 bg-[#ff6b0b]/90 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                              {date}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 p-4 lg:p-5">
                          <h3 className="text-[14px] lg:text-[15px] font-bold text-[#004360] leading-[1.4] mb-2 line-clamp-2 group-hover:text-[#ff6b0b] transition-colors duration-300">
                            {item.attributes.title}
                          </h3>
                          <p className="text-[13px] text-slate-400 leading-[1.65] flex-1 mb-3 line-clamp-2">
                            {excerpt}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-[1px] uppercase text-slate-300 group-hover:text-[#ff6b0b] transition-colors duration-300">
                            {t("home.latestNews.buttons.readMore")}{" "}
                            <FaArrowRight
                              size={9}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex md:hidden flex-col gap-5 mb-8">
                {newsData.slice(0, 3).map((item, idx) => {
                  const txt =
                    item.attributes.description[0]?.children
                      .map((c) => c.text)
                      .join(" ") ||
                    "";
                  const excerpt =
                    txt.slice(0, 110) + (txt.length > 110 ? "…" : "");
                  const date = item.attributes.createdAt
                    ? format(parseISO(item.attributes.createdAt), "MMM dd, yyyy")
                    : "";
                  const featuredUrl = item.attributes.featured_image?.data
                    ? `https://weg.back.strapi.wegagen.com${item.attributes.featured_image.data.attributes.url}`
                    : null;
                  return (
                    <div
                      key={item.id}
                      className="group flex bg-white rounded-[18px] overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.045)] active:scale-[0.99] transition-all duration-300 will-change-transform cursor-pointer"
                      data-aos="fade-up"
                      data-aos-delay={idx * 80}
                      onClick={() => newsDetail(item.id, item)}
                      onMouseEnter={() => preloadImage(featuredUrl)}
                    >
                      <div className="relative overflow-hidden w-[110px] shrink-0">
                        <Image
                          src={featuredUrl || news}
                          alt={item.attributes.title}
                          fill
                          sizes="110px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                      </div>
                      <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
                        {date && (
                          <span className="text-[10px] text-[#ff6b0b] font-bold mb-1 tracking-wide">
                            {date}
                          </span>
                        )}
                        <h3 className="text-[13px] font-bold text-[#004360] leading-[1.4] mb-1.5 line-clamp-2 group-hover:text-[#ff6b0b] transition-colors duration-200">
                          {item.attributes.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-[1.5] line-clamp-2 mb-3">
                          {excerpt}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[1.5px] uppercase text-[#ff6b0b]">
                          {t("home.latestNews.buttons.readFull")}
                          <FaArrowRight size={10} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-20 mb-10">
              <l-spiral size="50" speed="0.9" color="#003460"></l-spiral>
            </div>
          )}

          <div className="flex sm:hidden justify-center mt-2" data-aos="fade-up">
            <Link href="/News" className="no-underline">
              <button className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#004360] text-white text-[13px] font-bold shadow-[0_8px_24px_rgba(0,67,96,0.2)] hover:shadow-[0_12px_32px_rgba(0,67,96,0.3)] hover:-translate-y-0.5 transition-all duration-300" type="button">
                {t("home.latestNews.buttons.viewAll")}
                <FaArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#00121a]/85 backdrop-blur-[12px]"
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-[1050px] max-h-[90vh] bg-white rounded-[20px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col z-10"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-6 right-6 z-30 w-11 h-11 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 text-white flex items-center justify-center transition-all shadow-lg shadow-orange-500/30 border border-white/20 active:scale-95"
                type="button"
              >
                <IoClose size={26} />
              </motion.button>

              <div className="overflow-y-auto custom-scrollbar h-full">
                {activeModal.type === "loading" && (
                  <div className="flex flex-col items-center justify-center py-40">
                    <l-spiral size="70" speed="0.9" color="#ff6b0b"></l-spiral>
                    <motion.p
                      variants={itemVariants}
                      className="mt-8 text-[#004360]/50 font-bold tracking-[2px] uppercase text-xs"
                    >
                      {t("home.latestNews.modal.loading")}
                    </motion.p>
                  </div>
                )}

                {activeModal.type === "error" && (
                  <div className="text-center py-32 px-10">
                    <motion.div
                      variants={itemVariants}
                      className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-12"
                    >
                      <span className="text-3xl font-bold">!</span>
                    </motion.div>
                    <motion.h3
                      variants={itemVariants}
                      className="text-2xl font-black text-[#003460] mb-3"
                    >
                      {t("home.latestNews.modal.errorTitle")}
                    </motion.h3>
                    <motion.p
                      variants={itemVariants}
                      className="text-slate-400 max-w-xs mx-auto mb-10"
                    >
                      {t("home.latestNews.modal.errorDesc")}
                    </motion.p>
                    <motion.button
                      variants={itemVariants}
                      onClick={closeModal}
                      className="px-10 py-4 bg-[#003460] text-white rounded-2xl font-bold shadow-xl shadow-[#003460]/20 active:scale-95 transition-transform"
                      type="button"
                    >
                      {t("home.latestNews.buttons.back")}
                    </motion.button>
                  </div>
                )}

                {activeModal.type === "news" && (
                  <div className="flex flex-col bg-white">
                    <div className="relative w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                      <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative w-full"
                      >
                        <div className="relative w-full max-h-[550px] aspect-[16/9]">
                          <Image
                            src={
                              activeModal.data.featured_image?.data
                                ? `https://weg.back.strapi.wegagen.com${activeModal.data.featured_image.data.attributes.url}`
                                : news
                            }
                            alt={activeModal.data.title}
                            fill
                            sizes="(min-width: 1024px) 1050px, 100vw"
                            className="object-cover"
                            priority
                          />
                        </div>
                      </motion.div>
                    </div>

                    <div className="max-w-[1100px] mx-auto w-full px-6 md:px-12 py-12 md:py-16">
                      <motion.header
                        variants={itemVariants}
                        className="mb-10 border-b border-slate-100 pb-8"
                      >
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-600/90 text-white text-[9px] font-extrabold uppercase tracking-widest">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            {t("home.latestNews.modal.pressBadge")}
                          </span>
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">
                            {activeModal.data.publishDate}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#003460] leading-tight tracking-tight max-w-4xl">
                          {activeModal.data.title}
                        </h2>
                      </motion.header>

                      <div className="w-full">
                        <div className="space-y-8">
                          <div className="relative">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-orange-100/50 rounded-full hidden md:block" />
                            {activeModal.data.description &&
                            Array.isArray(activeModal.data.description) ? (
                              activeModal.data.description.map((p, i) => (
                                <motion.p
                                  variants={itemVariants}
                                  key={i}
                                  className={`text-slate-500 text-base md:text-lg leading-[1.7] mb-6 font-normal ${i === 0 ? "text-[#003460] font-semibold text-lg md:text-xl" : ""}`}
                                >
                                  {p.children
                                    ? p.children.map((c) => c.text).join(" ")
                                    : ""}
                                </motion.p>
                              ))
                            ) : (
                              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300">
                                {t("home.latestNews.modal.finalizing")}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
