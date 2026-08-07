import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpRight, Camera } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';

const CATEGORIES = [
  { id: 'WEDDING', label: 'Wedding', ko: '웨딩', mainPhotoCategory: 'WEDDING_MAIN' },
  { id: 'FASHION', label: 'Fashion', ko: '패션 화보', mainPhotoCategory: 'FASHION_MAIN' },
  { id: 'PRODUCT', label: 'Product', ko: '제품', mainPhotoCategory: 'PRODUCT_MAIN' },
  { id: 'FOOD', label: 'Food', ko: '음식', mainPhotoCategory: 'FOOD_MAIN' },
  { id: 'CAR', label: 'Car', ko: '자동차', mainPhotoCategory: 'CAR_MAIN' },
  { id: 'LANDSCAPE', label: 'Landscape', ko: '풍경', mainPhotoCategory: 'LANDSCAPE_MAIN' },
  { id: 'DRONE_LANDSCAPE', label: 'Drone Landscape', ko: '드론 풍경', mainPhotoCategory: 'DRONE_LANDSCAPE_MAIN' },
];

const PROCESS = [
  {
    step: '01',
    title: '패키지 확인 & 문의',
    desc: '각 패키지의 상세 구성을 확인하시고, 궁금한 점은 1:1 문의로 남겨주세요.',
  },
  {
    step: '02',
    title: '예약 & 맞춤 컨설팅',
    desc: '예약이 확정되면 1:1 컨설팅을 통해 촬영 장소와 컨셉, 목표를 함께 협의합니다.',
  },
  {
    step: '03',
    title: '촬영 & 결과물 전달',
    desc: '분야에 최적화된 장비와 연출로 촬영하고, 정성껏 보정한 결과물을 전달드립니다.',
  },
];

/** 스크롤 시 부드럽게 나타나는 래퍼 */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** 섹션 상단의 작은 라벨 */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-6 bg-gray-900/40 dark:bg-zinc-100/40" />
      <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-gray-500 dark:text-zinc-400">
        {children}
      </span>
    </div>
  );
}

