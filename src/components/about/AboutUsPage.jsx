"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  HiOfficeBuilding, HiLightBulb, HiShieldCheck, HiUserGroup, HiLightningBolt,
} from "react-icons/hi";
import {
  FaUserCheck, FaUsers, FaChartLine, FaHistory, FaInfoCircle,
  FaBalanceScale, FaChartBar, FaCreditCard,
} from "react-icons/fa";
import { MdMenuOpen, MdOutlineArrowForwardIos, MdClose } from "react-icons/md";
import { RiDoubleQuotesR } from "react-icons/ri";

import { useI18n } from "../i18n/I18nProvider";
import {
  MemberCardLarge, MemberCardCompact,
  MemberCardSkeletonLarge, MemberCardSkeletonCompact,
} from "./MemberCard";
import Footer from "../Footer";

import commonImg from "../../assets/Images/common.jpg";
import structureImg from "../../assets/Images/New-Stracture-2025.jpg";
import strategicImg from "../../assets/Strategic-Objective.jpg";

const STRAPI = "https://weg.back.strapi.wegagen.com";

// ── Motion Variants ───────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ── Ordered member arrays ─────────────────────────────────────────
const MGMT_ORDER = [
  "Genet Daba", "Abebaw G/Tsadik", "Kaleb Tadesse", "Yimegnushal Teshome", "Negassi Fisseha",
  "Fantahun Demissie", "Mahalet Hailemariam", "Niguss Girma", "Bahiru Demissie", "Mahlet Haile",
  "Amanuel Birhane", "Sebsibie Zebro", "Mahlet Mesfin", "Yonas Alemeyehu",
  "Tesfatsion Gebreyohannes", "Senait Etsub", "Million Legesse", "Desalegn Haile",
  "Yishak Yilma", "Abadi Leake", "Paulos G/Mariam", "Defaru Afework", "Tewodros Assefa",
  "Muluken Asmare", "Agere Belay", "Abay Gebreleul", "Haddush Hintsay", "Henok Anagaw",
  "Surafel Yazachew", "Tsegay Hagos", "Girma Gemechu", "Mesfin Solomon", "Dereje Mulat",
];
const DISTRICT_ORDER = [
  "Hana Tamirat", "Ashenafi Gidey", "Yohannes Assefa", "Temesgen Berhe", "Zenebe Asayehegn",
  "Daniel Liben", "Genet B/Meskel", "Kassanew Alem", "Mulugeta Zerga", "Habtamu Nigussie",
];
const SHARIA_ORDER = ["Ibrahim Dawud", "Fetihulbari Mohammednur", "Mohammed Ferej"];

const TIMELINE_DATA = [
  { date: "1996", month: "Nov 13", key: "establishment" },
  { date: "1997", month: "Jun 16", key: "startedOps" },
  { date: "2000", month: "Aug 16", key: "wan" },
  { date: "2007", month: "Jun 16", key: "anniversary10" },
  { date: "2010", month: "Jun 16", key: "cardBanking" },
  { date: "2011", month: "Aug 16", key: "omni" },
  { date: "2014", month: "Jan 16", key: "mobileBanking" },
  { date: "2014", month: "Dec 16", key: "branch100" },
  { date: "2016", month: "Jan 16", key: "masterCard" },
  { date: "2016", month: "Feb 17", key: "ifb" },
  { date: "2016", month: "Jul 16", key: "agencyBanking" },
  { date: "2017", month: "Jan 16", key: "atm200" },
  { date: "2017", month: "Feb 16", key: "branch200" },
  { date: "2017", month: "Jun 16", key: "profit500M" },
  { date: "2017", month: "Jun 16", key: "anniversary20" },
  { date: "2017", month: "Jun 21", key: "capital2B" },
  { date: "2017", month: "Jul 17", key: "rebranding" },
  { date: "2017", month: "Sep 16", key: "hq23" },
  { date: "2017", month: "Oct 16", key: "movedHQ" },
  { date: "2018", month: "Jan 16", key: "flexCube" },
  { date: "2018", month: "Jan 16", key: "internetBanking" },
  { date: "2018", month: "Apr 16", key: "emp4000" },
  { date: "2021", month: "Jun 30", key: "emp5000" },
  { date: "2021", month: "Oct 28", key: "anniversary25" },
  { date: "2022", month: "Apr 12", key: "shareholders5000" },
  { date: "2024", month: "Feb 22", key: "mobileApp" },
  { date: "2024", month: "June",   key: "recordIncome" },
  { date: "2024", month: "July",   key: "efoyta" },
  { date: "2024", month: "August", key: "visaPrepaid" },
  { date: "2025", month: "Jan",    key: "esx" },
  { date: "2025", month: "Jan 14", key: "eBirr" },
];

