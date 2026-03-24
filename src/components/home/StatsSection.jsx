"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaBuilding,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaHandshake,
  FaGlobe,
  FaBriefcase,
  FaStar,
} from "react-icons/fa";

import { useI18n } from "../i18n/I18nProvider";

const apiUrl = "https://weg.back.strapi.wegagen.com/api/stats";

// Icon mapping for stats
const iconMap = {
  FaBuilding: <FaBuilding />,
  FaUsers: <FaUsers />,
  FaMoneyBillWave: <FaMoneyBillWave />,
  FaChartLine: <FaChartLine />,
  FaHandshake: <FaHandshake />,
  FaGlobe: <FaGlobe />,
  FaBriefcase: <FaBriefcase />,
  FaStar: <FaStar />,
};

// Counter animation hook
function useCountUp(end, duration = 2000, startCounting = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) {
      setCount(0);
      return;
    }

    let startTime = null;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, startCounting]);

  return count;
}

// Stat card component with intersection observer
function StatCard({ stat, index }) {
  const { id, attributes } = stat;
  const { Name, Value, Icon, Color } = attributes;
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const count = useCountUp(Value, 2500, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-[#ffffff] p-[16px_12px] md:p-[30px] rounded-[16px] md:rounded-[20px] flex md:flex-row flex-col items-center md:text-left text-center gap-[12px] md:gap-[20px] transition-all duration-400 border border-[#f1f5f9] shadow-[0_10px_30px_-15px_rgba(0,52,96,0.05)] hover:-translate-y-[8px] hover:shadow-[0_20px_40px_-10px_rgba(0,52,96,0.1)] hover:border-[#e2e8f0] cursor-default"
    >
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[#FF8F12] rounded-t-[3px] transition-all duration-400 group-hover:w-[40px]" />

      {/* Icon */}
      <div
        className="shrink-0 w-[42px] h-[42px] md:w-[56px] md:h-[56px] rounded-[12px] md:rounded-[15px] flex items-center justify-center text-[18px] md:text-[24px] text-[#003460] transition-all duration-400 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] group-hover:!bg-[#FF8F12] group-hover:text-[#ffffff] group-hover:-rotate-[12deg] group-hover:scale-[1.1] group-hover:shadow-[0_8px_20px_rgba(255,143,18,0.3)] mb-[4px] md:mb-0"
        style={{ backgroundColor: `${Color}15` }}
      >
        <span style={{ color: Color || "#ff6b0b" }} className="group-hover:!text-white transition-colors duration-400">
          {iconMap[Icon]}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className="flex items-center md:justify-start justify-center text-[24px] md:text-[38px] font-extrabold text-[#003460] leading-none mb-[2px] tabular-nums whitespace-nowrap">
          {count.toLocaleString()}
          <span className="text-[#FF8F12] text-[18px] md:text-[26px] ml-[4px] font-bold">+</span>
        </span>
        <p className="text-[12px] md:text-[14px] text-[#64748b] font-medium m-0 md:whitespace-nowrap whitespace-normal overflow-hidden text-ellipsis">
          {Name}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const { t } = useI18n();
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(apiUrl);
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <section className="relative bg-white py-16 md:py-28 overflow-hidden">
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-[12px] md:gap-[30px]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-[16px_12px] md:p-[30px] rounded-[16px] md:rounded-[20px] border border-[#f1f5f9] animate-pulse"
              >
                <div className="flex md:flex-row flex-col items-center gap-[12px] md:gap-[20px]">
                  <div className="w-[42px] h-[42px] md:w-[56px] md:h-[56px] rounded-[12px] bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 md:h-8 bg-slate-100 rounded w-20 md:w-28" />
                    <div className="h-3 md:h-4 bg-slate-100 rounded w-24 md:w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white py-16 md:py-28 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Subtle Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#004360] text-[10px] font-black tracking-[2px] uppercase mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#004360] animate-pulse" />
            {t("home.stats.badge")}
          </div>
          <h2 className="text-[34px] md:text-[50px] font-black text-[#003460] tracking-[-2px] leading-tight mb-4">
            {t("home.stats.titlePrefix")} <span className="text-[#ff6b0b]">{t("home.stats.titleAccent")}</span>
          </h2>
          <p className="text-[14px] md:text-[17px] text-slate-400 max-w-[600px] mx-auto leading-relaxed">
            {t("home.stats.description")}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="relative grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-[12px] md:gap-[30px] px-0">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

