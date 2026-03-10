import { ArrowRight, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const featuredBook = {
  tag: "EDITOR'S PICK",
  section: "BOOKVILLAGE CURATION",
  title: "데미안",
  author: "헤르만 헤세",
  copy: "한 번쯤 삶의 기준이 흔들릴 때, 스스로의 길을 찾게 해주는 고전.",
  quote: "새는 알에서 나오기 위해 투쟁한다.",
  cta: "큐레이션 도서 보기",
  to: "/books",
};

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-[28px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[260px] sm:h-[330px] md:h-[370px] bg-[linear-gradient(118deg,#111827_0%,#1f2937_45%,#7c2d12_100%)]"
      >
        <div className="absolute -left-24 -top-14 h-56 w-56 rounded-full bg-orange-200/10 blur-sm" />
        <div className="absolute right-8 top-6 h-44 w-44 rounded-full bg-amber-100/10 blur-sm" />
        <div className="absolute right-16 bottom-8 h-24 w-24 rounded-full bg-white/10 blur-sm" />

        <div className="relative h-full container mx-auto px-7 sm:px-12 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
          <div className="space-y-4 md:space-y-5 text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.12em]">
              <BookOpen size={14} />
              {featuredBook.tag}
            </span>
            <p className="text-xs font-medium tracking-[0.14em] text-white/65">{featuredBook.section}</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              {featuredBook.title}
              <span className="ml-3 text-base sm:text-xl font-medium text-white/75">by {featuredBook.author}</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/85">{featuredBook.copy}</p>
            <Link
              to={featuredBook.to}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {featuredBook.cta}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="w-[280px] rounded-2xl border border-white/25 bg-white/10 p-5 text-white backdrop-blur-md shadow-2xl">
              <div className="mb-3 inline-flex rounded-full bg-white/15 p-2">
                <Quote size={15} />
              </div>
              <p className="text-sm leading-relaxed text-white/90">{featuredBook.quote}</p>
              <div className="mt-4 border-t border-white/15 pt-3 text-xs text-white/70">
                오늘의 추천 테마: 자기성찰, 성장소설
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
