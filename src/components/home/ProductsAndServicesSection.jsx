"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaFemale, FaChild, FaUserTie, FaUserGraduate, FaGlobe, FaHandsHelping, FaBriefcase } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

import { useI18n } from "../i18n/I18nProvider";

const products = [
  {
    id: "nigat",
    icon: FaFemale,
    href: "/services/nigat-women-account",
  },
  {
    id: "goh",
    icon: FaChild,
    href: "/services/goh-junior-account",
  },
  {
    id: "warka",
    icon: FaUserTie,
    href: "/services/warka-saving-account",
  },
  {
    id: "biruh",
    icon: FaUserGraduate,
    href: "/services/biruh-youth-account",
  },
  {
    id: "amana",
    icon: BsBank,
    href: "/services/wegagen-amana-ifb",
  },
  {
    id: "foreignCurrency",
    icon: FaGlobe,
    href: "/services/foreign-currency-account",
  },
  {
    id: "edirEqub",
    icon: FaHandsHelping,
    href: "/services/edir-equb-saving",
  },
  {
    id: "now",
    icon: FaBriefcase,
    href: "/services/now-account",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function ProductsAndServicesSection() {
  const { t } = useI18n();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (product) => {
    setActiveModal(product);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <section className="relative bg-[#fdfdfd] py-[80px] md:py-[120px] overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto mb-[50px] md:mb-[80px] px-5 md:px-[40px] text-center">
          <h2 className="text-[32px] md:text-[42px] font-extrabold text-[#003460] leading-[1.1] mb-[16px] md:mb-[24px] tracking-[-2px]">
            {t("home.productsServices.header.titlePrefix")} {" "}
            <span className="text-[#ff6b0b]">{t("home.productsServices.header.titleAccent")}</span>
          </h2>
          <div className="relative pt-[16px] md:pt-[20px] max-w-[800px] mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50px] h-[3px] bg-[#ff6b0b]" />
            <p className="text-[#64748b] text-[16px] md:text-[19px] leading-[1.6]">
              {t("home.productsServices.header.description")}
            </p>
          </div>
        </div>

        <div className="relative max-w-[1350px] mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[24px] md:gap-[32px] px-[20px] md:px-[40px]">
          {products.map((product) => {
            const Icon = product.icon;
            const baseKey = `home.productsServices.items.${product.id}`;
            return (
              <div
                key={product.id}
                className="group relative bg-[#ffffff] rounded-[20px] p-[20px] md:p-[24px] flex flex-col items-start text-left border border-[#f0f0f0] shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-500 cursor-pointer hover:-translate-y-[8px] hover:shadow-[0_20px_40px_rgba(0,52,96,0.08)] hover:border-transparent"
                onClick={() => openModal(product)}
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[20px] bg-[#ff6b0b] rounded-r-[4px] opacity-0 transition-all duration-400 group-hover:opacity-100 group-hover:h-[80%]" />

                {/* Icon */}
                <div className="w-[42px] h-[42px] md:w-[46px] md:h-[46px] bg-gradient-to-br from-[#003460] to-[#004c8c] rounded-[14px] flex items-center justify-center text-[20px] md:text-[24px] text-[#ffffff] mb-[10px] shadow-[0_8px_15px_rgba(0,52,96,0.15)] transition-all duration-400 group-hover:-rotate-[10deg] group-hover:scale-[1.1] group-hover:bg-[#ff6b0b] group-hover:bg-none group-hover:shadow-[0_8px_15px_rgba(255,107,11,0.25)]">
                  <Icon />
                </div>

                {/* Content */}
                <div className="w-full">
                  <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#003460] flex flex-col mb-[5px]">
                    {t(`${baseKey}.title`)}{" "}
                    <span className="text-[#ff6b0b] text-[14px] md:text-[15px] uppercase tracking-[1.3px]">
                      {t(`${baseKey}.subtitle`)}
                    </span>
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-[#64748b] leading-[1.6] mb-[10px]">
                    {t(`${baseKey}.description`)}
                  </p>
                  <div className="mt-auto flex items-center">
                    <button className="bg-transparent border-none text-[#003460] font-extrabold text-[12px] md:text-[13px] flex items-center gap-[8px] p-0 cursor-pointer transition-all duration-300 group-hover:text-[#ff6b0b]">
                      {t("home.productsServices.buttons.readMore")}{" "}
                      <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-[6px]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 md:p-12">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#00121a]/85 backdrop-blur-[12px]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }}
              className="relative w-full max-w-[600px] max-h-[90vh] bg-white rounded-[20px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-10"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 text-white flex items-center justify-center transition-all shadow-lg shadow-orange-500/30 border border-white/20"
              >
                <IoClose size={24} />
              </motion.button>

              {/* Modal Content */}
              <div className="overflow-y-auto p-8 md:p-12">
                <motion.div variants={itemVariants} initial="hidden" animate="visible">
                  <div className="w-[64px] h-[64px] bg-gradient-to-br from-[#003460] to-[#004c8c] rounded-[16px] flex items-center justify-center text-[32px] text-white mb-6 shadow-[0_8px_20px_rgba(0,52,96,0.2)]">
                    {(() => {
                      const Icon = activeModal.icon;
                      return <Icon />;
                    })()}
                  </div>

                  <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#003460] mb-2 leading-tight">
                    {t(`home.productsServices.items.${activeModal.id}.title`)}
                  </h2>
                  <p className="text-[#ff6b0b] text-[16px] font-extrabold uppercase tracking-[1.5px] mb-6">
                    {t(`home.productsServices.items.${activeModal.id}.subtitle`)}
                  </p>

                  <p className="text-[#64748b] text-[16px] md:text-[17px] leading-[1.7] mb-8">
                    {t(`home.productsServices.items.${activeModal.id}.description`)}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={activeModal.href}
                      onClick={closeModal}
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#003460] text-white rounded-xl font-bold transition-all hover:bg-[#004e70] shadow-[0_20px_40px_rgba(0,52,96,0.2)] hover:shadow-[0_25px_50px_rgba(0,52,96,0.25)] hover:-translate-y-1"
                    >
                      {t("home.productsServices.buttons.learnMore")}
                      <FaArrowRight />
                    </Link>
                    <button
                      onClick={closeModal}
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 text-[#64748b] rounded-xl font-bold transition-all hover:bg-slate-200"
                    >
                      {t("home.productsServices.buttons.close")}
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