export default function Home() {
  const [representativePhotos, setRepresentativePhotos] = useState([]); // 상단 슬라이더용
  const [categoryPhotos, setCategoryPhotos] = useState([]); // 하단 그리드용
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePhotos = async () => {
      try {
        const [homeDataRes, repPhotosRes] = await Promise.all([
          axios.get('/api/photo/home'),
          axios.get('/api/photo?category=REPRESENTATIVE'),
        ]);

        setRepresentativePhotos(repPhotosRes.data || []);

        const homeData = homeDataRes.data || {};
        const photos = CATEGORIES.map((cat) => ({
          ...cat,
          imageUrl: homeData[cat.mainPhotoCategory]?.imageUrl || '',
        }));
        setCategoryPhotos(photos);
      } catch (error) {
        console.error('홈 화면 사진을 불러오는 데 실패했습니다.', error);
        setRepresentativePhotos([]);
        setCategoryPhotos(CATEGORIES.map((cat) => ({ ...cat, imageUrl: '' })));
      } finally {
        setLoading(false);
      }
    };

    fetchHomePhotos();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-[52vh] min-h-[300px] w-full animate-pulse bg-gray-200 dark:bg-zinc-800 md:h-[72vh] md:min-h-[440px]" />
        <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
          <div className="mx-auto mb-16 h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-[4/5] animate-pulse bg-gray-200 dark:bg-zinc-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const lastIndex = categoryPhotos.length - 1;

  return (
    <div className="w-full">
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="w-full">
        {/* 사진: 모바일에서는 사진만, md 이상에서만 텍스트를 얹는다 */}
        <div className="relative h-[52vh] min-h-[300px] w-full md:h-[72vh] md:min-h-[440px] md:max-h-[820px]">
          {representativePhotos.length > 0 ? (
            <ImageSlider images={representativePhotos}>
              <div className="hidden h-full w-full md:block">
                <HeroContent />
              </div>
            </ImageSlider>
          ) : (
            <div className="relative h-full w-full bg-gray-900 dark:bg-black">
              <div className="hidden h-full w-full md:block">
                <HeroContent />
              </div>
            </div>
          )}
        </div>

        {/* 모바일 전용: 사진 아래에 텍스트를 따로 배치 */}
        <div className="px-6 py-10 md:hidden">
          <HeroContent variant="below" />
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="flex flex-col items-center text-center">
          <SectionLabel>About</SectionLabel>
          <h2 className="mt-8 text-2xl font-semibold leading-snug tracking-tight text-gray-900 break-keep dark:text-zinc-50 md:text-4xl">
            목적에 최적화된 결과물,
            <br />
            분야별 전문 촬영
          </h2>
          <p className="mt-7 max-w-xl text-[15px] leading-8 text-gray-600 break-keep dark:text-zinc-400 md:text-base md:leading-9">
            PIXO는 웨딩, 패션, 제품, 음식, 자동차, 풍경, 드론 풍경까지
            각 분야의 목적에 맞춘 결과물을 제공하는 전문 스튜디오입니다.
            촬영의 시작부터 결과물까지, 필요한 순간마다 함께합니다.
          </p>
        </Reveal>
      </section>

      {/* ── WORKS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pb-20 md:px-8 md:pb-28">
        <Reveal className="mb-10 flex items-end justify-between md:mb-14">
          <div>
            <SectionLabel>Works</SectionLabel>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50 md:text-3xl">
              카테고리별 포트폴리오
            </h2>
          </div>
          <span className="hidden text-sm text-gray-400 dark:text-zinc-500 md:block">
            {String(categoryPhotos.length).padStart(2, '0')} Categories
          </span>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {categoryPhotos.map((cat, index) => {
            const wideOn2 = index === lastIndex && categoryPhotos.length % 2 === 1;
            const wideOn3 = index === lastIndex && categoryPhotos.length % 3 === 1;

            return (
              <Reveal
                key={cat.id}
                delay={(index % 3) * 80}
                className={`${wideOn2 ? 'col-span-2' : ''} ${
                  wideOn3 ? 'md:col-span-3' : wideOn2 ? 'md:col-span-1' : ''
                }`}
              >
                <Link
                  to={`/category/${cat.id}`}
                  className={`group relative block w-full overflow-hidden bg-gray-100 dark:bg-zinc-800 ${
                    wideOn2 ? 'aspect-[16/9]' : 'aspect-[4/5]'
                  } ${wideOn3 ? 'md:aspect-[21/9]' : 'md:aspect-[4/5]'}`}
                >
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-zinc-600">
                      <Camera size={28} strokeWidth={1.2} />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 md:p-5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium tracking-[0.22em] text-white/60">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-1.5 truncate text-sm font-semibold uppercase tracking-[0.12em] text-white md:text-base">
                        {cat.label}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/70">{cat.ko}</p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      className="shrink-0 translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────── */}
      <section className="border-y border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionLabel>Process</SectionLabel>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50 md:text-3xl">
              예약부터 결과물까지
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden border-t border-gray-200 dark:border-zinc-800 md:mt-16 md:grid-cols-3 md:border-t-0">
            {PROCESS.map((item, index) => (
              <Reveal
                key={item.step}
                delay={index * 100}
                className="border-b border-gray-200 py-8 dark:border-zinc-800 md:border-b-0 md:border-t md:pr-8"
              >
                <p className="text-[11px] font-medium tracking-[0.28em] text-gray-400 dark:text-zinc-500">
                  {item.step}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 break-keep dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 break-keep dark:text-zinc-400">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="flex flex-col items-center text-center">
          <p
            className="text-5xl leading-none text-gray-900 dark:text-zinc-50 md:text-6xl"
            style={{ fontFamily: 'var(--logo-font)' }}
          >
            PIXO
          </p>
          <h2 className="mt-6 text-xl font-semibold tracking-tight text-gray-900 break-keep dark:text-zinc-50 md:text-3xl">
            촬영을 계획하고 계신가요?
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-gray-600 break-keep dark:text-zinc-400 md:text-base">
            원하시는 일정과 컨셉을 알려주시면, 가장 알맞은 방식으로 준비해 드립니다.
          </p>

          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/reservations/type"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 px-8 py-4 text-sm font-semibold tracking-wide text-white transition hover:bg-gray-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              예약하기
              <ArrowUpRight size={16} strokeWidth={2} />
            </Link>
            <Link
              to="/price"
              className="inline-flex items-center justify-center border border-gray-300 px-8 py-4 text-sm font-semibold tracking-wide text-gray-900 transition hover:border-gray-900 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-400"
            >
              가격 보기
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <Link
              to="/questions"
              className="text-sm text-gray-500 underline-offset-4 transition hover:text-gray-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              1:1 문의
            </Link>
            <span className="h-3 w-px bg-gray-300 dark:bg-zinc-700" />
            <a
              href="https://www.instagram.com/studio.pixo?igsh=dTRsaGQ1cmw5b3ls"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
              </svg>
              Instagram
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/**
 * 히어로 텍스트 / CTA
 * variant="overlay" — 사진 위에 얹히는 흰 글씨 (데스크톱)
 * variant="below"   — 사진 아래에 놓이는 본문 색 글씨 (모바일)
 */
function HeroContent({ variant = 'overlay' }) {
  const isOverlay = variant === 'overlay';

  return (
    <div
      className={
        isOverlay ? 'flex h-full w-full flex-col justify-center px-6 pb-24 md:px-14' : 'w-full'
      }
    >
      <div className="max-w-2xl">
        <p
          className={`text-[11px] font-medium uppercase tracking-[0.35em] ${
            isOverlay ? 'text-white/70' : 'text-gray-400 dark:text-zinc-500'
          }`}
        >
          Photo Studio
        </p>
        <h1
          className={`mt-5 text-[26px] font-semibold leading-[1.3] tracking-tight break-keep md:text-5xl md:leading-[1.2] ${
            isOverlay ? 'text-white drop-shadow-sm' : 'text-gray-900 dark:text-zinc-50'
          }`}
        >
          기록하고 싶은 순간을,
          <br />
          가장 좋은 형태로.
        </h1>
        <p
          className={`mt-5 max-w-md text-sm leading-7 break-keep md:text-base md:leading-8 ${
            isOverlay ? 'text-white/80' : 'text-gray-600 dark:text-zinc-400'
          }`}
        >
          웨딩부터 제품, 드론 풍경까지. 목적에 맞춘 촬영을 제안합니다.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-9">
          <Link
            to="/reservations/type"
            className={`inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wide transition ${
              isOverlay
                ? 'bg-white text-gray-900 hover:bg-white/90'
                : 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white'
            }`}
          >
            예약하기
            <ArrowUpRight size={16} strokeWidth={2} />
          </Link>
          <Link
            to="/introduce"
            className={`inline-flex items-center px-7 py-3.5 text-sm font-semibold tracking-wide transition ${
              isOverlay
                ? 'border border-white/50 text-white backdrop-blur-sm hover:border-white hover:bg-white/10'
                : 'border border-gray-300 text-gray-900 hover:border-gray-900 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-400'
            }`}
          >
            스튜디오 소개
          </Link>
        </div>
      </div>
    </div>
  );
}
