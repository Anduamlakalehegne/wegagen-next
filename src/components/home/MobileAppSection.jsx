"use client";

import Image from "next/image";

import appstore from "../../assets/Images/appstore.png";
import playstore from "../../assets/Images/playstore.jpg";
import mobileBanking from "../../assets/Images/Home Page/mobile banking.png";

import { useI18n } from "../i18n/I18nProvider";

export default function MobileAppSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#002333] via-[#00344b] to-[#004360] py-[60px] sm:py-[100px] text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ff6b0b]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-[1500px] mx-auto px-5 sm:px-[40px] grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[80px] items-center text-center lg:text-left">
        <div
          className="flex flex-col justify-center items-center lg:items-start z-10"
          data-aos="fade-right"
          data-aos-duration="1800"
          data-aos-easing="ease-out-cubic"
        >
          <div className="flex items-center gap-2 w-fit mb-[30px] px-5 py-2.5 rounded-[30px] bg-white/5 backdrop-blur-md border border-white/10 text-[#ff6b0b] text-[13px] font-extrabold tracking-[2px] uppercase shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <div className="w-2 h-2 rounded-full bg-[#ff6b0b] animate-pulse"></div>
            {t("home.mobileApp.badge")}
          </div>
          <h2 className="text-[36px] sm:text-[44px] xl:text-[52px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-4 leading-[1.1] drop-shadow-sm">
            {t("home.mobileApp.titleLine1")} <br className="hidden sm:block" />
            {t("home.mobileApp.titleLine2")}
          </h2>
          <h3 className="text-[24px] sm:text-[32px] font-extrabold text-[#ff6b0b] mb-[30px] drop-shadow-[0_2px_10px_rgba(255,107,11,0.3)]">
            {t("home.mobileApp.subtitle")}
          </h3>
          <p className="text-[16px] sm:text-[18px] text-slate-300 leading-[1.8] mb-[40px] max-w-[600px]">
            {t("home.mobileApp.descriptionPrefix")}
            <strong className="text-white font-extrabold drop-shadow-md">
              {t("home.mobileApp.descriptionStrong")}
            </strong>
            {t("home.mobileApp.descriptionSuffix")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-[25px] w-full">
            <a
              href="https://play.google.com/store/apps/details?id=com.act.wegagen&hl"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl group-hover:bg-[#ff6b0b]/30 transition-colors duration-300"></div>
              <Image
                src={playstore}
                alt={t("home.mobileApp.playStoreAlt")}
                className="relative h-[55px] sm:h-[60px] w-auto drop-shadow-lg"
                priority={false}
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/wegagen-mobile/id6472656143"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl group-hover:bg-[#ff6b0b]/30 transition-colors duration-300"></div>
              <Image
                src={appstore}
                alt={t("home.mobileApp.appStoreAlt")}
                className="relative h-[55px] sm:h-[60px] w-auto drop-shadow-lg"
                priority={false}
              />
            </a>
          </div>
        </div>

        <div
          className="relative flex justify-center items-center mt-10 lg:mt-0"
          data-aos="fade-left"
          data-aos-duration="1800"
          data-aos-easing="ease-out-cubic"
          data-aos-delay="200"
        >
          <div
            className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-[1]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,107,11,0.2) 0%, rgba(0,186,255,0.05) 50%, rgba(255,255,255,0) 70%)",
            }}
          ></div>
          <Image
            src={mobileBanking}
            className="relative z-[2] max-w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[700px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] rounded-[20px]"
            style={{ animation: "floatPhone 8s ease-in-out infinite" }}
            alt={t("home.mobileApp.phoneAlt")}
            priority={false}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatPhone {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-16px);
          }
        }
      `}</style>
    </section>
  );
}
