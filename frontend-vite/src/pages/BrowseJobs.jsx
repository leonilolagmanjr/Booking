import React, { useState, useEffect } from "react";
import { fetchJobs } from "../services/api";
import { Link } from "react-router-dom";
import CollapsibleText from "../components/CollapsibleText";
import {
  Search,
  Briefcase,
  Users,
  UserCheck,
  TrendingUp,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  MapPin,
  CheckCircle,
  Heart,
  Code2,
  Pencil,
  Megaphone,
  FileText,
  Smartphone,
  Camera,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

const CATEGORY_TAG_STYLE = {
  Development:
    "bg-[var(--browse-category-development-bg)] text-[var(--browse-category-development-text)] border border-[var(--browse-category-development-border)]",
  Design:
    "bg-[var(--browse-category-design-bg)] text-[var(--browse-category-design-text)] border border-[var(--browse-category-design-border)]",
  Marketing:
    "bg-[var(--browse-category-marketing-bg)] text-[var(--browse-category-marketing-text)] border border-[var(--browse-category-marketing-border)]",
  Writing:
    "bg-[var(--browse-category-writing-bg)] text-[var(--browse-category-writing-text)] border border-[var(--browse-category-writing-border)]",
  Other:
    "bg-[var(--browse-category-other-bg)] text-[var(--browse-category-other-text)] border border-[var(--browse-category-other-border)]",
};

const TYPE_TAG_STYLE = {
  "Full Time":
    "bg-[var(--browse-primary-muted)] text-[var(--browse-primary)] border border-[var(--browse-primary-border-strong)]",
  Contract:
    "bg-[var(--browse-category-other-bg)] text-[var(--browse-category-other-text)] border border-[var(--browse-category-other-border)]",
  "Part Time":
    "bg-[var(--browse-primary-muted)] text-[var(--browse-primary)] border border-[var(--browse-primary-border-strong)]",
};

const CATEGORY_ICON = {
  Development: <Code2 size={16} />,
  Design: <Pencil size={16} />,
  Marketing: <Megaphone size={16} />,
  Writing: <FileText size={16} />,
  Other: <Briefcase size={16} />,
};

const CATEGORY_LOGO_STYLE = {
  Development: {
    bg: "bg-[var(--browse-category-development-bg)]",
    text: "text-[var(--browse-category-development-text)]",
  },
  Design: {
    bg: "bg-[var(--browse-category-design-bg)]",
    text: "text-[var(--browse-category-design-text)]",
  },
  Marketing: {
    bg: "bg-[var(--browse-category-marketing-bg)]",
    text: "text-[var(--browse-category-marketing-text)]",
  },
  Writing: {
    bg: "bg-[var(--browse-category-writing-bg)]",
    text: "text-[var(--browse-category-writing-text)]",
  },
  Other: {
    bg: "bg-[var(--browse-category-other-bg)]",
    text: "text-[var(--browse-category-other-text)]",
  },
};

const CATEGORIES = ["Development", "Design", "Marketing", "Writing", "Other"];
const JOB_TYPES = ["Remote", "On-site", "Hybrid"];

// ─── sub-components ─────────────────────────────────────────────────────────

function StatCard({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-r border-(--browse-primary-border) last:border-r-0">
      <div className="bg-(--browse-primary-muted) rounded-lg p-2 flex items-center justify-center">
        <span className="text-(--browse-primary)">{icon}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-(--browse-primary) leading-none">
          {value}
        </p>
        <p className="text-[11px] text-(--browse-text-subtle) mt-1">{label}</p>
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const logo = CATEGORY_LOGO_STYLE[job.category] || CATEGORY_LOGO_STYLE.Other;
  const icon = CATEGORY_ICON[job.category] || <Briefcase size={16} />;
  const currencySymbol = (job.currency || "USD") === "USD" ? "$" : "₱";
  const price = `${currencySymbol}${(job.price || 0).toFixed(2)}`;

  return (
    <Link to={`/job/${job._id}`} className="no-underline block">
      <div
        className="
        bg-(--browse-surface)
        border border-(--browse-primary-border)
        rounded-xl
        p-4
        cursor-pointer
        transition-all
        duration-200
        aspect-square
        flex
        flex-col
      "
      >
        {/* Card top */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${logo.bg}`}
            >
              <span className={logo.text}>{icon}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-(--browse-text-strong) leading-snug">
                {job.title}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-(--browse-text-subtle) mt-0.5">
                {job.company || job.employer || "Unknown"}
                <CheckCircle size={10} className="text-(--browse-primary)" />
              </div>
            </div>
          </div>
          <button
            className="text-(--browse-text-disabled) hover:text-(--browse-heart) transition-colors"
            aria-label="Save job"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={15} />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-[11px] text-(--browse-text-subtle) mb-3">
          <MapPin size={10} className="text-(--browse-primary)" />
          <span>
            {job.location
              ? job.location.type === "physical"
                ? job.location.address
                : "Remote"
              : "Remote"}
          </span>
          <span className="text-(--browse-text-divider)">•</span>
          <span>Posted {new Date(job.dateListed).toLocaleDateString()}</span>
        </div>

        {/* Description */}
        <div className="text-[11px] text-(--browse-text-body) leading-relaxed mb-3 grow">
          <CollapsibleText text={job.description} limit={100} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.category && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${CATEGORY_TAG_STYLE[job.category] || CATEGORY_TAG_STYLE.Other}`}
            >
              {job.category}
            </span>
          )}
          {job.jobType && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${TYPE_TAG_STYLE[job.jobType] || TYPE_TAG_STYLE.Contract}`}
            >
              {job.jobType}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-(--browse-primary)">
            {price}
          </span>
          <button
            className="text-[11px] font-medium text-(--browse-primary) border border-(--browse-primary) rounded-md px-3 py-1 hover:bg-(--browse-primary) hover:text-(--browse-primary-contrast) transition-all duration-200"
            onClick={(e) => e.preventDefault()}
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}

function PaginationBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-md text-xs font-medium flex items-center justify-center transition-all
        ${
          active
            ? "bg-(--browse-primary) border border-(--browse-primary) text-(--browse-primary-contrast) font-bold"
            : "border border-(--browse-primary-border) text-(--browse-text-muted) hover:border-(--browse-primary) hover:text-(--browse-primary)"
        }`}
    >
      {children}
    </button>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  // ── fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchAllJobs();
  }, []);

  // ── search ───────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ── category filter ──────────────────────────────────────────────────────
  const toggleCategory = (cat) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    applyFilters(searchTerm, next, selectedTypes, sortOrder);
  };

  // ── type filter ──────────────────────────────────────────────────────────
  const toggleType = (type) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(next);
    applyFilters(searchTerm, selectedCategories, next, sortOrder);
  };

  // ── sort ─────────────────────────────────────────────────────────────────
  const handleSort = (val) => {
    setSortOrder(val);
    applyFilters(searchTerm, selectedCategories, selectedTypes, val);
  };

  // ── combined filter + sort ───────────────────────────────────────────────
  const applyFilters = (term, cats, types, sort) => {
    let result = [...jobs];

    if (term) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term.toLowerCase()) ||
          job.description.toLowerCase().includes(term.toLowerCase()) ||
          job.category.toLowerCase().includes(term.toLowerCase()),
      );
    }

    if (cats.length > 0) {
      result = result.filter((job) => cats.includes(job.category));
    }

    if (types.length > 0) {
      result = result.filter((job) => {
        const loc = job.location?.type === "physical" ? "On-site" : "Remote";
        return types.includes(loc) || types.includes(job.locationType);
      });
    }

    if (sort === "Price: Low to High")
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "Price: High to Low")
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "Oldest")
      result.sort((a, b) => new Date(a.dateListed) - new Date(b.dateListed));
    if (sort === "Newest")
      result.sort((a, b) => new Date(b.dateListed) - new Date(a.dateListed));

    setFilteredJobs(result);
    setCurrentPage(1);
  };

  // ── reset ────────────────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSortOrder("Newest");
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  // ── pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-8 bg-(--browse-bg)">
      <div className="mx-auto max-w-6xl">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 relative overflow-hidden border border-(--browse-border-white-subtle)"
          style={{
            background: "var(--browse-panel-gradient)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-(--browse-primary-border) bg-(--browse-primary-soft)">
              <Briefcase size={28} className="text-(--browse-primary)" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-(--browse-text-strong)">
                Browse Available Jobs
              </h1>

              <p className="mt-1 text-sm text-(--browse-primary)">
                Find your next opportunity from our curated list of jobs
              </p>
            </div>
          </div>
        </div>

        {/* ── Search Bar ───────────────────────────────────────────────────── */}
        <div className="flex gap-3 py-3 ">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--browse-primary)"
            />
            <input
              type="text"
              placeholder="Search jobs by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-9 pr-4 py-3 bg-(--browse-surface) border border-(--browse-primary-border) rounded-lg text-(--browse-text) text-sm placeholder-(--browse-placeholder) outline-none focus:border-(--browse-primary) transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-hover) transition-colors"
          >
            <Search size={15} />
            Search Jobs
          </button>
          <Link
            to="/jobmanager"
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-soft) transition-colors no-underline"
          >
            <Settings size={15} />
            Manage Your Jobs
          </Link>
        </div>

        {/* ── Stats Bar ────────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-4 border rounded-xl border-(--browse-primary-border)"
          style={{
            background: "var(--browse-panel-gradient)",
          }}
        >
          <StatCard
            icon={<Briefcase size={18} />}
            value="124"
            label="Jobs Available"
          />
          <StatCard icon={<Users size={18} />} value="45" label="Employers" />
          <StatCard
            icon={<UserCheck size={18} />}
            value="32"
            label="Freelancers Hired"
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            value="98%"
            label="Success Rate"
          />
        </div>

        {/* ── Main ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden mt-4">
          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside className="flex flex-col w-72 min-w-72 h-150 sticky bg-(--browse-surface) border-(--browse-primary-border) p-4 overflow-y-auto rounded-xl mr-4 justify-between">
            <div className="flex items-center gap-2 font-semibold text-(--browse-text) mb-2">
              <SlidersHorizontal
                size={15}
                className="text-(--browse-primary)"
              />
              Filters
            </div>

            {/* Category */}
            <div className="mb-2 ">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-(--browse-text-subtle) uppercase tracking-wider">
                  Category
                </span>
              </div>
              <label className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === 0}
                  onChange={() => {
                    setSelectedCategories([]);
                    applyFilters(searchTerm, [], selectedTypes, sortOrder);
                  }}
                  className="accent-(--browse-primary) w-3.5 h-3.5"
                />
                <span className="text-xs text-(--browse-text-muted)">
                  All Categories
                </span>
              </label>
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 py-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-(--browse-primary) w-3.5 h-3.5"
                  />
                  <span className="text-xs text-(--browse-text-muted)">
                    {cat}
                  </span>
                </label>
              ))}
            </div>

            {/* Budget Range */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-(--browse-text-subtle) uppercase tracking-wider">
                  Budget Range
                </span>
              </div>
              <div className="relative mb-2">
                <select className="w-full bg-(--browse-surface-deep) border border-(--browse-primary-border) rounded-md text-(--browse-text-muted) text-xs py-1.5 px-2.5 outline-none appearance-none">
                  <option>Min. Budget</option>
                  <option>$100</option>
                  <option>$250</option>
                  <option>$500</option>
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-(--browse-text-disabled) pointer-events-none"
                />
              </div>
              <div className="relative">
                <select className="w-full bg-(--browse-surface-deep) border border-(--browse-primary-border) rounded-md text-(--browse-text-muted) text-xs py-1.5 px-2.5 outline-none appearance-none">
                  <option>Max. Budget</option>
                  <option>$500</option>
                  <option>$1000</option>
                  <option>$2000</option>
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-(--browse-text-disabled) pointer-events-none"
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-(--browse-text-subtle) uppercase tracking-wider">
                  Job Type
                </span>
              </div>
              <label className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.length === 0}
                  onChange={() => {
                    setSelectedTypes([]);
                    applyFilters(searchTerm, selectedCategories, [], sortOrder);
                  }}
                  className="accent-(--browse-primary) w-3.5 h-3.5"
                />
                <span className="text-xs text-(--browse-text-muted)">
                  All Types
                </span>
              </label>
              {JOB_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 py-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="accent-(--browse-primary) w-3.5 h-3.5"
                  />
                  <span className="text-xs text-(--browse-text-muted)">
                    {type}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={resetFilters}
              className="w-full bg-transparent border border-(--browse-primary) text-(--browse-primary) rounded-md py-2 text-xs font-medium hover:bg-(--browse-primary-soft) transition-colors"
            >
              Reset Filters
            </button>
          </aside>

          {/* ── Job Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-1 flex flex-col">
            {/* Content header */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-(--browse-text-muted)">
                Found{" "}
                <strong className="text-(--browse-primary)">
                  {filteredJobs.length}
                </strong>{" "}
                job{filteredJobs.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 text-xs text-(--browse-text-subtle)">
                Sort by:
                <select
                  value={sortOrder}
                  onChange={(e) => handleSort(e.target.value)}
                  className="bg-(--browse-surface) border border-(--browse-primary-border) rounded-md text-(--browse-text-muted) text-xs py-1 px-2 outline-none"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {paginatedJobs.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 flex-1">
                {paginatedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-(--browse-primary-border-dashed) rounded-xl bg-(--browse-surface-muted)">
                <Briefcase
                  size={52}
                  className="text-(--browse-primary) opacity-40 mb-4"
                />
                <p className="text-lg text-(--browse-text) mb-1">
                  No jobs found
                </p>
                <p className="text-sm text-(--browse-text-faint) max-w-xs text-center">
                  {searchTerm
                    ? `No jobs matching "${searchTerm}"`
                    : "No jobs available at the moment"}
                </p>
                {(searchTerm || selectedCategories.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-sm text-(--browse-primary) hover:text-(--browse-text) transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Pagination ───────────────────────────────fi────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-4 border-(--browse-primary-border)">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-md border border-(--browse-primary-border) flex items-center justify-center text-(--browse-primary) hover:border-(--browse-primary) disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from(
              { length: Math.min(totalPages, 4) },
              (_, i) => i + 1,
            ).map((page) => (
              <PaginationBtn
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationBtn>
            ))}

            {totalPages > 5 && (
              <span className="text-(--browse-text-disabled) text-sm px-1">
                ...
              </span>
            )}

            {totalPages > 4 && (
              <PaginationBtn
                active={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </PaginationBtn>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-md border border-(--browse-primary-border) flex items-center justify-center text-(--browse-primary) hover:border-(--browse-primary) disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
