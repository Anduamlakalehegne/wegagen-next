"use client";

import Image from "next/image";
import { useI18n } from "../i18n/I18nProvider";

import bank1 from "../../assets/Images/bank1.png";
import bank2 from "../../assets/Images/bank2.png";
import bank3 from "../../assets/Images/bank3.png";
import bank4 from "../../assets/Images/bank4.png";
import bank5 from "../../assets/Images/bank5.png";
import bank6 from "../../assets/Images/bank6.png";
import bank7 from "../../assets/Images/bank7.png";
import bank8 from "../../assets/Images/bank8.png";
import bank9 from "../../assets/Images/bank9.png";
import bank10 from "../../assets/Images/bank10.png";

export default function CorrespondentBanksSection() {
  const { t } = useI18n();
  const logos = [
    bank1,
    bank2,
    bank3,
    bank4,
    bank5,
    bank6,
    bank7,
    bank8,
    bank9,
    bank10,
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-slate-50 py-[80px] md:py-[100px] text-center overflow-hidden border-t border-slate-100">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="relative max-w-[700px] mx-auto mb-[50px] px-5 z-10" data-aos="fade-up">
        <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#004360] text-[12px] font-extrabold tracking-[2px] uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#004360]"></span>
          {t("home.correspondentBanks.badge")}
        </div>
        <h2 className="text-[36px] md:text-[48px] font-extrabold text-[#004360] pb-4 tracking-[-1px] leading-tight">
          {t("home.correspondentBanks.titlePrefix")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12]">
            {t("home.correspondentBanks.titleAccent")}
          </span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-slate-500 leading-[1.8]">
          {t("home.correspondentBanks.description")}
        </p>
      </div>

      <div
        className="w-[95%] md:w-[90%] mx-auto overflow-hidden relative py-[30px] z-10"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="flex w-max hover:[animation-play-state:paused] will-change-transform animate-marquee">
          {logos.map((logo, i) => (
            <div
              key={`bank-1-${i}`}
              className="flex-none w-[160px] md:w-[220px] h-[85px] md:h-[110px] mr-[25px] md:mr-[40px] group"
            >
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-[16px] blur-md group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <Image
                  src={logo}
                  alt="Correspondent Bank"
                  fill
                  sizes="220px"
                  className="relative w-full h-full object-contain p-[15px] md:p-[20px] border border-slate-200/80 rounded-[16px] bg-white/90 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#ff6b0b]/50 group-hover:shadow-[0_20px_40px_rgba(255,107,11,0.1)]"
                />
              </div>
            </div>
          ))}

          {logos.map((logo, i) => (
            <div
              key={`bank-2-${i}`}
              className="flex-none w-[160px] md:w-[220px] h-[85px] md:h-[110px] mr-[25px] md:mr-[40px] group"
            >
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-[16px] blur-md group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <Image
                  src={logo}
                  alt="Correspondent Bank"
                  fill
                  sizes="220px"
                  className="relative w-full h-full object-contain p-[15px] md:p-[20px] border border-slate-200/80 rounded-[16px] bg-white/90 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#ff6b0b]/50 group-hover:shadow-[0_20px_40px_rgba(255,107,11,0.1)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
