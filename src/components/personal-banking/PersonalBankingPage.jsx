'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";

import { IoIosDoneAll } from "react-icons/io";
import { MdMenuOpen, MdOutlineArrowForwardIos, MdClose } from "react-icons/md";

import Footer from "../Footer";

import commonImg from "@/assets/Images/common.jpg";

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            staggerChildren: 0.2,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.4, ease: "easeIn" }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

export default function PersonalBankingPage() {
    const { t, messages } = useI18n();
    const pb = messages?.personalBanking || {};
    const ACCOUNT_TYPES = pb.accounts || [];

    const router = useRouter();
    const searchParams = useSearchParams();
    const paramId = searchParams.get('display');

    const [dispaly, setDisplay] = useState(1);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const activeItemRef = useRef(null);

    useEffect(() => {
        if (paramId) {
            setDisplay(parseInt(paramId));
        }
    }, [paramId]);

    // Auto-scroll to active item when mobile menu opens
    useEffect(() => {
        if (isMobileMenuOpen && activeItemRef.current) {
            const timer = setTimeout(() => {
                activeItemRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 500); // Wait for drawer animation
            return () => clearTimeout(timer);
        }
    }, [isMobileMenuOpen, dispaly]);

    const handleNavigationClick = (index) => {
        setDisplay(index);
        setIsMobileMenuOpen(false);

        // Update URL hash/query without reloading
        const url = new URL(window.location.href);
        url.searchParams.set('display', index);
        window.history.pushState({}, '', url);

        // Scroll
        const isMobile = window.innerWidth < 1024;
        window.scrollTo({
            top: isMobile ? 150 : 400,
            behavior: 'smooth'
        });
    };

    const activeAccount = ACCOUNT_TYPES.find(n => n.id === dispaly) || ACCOUNT_TYPES[0];

    return (
        <div className="font-inter">
            {/* ── Dynamic Hero Section ── */}
            <div className="relative bg-[#111827] min-h-[250px] md:h-[280px] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={commonImg}
                        alt="Personal Banking"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60 md:bg-black/50" />
                </div>

                <div className="relative z-10 w-full max-w-[1300px] mx-auto px-5 md:px-10 text-center py-10 md:py-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F12]/90 text-white font-black text-[10px] uppercase tracking-[3px] mb-6 border border-white/5">
                            {t('personalBanking.premiumBankingServices')}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight px-4 break-words">
                            {activeAccount.title}
                            <span className="text-[#ff6b0b]">.</span>
                        </h1>
                        <p className="text-slate-200 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
                            {t('personalBanking.tailoredFinancialSolutions')}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1450px] mx-auto px-5 md:px-10 py-16 md:py-24 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">

                {/* Mobile Menu Trigger */}
                <div className="lg:hidden sticky top-20 z-[60] -mx-5 px-5 py-3 mb-6 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/60">
                    <button
                        className="w-full flex items-center justify-between gap-3 px-6 py-4 bg-white rounded-2xl text-[#004360] shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:bg-[#ff6b0b] hover:text-white transition-all duration-300 font-bold text-lg"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <div className="flex items-center gap-3">
                            <MdMenuOpen className="text-2xl" />
                            <span>{t('personalBanking.browseAccounts')}</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-orange-50 text-[#ff6b0b] text-xs font-black">
                            {dispaly}/22
                        </div>
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-[#004360]/40 backdrop-blur-sm z-[100]"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 left-0 right-0 h-[65vh] bg-white rounded-t-[32px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] z-[101] overflow-hidden flex flex-col"
                            >
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                                    <div>
                                        <h3 className="text-xl font-black text-[#004360]">{t('personalBanking.quickNavigate')}</h3>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{t('personalBanking.accountDirectory')}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-[#ff6b0b] transition-all"
                                    >
                                        <MdClose className="text-2xl" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                                    {ACCOUNT_TYPES.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            ref={dispaly === item.id ? activeItemRef : null}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            onClick={() => handleNavigationClick(item.id)}
                                            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 ${dispaly === item.id ? 'bg-[#ff6b0b] text-white shadow-lg shadow-orange-100' : 'bg-slate-50 text-slate-600 active:bg-slate-100'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${dispaly === item.id ? 'bg-white/20' : 'bg-white shadow-sm text-slate-400'}`}>
                                                {index + 1}
                                            </div>
                                            <span className="font-bold text-[14px] flex-1">{item.title}</span>
                                            {dispaly === item.id && <MdOutlineArrowForwardIos className="text-white text-xs" />}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Left Navigation (Desktop) */}
                <div className="hidden lg:block w-full lg:w-[300px] xl:w-[360px] shrink-0">
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[28px] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.06)] h-fit lg:sticky lg:top-32 flex flex-col gap-1.5 overflow-hidden">
                        <div className="flex items-center gap-3 px-4 pb-4 pt-2 mb-2 border-b border-slate-100">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[#ff6b0b] rotate-45"></div>
                            <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[2px]">{t('personalBanking.accountDirectory')}</h3>
                        </div>
                        <div className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto pr-2 overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {ACCOUNT_TYPES.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleNavigationClick(item.id)}
                                    className={`px-3 py-1.5 rounded-[10px] cursor-pointer transition-all duration-200 flex items-center gap-3 text-[13px] font-bold group
                                        ${dispaly === item.id
                                            ? 'bg-[#ff8f12] text-white shadow-[0_8px_20px_-6px_rgba(255,143,18,0.4)] scale-[1.02]'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-[#004360] rounded-[16px]'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] transition-all duration-300 ${dispaly === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-[#004360] group-hover:text-white'}`}>
                                        {index + 1}
                                    </div>
                                    <span className="flex-1 leading-snug">{item.title}</span>
                                    {dispaly === item.id ? (
                                        <motion.div
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <MdOutlineArrowForwardIos className="text-xs text-white" />
                                        </motion.div>
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b0b] opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-125" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={dispaly}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full text-left"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="bg-[#FF6B0B] rounded-[32px] p-8 md:p-12 relative overflow-hidden mb-8"
                            >
                                <div className="relative z-10">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white backdrop-blur-md font-black text-[11px] uppercase tracking-[3px] mb-4 border border-white/5">
                                        {t('personalBanking.subtitle')}
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                                        {activeAccount.title.includes(' ') ? (
                                            <>
                                                {activeAccount.title.split(' ').slice(0, -1).join(' ')}<br />
                                                <span className="text-white">{activeAccount.title.split(' ').slice(-1)}</span>
                                            </>
                                        ) : activeAccount.title}
                                    </h2>
                                    
                                    {activeAccount.headerDescription ? (
                                        <div className="space-y-2 mt-4">
                                            <h4 className="text-white/80 font-bold uppercase text-[12px] tracking-[2px]">Description</h4>
                                            <p className="text-white max-w-4xl text-[16px] leading-relaxed font-medium">
                                                {activeAccount.headerDescription}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-white max-w-2xl text-[16px] leading-relaxed font-medium">
                                            {activeAccount.description}
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Dynamic Content Sections */}
                            <div className="space-y-12">
                                {/* Handle Global Layout (ECX style) */}
                                {activeAccount.customLayout === 'ecx' && (
                                    <motion.div variants={itemVariants} className="mb-2">
                                        <h3 className="text-2xl font-extrabold text-[#004360]">Products and Services:</h3>
                                    </motion.div>
                                )}

                                {/* Sections Renderer */}
                                {(activeAccount.sections || [{ id: 'default', title: null, features: activeAccount.features, requirements: activeAccount.requirements, requirementSublist: activeAccount.requirementSublist }]).map((section, sIdx) => (
                                    <div key={section.id || sIdx} className="space-y-8">
                                        {section.title && (
                                            <h4 className={`font-bold pl-3 border-l-4 border-[#ff6b0b] ${section.title.startsWith('1.') || section.title.startsWith('2.') ? 'text-2xl font-black text-[#004360]' : 'text-lg text-[#ff6b0b]'}`}>
                                                {section.title}
                                            </h4>
                                        )}

                                        {/* Subsections Grid (ECX Member-level) */}
                                        {section.subsections ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {section.subsections.map((sub, ssIdx) => (
                                                    <div key={ssIdx} className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                                                        <div className="mb-6">
                                                            <h5 className="text-lg font-bold text-[#004360] mb-2">{sub.title}</h5>
                                                            {sub.badge && <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 inline-block px-3 py-1 rounded-full border border-orange-100">{sub.badge}</p>}
                                                        </div>
                                                        <div className="space-y-4 flex-grow">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50">
                                                                    <div className="w-4 h-4 rounded bg-[#ff6b0b] rotate-45 flex items-center justify-center">
                                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h6 className="text-sm font-extrabold text-[#004360] uppercase tracking-wider">Key Features</h6>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {sub.features.map((feat, fIdx) => (
                                                                    <div key={fIdx} className="flex items-start gap-3 group">
                                                                        <IoIosDoneAll className="text-2xl text-[#ff6b0b] shrink-0 group-hover:scale-110 transition-transform" />
                                                                        <p className="text-slate-600 text-[13px] font-medium leading-relaxed group-hover:text-[#004360]">{feat}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-8 items-start">
                                                {/* Features Section */}
                                                {(section.features && section.features.length > 0) && (
                                                    <div className="bg-white rounded-[28px] p-8 lg:p-10 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] h-full transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                                                        <div className="flex items-center gap-4 mb-4 md:mb-8">
                                                            {section.featuresType !== 'entityIcons' && (
                                                                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50">
                                                                    <div className="w-6 h-6 rounded bg-[#ff6b0b] rotate-45 flex items-center justify-center">
                                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h3 className="text-2xl font-extrabold text-[#004360]">
                                                                    {section.eligibleEntitiesTitle || t('personalBanking.featuresTitle')}
                                                                </h3>
                                                                {section.featuresType !== 'entityIcons' && (
                                                                    <p className="text-slate-500 text-sm font-medium mt-1">
                                                                        {t('personalBanking.featuresSubtitle')}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className={section.featuresType === 'entityIcons' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
                                                            {section.features.map((feature, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    variants={itemVariants}
                                                                    initial="hidden"
                                                                    whileInView="visible"
                                                                    viewport={{ once: true, margin: "-50px" }}
                                                                    className={section.featuresType === 'entityIcons' 
                                                                        ? "flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all duration-300 group"
                                                                        : "flex gap-4 sm:gap-6 p-3 sm:p-3 rounded-2xl sm:rounded-2xl bg-slate-50 border border-transparent hover:border-[#ff6b0b]/20 hover:bg-white hover:shadow-[0_10px_30px_rgba(255,107,11,0.05)] transition-all duration-300 group"}
                                                                >
                                                                    <div className={section.featuresType === 'entityIcons'
                                                                        ? "w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#ff6b0b] group-hover:bg-[#ff6b0b] group-hover:text-white transition-colors border border-slate-100"
                                                                        : "w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-[#ff6b0b] group-hover:scale-110 group-hover:bg-[#ff6b0b] group-hover:text-white transition-all duration-300"}>
                                                                        {section.featuresType === 'entityIcons' ? (
                                                                            <IoIosDoneAll className="text-2xl" />
                                                                        ) : (
                                                                            <span className="font-bold text-sm block -mr-[1px] -mb-[1px]">{i + 1}</span>
                                                                        )}
                                                                    </div>
                                                                    <p className={section.featuresType === 'entityIcons'
                                                                        ? "text-slate-600 font-bold text-[14px]"
                                                                        : "text-slate-600 text-[14px] font-medium leading-relaxed group-hover:text-[#004360] transition-colors"}>{feature}</p>
                                                                </motion.div>
                                                            ))}

                                                            {/* Sub-section: Special Features (Legacy support for account 22) */}
                                                            {activeAccount.specialFeatures && section.id === 'default' && (
                                                                <div className="bg-slate-50/50 rounded-[24px] p-8 border border-slate-100 mt-4">
                                                                    <h4 className="text-[#004360] font-black text-[15px] mb-6 flex items-center gap-3">
                                                                        <span className="w-8 h-[2px] bg-[#ff6b0b]"></span>
                                                                        {activeAccount.specialFeaturesTitle || "Special Features"}
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        {activeAccount.specialFeatures.map((feature, i) => (
                                                                            <div key={i} className="flex gap-4 group">
                                                                                <span className="text-[#ff6b0b] font-black text-sm italic min-w-[20px] pt-0.5">{feature.id}.</span>
                                                                                <p className="text-slate-500 font-medium text-[13.5px] leading-relaxed group-hover:text-slate-700 transition-colors">{feature.text}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Requirements Section */}
                                                {(section.requirements && section.requirements.length > 0) && (
                                                    <div className="bg-white rounded-[28px] p-8 lg:p-10 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] h-full relative overflow-hidden transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100/50">
                                                                <div className="w-6 h-6 rounded bg-[#004360] rotate-45 flex items-center justify-center">
                                                                    <div className="w-2.5 h-2.5 bg-white rotate-45"></div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl font-extrabold text-[#004360]">{t('personalBanking.reqsTitle')}</h3>
                                                                <p className="text-slate-500 text-sm font-medium mt-1">{t('personalBanking.reqsSubtitle')}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2 relative z-10 mt-6 text-left">
                                                            {section.requirements.map((req, i) => (
                                                                typeof req === 'string' ? (
                                                                    <motion.div
                                                                        key={i}
                                                                        variants={itemVariants}
                                                                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200 group border border-transparent hover:border-slate-100"
                                                                    >
                                                                        <IoIosDoneAll className="text-3xl text-[#ff6b0b] shrink-0 group-hover:scale-125 transition-transform duration-300 mt-0.5" />
                                                                        <p className="text-slate-600 text-[14px] font-medium leading-relaxed group-hover:text-[#004360] transition-colors">{req}</p>
                                                                    </motion.div>
                                                                ) : req.type === 'highlight' ? (
                                                                    <motion.div
                                                                        key={i}
                                                                        variants={itemVariants}
                                                                        className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50 my-2"
                                                                    >
                                                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                                                                            <IoIosDoneAll className="text-3xl text-[#ff6b0b]" />
                                                                        </div>
                                                                        <p className="text-[#004360] text-[14px] font-extrabold leading-relaxed mt-1">{req.text}</p>
                                                                    </motion.div>
                                                                ) : req.type === 'note' ? (
                                                                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                                                                        <p className="text-slate-600 font-medium leading-relaxed text-[14px]">{req.text}</p>
                                                                    </div>
                                                                ) : req.type === 'labeledList' ? (
                                                                    <div key={i} className="space-y-4 mt-4">
                                                                        <h4 className="text-[#004360] font-bold text-lg flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                                            {req.title}
                                                                        </h4>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                            {req.items.map((item, ii) => (
                                                                                <div key={ii} className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                                                                    <span className="text-orange-500 font-black text-[10px] block mb-2 uppercase tracking-widest">{item.id}</span>
                                                                                    <p className="text-slate-600 font-bold text-[13px] leading-snug group-hover:text-[#004360]">{item.text}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ) : req.type === 'labeledGrid' ? (
                                                                    <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 my-4 shadow-sm">
                                                                        <h4 className="text-[#004360] font-extrabold text-sm mb-4 uppercase tracking-[1px]">{req.title}</h4>
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                            {req.items.map((item, ii) => (
                                                                                <div key={ii} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-[#ff6b0b]/30 transition-all">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                                                    <span className="text-slate-600 text-[12px] font-bold leading-tight">{item}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ) : req.type === 'infoCards' ? (
                                                                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                                        {req.cards.map((card, ii) => (
                                                                            <div key={ii} className={`p-4 rounded-2xl border ${card.color === 'sky' ? 'bg-sky-50/50 border-sky-100/50' : 'bg-orange-50/50 border-orange-100/50'}`}>
                                                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${card.color === 'sky' ? 'text-sky-600' : 'text-orange-600'}`}>{card.title}</p>
                                                                                <p className={`font-bold text-[13px] ${card.color === 'sky' ? 'text-[#004360]' : 'text-[#ff6b0b]'}`}>{card.text}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : null
                                                            ))}

                                                            {/* Nested sublist for identification types (Tab 10) */}
                                                            {section.requirementSublist && (
                                                                <div className="mt-8">
                                                                    <div className="flex items-center gap-2 mb-4 ml-1">
                                                                        <div className="w-1 h-4 bg-[#ff6b0b] rounded-full"></div>
                                                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
                                                                            {section.requirementSublist.title}
                                                                        </p>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                        {section.requirementSublist.items.map((item, idx) => (
                                                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/30 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                                                                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#ff6b0b] text-[11px] shrink-0 font-black shadow-sm group-hover:bg-[#ff6b0b] group-hover:text-white transition-all">
                                                                                    {String.fromCharCode(65 + idx)}
                                                                                </div>
                                                                                <span className="text-slate-600 text-[12px] font-bold group-hover:text-[#004360] transition-colors">{item}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </div>
    );
}
