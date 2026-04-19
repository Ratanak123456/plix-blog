"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight, Calendar, Heart, Eye, Loader2 } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { useGetLatestPostsQuery, useGetMostLikedPostsQuery, useGetMostViewedPostsQuery, useGetCategoriesQuery } from "@/lib/services/auth-api";
import type { BlogCategory, BlogPost } from "@/lib/types";

type SortOption = "latest" | "oldest" | "most-liked" | "most-viewed";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  
  // Fetch posts based on sort option
  const { data: latestPosts = [], isLoading: latestLoading } = useGetLatestPostsQuery({ page: 0, size: 100 });
  const { data: mostLikedPosts = [], isLoading: likedLoading } = useGetMostLikedPostsQuery({ page: 0, size: 100 });
  const { data: mostViewedPosts = [], isLoading: viewedLoading } = useGetMostViewedPostsQuery({ page: 0, size: 100 });
  
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
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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
    ? sortedPosts.filter(post => post.category?.name === selectedCategory)
    : sortedPosts;

  // Filter by search query (client-side for now)
  const searchedPosts = searchQuery
    ? filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPosts;

  // Pagination
  const totalPages = Math.ceil(searchedPosts.length / pageSize);
  const paginatedPosts = searchedPosts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: "latest", label: "Latest", icon: <Calendar size={16} /> },
    { value: "oldest", label: "Oldest", icon: <Calendar size={16} className="rotate-180" /> },
    { value: "most-liked", label: "Most Liked", icon: <Heart size={16} /> },
    { value: "most-viewed", label: "Most Viewed", icon: <Eye size={16} /> },
  ];

  const isLoading = latestLoading || likedLoading || viewedLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Search */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-card p-8 comic-border halftone-bg"
        >
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/20" />
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-4 inline-block -rotate-2 bg-primary px-6 py-2 font-bangers text-3xl text-background comic-border-secondary"
            >
              WELCOME TO THE ARCHIVE!
            </motion.div>
            
            <h1 className="mb-6 font-bangers text-5xl leading-none uppercase md:text-7xl">
              Explore Our <span className="text-accent">Story Collection</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl font-oswald text-xl text-muted-foreground">
              Dive into a universe of comics, tech tales, and creative adventures. 
              Search for your next favorite issue or browse by category!
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search for comics, stories, or topics..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="w-full rounded-full border-2 border-primary bg-background py-4 pl-12 pr-4 font-oswald text-lg outline-none transition-all focus:border-accent focus:shadow-lg focus:shadow-accent/20 comic-border"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filters and Sort Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Categories Sidebar */}
          <aside className="sticky top-28 self-start w-full lg:w-1/4 z-30">
            <div className="bg-card p-6 comic-border">
              <div className="mb-4 flex items-center gap-2">
                <Filter size={20} className="text-primary" />
                <h2 className="font-bangers text-2xl">Categories</h2>
              </div>
              
              {categoriesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(0);
                    }}
                    className={`w-full rounded-lg px-4 py-2 font-oswald text-left uppercase tracking-wider transition-all ${
                      selectedCategory === null
                        ? "bg-primary text-background"
                        : "bg-background hover:bg-primary/10"
                    }`}
                  >
                    All Stories
                  </button>
                  
                  {categories.map((category: BlogCategory) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentPage(0);
                      }}
                      className={`w-full rounded-lg px-4 py-2 font-oswald text-left uppercase tracking-wider transition-all ${
                        selectedCategory === category.name
                          ? "bg-primary text-background"
                          : "bg-background hover:bg-primary/10"
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 text-xs opacity-70">({category.postCount})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="font-oswald text-muted-foreground">
                Showing <span className="font-bold text-foreground">{paginatedPosts.length}</span> of{" "}
                <span className="font-bold text-foreground">{searchedPosts.length}</span> stories
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
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center bg-card p-12 text-center comic-border">
                <div className="mb-4 text-6xl">📚</div>
                <h3 className="mb-2 font-bangers text-3xl">No Stories Found</h3>
                <p className="font-oswald text-muted-foreground">
                  Try adjusting your search or filters to find what you&apos;re looking for!
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2 rounded-full bg-card px-6 py-3 font-oswald uppercase tracking-wider transition-all hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-50 comic-border"
                >
                  <ChevronLeft size={20} /> Prev
                </button>
                
                <div className="flex items-center gap-2">
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
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bangers text-lg transition-all ${
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center gap-2 rounded-full bg-card px-6 py-3 font-oswald uppercase tracking-wider transition-all hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-50 comic-border"
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
