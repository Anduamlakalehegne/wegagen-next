"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Icons
import {
  IoClose, IoHome, IoChevronDown, IoShieldCheckmark, IoGlobeOutline, IoChevronForward,
  IoBriefcase, IoStorefront, IoCall, IoLocation, IoInformationCircle
} from "react-icons/io5";
import {
  MdWork, MdContactPhone, MdLocationOn, MdKeyboardArrowDown, MdSavings, MdSupportAgent, MdAdsClick
} from "react-icons/md";
import {
  RiMenu2Line, RiTeamFill, RiNewspaperFill, RiBookOpenFill, RiHandCoinFill,
} from "react-icons/ri";
import {
  BsGraphUp, BsCreditCard2Front, BsShieldFillCheck, BsInstagram, BsYoutube, BsFacebook, BsTelegram, BsLinkedin
} from "react-icons/bs";
import {
  FaLandmark, FaPhone, FaEnvelope, FaSwift, FaLocationDot, FaPhoneVolume, FaMosque, FaFacebookF, FaLinkedinIn, FaXTwitter,
  FaFileLines, FaDownload
} from "react-icons/fa6";
import { GiPayMoney, GiWorld } from "react-icons/gi";

import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useI18n } from "./i18n/I18nProvider";

// Assets
import WegagenLogo from "../assets/Images/logo.png";
import wadya from "../assets/Images/wadyaLogo.png";
import menuFeature from "../assets/Images/MenuFeature Image.png";
import menuFeature2 from "../assets/Images/MenuFeature Image2.png";

