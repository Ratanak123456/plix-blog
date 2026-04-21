"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Heart,
  Eye,
  Loader2,
  BookOpen,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import {
  useGetLatestPostsQuery,
  useGetMostLikedPostsQuery,
  useGetMostViewedPostsQuery,
  useGetCategoriesQuery,
} from "@/lib/services/auth-api";
import type { BlogCategory, BlogPost } from "@/lib/types";

type SortOption = "latest" | "oldest" | "most-liked" | "most-viewed";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(0);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const pageSize = 12;

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const CategoryListContent = (onSelect?: () => void) => (
    <div className="grid gap-2 relative z-10">
      {/* "All Stories" Button */}
      <button
        type="button"
        onClick={() => {
          setSelectedCategory(null);
          setCurrentPage(0);
          onSelect?.();
        }}
        className={`w-full border-3 px-4 py-3 font-oswald text-left uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 ${
          selectedCategory === null
            ? "bg-[#f0b443] text-white border-black dark:border-white"
            : "bg-[#F5F5F0] dark:bg-gray-800 text-black dark:text-white border-black dark:border-white hover:bg-[#f0b443] hover:text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-bangers text-lg tracking-wide">
            All Stories
          </span>
          {selectedCategory === null && (
            <div className="w-3 h-3 bg-white border-2 border-black rotate-45 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
          )}
        </div>
      </button>

      {/* Category Buttons */}
      {categories.map((category: BlogCategory, index: number) => (
        <button
          key={category.id}
          type="button"
          onClick={() => {
            setSelectedCategory(category.name);
            setCurrentPage(0);
            onSelect?.();
          }}
          className={`w-full border-3 px-4 py-3 font-oswald text-left uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 ${
            selectedCategory === category.name
              ? "bg-[#f0b443] text-white border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
              : "bg-[#F5F5F0] dark:bg-gray-800 text-black dark:text-white border-black dark:border-white hover:bg-[#f28b6a] hover:text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center border-2 border-black bg-black text-xs font-bangers text-white dark:border-white dark:bg-white dark:text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-bangers text-lg tracking-wide">
                {category.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-oswald font-bold px-2 py-0.5 border-2 ${
                  selectedCategory === category.name
                    ? "bg-white text-[#f0b443] border-black dark:border-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-black dark:border-white"
                }`}
              >
                {category.postCount}
              </span>
              {selectedCategory === category.name && (
                <div className="w-2 h-2 bg-white border-2 border-black rotate-45" />
              )}
            </div>
          </div>
        </button>
      ))}

      {/* Decorative bottom element */}
      <div className="mt-6 pt-4 border-t-4 border-black dark:border-white flex items-center justify-between">
        <span className="font-oswald text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {categories.length} Categories
        </span>
        <div className="bg-[#f28b6a] border-2 border-black dark:border-white px-2 py-1 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] -rotate-3">
          FILTER!
        </div>
      </div>
    </div>
  );

  // Fetch posts based on sort option
  const { data: latestPosts = [], isLoading: latestLoading } =
    useGetLatestPostsQuery({ page: 0, size: 100 });
  const { data: mostLikedPosts = [], isLoading: likedLoading } =
    useGetMostLikedPostsQuery({ page: 0, size: 100 });
  const { data: mostViewedPosts = [], isLoading: viewedLoading } =
    useGetMostViewedPostsQuery({ page: 0, size: 100 });

  // Get posts based on sort selection
  let allPosts: BlogPost[] = [];
  if (sortBy === "most-viewed") {
    allPosts = mostViewedPosts;
  } else if (sortBy === "most-liked") {
    allPosts = mostLikedPosts;
  } else {
    allPosts = latestPosts;
  }

  // Sort posts
  const sortedPosts = [...allPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "most-liked":
        return b.likeCount - a.likeCount;
      case "most-viewed":
        return b.viewCount - a.viewCount;
      default:
        return 0;
    }
  });

  // Filter by category if selected
  const filteredPosts = selectedCategory
    ? sortedPosts.filter((post) => post.category?.name === selectedCategory)
    : sortedPosts;

  // Filter by search query (client-side for now)
  const searchedPosts = searchQuery
    ? filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredPosts;

  // Pagination
  const totalPages = Math.ceil(searchedPosts.length / pageSize);
  const paginatedPosts = searchedPosts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "latest", label: "Latest", icon: <Calendar size={16} /> },
    {
      value: "oldest",
      label: "Oldest",
      icon: <Calendar size={16} className="rotate-180" />,
    },
    { value: "most-liked", label: "Most Liked", icon: <Heart size={16} /> },
    { value: "most-viewed", label: "Most Viewed", icon: <Eye size={16} /> },
  ];

  const isLoading =
    latestLoading || likedLoading || viewedLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Search */}
      <section className="relative dark:bg-black py-16 md:py-24 overflow-hidden border-b-8 border-black dark:border-white">
        {/* ── Halftone Background ── */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, black 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* ── Action Lines ── */}
        <svg
          className="absolute top-0 left-0 w-40 h-full opacity-[0.07] dark:opacity-[0.04] pointer-events-none"
          viewBox="0 0 100 400"
          preserveAspectRatio="none"
        >
          <path
            d="M80 0 L20 200 L85 400"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
          <path
            d="M60 50 L10 200 L70 350"
            stroke="black"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 8"
          />
        </svg>
        <svg
          className="absolute top-0 right-0 w-40 h-full opacity-[0.07] dark:opacity-[0.04] pointer-events-none rotate-180"
          viewBox="0 0 100 400"
          preserveAspectRatio="none"
        >
          <path
            d="M80 0 L20 200 L85 400"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
        </svg>

        {/* ── Floating Sound Effects ── */}
        <div className="absolute top-16 left-[8%] bg-yellow-400 border-3 border-black dark:border-white px-3 py-1 font-bangers text-sm text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] -rotate-12 pointer-events-none hidden lg:block">
          SEARCH!
        </div>
        <div className="absolute bottom-20 right-[10%] bg-accent border-3 border-black dark:border-white px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] rotate-12 pointer-events-none hidden lg:block">
          FIND IT!
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0, rotate: -1 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.15)]"
          >
            {/* Inner dashed border */}
            <div className="absolute inset-3 border-2 border-dashed border-gray-200 dark:border-gray-700 pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] z-20" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-accent border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] z-20" />

            {/* Background gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 dark:from-primary/5 dark:to-accent/5" />

            <div className="relative z-10 text-center">
              {/* Welcome Badge */}
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: -2 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 inline-block relative"
              >
                <svg
                  className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] text-yellow-400 -z-10"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M50 0 L58 38 L95 30 L65 55 L85 90 L50 68 L15 90 L35 55 L5 30 L42 38Z"
                    fill="currentColor"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
                <div className="bg-primary border-3 border-black dark:border-white px-5 py-2 font-bangers text-2xl text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] md:px-7 md:text-3xl flex items-center gap-2">
                  <BookOpen size={24} strokeWidth={3} />
                  WELCOME TO THE ARCHIVE!
                </div>
              </motion.div>

              {/* Title */}
              <h1
                className="mb-6 font-bangers text-5xl leading-none uppercase text-black dark:text-white sm:text-6xl md:text-8xl tracking-wide"
                style={{
                  textShadow:
                    "4px 4px 0px rgba(0,0,0,0.1) dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)]",
                  WebkitTextStroke: "1.5px black dark:stroke-white",
                }}
              >
                Explore Our{" "}
                <span className="text-primary relative inline-block">
                  Story Collection
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-accent"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 6 L20 2 L40 6 L60 2 L80 6 L100 2 L120 6 L140 2 L160 6 L180 2 L200 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mb-10 max-w-2xl font-oswald text-base text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl uppercase tracking-wide">
                Dive into a universe of comics, tech tales, and creative
                adventures. Search for your next favorite issue or browse by
                category!
              </p>

              {/* Search Bar - Comic Style */}
              <div className="mx-auto max-w-2xl relative">
                <div className="relative bg-white dark:bg-gray-800 border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] transition-all focus-within:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] focus-within:-translate-x-1 focus-within:-translate-y-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={22}
                    strokeWidth={3}
                  />
                  <input
                    type="text"
                    placeholder="Search for comics, stories, or topics..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full bg-transparent py-4 pl-12 pr-4 font-oswald text-base text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none md:py-5 md:pl-14 md:text-lg uppercase tracking-wider"
                  />
                  {/* Decorative search badge */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary border-2 border-black dark:border-white px-3 py-1 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hidden sm:block">
                    CTRL+K
                  </div>
                </div>

                {/* Search hint */}
                <p className="mt-3 font-oswald text-xs uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  Press{" "}
                  <span className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-1.5 py-0.5 rounded font-mono text-[10px]">
                    /
                  </span>{" "}
                  to focus
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Sort Section */}
      <section className="container mx-auto px-4 pt-8 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Mobile Category Toggle - Pattern from Profile Page */}
          <div className="lg:hidden mb-6">
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex w-full items-center justify-between border-4 border-black dark:border-white bg-[#f0b443] p-4 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none"
            >
              <div className="flex items-center gap-3">
                <div className="bg-black dark:bg-white p-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                  <Filter
                    size={20}
                    className="text-white dark:text-black"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bangers text-xl tracking-wide uppercase">
                  {selectedCategory || "All Stories"}
                </span>
              </div>
              <ChevronDown
                size={24}
                strokeWidth={3}
                className={`transition-transform duration-300 ${
                  isCategoryMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`mt-3 grid gap-2 overflow-hidden transition-all duration-300 ${
                isCategoryMenuOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-[#f0b443]" />
                </div>
              ) : (
                CategoryListContent(() => setIsCategoryMenuOpen(false))
              )}
            </div>
          </div>

          {/* Categories Sidebar - Desktop Only */}
          <aside className="z-30 hidden w-full self-start lg:sticky lg:top-28 lg:block lg:w-1/4">
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] relative">
              {/* Inner dashed border */}
              <div className="absolute inset-2 border-2 border-dashed border-gray-200 dark:border-gray-700 pointer-events-none" />

              {/* Corner accent */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#f28b6a] border-3 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] z-10" />

              {/* Header */}
              <div className="mb-6 flex items-center gap-3 relative z-10">
                <div className="bg-[#f0b443] border-3 border-black dark:border-white p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]">
                  <Filter size={20} className="text-white" strokeWidth={3} />
                </div>
                <h2
                  className="font-bangers text-2xl text-black dark:text-white sm:text-3xl tracking-wide"
                  style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}
                >
                  Categories
                </h2>
                <div className="h-[3px] flex-1 bg-black dark:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] ml-2" />
              </div>

              {categoriesLoading ? (
                <div className="flex justify-center py-8 relative z-10">
                  <Loader2 className="animate-spin text-[#f0b443]" />
                </div>
              ) : (
                <div className="-mx-4">{CategoryListContent()}</div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="font-oswald text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {paginatedPosts.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {searchedPosts.length}
                </span>{" "}
                stories
              </div>

              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setCurrentPage(0);
                    }}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-oswald text-sm uppercase tracking-wider transition-all ${
                      sortBy === option.value
                        ? "bg-accent text-background"
                        : "bg-card hover:bg-primary/10"
                    } comic-border`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Grid */}
            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedPosts.map((post: BlogPost, index: number) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    index={currentPage * pageSize + index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center bg-card p-6 text-center comic-border sm:p-12">
                <div className="mb-4 text-6xl">📚</div>
                <h3 className="mb-2 font-bangers text-3xl">No Stories Found</h3>
                <p className="font-oswald text-muted-foreground">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for!
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2 rounded-full bg-card px-4 py-3 font-oswald text-sm uppercase tracking-wider transition-all hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 comic-border"
                >
                  <ChevronLeft size={20} /> Prev
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage > totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bangers text-base transition-all sm:text-lg ${
                          currentPage === pageNum
                            ? "bg-primary text-background"
                            : "bg-card hover:bg-primary/10"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center gap-2 rounded-full bg-card px-4 py-3 font-oswald text-sm uppercase tracking-wider transition-all hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 comic-border"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
