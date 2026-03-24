"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BsFacebook, BsTelegram, BsLinkedin, BsInstagram, BsYoutube, BsArrowUpShort } from "react-icons/bs";
import { FaXTwitter, FaLocationDot, FaPhoneVolume, FaEnvelope, FaArrowRight, FaPaperPlane } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useI18n } from "./i18n/I18nProvider";
import logo from "../assets/Images/logo.png";

const apiUrl = "https://weg.back.strapi.wegagen.com/api/exchange-rates?populate=*";
const pdfApiUrl = "https://weg.back.strapi.wegagen.com/api/adeles?populate=*";

// Terms & Tariffs Modal
function TermsModal({ isOpen, onClose, onNavigate }) {
  const { t } = useI18n();
  const terms = [
    { label: t("home.footer.modals.terms.items.branch"), path: "/branch-terms-and-tariffs" },
    { label: t("home.footer.modals.terms.items.digital"), path: "/digital-terms-and-tariffs" },
    { label: t("home.footer.modals.terms.items.credit"), path: "/credit-terms-and-tariffs" },
    { label: t("home.footer.modals.terms.items.international"), path: "/international-terms-and-tariffs" },
    { label: t("home.footer.modals.terms.items.ifb"), path: "/ifb-terms-and-tariffs" },
    { label: t("home.footer.modals.terms.items.efoyta"), path: "/efoyta-terms-and-tariffs" },
    { label: t("home.footer.modals.terms.items.share"), path: "/share-terms-and-tariffs" },
  ];

  const handleClick = (path) => {
    onClose();
    onNavigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#00121a]/85 backdrop-blur-[12px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[500px] bg-white rounded-[20px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 text-white flex items-center justify-center shadow-lg"
            >
              <IoClose size={24} />
            </button>
            <div className="p-8">
              <h3 className="text-[26px] text-[#003460] font-black tracking-tight mb-2">
                {t("home.footer.modals.terms.title")}<span className="text-[#ff6b0b]">{t("home.footer.modals.terms.accent")}</span>
              </h3>
              <p className="text-slate-400 text-sm mb-6">{t("home.footer.modals.terms.desc")}</p>
              <div className="grid gap-3">
                {terms.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#ff6b0b]/30 hover:bg-[#ff6b0b]/5 transition-all duration-300 cursor-pointer"
                    onClick={() => handleClick(item.path)}
                  >
                    <span className="text-slate-700 font-bold text-sm tracking-wide">{item.label}</span>
                    <FaArrowRight className="text-[#ff6b0b] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Exchange Rate Modal
function ExchangeRateModal({ isOpen, onClose, rates, formattedDate }) {
  const { t } = useI18n();
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#00121a]/85 backdrop-blur-[12px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-[850px] max-h-[90vh] bg-white rounded-[20px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 text-white flex items-center justify-center shadow-lg"
            >
              <IoClose size={24} />
            </button>
            <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">
              <div className="min-w-[600px]">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-[28px] font-black text-[#004360] tracking-tight text-left">
                      {t("home.footer.modals.exchange.title")}<span className="text-[#ff6b0b]">{t("home.footer.modals.exchange.accent")}</span>
                    </p>
                    <p className="text-slate-400 text-sm text-left font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {t("home.footer.modals.exchange.official")} {formattedDate}
                    </p>
                  </div>
                  <Image src={logo} alt="Logo" className="h-8 opacity-20 grayscale object-contain" />
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase font-black tracking-[2px] text-slate-400">
                      <th className="pb-4 px-3">{t("home.exchangeRate.table.currency")}</th>
                      <th className="pb-4 px-3 text-center">{t("home.exchangeRate.table.unit")}</th>
                      <th className="pb-4 px-3 text-center bg-blue-50/50 rounded-t-xl" colSpan={2}>{t("home.exchangeRate.table.cashRemittance")}</th>
                      <th className="pb-4 px-3 text-center bg-orange-50/50 rounded-t-xl" colSpan={2}>{t("home.exchangeRate.table.bankTransactions")}</th>
                    </tr>
                    <tr className="text-[12px] font-black text-[#004360] bg-slate-50 border-b border-white">
                      <th className="py-4 px-3 rounded-l-xl">Code</th>
                      <th className="py-4 px-3 text-center"></th>
                      <th className="py-4 px-3 text-center border-l border-white bg-blue-50/80">Buying</th>
                      <th className="py-4 px-3 text-center bg-blue-50/80">Selling</th>
                      <th className="py-4 px-3 text-center border-l border-white bg-orange-50/80">Buying</th>
                      <th className="py-4 px-3 text-center bg-orange-50/80 rounded-r-xl">Selling</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rates.map((rate) => (
                      <tr key={rate.id} className="text-[14px] group transition-all duration-300 hover:bg-slate-50/80">
                        <td className="py-4 px-3 flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={`https://weg.back.strapi.wegagen.com${rate.attributes.flag.data[0].attributes.url}`}
                              alt={rate.attributes.code}
                              width={32}
                              height={20}
                              className="w-8 h-5 rounded shadow-sm object-cover border border-slate-100"
                            />
                          </div>
                          <span className="font-extrabold text-[#004360] tracking-tight">{rate.attributes.code}</span>
                        </td>
                        <td className="py-4 px-3 text-center text-slate-500 font-bold">{rate.attributes.unit}</td>
                        <td className="py-4 px-3 text-center font-black text-[#004360] bg-blue-50/20">{rate.attributes.buying}</td>
                        <td className="py-4 px-3 text-center font-black text-[#ff6b0b] bg-blue-50/20">{rate.attributes.selling}</td>
                        <td className="py-4 px-3 text-center font-black text-[#004360] bg-orange-50/10">{rate.attributes.tra_buying}</td>
                        <td className="py-4 px-3 text-center font-black text-[#ff6b0b] bg-orange-50/10">{rate.attributes.tra_selling}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Simple Loan Calculator Modal
function LoanCalculatorModal({ isOpen, onClose }) {
  const { t } = useI18n();
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const principal = amount;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    setMonthlyPayment(isFinite(payment) ? payment : 0);
  }, [amount, rate, years]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#00121a]/85 backdrop-blur-[12px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[500px] bg-white rounded-[20px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 text-white flex items-center justify-center shadow-lg"
            >
              <IoClose size={24} />
            </button>
            <div className="p-8">
              <h3 className="text-[26px] text-[#003460] font-black tracking-tight mb-6">
                {t("home.footer.modals.loan.title")}<span className="text-[#ff6b0b]">{t("home.footer.modals.loan.accent")}</span>
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-600 mb-2 block">{t("home.footer.modals.loan.amount")}</label>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full accent-[#ff6b0b]"
                  />
                  <p className="text-2xl font-black text-[#003460] mt-2">{amount.toLocaleString()} ETB</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600 mb-2 block">{t("home.footer.modals.loan.rate")}</label>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-[#ff6b0b]"
                  />
                  <p className="text-2xl font-black text-[#003460] mt-2">{rate}%</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600 mb-2 block">{t("home.footer.modals.loan.term")}</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-[#ff6b0b]"
                  />
                  <p className="text-2xl font-black text-[#003460] mt-2">{years} Years</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-slate-500 mb-2">{t("home.footer.modals.loan.payment")}</p>
                  <p className="text-4xl font-black text-[#ff6b0b]">{Math.round(monthlyPayment).toLocaleString()} ETB</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Footer({ footerColor }) {
  const { t } = useI18n();
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [rates, setRates] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const getColor = () => "#007070";

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data.data;
        setRates(data);
        if (data.length > 0) {
          const date = parseISO(data[0].attributes.date);
          setFormattedDate(format(date, "MMM dd, yyyy"));
        }
      })
      .catch((error) => console.error("Error fetching exchange rates:", error));
  }, []);

  useEffect(() => {
    fetch(pdfApiUrl)
      .then((response) => response.json())
      .then((data) => {
        const pdfFile = data.data[0]?.attributes?.file?.data[0]?.attributes?.url;
        if (pdfFile) setPdfUrl(`https://weg.back.strapi.wegagen.com${pdfFile}`);
      })
      .catch((error) => console.error("Error fetching PDF:", error));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  const linkClass = "group flex items-center text-[#94a3b8] no-underline text-[14px] transition-all duration-300 hover:text-[#ff6b0b] hover:no-underline cursor-pointer w-fit py-1.5 font-medium";
  const headingClass = "text-white text-[13px] font-black uppercase tracking-[2.5px] mb-6 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-1 after:bg-white/10";

  return (
    <>
      <footer
        className="relative bg-[#001d2a] pt-8 md:pt-10 pb-8 overflow-hidden font-inter"
        style={{
          ...(footerColor === "wadya" ? { backgroundColor: getColor() } : {}),
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[4px] flex justify-center pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#ff6b0b] to-transparent opacity-80" />
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff6b0b]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          {/* Newsletter Section */}
          <div className="mb-10 p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 backdrop-blur-md border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff6b0b]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="relative text-center lg:text-left">
              <h3 className="text-white text-xl md:text-2xl font-black tracking-tighter mb-1 uppercase">{t("home.footer.newsletter.titlePrefix")}<span className="text-[#ff6b0b]">{t("home.footer.newsletter.titleAccent")}</span></h3>
              <p className="text-[#94a3b8] font-medium text-[13px] md:text-sm">{t("home.footer.newsletter.description")}</p>
            </div>
            <div className="relative w-full lg:max-w-md flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 relative group text-left">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ff6b0b] transition-colors" />
                <input
                  type="email"
                  placeholder={t("home.footer.newsletter.placeholder")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff6b0b]/50 transition-all font-medium text-[13px]"
                />
              </div>
              <button className="bg-[#ff6b0b] hover:bg-[#e85a00] text-white font-black py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,107,11,0.25)] hover:shadow-[0_15px_30px_rgba(255,107,11,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95 whitespace-nowrap text-[13px]">
                {t("home.footer.newsletter.button")} <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-10 lg:gap-14 mb-10">
            {/* Brand Column */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Image src={logo} alt="Wegagen Bank Logo" className="w-[220px] object-contain" width={220} height={60} />
                <p className="text-[16px] leading-relaxed text-[#94a3b8] max-w-[340px] font-medium text-left">{t("home.footer.brandDescription")}</p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="group flex items-center gap-4 text-[#cbd5e1] transition-all hover:text-white">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#ff6b0b]/30 group-hover:bg-[#ff6b0b]/10 transition-all">
                    <FaPhoneVolume className="text-[#FF8F12]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#94a3b8]">{t("home.footer.contact.callCenter")}</span>
                    <span className="text-lg font-black tracking-tight self-start">866</span>
                  </div>
                </div>

                <div className="group flex items-center gap-4 text-[#cbd5e1] transition-all hover:text-white">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#ff6b0b]/30 group-hover:bg-[#ff6b0b]/10 transition-all">
                    <FaEnvelope className="text-[#FF8F12]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#94a3b8]">{t("home.footer.contact.email")}</span>
                    <span className="font-bold tracking-tight self-start">info@wegagen.com</span>
                  </div>
                </div>

                <div className="group flex items-center gap-4 text-[#cbd5e1] transition-all hover:text-white">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#ff6b0b]/30 group-hover:bg-[#ff6b0b]/10 transition-all">
                    <FaLocationDot className="text-[#FF8F12]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#94a3b8]">{t("home.footer.contact.location")}</span>
                    <span className="font-bold tracking-tight">{t("home.footer.contact.address")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className={headingClass}>{t("home.footer.sections.explore")}</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: t("home.footer.links.bid"), to: "/bid" },
                  { label: t("home.footer.links.career"), to: "/vacancy" },
                  { label: t("home.footer.links.terms"), onClick: () => setShowTermsModal(true) },
                  { label: t("home.footer.links.privacy"), to: "/wegagen-privacy-policy" },
                  { label: t("home.footer.links.risk"), to: "/risk-management" },
                  { label: t("home.footer.links.relatedParty"), to: "/related-party-transaction" }
                ].map((link, i) => (
                  link.to ? (
                    <Link key={i} href={link.to} className={linkClass}>
                      <span className="w-0 h-[1.5px] bg-[#ff6b0b] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  ) : (
                    <span key={i} onClick={link.onClick} className={linkClass}>
                      <span className="w-0 h-[1.5px] bg-[#ff6b0b] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.label}
                    </span>
                  )
                ))}
              </div>
            </div>

            <div>
              <h4 className={headingClass}>{t("home.footer.sections.insights")}</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: t("home.footer.links.news"), to: "/news" },
                  { label: t("home.footer.links.reports"), to: "/annual-report" },
                  { label: t("home.footer.links.bankFormat"), to: "/bank-format" },
                  { label: t("home.footer.links.gallery"), to: "/gallery" },
                  ...(pdfUrl ? [{ label: t("home.footer.links.adele"), href: pdfUrl }] : [])
                ].map((link, i) => (
                  link.href ? (
                    <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      <span className="w-0 h-[1.5px] bg-[#ff6b0b] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.label}
                    </a>
                  ) : (
                    <Link key={i} href={link.to} className={linkClass}>
                      <span className="w-0 h-[1.5px] bg-[#ff6b0b] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>

            <div>
              <h4 className={headingClass}>{t("home.footer.sections.services")}</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: t("home.footer.links.findBranch"), to: "/branch-location" },
                  { label: t("home.footer.links.atm"), to: "/atm-location" },
                  { label: t("home.footer.links.exchange"), onClick: () => setShowExchangeModal(true) },
                  { label: t("home.footer.links.loan"), onClick: () => setShowLoanCalculator(true) }
                ].map((link, i) => (
                  link.to ? (
                    <Link key={i} href={link.to} className={linkClass}>
                      <span className="w-0 h-[1.5px] bg-[#ff6b0b] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  ) : (
                    <span key={i} onClick={link.onClick} className={linkClass}>
                      <span className="w-0 h-[1.5px] bg-[#ff6b0b] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.label}
                    </span>
                  )
                ))}
                <div className="mt-8 space-y-6">
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ff6b0b] to-transparent" />
                    <span className="text-[10px] uppercase font-black tracking-[3px] text-[#ff6b0b] block mb-1">{t("home.footer.swift")}</span>
                    <span className="text-xl font-black text-white tracking-[4px]">WEGAETAA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent relative mb-8">
            <button
              onClick={scrollToTop}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#ff6b0b] flex items-center justify-center text-white text-3xl shadow-[0_0_30px_rgba(255,107,11,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 group"
            >
              <BsArrowUpShort className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8">
              <p className="text-[14px] text-[#64748b] font-medium tracking-wide">&copy; {new Date().getFullYear()} Wegagen Bank. {t("home.footer.rights")}</p>
              <div className="flex items-center gap-6">
                <Link href="/wegagen-privacy-policy" className="text-[12px] text-[#64748b] hover:text-[#ff6b0b] transition-colors uppercase font-black tracking-widest">{t("home.footer.links.privacy")}</Link>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <Link href="/risk-management" className="text-[12px] text-[#64748b] hover:text-[#ff6b0b] transition-colors uppercase font-black tracking-widest">{t("home.footer.links.risk")}</Link>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {[
                { icon: <BsFacebook />, url: "https://www.facebook.com/bankwegagen", name: "Facebook" },
                { icon: <BsTelegram />, url: "https://t.me/WegagenBanksc", name: "Telegram" },
                { icon: <FaXTwitter />, url: "https://x.com/WegagenBanksc", name: "X" },
                { icon: <BsLinkedin />, url: "https://www.linkedin.com/company/bankwegagen", name: "LinkedIn" },
                { icon: <BsYoutube />, url: "https://www.youtube.com/channel/bankwegagen", name: "YouTube" },
                { icon: <BsInstagram />, url: "https://www.instagram.com/wegagenbankofficial/", name: "Instagram" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[#cbd5e1] text-base transition-all duration-500 border border-white/5 hover:bg-[#FF8F12] hover:text-white hover:-translate-y-2 hover:rotate-6 hover:shadow-[0_10px_20px_rgba(255,107,11,0.3)] active:scale-95"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onNavigate={handleNavigate}
      />
      <ExchangeRateModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        rates={rates}
        formattedDate={formattedDate}
      />
      <LoanCalculatorModal
        isOpen={showLoanCalculator}
        onClose={() => setShowLoanCalculator(false)}
      />
    </>
  );
}