// ─── Menu Data ───────────────────────────────────────────────────────────────
const MENU_CONFIG = {
  aboutUs: {
    title: "About Wegagen",
    categories: [
      {
        label: "About Us", icon: <FaLandmark />,
        links: [
          { label: "About Wegagen Bank", path: "/about-us", display: 1, desc: "Our history, mission and core values" },
          { label: "Our History (Timeline)", path: "/about-us", display: 7, desc: "Milestones of excellence since 1996" },
          { label: "Strategic Objectives", path: "/about-us", display: 10, desc: "Driving innovation and financial growth" },
        ]
      },
      {
        label: "Corporate Governance", icon: <RiTeamFill />,
        links: [
          { label: "Board of Directors", path: "/about-us", display: 2, desc: "Visionary leadership for sustainable growth" },
          { label: "Core Management", path: "/about-us", display: 3, desc: "Our executive team driving success" },
          { label: "Senior Management Team", path: "/about-us", display: 4, desc: "Expert leaders in various banking sectors" },
          { label: "Management Team", path: "/about-us", display: 5, desc: "The operational pillars of our bank" },
          { label: "District Directors", path: "/about-us", display: 6, desc: "Regional excellence and local commitment" },
          { label: "Sharia Advisory Committee", path: "/about-us", display: 9, desc: "Ensuring Sharia-compliant financial solutions" },
        ]
      },
      {
        label: "Legal & Policies", icon: <IoShieldCheckmark />,
        links: [
          { label: "Bank Policies", path: "/policies", display: 7, desc: "Transparency and ethical banking standards" },
          { label: "Memorandum of Association", path: "/memorandum", display: 7, desc: "Our legal foundation and bylaws" },
        ]
      }
    ]
  },
  bankingServices: {
    title: "Banking Solutions",
    categories: [
      {
        label: "Personal Banking", icon: <MdSavings />,
        links: [
          { label: "Local currency saving accounts", path: "/personal-banking", display: 1, desc: "Secure your future with flexible saving options" },
          { label: "Special Saving Account", path: "/personal-banking", display: 2, desc: "Tailored accounts for unique financial goals" },
          { label: "Goh Child Trust Account", path: "/personal-banking", display: 3, desc: "Investing in the next generation's future" },
          { label: "Nigat (Women) Saving Account", path: "/personal-banking", display: 4, desc: "Empowering women with financial tools" },
          { label: "Elders/Warka Saving Account", path: "/personal-banking", display: 5, desc: "Dignified banking for our senior citizens" },
        ]
      },
      {
        label: "Loan Facilities", icon: <GiPayMoney />,
        links: [
          { label: "General eligibility Criteria", path: "/loan-facilities", display: 1, desc: "Understand our lending criteria" },
          { label: "Working Capital Loan", path: "/working-capital-loan", display: 1, desc: "Fuel your business growth and operations" },
          { label: "Asset Financing Loans", path: "/asset-financing-loans", display: 1, desc: "Direct financing for machinery and vehicle" },
          { label: "Letter of Bank Guarantee Facilities", path: "/letter-of-bank-guarantee-facilities", display: 1, desc: "Bilateral financial security for local trades" },
          { label: "Retail Loans", path: "/rental-loan", display: 1, desc: "Consumer loans for personal milestones" },
          { label: "Diaspora Loans", path: "/diaspora-loans", display: 1, desc: "Linking Ethiopians abroad with domestic growth" },
          { label: "Personal Loans for Salaried Persons", path: "/personal-loans-for-salaried-persons", display: 1, desc: "Banking solutions for formal employees" },
        ]
      },
      {
        label: "International Banking", icon: <GiWorld />,
        links: [
          { label: "Letter of Credit", path: "/international-banking", display: 1, desc: "Secure international trade settlement" },
          { label: "Cash Against Documents", path: "/international-banking", display: 2, desc: "Simplified global trade collections" },
          { label: "Advance Payment", path: "/international-banking", display: 3, desc: "Direct cross-border payment solutions" },
          { label: "Consignment Basis Payment", path: "/international-banking", display: 4, desc: "Flexible import and export financing" },
          { label: "Small Export Items", path: "/international-banking", display: 5, desc: "Supporting local producers for global markets" },
          { label: "Guarantee", path: "/international-banking", display: 1, desc: "Global trade guarantees and security" },
        ]
      }
    ]
  },
  digitalBanking: {
    title: "Digital Ecosystem",
    categories: [
      {
        label: "Electronic Banking", icon: <BsCreditCard2Front />,
        links: [
          { label: "Card Banking", path: "/card-banking", desc: "Access funds 24/7 with ATM and POS cards" },
          { label: "Mobile Banking", path: "/mobile-banking", desc: "Bank on the go with our intuitive app" },
          { label: "Internet Banking", path: "/internet-banking", desc: "Complete control of your finances online" },
        ]
      },
      {
        label: "Solutions", icon: <MdSupportAgent />,
        links: [
          { label: "School Management", path: "/school-management", desc: "Digital systems for educational institutions" },
          { label: "Agent Banking", path: "/agent-banking", desc: "Banking services closer to your doorstep" },
        ]
      }
    ]
  },
  interestFree: {
    title: "Interest Free Banking",
    categories: [
      {
        label: "Savings (Wadya)", icon: <FaMosque />,
        links: [
          { label: "Wadia Aman Account", path: "/wadya-aman-saving", display: 1, desc: "Sharia-compliant amanat deposits" },
          { label: "Muday Wadia Amana", path: "/wadya-aman-saving", display: 2, desc: "Savings based on Islamic principles" },
          { label: "Equb Wadia Amana", path: "/wadya-aman-saving", display: 3, desc: "Rotating savings for members" },
          { label: "Zakat Wadia Amana", path: "/wadya-aman-saving", display: 4, desc: "Transparent zakat management" },
          { label: "School Wadia Amana", path: "/wadya-aman-saving", display: 5, desc: "Youth savings for education" },
        ]
      },
      {
        label: "Financing Products", icon: <RiHandCoinFill />,
        links: [
          { label: "Murabaha Financing", path: "/financing-products", display: 1, desc: "Cost-plus-profit trade financing" },
          { label: "Qard Financing", path: "/financing-products", display: 2, desc: "Ethical interest-free personal loans" },
          { label: "Qard Benevolent", path: "/financing-products", display: 3, desc: "Socially responsible loan solutions" },
        ]
      },
      {
        label: "Guarantees (Kafalah)", icon: <BsShieldFillCheck />,
        links: [
          { label: "Bid Bond", path: "/guarantee-kafalah", desc: "Sharia-compliant tender guarantees" },
          { label: "Advance Payment", path: "/guarantee-kafalah", desc: "Ethical security for trade advances" },
          { label: "Retention Payment", path: "/guarantee-kafalah", desc: "Security for construction retention" },
          { label: "Export & Import Trade", path: "/guarantee-kafalah", desc: "Global trade with Sharia integrity" },
        ]
      }
    ]
  },
  news: {
    title: "Media Center",
    categories: [
      {
        label: "Press & News", icon: <RiNewspaperFill />,
        links: [
          { label: "Recent News", path: "/news", desc: "Latest updates and corporate bulletins" },
        ]
      },
      {
        label: "Publications", icon: <RiBookOpenFill />,
        links: [
          { label: "Annual Reports", path: "/annual-report", desc: "Our financial performance and journey" },
          { label: "Newsletters", path: "/newsletter", desc: "Quarterly insights and community stories" },
        ]
      },
      {
        label: "Bank Format", icon: <FaFileLines />,
        links: [
          { label: "Official Formats", path: "/bank-format", desc: "Downloadable bank forms and applications" },
        ]
      },
      {
        label: "Media Gallery", icon: <BsInstagram />,
        links: [
          { label: "Visual Archive", path: "/gallery", desc: "Visual stories of our impact" },
        ]
      },
      {
        label: "Downloadables", icon: <FaDownload />,
        links: [
          { label: "ESG Policy", path: "/policies", desc: "Our commitment to sustainability and ethics" },
        ]
      }
    ]
  },
  csr: {
    title: "CSR",
    categories: [
      {
        label: "Community Impact", icon: <RiHandCoinFill />,
        links: [
          { label: "CSR Overview", path: "/csr", display: 1, desc: "Our commitment to community development" },
          { label: "ESG Policy", path: "/csr", display: 2, desc: "Our Environmental, Social and Governance standards" },
        ]
      }
    ]
  },
  investorRelations: {
    title: "Investor Relations",
    categories: [
      {
        label: "Reports", icon: <BsGraphUp />,
        links: [
          { label: "Prospectus", path: "/investor-relations", desc: "Information for potential shareholders" },
          { label: "Accompanying Docs", path: "/accompanying-documents", desc: "Detailed disclosure documents" },
          { label: "Interim Reports", path: "/interim-reports", desc: "Mid-year performance highlights" },
        ]
      }
    ]
  }
};


