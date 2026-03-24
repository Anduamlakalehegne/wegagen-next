"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useI18n } from "../i18n/I18nProvider";

import myImage from "../../assets/Bonus-Remittance-7.png";

const WEIGHTED_RATE_API_URL =
  "https://weg.back.strapi.wegagen.com/api/weighted-average-rates";

export default function ExchangeRateSection() {
  const { t } = useI18n();
  const exchangeRateRef = useRef(null);

  const [rates, setRates] = useState([]);
  const [formattedDate2, setFormattedDate2] = useState("");
  const [activeTab, setActiveTab] = useState("exchange");
  const [weightedRates, setWeightedRates] = useState([]);
  const [weightedFormattedDate, setWeightedFormattedDate] = useState("");

  useEffect(() => {
    axios
      .get("https://weg.back.strapi.wegagen.com/api/exchange-rates?populate=*")
      .then((response) => {
        const data = response.data.data;
        setRates(data);

        if (data.length > 0) {
          const date = parseISO(data[0].attributes.date);
          setFormattedDate2(format(date, "EEEE MMMM dd, yyyy"));
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the exchange rates!", error);
      });
  }, []);

  useEffect(() => {
    const expectedCurrencies = [
      "USD",
      "GBP",
      "EUR",
      "CHF",
      "SEK",
      "CNY",
      "AED",
      "JPY",
    ];

    axios
      .get(WEIGHTED_RATE_API_URL)
      .then((response) => {
        const apiData = response.data.data || [];

        const apiDataMap = {};
        apiData.forEach((item) => {
          const attrs = item.attributes;
          const ccy = attrs.code ? attrs.code.toUpperCase() : "";
          apiDataMap[ccy] = attrs;
        });

        const apiDate =
          apiData.length > 0 && apiData[0].attributes.date
            ? apiData[0].attributes.date
            : null;

        const completeData = expectedCurrencies.map((ccy) => {
          const apiItem = apiDataMap[ccy];
          if (apiItem) {
            return {
              ...apiItem,
              ccy: ccy,
              buying: apiItem.buying || null,
              selling: apiItem.selling || null,
            };
          }

          return {
            id: null,
            ccy: ccy,
            date: apiDate || new Date().toISOString().split("T")[0],
            buying: null,
            selling: null,
          };
        });

        setWeightedRates(completeData);

        if (apiDate) {
          const date = parseISO(apiDate);
          setWeightedFormattedDate(format(date, "MMMM dd, yyyy"));
        } else if (completeData.length > 0 && completeData[0].date) {
          const date = parseISO(completeData[0].date);
          setWeightedFormattedDate(format(date, "MMMM dd, yyyy"));
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the weighted average rates!",
          error,
        );
      });
  }, []);

  return (
    <section
      className="relative bg-slate-50 py-10 sm:py-[60px] lg:py-24 min-h-[800px] flex items-center overflow-hidden max-w-[100vw] box-border"
      id="exchange-rate"
      ref={exchangeRateRef}
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-[#004360]/10 to-transparent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="relative max-w-[1500px] mx-auto px-5 md:px-[30px] lg:px-[30px] xl:px-[40px] w-full grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[480px_1fr] gap-10 lg:gap-[40px] xl:gap-[60px] items-center box-border">
        <div
          className="flex flex-col items-center lg:items-start text-center lg:text-left box-border mb-8 lg:mb-0"
          data-aos="fade-up"
          key={`left-side-${activeTab}`}
        >
          <div
            className="mb-[30px] lg:mb-[40px] w-full flex justify-center lg:justify-start animate__animated animate__fadeInUp"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <div className="relative group flex justify-center">
              <div className="absolute rounded-full blur-2xl group-hover:bg-[#ff6b0b]/10 transition-colors duration-500"></div>
              <Image
                src={myImage}
                alt="Wegagen Promo"
                className="relative max-w-[350px] sm:max-w-[400px] lg:max-w-[100%] xl:max-w-[100%] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:scale-105 hover:-translate-y-2 zoom-img"
                priority
              />
            </div>
          </div>

          <div className="relative pl-0 lg:pl-5 lg:border-l-4 lg:border-[#ff6b0b] flex flex-col items-center lg:items-start w-full">
            <h2
              className="text-[36px] sm:text-[44px] md:text-[50px] lg:text-[48px] font-extrabold text-[#004360] mb-3 lg:mb-4 tracking-[-1px] animate__animated animate__fadeInUp leading-[1.1]"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              {activeTab === "exchange"
                ? t("home.exchangeRate.titlePrefix")
                : t("home.exchangeRate.titleWeighted")}
              <span className="text-[#ff6b0b]">
                {activeTab === "exchange"
                  ? t("home.exchangeRate.titleRate")
                  : t("home.exchangeRate.titleAverage")}
              </span>
            </h2>
            <h3
              className="text-[18px] sm:text-[22px] md:text-[24px] font-bold text-slate-500 mb-[25px] lg:mb-[30px] animate__animated animate__fadeInUp"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              {activeTab === "exchange"
                ? t("home.exchangeRate.subtitleRate")
                : t("home.exchangeRate.subtitleWeighted")}
            </h3>

            <div
              className="inline-flex items-center gap-3 bg-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 animate__animated animate__fadeInUp"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[14px] sm:text-[16px] font-bold text-slate-700">
                {t("home.exchangeRate.lastUpdated")}{" "}
                <span className="text-[#ff6b0b] ml-1">
                  {activeTab === "exchange"
                    ? formattedDate2
                    : weightedFormattedDate}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col min-w-0 w-full box-border"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-offset="50"
        >
          <div className="flex justify-center lg:justify-end mb-[30px]">
            <div className="flex justify-center bg-white/80 backdrop-blur-md w-full sm:w-auto p-1.5 rounded-[16px] border border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.04)]">
              <button
                className={`flex-1 sm:flex-none text-center py-3 px-3 sm:px-[30px] rounded-[12px] border-none font-extrabold text-[12px] sm:text-[14px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeTab === "exchange" ? "bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12] text-white shadow-[0_8px_20px_rgba(255,107,11,0.25)] hover:shadow-[0_10px_25px_rgba(255,107,11,0.35)] translate-y-[-1px]" : "text-slate-500 bg-transparent hover:text-[#004360] hover:bg-slate-50"}`}
                onClick={() => setActiveTab("exchange")}
                type="button"
              >
                {t("home.exchangeRate.tabs.exchange")}
              </button>
              <button
                className={`flex-1 sm:flex-none text-center py-3 px-3 sm:px-[30px] rounded-[12px] border-none font-extrabold text-[12px] sm:text-[14px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeTab === "weighted" ? "bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12] text-white shadow-[0_8px_20px_rgba(255,107,11,0.25)] hover:shadow-[0_10px_25px_rgba(255,107,11,0.35)] translate-y-[-1px]" : "text-slate-500 bg-transparent hover:text-[#004360] hover:bg-slate-50"}`}
                onClick={() => setActiveTab("weighted")}
                type="button"
              >
                {t("home.exchangeRate.tabs.weighted")}
              </button>
            </div>
          </div>

          <div
            className="bg-white/90 backdrop-blur-xl rounded-[24px] overflow-hidden overflow-x-auto w-full shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-200/60"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table
              className="w-full border-collapse table-auto min-w-[700px] animate__animated animate__fadeIn"
              key={activeTab}
            >
              <thead className="bg-[#004360] text-white">
                {activeTab === "exchange" ? (
                  <tr>
                    <th
                      rowSpan="2"
                      className="px-[25px] py-[20px] text-[13px] uppercase tracking-wider font-extrabold text-left border-b border-white/10 sticky left-0 bg-[#004360] z-[2] w-[250px] shadow-[4px_0_12px_rgba(0,0,0,0.05)]"
                    >
                      {t("home.exchangeRate.table.currency")}
                    </th>
                    <th
                      rowSpan="2"
                      className="px-[25px] py-[20px] text-[13px] uppercase tracking-wider font-extrabold text-center border-b border-white/10"
                    >
                      {t("home.exchangeRate.table.unit")}
                    </th>
                    <th
                      colSpan="2"
                      className="px-[25px] py-[16px] text-[14px] font-extrabold border-b border-white/10 text-center border-l border-white/10 bg-white/5"
                    >
                      {t("home.exchangeRate.table.cashRemittance")}
                    </th>
                    <th
                      colSpan="2"
                      className="px-[25px] py-[16px] text-[14px] font-extrabold border-b border-white/10 text-center border-l bg-white/5"
                    >
                      {t("home.exchangeRate.table.bankTransactions")}
                    </th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-[25px] py-[20px] text-[13px] uppercase tracking-wider font-extrabold text-left border-b border-white/10 sticky left-0 bg-[#004360] z-[2] w-[250px] shadow-[4px_0_12px_rgba(0,0,0,0.05)]">
                      {t("home.exchangeRate.table.currency")}
                    </th>
                    <th className="px-[25px] py-[20px] text-[14px] font-extrabold border-b border-white/10 text-center border-l bg-white/5 text-white">
                      {t("home.exchangeRate.table.buying")}
                    </th>
                    <th className="px-[25px] py-[20px] text-[14px] font-extrabold border-b border-white/10 text-center border-l bg-white/5 text-[#ff6b0b]">
                      {t("home.exchangeRate.table.selling")}
                    </th>
                  </tr>
                )}
                {activeTab === "exchange" && (
                  <tr className="bg-black/20 text-[11px] uppercase tracking-[1.5px]">
                    <th className="px-[25px] py-[14px] font-extrabold text-center border-b border-white/10 text-white">
                      {t("home.exchangeRate.table.buying")}
                    </th>
                    <th className="px-[25px] py-[14px] font-extrabold text-center border-b border-white/10 text-[#ff6b0b]">
                      {t("home.exchangeRate.table.selling")}
                    </th>
                    <th className="px-[25px] py-[14px] font-extrabold text-center border-b border-white/10 text-white">
                      {t("home.exchangeRate.table.buying")}
                    </th>
                    <th className="px-[25px] py-[14px] font-extrabold text-center border-b border-white/10 text-[#ff6b0b]">
                      {t("home.exchangeRate.table.selling")}
                    </th>
                  </tr>
                )}
              </thead>

              <tbody key={activeTab}>
                {activeTab === "exchange" ? (
                  rates.map((rate, idx) => (
                    <tr
                      key={rate.id}
                      className="animate__animated animate__fadeInUp group hover:bg-[#f8fafc] transition-colors duration-200 last:[&>td]:border-b-0"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <td className="px-[25px] py-[12px] border-b border-slate-100 text-[15px] text-slate-800 sticky left-0 bg-white group-hover:bg-[#f8fafc] z-[2] font-extrabold w-[250px] shadow-[4px_0_12px_rgba(0,0,0,0.02)] transition-colors duration-200">
                        <div className="flex items-center gap-[15px]">
                          {rate.attributes.flag?.data?.[0]?.attributes?.url ? (
                            <Image
                              src={`https://weg.back.strapi.wegagen.com${rate.attributes.flag.data[0].attributes.url}`}
                              className="w-[42px] h-[30px] rounded-[6px] object-cover shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow duration-300"
                              alt={rate.attributes.code}
                              width={42}
                              height={30}
                            />
                          ) : (
                            <div className="w-[42px] h-[30px] bg-slate-100 flex items-center justify-center text-[12px] font-extrabold rounded-[6px] text-slate-500 shadow-inner">
                              {rate.attributes.code.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <strong className="text-[#004360]">
                              {rate.attributes.code}
                            </strong>
                          </div>
                        </div>
                      </td>
                      <td className="px-[25px] py-[12px] border-b border-slate-100 text-[14px] text-center text-slate-500 font-bold bg-slate-50/30 group-hover:bg-transparent transition-colors duration-200">
                        {rate.attributes.unit}
                      </td>
                      <td className="px-[25px] py-[12px] border-b border-slate-100 text-[15px] text-center font-bold tracking-tight text-[#004360]">
                        {rate.attributes.buying}
                      </td>
                      <td className="px-[25px] py-[12px] border-b border-slate-100 text-[15px] text-center font-bold tracking-tight text-[#ff6b0b] bg-[#ff6b0b]/[0.02] group-hover:bg-transparent transition-colors duration-200">
                        {rate.attributes.selling}
                      </td>
                      <td className="px-[25px] py-[12px] border-b border-slate-100 text-[15px] text-center font-bold tracking-tight text-[#004360]">
                        {rate.attributes.tra_buying}
                      </td>
                      <td className="px-[25px] py-[12px] border-b border-slate-100 text-[15px] text-center font-bold tracking-tight text-[#ff6b0b] bg-[#ff6b0b]/[0.02] group-hover:bg-transparent transition-colors duration-200">
                        {rate.attributes.tra_selling}
                      </td>
                    </tr>
                  ))
                ) : (
                  weightedRates.map((rate, idx) => {
                    const match = rates.find(
                      (r) =>
                        r.attributes.code.toUpperCase() ===
                          rate.ccy.toUpperCase() ||
                        (r.attributes.code.toUpperCase() === "EURO" &&
                          rate.ccy.toUpperCase() === "EUR") ||
                        (r.attributes.code.toUpperCase() === "EUR" &&
                          rate.ccy.toUpperCase() === "EURO"),
                    );
                    const flagUrl = match?.attributes.flag?.data?.[0]?.attributes
                      ?.url;
                    return (
                      <tr
                        key={idx}
                        className="animate__animated animate__fadeInUp group hover:bg-[#f8fafc] transition-colors duration-200 last:[&>td]:border-b-0"
                        style={{ animationDelay: `${idx * 0.04}s` }}
                      >
                        <td className="px-[25px] py-[14px] border-b border-slate-100 text-[15px] text-slate-800 sticky left-0 bg-white group-hover:bg-[#f8fafc] z-[2] font-extrabold w-[250px] shadow-[4px_0_12px_rgba(0,0,0,0.02)] transition-colors duration-200">
                          <div className="flex items-center gap-[15px]">
                            {flagUrl ? (
                              <Image
                                src={`https://weg.back.strapi.wegagen.com${flagUrl}`}
                                className="w-[42px] h-[30px] rounded-[6px] object-cover shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow duration-300"
                                alt={rate.ccy}
                                width={42}
                                height={30}
                              />
                            ) : (
                              <div className="w-[42px] h-[30px] bg-slate-100 flex items-center justify-center text-[12px] font-extrabold rounded-[6px] text-slate-500 shadow-inner">
                                {rate.ccy.charAt(0)}
                              </div>
                            )}
                            <strong className="text-[#004360]">
                              {rate.ccy}
                            </strong>
                          </div>
                        </td>
                        <td className="px-[25px] py-[14px] border-b border-slate-100 text-[15px] text-center font-bold tracking-tight text-[#004360]">
                          {rate.buying || "N/A"}
                        </td>
                        <td className="px-[25px] py-[14px] border-b border-slate-100 text-[15px] text-center font-bold tracking-tight text-[#ff6b0b] bg-[#ff6b0b]/[0.02] group-hover:bg-transparent transition-colors duration-200">
                          {rate.selling || "N/A"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
