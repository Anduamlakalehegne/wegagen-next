"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "../i18n/I18nProvider";

const STRAPI = "https://weg.back.strapi.wegagen.com";

// ── Skeleton loaders ─────────────────────────────────────────────
export function MemberCardSkeletonLarge() {
  return (
    <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow border border-slate-100 animate-pulse flex flex-col md:flex-row">
      <div className="w-full max-w-[120px] min-h-[150px] mx-auto md:max-w-none md:mx-0 md:w-[180px] md:min-h-[225px] bg-slate-200 shrink-0" />
      <div className="flex-1 p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-14 bg-slate-100 rounded" />
        <div className="h-14 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export function MemberCardSkeletonCompact() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow border border-slate-100 animate-pulse flex flex-row">
      <div className="w-20 h-24 sm:w-24 sm:h-28 bg-slate-200 shrink-0" />
      <div className="flex-1 p-3 md:p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-10 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

// ── Large member card (Board / Core Primary) ─────────────────────
export function MemberCardLarge({ member, onClick }) {
  const { t } = useI18n();
  const imgUrl = member.attributes?.image?.data?.attributes?.url
    ? `${STRAPI}${member.attributes.image.data.attributes.url}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl border border-slate-100 cursor-pointer min-w-0"
      onClick={() => onClick(member)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full max-w-[120px] min-h-[150px] mx-auto md:max-w-none md:mx-0 md:w-[140px] md:min-h-[180px] lg:w-[160px] lg:min-h-[200px] xl:w-[180px] xl:min-h-[225px] flex-shrink-0 relative overflow-hidden bg-slate-100 rounded-lg md:rounded-none">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={member.attributes.full_name}
              className="w-full h-full transition-transform duration-1000 group-hover:scale-105 md:object-cover object-contain absolute inset-0"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-3xl font-black">
              {member.attributes.full_name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 p-4 md:p-5 flex flex-col justify-center overflow-hidden">
          <div className="mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-black text-[#004360] leading-tight mb-1 md:mb-2 text-left">
              {member.attributes.full_name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-6 md:w-8 bg-[#FF8F12] rounded-full" />
              <p className="text-[#FF8F12] font-bold uppercase text-[9px] md:text-[10px] tracking-[2px] break-words line-clamp-2">
                {member.attributes.position}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 md:p-3 rounded-[12px] md:rounded-[16px] border border-slate-100 mb-2.5 md:mb-3">
            <span className="font-bold text-[#004360] uppercase text-[8px] md:text-[9px] tracking-widest block mb-1">
              {t("aboutUs.board.academicExcellence")}
            </span>
            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
              {member.attributes.qualification || t("aboutUs.board.defaultQual")}
            </p>
          </div>
          <div className="bg-[#FF8F12]/10 p-2.5 md:p-3 rounded-[12px] md:rounded-[16px] border border-[#FF8F12]/30">
            <span className="font-bold text-[#FF8F12] uppercase text-[8px] md:text-[9px] tracking-widest block mb-1">
              {t("aboutUs.board.professionalJourney")}
            </span>
            <p className="text-[#004360] text-xs leading-relaxed line-clamp-2 font-medium">
              {member.attributes.work_experience || t("aboutUs.board.defaultExp")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Compact member card (Senior / Management / District / Sharia) ─
export function MemberCardCompact({ member, onClick }) {
  const imgUrl = member.attributes?.image?.data?.attributes?.url
    ? `${STRAPI}${member.attributes.image.data.attributes.url}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 hover:border-[#FF8F12]/40 hover:shadow-xl hover:shadow-[#FF8F12]/10 transition-all duration-500 overflow-hidden min-w-0 cursor-pointer"
      onClick={() => onClick && onClick(member)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF8F12]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
      <div className="flex flex-row">
        <div className="w-20 h-24 sm:w-24 sm:h-28 md:w-[100px] md:min-h-[125px] lg:w-[130px] lg:min-h-[162px] xl:w-[140px] xl:min-h-[175px] flex-shrink-0 relative overflow-hidden bg-slate-100 rounded-lg md:rounded-none">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={member.attributes.full_name}
              className="w-full h-full transition-transform duration-1000 group-hover:scale-105 md:object-cover object-contain absolute inset-0"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-2xl font-black">
              {member.attributes.full_name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 p-3 md:p-4 flex flex-col justify-center">
          <div className="mb-2 md:mb-3">
            <h3 className="text-sm md:text-base font-black text-[#004360] leading-tight mb-1 break-words">
              {member.attributes.full_name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-6 flex-shrink-0 bg-[#FF8F12] rounded-full" />
              <p className="text-[#FF8F12] font-bold uppercase text-[8px] md:text-[9px] tracking-[2px] break-words line-clamp-2">
                {member.attributes.position}
              </p>
            </div>
          </div>
          {member.attributes.description && (
            <div className="bg-slate-50 p-2 rounded-[12px] border border-slate-100">
              <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
                {member.attributes.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
