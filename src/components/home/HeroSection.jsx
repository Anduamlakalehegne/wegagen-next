"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import axios from "axios";
import { useI18n } from "../i18n/I18nProvider";

const apiUrl = "https://weg.back.strapi.wegagen.com/api/sliders?populate=*";

// In-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export default function HeroSection() {
  const { t } = useI18n();

  const heroContent = [
    {
      title: t("home.hero.slides.s1.title"),
      subtitle: t("home.hero.slides.s1.subtitle"),
      description: t("home.hero.slides.s1.description"),
      cta: { label: t("home.hero.slides.s1.ctaLabel"), href: "#services" },
    },
    {
      title: t("home.hero.slides.s2.title"),
      subtitle: t("home.hero.slides.s2.subtitle"),
      description: t("home.hero.slides.s2.description"),
      cta: { label: t("home.hero.slides.s2.ctaLabel"), href: "#mobile-app" },
    },
    {
      title: t("home.hero.slides.s3.title"),
      subtitle: t("home.hero.slides.s3.subtitle"),
      description: t("home.hero.slides.s3.description"),
      cta: { label: t("home.hero.slides.s3.ctaLabel"), href: "#about" },
    },
  ];

  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const slideDuration = 6000;

  const slidesWithContent = useMemo(() => {
    return slides.map((s, index) => ({
      ...s,
      content: heroContent[index % heroContent.length],
    }));
  }, [slides, heroContent]);

  // Fetch slides
  useEffect(() => {
    const fetchSlides = async () => {
      const cached = getCachedData("hero-slides");
      if (cached) {
        setSlides(cached);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(apiUrl);
        const slidersData = response.data.data[0]?.attributes?.wegagen_slider?.data;
        
        if (!slidersData) {
          setError("No slides found");
          setIsLoading(false);
          return;
        }

        const formattedSlides = slidersData.map((slider) => ({
          id: slider.id,
          url: `https://weg.back.strapi.wegagen.com${slider.attributes.url}`,
          altText: slider.attributes.alternativeText || slider.attributes.name || "Hero Image",
          name: slider.attributes.name,
        }));

        setCachedData("hero-slides", formattedSlides);
        setSlides(formattedSlides);
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError("Failed to load slides");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / slideDuration) * 100;
      
      if (newProgress >= 100) {
        setProgress(0);
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, slides.length]);

  const goToSlide = useCallback(
    (index, newDirection = 1) => {
      setDirection(newDirection);
      setCurrentIndex(index);
      setProgress(0);
    },
    [],
  );

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: prefersReducedMotion ? 0 : direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: prefersReducedMotion ? 0.2 : 0.6 },
        scale: { duration: prefersReducedMotion ? 0.2 : 0.8, ease: "easeOut" },
      },
    },
    exit: (direction) => ({
      x: prefersReducedMotion ? 0 : direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: prefersReducedMotion ? 0.2 : 0.4 },
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[900px] bg-gradient-to-br from-[#003460] via-[#004e70] to-[#005a80] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#ff6b0b]/50 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
          </div>
          <span className="text-white/90 text-sm font-medium tracking-wider uppercase">Loading Experience</span>
        </div>
      </section>
    );
  }

  if (error || slides.length === 0) {
    return (
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[900px] bg-gradient-to-br from-[#003460] via-[#004e70] to-[#005a80] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative text-center px-6">
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight">
            Welcome to <span className="text-[#ff6b0b]">Wegagen</span> Bank
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">Banking Excellence Since 1997</p>
        </div>
      </section>
    );
  }

  const currentSlide = slidesWithContent[currentIndex];
  const currentContent = currentSlide?.content;

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[70vh] min-h-[500px] max-h-[900px] overflow-hidden bg-[#001d2a]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero Banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Slides with Ken Burns Effect */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentIndex].url}
              alt={slides[currentIndex].altText}
              fill
              priority={currentIndex === 0}
              sizes="100vw"
              className="object-cover"
              quality={90}
            />
          </motion.div>
          
          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001d2a]/90 via-[#001d2a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001d2a]/80 via-transparent to-[#001d2a]/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ff6b0b]/10 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Subtitle pill */}
            <motion.div
              custom={0.1}
              variants={textVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff6b0b] animate-pulse" />
              <span className="text-white/90 text-xs font-black uppercase tracking-[3px]">
                {currentContent?.subtitle}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              custom={0.2}
              variants={textVariants}
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6"
            >
              {(currentContent?.title ? currentContent.title.split(" ") : []).map((word, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? "text-[#ff6b0b]" : ""}>
                  {word}{" "}
                </span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={0.3}
              variants={textVariants}
              className="text-white/70 text-base md:text-lg lg:text-xl leading-relaxed mb-8 max-w-xl"
            >
              {currentContent?.description}
            </motion.p>

            {/* CTA Button */}
            <motion.div custom={0.4} variants={textVariants}>
              <a
                href={currentContent?.cta.href}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#ff6b0b] hover:bg-[#e85a00] text-white font-bold rounded-xl transition-all duration-300 shadow-[0_20px_40px_rgba(255,107,11,0.3)] hover:shadow-[0_30px_60px_rgba(255,107,11,0.4)] hover:-translate-y-1"
              >
                {currentContent?.cta.label}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls - Glassmorphism Style */}
      {slides.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff6b0b] to-[#ff8f12]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-6 flex items-center justify-between">
          {/* Slide Indicators */}
          <div className="flex items-center gap-3" role="tablist" aria-label="Slide indicators">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`group relative flex items-center gap-3 transition-all duration-300 focus:outline-none ${
                  index === currentIndex ? "w-auto" : "w-12"
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}: ${slide.content?.subtitle}`}
              >
                {/* Number */}
                <span className={`text-xs font-bold transition-colors duration-300 ${
                  index === currentIndex ? "text-white" : "text-white/40 group-hover:text-white/60"
                }`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                
                {/* Line indicator */}
                <div className={`h-[2px] transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? "w-12 bg-[#ff6b0b]" 
                    : "w-8 bg-white/30 group-hover:bg-white/50"
                }`} />
              </button>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Slide Counter */}
            <div className="hidden md:flex items-center gap-2 text-white/60 text-sm font-medium">
              <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="w-8 h-[1px] bg-white/30" />
              <span>{String(slides.length).padStart(2, "0")}</span>
            </div>

            {/* Pause/Play Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-[10px] uppercase tracking-[3px] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