export default function AboutUsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailMember, setDetailMember] = useState(null);
  const activeItemRef = useRef(null);

  // ── Sync section from URL ?display param (MegaMenu links) ───────
  useEffect(() => {
    const display = searchParams.get("display");
    if (display) {
      const id = parseInt(display, 10);
      if (!isNaN(id)) setActiveSection(id);
    }
  }, [searchParams]);

  // ── API data ────────────────────────────────────────────────────
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardMembers2, setBoardMembers2] = useState([]);
  const [coreManagements, setCoreManagements] = useState([]);
  const [coreManagements2, setCoreManagements2] = useState([]);
  const [seniorManagements, setSeniorManagements] = useState([]);
  const [managements, setManagements] = useState([]);
  const [districtTeam, setDistrictTeam] = useState([]);
  const [shariaCommittee, setShariaCommittee] = useState([]);

  const [mainLoading, setMainLoading] = useState(true);
  const [mainError, setMainError] = useState(false);
  const [mgmtLoading, setMgmtLoading] = useState(true);
  const [mgmtError, setMgmtError] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(true);
  const [districtError, setDistrictError] = useState(false);

  const navItems = [
    { id: 1, label: t("aboutUs.nav.about"), icon: <HiOfficeBuilding /> },
    { id: 2, label: t("aboutUs.nav.board"), icon: <FaUserCheck /> },
    { id: 3, label: t("aboutUs.nav.core"), icon: <FaUsers /> },
    { id: 4, label: t("aboutUs.nav.senior"), icon: <FaUsers /> },
    { id: 5, label: t("aboutUs.nav.management"), icon: <FaUsers /> },
    { id: 6, label: t("aboutUs.nav.district"), icon: <FaUsers /> },
    { id: 9, label: t("aboutUs.nav.sharia"), icon: <HiLightBulb /> },
    { id: 11, label: t("aboutUs.nav.policies"), icon: <FaInfoCircle />, path: "/policies" },
    { id: 12, label: t("aboutUs.nav.memorandum"), icon: <FaInfoCircle />, path: "/memorandum" },
    { id: 10, label: t("aboutUs.nav.strategy"), icon: <FaChartLine /> },
    { id: 7, label: t("aboutUs.nav.timeline"), icon: <FaHistory /> },
  ];

  // ── Fetch helpers ────────────────────────────────────────────────
  const fetchAllData = async () => {
    setMainLoading(true); setMainError(false);
    try {
      const [boardRes, coreRes, seniorRes, shariaRes] = await Promise.all([
        fetch(`${STRAPI}/api/corporate-governances?filters[class][$eq]=Board%20of%20directors&populate=*`),
        fetch(`${STRAPI}/api/corporate-governances?filters[class][$eq]=Core%20Management&populate=*`),
        fetch(`${STRAPI}/api/corporate-governances?filters[class][$eq]=Senior%20Management&populate=*`),
        fetch(`${STRAPI}/api/corporate-governances?filters[class][$eq]=Sharia%20Advisory%20Committee&populate=*`),
      ]);
      const [boardData, coreData, seniorData, shariaData] = await Promise.all([
        boardRes.json(), coreRes.json(), seniorRes.json(), shariaRes.json(),
      ]);
      const boardArr = Array.isArray(boardData?.data) ? boardData.data : [];
      const coreArr = Array.isArray(coreData?.data) ? coreData.data : [];
      setBoardMembers(boardArr.filter(m => m.id !== 1));
      setBoardMembers2(boardArr.filter(m => m.id === 1));
      setCoreManagements(coreArr.filter(m => m.id !== 11));
      setCoreManagements2(coreArr.filter(m => m.id === 11));
      setSeniorManagements(Array.isArray(seniorData?.data) ? seniorData.data.filter(m => m.id !== 11) : []);
      const shariaArr = Array.isArray(shariaData?.data) ? shariaData.data : [];
      setShariaCommittee(shariaArr.sort((a, b) =>
        SHARIA_ORDER.indexOf((a.attributes?.full_name || "").trim()) -
        SHARIA_ORDER.indexOf((b.attributes?.full_name || "").trim())
      ));
    } catch { setMainError(true); } finally { setMainLoading(false); }
  };

  const fetchManagement = async () => {
    setMgmtLoading(true); setMgmtError(false);
    try {
      const initRes = await fetch(`${STRAPI}/api/corporate-governances?filters[class][$eq]=Management%20Team&pagination[page]=1&pagination[pageSize]=1`);
      const initData = await initRes.json();
      const total = initData?.meta?.pagination?.total ?? 50;
      const res = await fetch(`${STRAPI}/api/corporate-governances?filters[class][$eq]=Management%20Team&pagination[page]=1&pagination[pageSize]=${total}&populate=*`);
      const data = await res.json();
      const arr = Array.isArray(data?.data) ? data.data : [];
      setManagements(arr.sort((a, b) => {
        const iA = MGMT_ORDER.indexOf((a.attributes?.full_name || "").trim());
        const iB = MGMT_ORDER.indexOf((b.attributes?.full_name || "").trim());
        return (iA === -1 ? 99 : iA) - (iB === -1 ? 99 : iB);
      }));
    } catch { setMgmtError(true); } finally { setMgmtLoading(false); }
  };

  const fetchDistricts = async () => {
    setDistrictLoading(true); setDistrictError(false);
    try {
      const res = await fetch(`${STRAPI}/api/corporate-governances?filters[class][$eq]=District%20Directors%20Team&populate=*`);
      const data = await res.json();
      const arr = Array.isArray(data?.data) ? data.data : [];
      setDistrictTeam(arr.sort((a, b) =>
        DISTRICT_ORDER.indexOf((a.attributes?.full_name || "").trim()) -
        DISTRICT_ORDER.indexOf((b.attributes?.full_name || "").trim())
      ));
    } catch { setDistrictError(true); } finally { setDistrictLoading(false); }
  };

  useEffect(() => { fetchAllData(); }, []);
  useEffect(() => { fetchManagement(); }, []);
  useEffect(() => { fetchDistricts(); }, []);

  useEffect(() => {
    if (isMobileMenuOpen && activeItemRef.current) {
      const timer = setTimeout(() => {
        activeItemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen, activeSection]);

  const handleNav = (id, path) => {
    if (path) { router.push(path); return; }
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    // Update URL without full reload so browser history works
    const params = new URLSearchParams(searchParams.toString());
    if (id === 1) { params.delete("display"); } else { params.set("display", id); }
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newUrl, { scroll: false });
    const isMobile = window.innerWidth < 1024;
    window.scrollTo({ top: isMobile ? 150 : 400, behavior: "smooth" });
  };

  // ── Error banner ─────────────────────────────────────────────────
  const ErrorBanner = ({ onRetry }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
      <p className="text-sm sm:text-base font-medium text-center sm:text-left">{t("aboutUs.error.message")}</p>
      <button onClick={onRetry} className="flex-shrink-0 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors">
        {t("aboutUs.error.retry")}
      </button>
    </div>
  );

  // ── Member detail modal ──────────────────────────────────────────
  const DetailModal = ({ member, onClose }) => {
    if (!member) return null;
    const imgUrl = member.attributes?.image?.data?.attributes?.url
      ? `${STRAPI}${member.attributes.image.data.attributes.url}` : null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-[#00121a]/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] w-full max-w-[950px] max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-slate-100 hover:bg-orange-100 hover:text-[#ff6b0b] flex items-center justify-center transition-all"
            >
              <MdClose className="text-xl" />
            </button>
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-stretch">
                <div className="w-full md:w-5/12 relative group rounded-[32px] overflow-hidden aspect-[4/5]">
                  <div className="absolute inset-0 bg-orange-500 rounded-[32px] rotate-3 -z-10 opacity-10 group-hover:rotate-6 transition-transform" />
                  {imgUrl ? (
                    <img src={imgUrl} alt={member.attributes.full_name} className="w-full h-full object-cover rounded-[32px] shadow-2xl" loading="eager" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-6xl font-black rounded-[32px]">
                      {member.attributes.full_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="w-full md:w-7/12 py-4 flex flex-col justify-center space-y-6">
                  <div>
                    <h2 className="text-3xl font-black text-[#004360] leading-tight mb-2">{member.attributes.full_name}</h2>
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-orange-500 rounded-full" />
                      <p className="text-orange-500 font-black uppercase text-xs tracking-[4px]">{member.attributes.position}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-5 rounded-[20px] border border-slate-100">
                      <span className="font-bold text-[#004360] uppercase text-[10px] tracking-widest block mb-2 opacity-50">{t("aboutUs.board.academicExcellence")}</span>
                      <p className="text-slate-700 text-sm leading-relaxed">{member.attributes.qualification || t("aboutUs.board.defaultQual")}</p>
                    </div>
                    <div className="bg-[#004360]/5 p-5 rounded-[20px] border border-[#004360]/10">
                      <span className="font-bold text-[#004360] uppercase text-[10px] tracking-widest block mb-2 opacity-50">{t("aboutUs.board.professionalJourney")}</span>
                      <p className="text-slate-700 text-sm leading-relaxed">{member.attributes.work_experience || t("aboutUs.board.defaultExp")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ── Section heading helper ───────────────────────────────────────
  const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-4 mb-4 mt-6 sm:mt-10">
      <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-[#FF8F12] to-transparent rounded-full" />
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#004360]">{children}</h2>
    </div>
  );

  // ── Shared member grid renderer ──────────────────────────────────
  const MemberGrid = ({ members, loading, error, onRetry, variant = "compact", skeletonCount = 6 }) => {
    const isLarge = variant === "large";
    if (error) return <ErrorBanner onRetry={onRetry} />;
    if (loading) {
      return (
        <div className={`grid ${isLarge ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"} gap-4 sm:gap-6`}>
          {Array.from({ length: skeletonCount }).map((_, i) =>
            isLarge ? <MemberCardSkeletonLarge key={i} /> : <MemberCardSkeletonCompact key={i} />
          )}
        </div>
      );
    }
    return (
      <div className={`grid ${isLarge ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"} gap-4 sm:gap-6`}>
        {members.map(m =>
          isLarge
            ? <MemberCardLarge key={m.id} member={m} onClick={setDetailMember} />
            : <MemberCardCompact key={m.id} member={m} onClick={setDetailMember} />
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen font-inter selection:bg-orange-100 selection:text-orange-600">

      {/* ── Hero Banner ── */}
      <div className="relative bg-[#111827] min-h-[250px] md:h-[280px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={commonImg.src}
            alt="About Wegagen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/50" />
        </div>
        <div className="relative z-10 w-full max-w-[1300px] mx-auto px-5 md:px-10 text-center py-10 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F12]/90 text-white font-black text-[10px] uppercase tracking-[3px] mb-6 border border-white/5">
              {t("aboutUs.hero.badge")}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight px-4 break-words">
              {navItems.find(n => n.id === activeSection)?.label || t("aboutUs.discover")}
              <span className="text-[#ff6b0b]">.</span>
            </h1>
            <p className="text-slate-200 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
              {t("aboutUs.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto px-5 md:px-10 py-16 md:py-24 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">

        {/* ── Mobile Menu Trigger ── */}
        <div className="lg:hidden sticky top-[70px] z-[60] -mx-4 px-4 py-3 mb-4 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
          <button
            className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white rounded-2xl text-[#004360] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 hover:bg-[#ff6b0b] hover:text-white transition-all duration-300 font-bold text-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <div className="flex items-center gap-3">
              <MdMenuOpen className="text-2xl" />
              <span>{t("aboutUs.nav.browseDirectory")}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-orange-50 text-[#ff6b0b] text-xs font-black uppercase tracking-wider">
              {navItems.find(n => n.id === activeSection)?.label || t("aboutUs.discover")}
            </div>
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-[#004360]/40 backdrop-blur-sm z-[1001]"
              />
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 h-[70vh] bg-white rounded-t-[32px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] z-[1002] overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-xl font-black text-[#004360]">{t("aboutUs.mobile.title")}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{t("aboutUs.mobile.subtitle")}</p>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-[#ff6b0b] transition-all">
                    <MdClose className="text-2xl" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      ref={activeSection === item.id ? activeItemRef : null}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleNav(item.id, item.path)}
                      className={`p-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 cursor-pointer ${activeSection === item.id ? "bg-[#ff6b0b] text-white shadow-lg shadow-orange-100" : "bg-slate-50 text-slate-600 active:bg-slate-100"}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${activeSection === item.id ? "bg-white/20" : "bg-white shadow-sm text-slate-400"}`}>{index + 1}</div>
                      <span className="font-bold text-[14px] flex-1">{item.label}</span>
                      {activeSection === item.id && <MdOutlineArrowForwardIos className="text-white text-xs" />}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-full lg:w-[300px] xl:w-[360px] shrink-0 z-40">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[28px] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.06)] h-fit lg:sticky lg:top-[85px] flex flex-col gap-1.5 overflow-hidden">
            <div className="flex items-center gap-3 px-4 pb-4 pt-2 mb-2 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#ff6b0b] rotate-45" />
              <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[2px]">{t("aboutUs.nav.quickNav")}</h3>
            </div>
            <div className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [scrollbar-width:thin]">
              {navItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleNav(item.id, item.path)}
                  className={`px-3 py-1.5 rounded-[12px] cursor-pointer transition-all duration-300 flex items-center gap-3 text-[13px] font-bold group ${activeSection === item.id ? "bg-[#ff8f12] text-white shadow-[0_10px_25px_-8px_rgba(255,143,18,0.5)] scale-[1.02]" : "text-slate-600 hover:bg-slate-50 hover:text-[#004360]"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] transition-all duration-300 ${activeSection === item.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-[#004360] group-hover:text-white"}`}>
                    {index + 1}
                  </div>
                  <span className="flex-1 leading-tight tracking-wide">{item.label}</span>
                  {activeSection === item.id
                    ? <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}><MdOutlineArrowForwardIos className="text-xs text-white" /></motion.div>
                    : <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b0b] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125" />
                  }
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-h-[600px] min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ── 1. About Wegagen Bank ── */}
            {activeSection === 1 && (
              <motion.div key="bank" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-16">
                <div className="max-w-4xl text-left text-justify">
                  <motion.div variants={itemVariants} className="mb-8">
                    <div className="flex items-center gap-4 mb-4 mt-10">
                      <div className="h-1 w-16 bg-gradient-to-r from-[#FF8F12] to-transparent rounded-full" />
                      <h2 className="text-4xl md:text-5xl font-bold text-[#004360]">{t("aboutUs.about.establishment")}</h2>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="mb-8">
                    <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed">{t("aboutUs.about.estText1")}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-6 text-slate-600 text-lg leading-relaxed">
                    <p>{t("aboutUs.about.estText2")}</p>
                    <p>{t("aboutUs.about.estText3")}</p>
                    <p>{t("aboutUs.about.estText4")}</p>
                  </motion.div>
                </div>

                {/* Vision & Mission */}
                <div className="space-y-16">
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div whileHover={{ y: -10 }} className="relative bg-[#FF8F12] p-12 rounded-[20px] overflow-hidden border border-white/10 group shadow-2xl shadow-blue-900/20">
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                      <h3 className="text-3xl font-black text-white mb-6">{t("aboutUs.about.vision")}</h3>
                      <p className="text-white text-xl leading-relaxed font-medium italic">{t("aboutUs.about.visionText")}</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -10 }} className="relative bg-white p-12 rounded-[20px] overflow-hidden border border-slate-100 shadow-2xl group">
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                      <h3 className="text-3xl font-black text-[#004360] mb-6">{t("aboutUs.about.mission")}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed">{t("aboutUs.about.missionText")}</p>
                    </motion.div>
                  </div>

                  {/* Core Values */}
                  <div className="space-y-20 py-20">
                    <div className="text-center space-y-4">
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-full border border-orange-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-orange-600 font-black text-[10px] uppercase tracking-[4px]">{t("aboutUs.about.coreValuesFoundation")}</span>
                      </motion.div>
                      <h2 className="text-3xl md:text-5xl font-black text-[#004360] tracking-tight">
                        {t("aboutUs.about.coreValuesTitle")}<span className="text-orange-500">.</span>
                      </h2>
                      <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm leading-relaxed">{t("aboutUs.about.coreValuesDesc")}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { key: "integrity", icon: <HiShieldCheck />, color: "from-blue-500 to-blue-600" },
                        { key: "teamwork", icon: <HiUserGroup />, color: "from-cyan-500 to-blue-500" },
                        { key: "responsiveness", icon: <HiLightningBolt />, color: "from-purple-500 to-blue-600" },
                        { key: "innovation", icon: <HiLightBulb />, color: "from-orange-500 to-pink-500" },
                      ].map((val, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="group relative bg-white border-2 border-slate-100 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300">
                          <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${val.color} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
                          <div className="w-12 h-12 rounded-xl bg-[#FF8F12] flex items-center justify-center text-white text-2xl mb-5 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
                            {val.icon}
                          </div>
                          <h4 className="text-2xl font-bold text-[#004360] mb-3">{t(`aboutUs.about.values.${val.key}.title`)}</h4>
                          <p className="text-slate-600 leading-relaxed text-[17px]">{t(`aboutUs.about.values.${val.key}.desc`)}</p>
                          <div className="mt-6 h-0.5 w-12 bg-gradient-to-r from-[#004360] to-transparent rounded-full" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Corporate Governance */}
                <div className="space-y-16">
                  <div className="bg-slate-50 p-12 rounded-[30px] border border-white shadow-inner relative overflow-hidden group">
                    <RiDoubleQuotesR className="absolute -top-10 -right-10 text-[200px] text-black/5 group-hover:scale-110 transition-transform" />
                    <h3 className="text-4xl font-black text-[#004360] mb-8 relative z-10 text-left">{t("aboutUs.about.governance")}</h3>
                    <p className="text-slate-600 text-[17px] leading-relaxed max-w-4xl relative z-10 text-left text-justify">{t("aboutUs.about.governanceText")}</p>
                  </div>

                  {/* Org Structure */}
                  <div className="p-10 md:p-12 rounded-[40px] border-2 border-dashed border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                      <div className="space-y-4">
                        <h4 className="text-orange-500 font-bold uppercase tracking-[4px] text-xs">{t("aboutUs.about.orgHierarchy")}</h4>
                        <h3 className="text-3xl md:text-5xl font-black text-[#004360]">{t("aboutUs.about.orgStructure")}</h3>
                      </div>
                      <button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = structureImg.src;
                          link.download = "Wegagen-Bank-Organizational-Structure.jpg";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-10 py-4 bg-[#004360] text-white font-black rounded-full shadow-2xl hover:bg-orange-500 transition-colors uppercase text-xs tracking-widest"
                      >
                        {t("aboutUs.about.downloadChart")}
                      </button>
                    </div>
                    <div className="relative group overflow-hidden rounded-[30px] shadow-2xl bg-slate-100 p-2 border border-slate-200">
                      <img src={structureImg.src} className="w-full transition-transform duration-1000 group-hover:scale-105 rounded-[24px]" alt="Wegagen Structure" />
                      <div className="absolute inset-0 bg-[#004360]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-[30px]">
                        <button onClick={() => setIsFullscreen(true)} className="px-8 py-3 bg-white text-[#004360] font-black rounded-full shadow-xl hover:scale-110 transition-transform">
                          {t("aboutUs.about.viewFullscreen")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── 2. Board of Directors ── */}
            {activeSection === 2 && (
              <motion.div key="board" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-12 md:space-y-16">
                <div>
                  <SectionHeading>{t("aboutUs.board.title")}</SectionHeading>
                  {!mainLoading && !mainError && (
                    <p className="text-xl text-slate-500 leading-relaxed max-w-[900px] mt-4">{t("aboutUs.board.description")}</p>
                  )}
                </div>
                {mainError && <ErrorBanner onRetry={fetchAllData} />}
                <MemberGrid members={boardMembers2} loading={mainLoading} error={mainError} onRetry={fetchAllData} variant="large" skeletonCount={2} />
                <MemberGrid members={boardMembers} loading={mainLoading} error={mainError} onRetry={fetchAllData} variant="large" skeletonCount={4} />

                {/* Board Committees */}
                <div>
                  <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="h-1 w-12 bg-[#FF8F12] rounded-full" />
                      <span className="text-[#FF8F12] font-bold uppercase text-xs tracking-[4px]">{t("aboutUs.board.governance")}</span>
                      <div className="h-1 w-12 bg-[#FF8F12] rounded-full" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#004360]">{t("aboutUs.board.committees")}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {[
                      { titleKey: "Risk Management & Compliance Committee", icon: <FaBalanceScale className="w-6 h-6" />, members: ["Ato Alemseged Assefa - Chairperson", "Ato Zenfu Asfaw - Member", "Ato Fikru Jiregna - Member"] },
                      { titleKey: "Audit Committee", icon: <FaChartBar className="w-6 h-6" />, members: ["Ato Hassen Yesuf - Chairperson", "Ato Fithanegest Gebru - Member", "Ato Abdishu Hussein - Member"] },
                      { titleKey: "Nomination & Remuneration Committee", icon: <FaUsers className="w-6 h-6" />, members: ["Ato Woldegabriel Naizghi - Chairperson", "Ato Gebregziabher Haddush - Member", "Ato Tesfatsyon Desta - Member", "Ato Surafeal Berhe - Member"] },
                      { titleKey: "Credit Committee", icon: <FaCreditCard className="w-6 h-6" />, members: ["Ato Gebregziabher Haddush - Chairperson", "Ato Woldegabriel Naizghi - Member", "Ato Alemseged Assefa - Member", "Ato Fikru Jiregna - Member"] },
                    ].map((comm, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: idx * 0.15 }} whileHover={{ y: -8, scale: 1.02 }} className="group bg-slate-50 hover:bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 hover:border-[#FF8F12]/30 hover:shadow-xl hover:shadow-[#FF8F12]/10 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 shrink-0 rounded-[14px] bg-[#FF8F12] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">{comm.icon}</div>
                          <h4 className="text-lg md:text-xl font-black text-center w-full text-[#004360] group-hover:text-[#FF8F12] transition-colors duration-300 leading-tight">{comm.titleKey}</h4>
                        </div>
                        <div className="h-0.5 bg-gradient-to-r from-[#FF8F12]/50 to-transparent mb-5 rounded-full" />
                        <ul className="space-y-3">
                          {comm.members.map((m, i) => (
                            <li key={i} className="text-slate-600 flex items-center gap-3 group/item hover:text-[#004360] transition-colors duration-200">
                              <span className="w-8 h-8 shrink-0 rounded-full bg-[#FF8F12]/10 flex items-center justify-center text-[#FF8F12] font-bold text-xs group-hover/item:bg-[#FF8F12] group-hover/item:text-white transition-all duration-300">{i + 1}</span>
                              <span className="text-[15px]">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── 3. Core Management ── */}
            {activeSection === 3 && (
              <motion.div key="core" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
                <SectionHeading>{t("aboutUs.core.title")}</SectionHeading>
                {mainError && <ErrorBanner onRetry={fetchAllData} />}
                <MemberGrid members={coreManagements2} loading={mainLoading} error={mainError} onRetry={fetchAllData} variant="large" skeletonCount={1} />
                <MemberGrid members={coreManagements} loading={mainLoading} error={mainError} onRetry={fetchAllData} variant="compact" skeletonCount={6} />
              </motion.div>
            )}

            {/* ── 4. Senior Management ── */}
            {activeSection === 4 && (
              <motion.div key="senior" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
                <SectionHeading>{t("aboutUs.senior.title")}</SectionHeading>
                {mainError && <ErrorBanner onRetry={fetchAllData} />}
                <MemberGrid members={seniorManagements} loading={mainLoading} error={mainError} onRetry={fetchAllData} variant="compact" skeletonCount={6} />
              </motion.div>
            )}

            {/* ── 5. Management Team ── */}
            {activeSection === 5 && (
              <motion.div key="mgmt" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
                <SectionHeading>{t("aboutUs.management.title")}</SectionHeading>
                {mgmtError && <ErrorBanner onRetry={fetchManagement} />}
                <MemberGrid members={managements} loading={mgmtLoading} error={mgmtError} onRetry={fetchManagement} variant="compact" skeletonCount={9} />
              </motion.div>
            )}

            {/* ── 6. District Directors ── */}
            {activeSection === 6 && (
              <motion.div key="district" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
                <SectionHeading>{t("aboutUs.district.title")}</SectionHeading>
                {districtError && <ErrorBanner onRetry={fetchDistricts} />}
                <MemberGrid members={districtTeam} loading={districtLoading} error={districtError} onRetry={fetchDistricts} variant="compact" skeletonCount={10} />
              </motion.div>
            )}

            {/* ── 9. Sharia Advisory Committee ── */}
            {activeSection === 9 && (
              <motion.div key="sharia" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
                <SectionHeading>{t("aboutUs.sharia.title")}</SectionHeading>
                {mainError && <ErrorBanner onRetry={fetchAllData} />}
                <MemberGrid members={shariaCommittee} loading={mainLoading} error={mainError} onRetry={fetchAllData} variant="compact" skeletonCount={3} />
              </motion.div>
            )}

            {/* ── 7. Timeline ── */}
            {activeSection === 7 && (
              <motion.div key="timeline" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-16">
                <div>
                  <div className="flex items-center gap-4 mb-4 mt-10">
                    <div className="h-1 w-16 bg-gradient-to-r from-[#FF8F12] to-transparent rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-bold text-[#004360]">{t("aboutUs.timeline.title")}</h2>
                  </div>
                  <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">{t("aboutUs.timeline.description")}</p>
                </div>

                {/* ── Vertical Timeline (alternating, replicating react-vertical-timeline-component) ── */}
                <div className="bg-slate-50/50 rounded-[40px] md:rounded-[60px] p-4 md:p-10 border border-slate-100">
                  <div className="relative">
                    {/* Centre spine */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#004360]/20 -translate-x-1/2" />
                    {/* Mobile spine */}
                    <div className="md:hidden absolute left-7 top-0 bottom-0 w-0.5 bg-[#004360]/20" />

                    <div className="space-y-0">
                      {TIMELINE_DATA.map((step, idx) => {
                        const isLeft = idx % 2 === 0;
                        const isDark = idx % 2 === 0;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: Math.min(idx * 0.03, 0.5) }}
                            className="relative flex items-center mb-6 md:mb-8"
                          >
                            {/* ── MOBILE layout ── */}
                            <div className="md:hidden flex items-start gap-4 pl-16 w-full">
                              {/* Mobile dot */}
                              <div
                                className="absolute left-4 top-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 shrink-0"
                                style={{ background: '#ff6b0b' }}
                              >
                                <span className="text-[7px] font-black text-white uppercase leading-none text-center px-0.5">{step.month}</span>
                              </div>
                              <div
                                className="flex-1 rounded-[20px] p-5 shadow-md"
                                style={{
                                  background: isDark ? '#004360' : '#fff',
                                  border: isDark ? 'none' : '1px solid #f1f5f9',
                                }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                                    style={{
                                      background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,107,11,0.1)',
                                      color: isDark ? 'rgba(255, 200, 150, 1)' : '#ff6b0b',
                                    }}
                                  >{step.date}</span>
                                </div>
                                <h3
                                  className="text-base font-black mb-1.5 leading-snug"
                                  style={{ color: isDark ? '#fff' : '#ff6b0b' }}
                                >{t(`aboutUs.timeline.entries.${step.key}.title`)}</h3>
                                <p
                                  className="text-sm leading-relaxed"
                                  style={{ color: isDark ? 'rgba(255,255,255,0.65)' : '#64748b' }}
                                >{t(`aboutUs.timeline.entries.${step.key}.desc`)}</p>
                              </div>
                            </div>

                            {/* ── DESKTOP layout ── */}
                            <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-0 w-full">

                              {/* Left content — always pr-10 from center circle */}
                              <div className="pr-10 flex justify-end">
                                {isLeft ? (
                                  <div
                                    className="max-w-[400px] w-full rounded-[28px] p-7 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-transform duration-300 cursor-default"
                                    style={{ background: '#004360', border: 'none' }}
                                  >
                                    <h3 className="text-[20px] font-black mb-2 text-right" style={{ color: '#fff' }}>{t(`aboutUs.timeline.entries.${step.key}.title`)}</h3>
                                    <p className="opacity-70 text-[15px] text-right" style={{ color: '#fff' }}>{t(`aboutUs.timeline.entries.${step.key}.desc`)}</p>
                                  </div>
                                ) : (
                                  /* Year label on left when card is on right */
                                  <div className="flex justify-end pr-4">
                                    <span className="text-3xl font-black text-[#004360]">{step.date}</span>
                                  </div>
                                )}
                              </div>

                              {/* Centre circle icon */}
                              <div className="relative z-10 flex flex-col items-center">
                                <div
                                  className="w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-xl text-center"
                                  style={{ background: '#ff6b0b', color: '#fff' }}
                                >
                                  <span className="text-[9px] font-black uppercase leading-tight text-center px-1">{step.month}</span>
                                </div>
                              </div>

                              {/* Right content — always pl-10 from center circle */}
                              <div className="pl-10 flex justify-start">
                                {!isLeft ? (
                                  <div
                                    className="max-w-[400px] w-full rounded-[28px] p-7 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-transform duration-300 cursor-default"
                                    style={{ background: '#fff', border: '1px solid #f1f5f9' }}
                                  >
                                    <h3 className="text-[20px] font-black mb-2 text-left" style={{ color: '#ff6b0b' }}>{t(`aboutUs.timeline.entries.${step.key}.title`)}</h3>
                                    <p className="opacity-70 text-[15px] text-left" style={{ color: '#004360' }}>{t(`aboutUs.timeline.entries.${step.key}.desc`)}</p>
                                  </div>
                                ) : (
                                  /* Year label on right when card is on left */
                                  <div className="flex justify-start pl-4">
                                    <span className="text-3xl font-black text-[#004360]">{step.date}</span>
                                  </div>
                                )}
                              </div>

                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── 10. Strategic Objectives ── */}
            {activeSection === 10 && (
              <motion.div key="strategy" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-16">
                <div className="flex items-center gap-4 mb-4 mt-10">
                  <div className="h-1 w-16 bg-gradient-to-r from-[#FF8F12] to-transparent rounded-full" />
                  <h2 className="text-4xl md:text-5xl font-bold text-[#004360]">{t("aboutUs.strategy.title")}</h2>
                </div>
                <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-slate-50 overflow-hidden group">
                  <img src={strategicImg.src} className="w-full rounded-[30px] transition-transform duration-1000 group-hover:scale-[1.02]" alt="Strategic Objectives" />
                  <div className="mt-10 text-center max-w-2xl mx-auto">
                    <p className="text-slate-500 text-lg">{t("aboutUs.strategy.description")}</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      <Footer />

      {/* ── Fullscreen Org Chart ── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={e => { e.stopPropagation(); setIsFullscreen(false); }}
              className="fixed top-6 right-6 z-[10000] flex items-center gap-2 px-4 py-2 bg-white text-[#004360] font-bold rounded-full shadow-2xl hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full flex items-center justify-center p-4 pt-20" onClick={e => e.stopPropagation()}>
              <img src={structureImg.src} alt="Organizational Structure" className="max-w-full max-h-full object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Member Detail Modal ── */}
      {detailMember && <DetailModal member={detailMember} onClose={() => setDetailMember(null)} />}
    </div>
  );
}