// ─── NAV ITEMS definition ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Home", key: "home", path: "/" },
  { label: "About Us", key: "aboutUs" },
  { label: "Banking Services", key: "bankingServices" },
  { label: "Digital Banking", key: "digitalBanking" },
  { label: "Interest Free", key: "interestFree", teal: true },
  { label: "Medias", key: "news" },
  { label: "CSR", key: "csr" },
  { label: "Investor Relations", key: "investorRelations" },
];

// Contact Modal Component
function ContactModal({ isOpen, onClose, isInterestFree }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#00121a]/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl z-10 overflow-hidden"
          >
            <div className="p-6 md:p-8 text-center">
              <div className={`w-14 h-14 rounded-2xl mb-4 mx-auto flex items-center justify-center shadow-lg transition-transform hover:rotate-12 ${isInterestFree ? "bg-[#008a8a]/10 text-[#008a8a]" : "bg-[#FF8F12]/10 text-[#FF8F12]"}`}>
                <IoCall size={28} />
              </div>
              <h3 className="text-2xl font-black text-[#004360] mb-1 tracking-tight">
                {isInterestFree ? "Wadi'ah Contact" : "Contact Our Team"}
              </h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] mb-6">
                Reliable support 24/7
              </p>
              <div className="grid grid-cols-1 gap-3 text-left">
                {[
                  { icon: <FaPhoneVolume />, text: "Call Center: 866", sub: "Toll Free Support" },
                  { icon: <FaPhone />, text: "+251 115 52 3800", sub: "Main Office Line" },
                  { icon: <FaEnvelope />, text: "info@wegagen.com", sub: "Inquiry Support" },
                  { icon: <FaLocationDot />, text: "Wegagen Tower, AA", sub: "Ras Mekonen St" },
                ].map(({ icon, text, sub }, i) => (
                  <div key={i} className="flex items-center gap-4 p-2 rounded-2xl border border-slate-50 bg-slate-50/50 hover:border-[#FF8F12]/30 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${isInterestFree ? "bg-white text-[#008a8a]" : "bg-white text-[#FF8F12]"}`}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-[#004360] leading-none mb-1 group-hover:text-[#FF8F12] transition-colors">{text}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-2">
                  {[
                    { icon: <BsFacebook />, link: "https://www.facebook.com/bankwegagen" },
                    { icon: <BsTelegram />, link: "https://t.me/WegagenBanksc" },
                    { icon: <FaXTwitter />, link: "https://twitter.com/WegagenBanksc" },
                    { icon: <BsLinkedin />, link: "https://www.linkedin.com/company/bankwegagen" },
                    { icon: <BsYoutube />, link: "#" },
                    { icon: <BsInstagram />, link: "https://www.instagram.com/wegagenbankofficial/" }
                  ].map((social, i) => (
                    <a key={i} href={social.link} target="_blank" rel="noreferrer"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all duration-300 border hover:text-white hover:-translate-y-1 hover:rotate-6 hover:shadow-lg ${isInterestFree ? "bg-white text-[#008a8a] border-[#008a8a]/20 hover:bg-[#008a8a] hover:border-[#008a8a]" : "bg-[#001d2a] border-transparent hover:bg-[#FF8F12] hover:border-[#FF8F12]"}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-medium tracking-tight">
                  Copyright © {new Date().getFullYear()} Wegagen Bank S.C. All Rights Reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Locations Modal Component
function LocationsModal({ isOpen, onClose, isInterestFree, locale }) {
  const router = useRouter();
  const lp = (route) => `/${locale}${route}`;
  const handleNavigate = (path) => { router.push(lp(path)); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#00121a]/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl z-10 overflow-hidden"
          >
            <div className="p-6 md:p-8 text-center">
              <div className={`w-14 h-14 rounded-2xl mb-4 mx-auto flex items-center justify-center shadow-lg transition-transform hover:rotate-12 ${isInterestFree ? "bg-[#008a8a]/10 text-[#008a8a]" : "bg-[#FF8F12]/10 text-[#FF8F12]"}`}>
                {isInterestFree ? <FaMosque size={28} /> : <IoLocation size={28} />}
              </div>
              <h3 className="text-2xl font-black text-[#004360] mb-1 tracking-tight">
                {isInterestFree ? "Amana Branches" : "Find Your Service"}
              </h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] mb-6">
                {isInterestFree ? "Sharia Compliant Near You" : "Locate Wegagen instantly"}
              </p>
              <div className="grid grid-cols-1 gap-2 text-left">
                {[
                  { label: "Combined Locator", path: "/find-us",        icon: <IoLocation />,  sub: "Map & List View" },
                  { label: "ATM Network",       path: "/atm-location",   icon: <MdAdsClick />,  sub: "Nearest cash machines" },
                  { label: "Branch Network",    path: "/branch-location",icon: <IoStorefront />, sub: "Our service points" },
                ].map(({ label, path, icon, sub }) => (
                  <button key={path} onClick={() => handleNavigate(path)}
                    className={`flex items-center justify-between p-3 rounded-2xl border border-slate-50 bg-slate-50/50 hover:border-[#FF8F12]/30 hover:bg-white hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 shadow-sm ${isInterestFree ? "bg-white text-[#008a8a]" : "bg-white text-[#FF8F12]"}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-[14px] font-black text-[#004360] leading-none mb-1 group-hover:text-[#FF8F12] transition-colors">{label}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{sub}</p>
                      </div>
                    </div>
                    <IoChevronForward className="text-slate-300 group-hover:text-[#FF8F12] group-hover:translate-x-1 transition-all text-xs" />
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2">
                  {[
                    { icon: <BsFacebook />, link: "https://www.facebook.com/bankwegagen" },
                    { icon: <BsTelegram />, link: "https://t.me/WegagenBanksc" },
                    { icon: <FaXTwitter />, link: "https://twitter.com/WegagenBanksc" },
                    { icon: <BsLinkedin />, link: "https://www.linkedin.com/company/bankwegagen" },
                    { icon: <BsYoutube />, link: "#" },
                    { icon: <BsInstagram />, link: "https://www.instagram.com/wegagenbankofficial/" }
                  ].map((social, i) => (
                    <a key={i} href={social.link} target="_blank" rel="noreferrer"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all duration-300 border hover:-translate-y-1 hover:rotate-6 hover:shadow-lg ${isInterestFree ? "bg-white text-[#008a8a] border-[#008a8a]/20 hover:bg-[#008a8a] hover:border-[#008a8a]" : "bg-[#001d2a] border-transparent hover:bg-[#FF8F12] hover:border-[#FF8F12]"}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-medium tracking-tight">
                  Copyright © {new Date().getFullYear()} Wegagen Bank S.C. All Rights Reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function MegaMenu({ path, headerSelect }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState({});
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLocationsModal, setShowLocationsModal] = useState(false);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  const isInterestFree = headerSelect === "interestFree";

  // Locale-aware path helper — prefixes every internal route with /{locale}
  const { locale } = useI18n();
  const lp = (route) => `/${locale}${route}`;

  // Active state helpers
  const isLinkActive = (itemPath, itemDisplay) => {
    const currentPath = pathname;
    if (itemPath !== currentPath) return false;
    // For display state, we'd need to check query params or state
    // Simplified for Next.js - you'd use searchParams for this
    return true;
  };

  const isNavActive = (itemKey) => {
    if (path === itemKey) return true;
    const match = NAV_ITEMS.find(n => n.key === itemKey);
    if (match && match.path === pathname) return true;
    const config = MENU_CONFIG[itemKey];
    if (config) {
      return config.categories.some(cat =>
        cat.links.some(link => isLinkActive(link.path, link.display))
      );
    }
    return false;
  };

  const findActiveCategory = (itemKey) => {
    const config = MENU_CONFIG[itemKey];
    if (!config) return 0;
    const index = config.categories.findIndex(cat =>
      cat.links.some(link => isLinkActive(link.path, link.display))
    );
    return index !== -1 ? index : 0;
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (route, display = 1) => {
    const base = lp(route);
    const url = display > 1 ? `${base}?display=${display}` : base;
    router.push(url);
    setActivePopup(null);
    setIsSidebarOpen(false);
  };

  const toggleMobileMenu = (key) =>
    setActiveMobileMenu(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleMobileSubMenu = (label) =>
    setActiveMobileSubMenu(prev => ({ ...prev, [label]: !prev[label] }));

  const currentConfig = activePopup ? MENU_CONFIG[activePopup] : null;

  return (
    <>
      <div className="relative">
        {/* ── Top Header Strip ─────────────────── */}
        <div className={`${isInterestFree ? "bg-[#008a8a]" : "bg-[#FF6B0B]"} py-1.5 sm:py-1 px-4 shadow-inner relative z-[1001] hidden lg:block ${isInterestFree ? "border-b border-teal-500/20" : ""}`}>
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2.5 sm:gap-0">
            {/* Left: Quick Links */}
            <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-1 xl:gap-2">
              {[
                { label: "Careers", icon: <IoBriefcase />, onClick: () => router.push(lp("/vacancy")) },
                { label: "Bids", icon: <MdAdsClick />, onClick: () => router.push(lp("/bid")) },
                { label: "Contact", icon: <IoCall />, onClick: () => setShowContactModal(true) },
                { label: "Locations", icon: <IoLocation />, onClick: () => setShowLocationsModal(true) },
                { label: "EDIF", icon: <IoGlobeOutline />, link: "https://edif.gov.et" },
                { label: "Cyber Security", icon: <IoInformationCircle />, onClick: () => router.push(lp("/cybersecurity-awareness-tips")) },
              ].map((item, i) => (
                item.link ? (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black text-white/80 hover:text-white hover:bg-white/10 transition-all no-underline uppercase tracking-wider"
                  >
                    <span style={{ color: isInterestFree ? "#008a8a" : "#ffffff" }}>{item.icon}</span> {item.label}
                  </a>
                ) : (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[11px] font-black text-white/80 hover:text-white hover:bg-white/10 transition-all uppercase tracking-wider whitespace-nowrap no-underline"
                  >
                    <span style={{ color: isInterestFree ? "#008a8a" : "#ffffff" }}>{item.icon}</span> {item.label}
                  </button>
                )
              ))}
            </div>

            {/* Right: Social Medias */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-[2px] sm:tracking-[3px] mr-1 sm:mr-2 hidden lg:inline-block">
                Follow Us
              </span>
              <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-1.5">
                {[
                  { icon: <FaFacebookF />, link: "https://www.facebook.com/WegagenBankSC", color: "hover:bg-[#1877F2]" },
                  { icon: <FaXTwitter />, link: "https://twitter.com/WegagenBanksc", color: "hover:bg-black" },
                  { icon: <BsTelegram />, link: "https://t.me/WegagenBanksc", color: "hover:bg-[#0088cc]" },
                  { icon: <FaLinkedinIn />, link: "https://linkedin.com/company/66893778/admin/", color: "hover:bg-[#0077b5]" },
                  { icon: <BsYoutube />, link: "https://youtube.com/channel/UCksW-3Q5a3TKos-jTQp-LCA", color: "hover:bg-[#FF0000]" },
                  { icon: <BsInstagram />, link: "https://www.instagram.com/wegagenbankofficial/", color: "hover:bg-[#E4405F]" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-6 h-6 mx-1 rounded-full bg-white/20 text-white flex items-center justify-center text-xs transition-all duration-300 transform hover:-translate-y-1 hover:text-white ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
               <LanguageSwitcher className="mr-1 sm:mr-2" />
            </div>
          </div>
        </div>

        {/* ── Mobile Sidebar Overlay ─────────────────── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex justify-end"
              onClick={() => setIsSidebarOpen(false)}
            >
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-[350px] h-full bg-white text-[#004360] flex flex-col overflow-y-auto shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                {/* Sidebar Header */}
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg flex items-center justify-between px-6 pt-8 pb-6 border-b border-gray-100">
                  <Image src={isInterestFree ? wadya : WegagenLogo} alt="Logo" className="h-8 object-contain" width={120} height={32} />
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-2xl hover:bg-[#FF8F12] hover:text-white transition-all duration-300"
                  >
                    <IoClose />
                  </motion.button>
                </div>

                {/* Sidebar Nav */}
                <nav className="flex-1 pt-4 pb-12 overflow-x-hidden">
                  {/* Home */}
                  <Link
                    href={lp("/")}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-4 px-8 py-4 text-[13px] font-black uppercase tracking-[2px] text-[#004360]/90 hover:text-[#FF8F12] hover:bg-orange-50 transition-all border-b border-gray-100"
                  >
                    <IoHome className="text-[#FF8F12] text-xl" /> Home
                  </Link>

                  {/* Collapsible Menu Items */}
                  {Object.keys(MENU_CONFIG).map((key) => (
                    <div key={key} className="border-b border-gray-100">
                      <motion.button
                        whileHover={{ x: 5 }}
                        className={`w-full flex items-center justify-between px-8 py-4 text-[11px] font-black uppercase tracking-[3px] transition-all
                          ${(activeMobileMenu[key] || isNavActive(key)) ? "text-[#FF8F12] bg-orange-50" : "text-[#004360]/80 hover:text-[#FF8F12] hover:bg-orange-50"}
                        `}
                        onClick={() => toggleMobileMenu(key)}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-xl transition-transform duration-300 ${(activeMobileMenu[key] || isNavActive(key)) ? "scale-110" : ""}`}>
                            {key === 'aboutUs' && <RiTeamFill />}
                            {key === 'bankingServices' && <MdSavings />}
                            {key === 'digitalBanking' && <BsCreditCard2Front />}
                            {key === 'interestFree' && <FaMosque />}
                            {key === 'news' && <RiNewspaperFill />}
                            {key === 'csr' && <RiHandCoinFill />}
                            {key === 'investorRelations' && <BsGraphUp />}
                          </span>
                          <span className="pt-0.5 whitespace-nowrap">{MENU_CONFIG[key].title}</span>
                        </div>
                        <MdKeyboardArrowDown
                          className={`text-2xl text-[#FF8F12] transition-transform duration-500 ${activeMobileMenu[key] ? "rotate-180" : ""}`}
                        />
                      </motion.button>

                      <AnimatePresence>
                        {activeMobileMenu[key] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden bg-gray-50/50"
                          >
                            <div className="py-2 border-t border-gray-100">
                              {MENU_CONFIG[key].categories.map(cat => (
                                <div key={cat.label} className="mb-2 last:mb-0">
                                  <motion.button
                                    whileHover={{ x: 5 }}
                                    onClick={() => toggleMobileSubMenu(cat.label)}
                                    className={`w-full flex items-center justify-between px-10 py-2 text-[10px] font-black uppercase tracking-[3px] transition-all
                                      ${(activeMobileSubMenu[cat.label] || cat.links.some(l => isLinkActive(l.path, l.display))) ? "text-[#FF8F12]" : "text-[#004360]/60 hover:text-[#FF8F12]"}
                                    `}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-base">{cat.icon}</span>
                                      {cat.label}
                                    </div>
                                    <MdKeyboardArrowDown
                                      className={`text-lg transition-transform duration-300 ${activeMobileSubMenu[cat.label] ? "rotate-180" : ""}`}
                                    />
                                  </motion.button>

                                  <AnimatePresence>
                                    {activeMobileSubMenu[cat.label] && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden bg-gray-100/50"
                                      >
                                        <div className="py-1">
                                          {cat.links.map(link => (
                                            <motion.button
                                              key={link.label}
                                              whileHover={{ x: 10 }}
                                              onClick={() => handleNavigate(link.path, link.display)}
                                              className={`w-full text-left px-14 py-2 text-[12px] transition-all flex items-center gap-4 group
                                                ${isLinkActive(link.path, link.display)
                                                  ? "text-[#FF8F12] bg-orange-50 font-black"
                                                  : "text-[#004360]/70 hover:text-[#FF8F12] hover:bg-white active:bg-orange-50 font-semibold"
                                                }
                                              `}
                                            >
                                              <div className={`w-1.5 h-1.5 rounded-full transition-all 
                                                ${isLinkActive(link.path, link.display) ? "bg-[#FF8F12] scale-125 shadow-[0_0_8px_rgba(255,143,18,0.5)]" : "bg-[#FF8F12] opacity-30 group-hover:opacity-100"}
                                              `} />
                                              <span className="tracking-wide leading-tight whitespace-nowrap">{link.label}</span>
                                            </motion.button>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* Extras Section */}
                  <div className="mt-6 px-8 space-y-2">
                    <div className="text-[10px] font-black text-[#004360]/30 uppercase tracking-[4px] mb-3">Support & Tools</div>
                    {[
                      { icon: <MdContactPhone />, label: "Contact Us", action: () => setShowContactModal(true) },
                      { icon: <MdLocationOn />, label: "Locations", action: () => setShowLocationsModal(true) },
                      { icon: <MdWork />, label: "Careers", path: lp("/vacancy") },
                      { icon: <MdAdsClick />, label: "Bids", path: lp("/bid") },
                      { icon: <IoGlobeOutline />, label: "EDIF", link: "https://edif.gov.et" },
                      { icon: <IoInformationCircle />, label: "Cyber Security", path: lp("/cybersecurity-awareness-tips") },
                    ].map((item, idx) => (
                      item.link ? (
                        <a
                          key={idx}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-5 px-6 py-2 bg-gray-50 rounded-2xl text-[12px] font-black uppercase tracking-[2px] text-[#004360]/90 hover:text-[#FF8F12] hover:bg-orange-50 transition-all border border-gray-100 no-underline"
                        >
                          <span className="text-[#FF8F12] text-2xl">{item.icon}</span> {item.label}
                        </a>
                      ) : (
                        <motion.div key={idx} whileHover={{ x: 5 }}>
                          {item.path ? (
                            <Link
                              href={item.path}
                              onClick={() => setIsSidebarOpen(false)}
                              className="w-full flex items-center gap-5 px-6 py-2 bg-gray-50 rounded-2xl text-[12px] font-black uppercase tracking-[2px] text-[#004360]/90 hover:text-[#FF8F12] hover:bg-orange-50 transition-all border border-gray-100 no-underline"
                            >
                              <span className="text-[#FF8F12] text-2xl">{item.icon}</span> {item.label}
                            </Link>
                          ) : (
                            <button
                              onClick={() => { item.action(); setIsSidebarOpen(false); }}
                              className="w-full flex items-center gap-5 px-6 py-2 bg-gray-50 rounded-2xl text-[12px] font-black uppercase tracking-[2px] text-[#004360]/90 hover:text-[#FF8F12] hover:bg-orange-50 transition-all border border-gray-100"
                            >
                              <span className="text-[#FF8F12] text-2xl">{item.icon}</span> {item.label}
                            </button>
                          )}
                        </motion.div>
                      )
                    ))}
                  </div>

                  {/* Mobile Sidebar Footer */}
                  <div className="mt-10 px-8 pb-12">
                    <div className="text-[10px] font-black text-[#004360]/30 uppercase tracking-[4px] mb-4">Connect With Us</div>
                    <div className="flex items-center gap-2 mb-8">
                      {[
                        { icon: <FaFacebookF />, link: "https://www.facebook.com/bankwegagen", color: "text-[#1877F2] bg-[#1877F2]/10" },
                        { icon: <FaXTwitter />, link: "https://twitter.com/WegagenBanksc", color: "text-black bg-black/10" },
                        { icon: <BsTelegram />, link: "https://t.me/WegagenBanksc", color: "text-[#0088cc] bg-[#0088cc]/10" },
                        { icon: <FaLinkedinIn />, link: "https://linkedin.com/company/66893778/admin/", color: "text-[#0077b5] bg-[#0077b5]/10" },
                        { icon: <BsYoutube />, link: "https://youtube.com/channel/UCksW-3Q5a3TKos-jTQp-LCA", color: "text-[#FF0000] bg-[#FF0000]/10" },
                        { icon: <BsInstagram />, link: "https://www.instagram.com/wegagenbankofficial/", color: "text-[#E4405F] bg-[#E4405F]/10" },
                      ].map((social, i) => (
                        <a
                          key={i}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all active:scale-90 ${social.color} hover:scale-110`}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>

                    <div className="mt-8 text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center">
                      © 2024 Wegagen Bank S.C.
                    </div>
                  </div>
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dark backdrop: sibling to nav, starts at nav bottom, purely visual ── */}
        <AnimatePresence>
          {activePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed left-0 right-0 bottom-0 bg-black/50 z-[50] pointer-events-none"
              style={{
                top: navRef.current
                  ? navRef.current.getBoundingClientRect().bottom
                  : 72,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Main Sticky Navbar ─────────────────── */}
        <nav
          ref={navRef}
          className={`w-full bg-white border-b-2 border-[#FF8F12] z-[999] transition-all duration-300
            ${scrolled ? "fixed top-0 left-0 shadow-[0_4px_12px_-2px_rgba(255,143,18,0.15)]" : "relative"}
          `}
        >
          <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-[72px]">

            {/* ── Left: Nav Links Container ─── */}
            <div
              className="hidden lg:flex items-center gap-0.5 xl:gap-1 h-full"
              onMouseLeave={() => {
                timeoutRef.current = setTimeout(() => setActivePopup(null), 100);
              }}
            >
              {NAV_ITEMS.map(item => (
                item.path ? (
                  /* Home – plain link, same style as dropdown items */
                  <Link
                    key={item.key}
                    href={item.path}
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      setActivePopup(null);
                    }}
                    className={`px-3 py-4 text-[12px] xl:text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1 no-underline shrink-0 h-10
                      ${isNavActive(item.key)
                        ? "text-[#FF8F12] bg-orange-50"
                        : "text-[#004360] hover:text-[#FF8F12] hover:bg-orange-50 hover:px-3"
                      }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  /* Dropdown items */
                  <button
                    key={item.key}
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      setActivePopup(item.key);
                      setActiveCategory(findActiveCategory(item.key));
                    }}
                    className={`px-3 xl:px-3 py-4  text-[12px] xl:text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-0.5 xl:gap-1 group shrink-0 h-10
                      ${(activePopup === item.key || isNavActive(item.key))
                        ? item.teal
                          ? "text-[#008a8a] bg-teal-50 "
                          : "text-[#FF8F12] bg-orange-50"
                        : item.teal
                          ? "text-teal-600 hover:text-[#008a8a] hover:bg-teal-50 hover:px-3"
                          : "text-[#004360] hover:text-[#FF8F12] hover:bg-orange-50 hover:px-3"
                      }`}
                  >
                    {item.label}
                    <IoChevronDown
                      className={`text-[10px] xl:text-xs transition-transform duration-200 ${(activePopup === item.key || isNavActive(item.key)) ? "rotate-180" : ""} ${(activePopup === item.key || isNavActive(item.key)) ? (item.teal ? "text-[#008a8a]" : "text-[#FF8F12]") : ""}`}
                    />
                  </button>
                )
              ))}
            </div>

            {/* ── Right: Logo + Hamburger ─── */}
            <div
              className="flex items-center gap-4 ml-auto lg:ml-0"
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setActivePopup(null);
              }}
            >
              <Link href="/" className="shrink-0">
                <Image
                  src={isInterestFree ? wadya : WegagenLogo}
                  alt="Wegagen Bank"
                  className="h-16 xl:h-20 object-contain"
                  width={160}
                  height={80}
                />
              </Link>
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-full bg-[#FF8F12]/10 flex items-center justify-center text-[#FF8F12] text-2xl hover:bg-[#FF8F12] hover:text-white transition-all"
              >
                <RiMenu2Line />
              </button>
            </div>
          </div>

          {/* ── Mega Menu Dropdown Panel ─────────────────── */}
          <AnimatePresence>
            {activePopup && currentConfig && (
              <motion.div
                initial={{ opacity: 0, y: -15, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: -15, x: "-50%" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-1/2 w-[98%] xl:w-[90%] 2xl:w-[80%] max-w-[1440px] bg-white rounded-b-2xl shadow-2xl z-[999] border border-gray-100 border-t-0 overflow-hidden"
                onMouseEnter={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                }}
                onMouseLeave={() => setActivePopup(null)}
                style={{ top: "100%" }}
              >
                <motion.div
                  key={activePopup}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="max-w-[1400px] mx-auto px-6 py-0"
                >
                  {/* Section label */}
                  <div className="flex items-center gap-2 pt-4 pb-3 border-b border-gray-100">
                    <span className={`w-2 h-2 rounded-full inline-block ${activePopup === "interestFree" ? "bg-[#008a8a]" : "bg-[#FF8F12]"}`}></span>
                    <p className="text-[10px] font-black tracking-[4px] uppercase text-[#004360]">
                      Explore {currentConfig.title}
                    </p>
                  </div>

                  {/* Responsive grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[260px_1fr_280px] gap-8 py-6">

                    {/* Col 1: Category Tabs */}
                    <motion.div variants={itemVariant} className="flex flex-col gap-1.5">
                      {currentConfig.categories.map((cat, idx) => (
                        <button
                          key={cat.label}
                          onMouseEnter={() => setActiveCategory(idx)}
                          className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group
                          ${activeCategory === idx
                              ? (activePopup === "interestFree" ? "bg-[#008a8a] text-white shadow-lg shadow-teal-200" : "bg-[#FF8F12] text-white shadow-lg shadow-orange-100")
                              : (cat.links.some(l => isLinkActive(l.path, l.display))
                                ? (activePopup === "interestFree" ? "bg-teal-50 text-[#008a8a] border border-teal-100" : "bg-orange-50 text-[#FF8F12] border border-orange-100")
                                : (activePopup === "interestFree" ? "bg-gray-50 text-[#004360] hover:bg-teal-50 hover:text-[#008a8a]" : "bg-gray-50 text-[#004360] hover:bg-orange-50 hover:text-[#FF8F12]"))
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xl flex-shrink-0 ${activeCategory === idx ? "text-white" : (activePopup === "interestFree" ? "text-[#008a8a]" : "text-[#FF8F12]")} group-hover:scale-110 transition-transform`}>
                              {cat.icon}
                            </span>
                            <span className="text-sm font-black tracking-tight">{cat.label}</span>
                          </div>
                          <IoChevronForward className={`text-xs flex-shrink-0 transition-transform ${activeCategory === idx ? "translate-x-1 text-white" : `opacity-0 group-hover:opacity-100 ${activePopup === "interestFree" ? "text-[#008a8a]" : "text-[#FF8F12]"}`}`} />
                        </button>
                      ))}
                    </motion.div>

                    {/* Col 2: Link Grid */}
                    <motion.div
                      key={`${activePopup}-${activeCategory}`}
                      variants={itemVariant}
                      className="flex flex-col pr-2 lg:pr-0"
                    >
                      <h3 className="text-lg font-black text-[#004360] mb-4 tracking-tight flex items-center gap-2 shrink-0">
                        <span className="lg:hidden">{currentConfig.categories[activeCategory]?.icon}</span>
                        {currentConfig.categories[activeCategory]?.label}
                      </h3>

                      {/* Optimized height for high-density - fits 4 rows (8 items) without scrolling */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-2.5 xl:gap-3 max-h-[500px] overflow-y-auto pr-3 
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-track]:bg-slate-50
                        [&::-webkit-scrollbar-thumb]:bg-slate-200
                        hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [scrollbar-width:thin]"
                      >
                        {currentConfig.categories[activeCategory]?.links.map(link => (
                          <button
                            key={link.label}
                            onClick={() => handleNavigate(link.path, link.display)}
                            className={`group flex flex-col items-start gap-1 p-2.5 xl:p-3.5 rounded-2xl text-left border transition-all duration-300 h-fit
                              ${isLinkActive(link.path, link.display)
                                ? (activePopup === "interestFree" ? "bg-teal-50 border-[#008a8a]/40 shadow-sm" : "bg-orange-50 border-[#FF8F12]/40 shadow-sm")
                                : `bg-gray-50 border-transparent hover:shadow-md ${activePopup === "interestFree" ? "hover:border-[#008a8a]/30 hover:bg-teal-50" : "hover:border-[#FF8F12]/30 hover:bg-orange-50"}`
                              }
                            `}
                          >
                            <span className={`text-[12.5px] xl:text-[13.5px] font-black transition-colors line-clamp-1 
                              ${isLinkActive(link.path, link.display)
                                ? (activePopup === "interestFree" ? "text-[#008a8a]" : "text-[#FF8F12]")
                                : `text-[#004360] ${activePopup === "interestFree" ? "group-hover:text-[#008a8a]" : "group-hover:text-[#FF8F12]"}`
                              }
                            `}>
                              {link.label}
                            </span>
                            <span className="text-[10px] xl:text-[11px] text-gray-500 leading-tight line-clamp-2">
                              {link.desc || "Explore Wegagen's premium banking services."}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Col 3: Feature Card - Hidden on medium desktops */}
                    <motion.div variants={itemVariant} className={`hidden xl:block rounded-2xl overflow-hidden relative h-[320px] border border-gray-100 shadow-lg group/card`}>
                      <Image
                        src={activePopup === "bankingServices" ? menuFeature2 : menuFeature}
                        alt="Featured"
                        fill
                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                      />
                    </motion.div>
                  </div>

                  {/* Footer bar */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    <span>© 2026 Wegagen Bank S.C. | Empowering Ethiopia</span>
                    <div className="flex gap-5">
                      {["Privacy", "Terms", "Security"].map(t => (
                        <span key={t} className={`cursor-pointer transition-colors ${activePopup === "interestFree" ? "hover:text-[#008a8a]" : "hover:text-[#FF8F12]"}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ── Spacer to prevent layout jump when fixed ─── */}
        {scrolled && <div className="h-[72px]" />}
      </div>

      {/* Modals */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        isInterestFree={isInterestFree}
      />
      <LocationsModal
        isOpen={showLocationsModal}
        onClose={() => setShowLocationsModal(false)}
        isInterestFree={isInterestFree}
        locale={locale}
      />
    </>
  );
}
