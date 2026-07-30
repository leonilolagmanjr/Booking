import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreatePost from "../components/posts/CreatePost";
import Posts from "../components/posts/Posts";
import { fetchForumGroups, createForumGroup } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  X,
  MessageSquare,
  Users,
  Rss,
  Video,
  TrendingUp,
  MessageCircle,
  Loader2,
  ChevronRight,
  Briefcase,
  User,
  Hash,
  Filter,
  Image,
  Film,
  Bell,
  Trophy,
  Star,
  Flame,
  Rocket,
  Activity,
  Code2,
  Palette,
  Smartphone,
  BarChart2,
  ChevronDown,
} from "lucide-react";

// ─── constants (outside component — no re-creation on render) ────────────────

const GROUP_COLORS = [
  "bg-[rgba(83,74,183,0.25)]  text-[#a09be0]",
  "bg-[rgba(13,110,204,0.2)]  text-[#6ba8e0]",
  "bg-[rgba(15,110,86,0.2)]   text-[#5ec9a0]",
  "bg-[rgba(200,136,74,0.15)] text-[#c8884a]",
  "bg-[rgba(162,46,121,0.2)]  text-[#d07bbf]",
  "bg-[rgba(120,120,140,0.2)] text-[#a0a0b8]",
  "bg-[rgba(200,136,74,0.15)] text-[#c8884a]",
  "bg-[rgba(162,46,121,0.2)]  text-[#d07bbf]",
];

const GROUP_ICONS = [
  Code2,
  Palette,
  Smartphone,
  Briefcase,
  BarChart2,
  MessageSquare,
  Users,
  TrendingUp,
];

const TABS = [
  { key: "all", label: "All Posts" },
  { key: "following", label: "Following" },
  { key: "groups", label: "Groups" },
  { key: "mentions", label: "Mentions" },
];

const FALLBACK_GROUPS = [
  {
    _id: "fg-1",
    name: "Frontend Developers",
    createdBy: { name: "1.8K members" },
  },
  { _id: "fg-2", name: "UI/UX Designers", createdBy: { name: "1.2K members" } },
  { _id: "fg-3", name: "React Native PH", createdBy: { name: "982 members" } },
  { _id: "fg-4", name: "Freelancers PH", createdBy: { name: "2.3K members" } },
  { _id: "fg-5", name: "Career Growth PH", createdBy: { name: "745 members" } },
];

const TRENDING_TOPICS = [
  ["Web Development", "1.2K"],
  ["React", "842"],
  ["Remote Work", "632"],
  ["Freelancing", "521"],
  ["UI / UX Design", "412"],
];

const QUICK_LINKS = [
  { text: "Browse Jobs", path: "/jobs", icon: Briefcase },
  { text: "Post a Job", path: "/post-job", icon: Plus },
  { text: "Messages", path: "/chat", icon: MessageCircle },
];

const COMPOSER_ACTIONS = [
  {
    icon: Image,
    label: "Photo",
    color: "text-emerald-400",
  },
  {
    icon: Film,
    label: "Video",
    color: "text-violet-400",
  },
  {
    icon: Bell,
    label: "Job Update",
    color: "text-amber-400",
  },
];

const BADGE_CONFIG = [
  { icon: Trophy, color: "bg-[rgba(200,136,74,0.2)]  text-[#c8884a]" },
  { icon: Star, color: "bg-[rgba(83,74,183,0.25)]  text-[#a09be0]" },
  { icon: Flame, color: "bg-[rgba(162,46,121,0.2)]  text-[#d07bbf]" },
  { icon: Rocket, color: "bg-[rgba(13,110,204,0.2)]  text-[#6ba8e0]" },
];

const COMMUNITY_STATS = [
  { icon: Users, color: "text-[#c8884a]", val: "1.2K", label: "Total Members" },
  {
    icon: MessageCircle,
    color: "text-[#a09be0]",
    val: "15.4K",
    label: "Total Posts",
  },
  { icon: Users, color: "text-[#6ba8e0]", val: "84", label: "Active Groups" },
  {
    icon: Activity,
    color: "text-[#5ec9a0]",
    val: "320",
    label: "Active Today",
  },
];

// ─── design tokens ────────────────────────────────────────────────────────────
// bg:      #0d1117        (page background)
// surface: #1e1e26        (cards / panels)
// input:   #141418        (inputs / deeper surface)
// border:  rgba(200,136,74,0.2)
// accent:  #c8884a        (primary CTA, icons, highlights)
// text-hi: #f0e8d8        (headings)
// text-lo: rgba(232,226,212,0.55)  (muted / secondary)

// ─── shared primitives ───────────────────────────────────────────────────────

/** Card wrapper used across both sidebars */
const SideCard = ({ children, className = "" }) => (
  <div
    className={`bg-[#1e1e26] rounded-xl border border-[rgba(200,136,74,0.2)] overflow-hidden ${className}`}
  >
    {children}
  </div>
);

/** Consistent card section header row */
const SideCardHeader = ({ children }) => (
  <div className="flex items-center justify-between px-4 pt-4 pb-2">
    {children}
  </div>
);

/** Hairline divider matching the amber-tinted border */
const Divider = () => (
  <div className="border-t border-[rgba(200,136,74,0.2)] my-2" />
);

// ─── modal ────────────────────────────────────────────────────────────────────

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[rgba(200,136,74,0.15)]">
          <h2 className="text-base font-bold text-[#f0e8d8] flex items-center gap-2">
            <Plus size={17} className="text-[#c8884a]" />
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-[rgba(232,226,212,0.55)] hover:text-[#e8e2d4] hover:bg-[rgba(200,136,74,0.1)] p-1.5 rounded-lg transition-colors"
          >
            <X size={17} />
          </button>
        </div>
        {/* modal body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// ─── form field ──────────────────────────────────────────────────────────────

const inputBase =
  "w-full bg-[#141418] text-[#e8e2d4] border border-[rgba(200,136,74,0.2)] rounded-lg px-3 py-2.5 text-sm " +
  "placeholder-[rgba(232,226,212,0.35)] outline-none transition-all " +
  "focus:border-[#c8884a] focus:ring-1 focus:ring-[#c8884a]/30 " +
  "hover:border-[rgba(200,136,74,0.4)]";

const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  rows = 4,
  required,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[rgba(232,226,212,0.55)] text-xs font-semibold uppercase tracking-widest">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className={`${inputBase} resize-none`}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        className={inputBase}
      />
    )}
  </div>
);

// ─── badge tile ──────────────────────────────────────────────────────────────

const BadgeTile = ({ icon: Icon, color }) => (
  <div
    className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}
  >
    <Icon size={17} />
  </div>
);

// ─── sidebar group button ────────────────────────────────────────────────────

const GroupButton = ({ group, index, active, onClick }) => {
  const Icon = GROUP_ICONS[index % GROUP_ICONS.length];
  const color = GROUP_COLORS[index % GROUP_COLORS.length];
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left
        ${
          active
            ? "bg-[rgba(200,136,74,0.15)] text-[#c8884a]"
            : "text-[rgba(232,226,212,0.55)] hover:bg-[rgba(200,136,74,0.1)] hover:text-[#e8e2d4]"
        }`}
    >
      <div
        className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}
      >
        <Icon size={14} />
      </div>
      <span className="flex-1 min-w-0">
        <span className="block truncate font-medium">{group.name}</span>
        <span className="block text-xs text-[rgba(232,226,212,0.4)] truncate">
          {group.createdBy?.name ?? "Unknown"}
        </span>
      </span>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const SocialMedia = () => {
  const { isLoggedIn, user } = useAuth();

  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateForum, setOpenCreateForum] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // ── data ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchForumGroups()
      .then(setGroups)
      .catch((err) => console.error("fetchForumGroups:", err));
  }, []);

  // ── handlers ──────────────────────────────────────────────────────────────
  const triggerRefresh = () => setRefreshPosts((p) => !p);
  const handleGroupSelect = (id) => setSelectedGroup(id);
  const handleBackToSocial = () => setSelectedGroup(null);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDesc.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await createForumGroup(
        { name: groupName, description: groupDesc },
        token,
      );
      setGroupName("");
      setGroupDesc("");
      setOpenCreateForum(false);
      const updated = await fetchForumGroups();
      setGroups(updated);
    } catch (err) {
      console.error("createForumGroup:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeCreateForum = () => {
    if (!submitting) setOpenCreateForum(false);
  };

  // ── derived ───────────────────────────────────────────────────────────────
  const displayGroups =
    groups.length > 0 ? groups.slice(0, 8) : FALLBACK_GROUPS;
  const selectedGroupData = groups.find((g) => g._id === selectedGroup);
  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  // ── accent button classes (reused) ────────────────────────────────────────
  const btnPrimary =
    "flex items-center gap-1.5 bg-[#c8884a] text-[#1a1008] font-semibold rounded-lg transition-colors " +
    "hover:bg-[#b07a40] shadow-[0_0_14px_rgba(200,136,74,0.25)]";

  const btnOutline =
    "flex items-center gap-1.5 border border-[rgba(200,136,74,0.3)] text-[#e8e2d4] font-medium rounded-lg transition-colors " +
    "hover:border-[#c8884a] hover:text-[#c8884a]";

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e8e2d4]">
      <div className="max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
          {/* ══════════ LEFT SIDEBAR ══════════ */}
          <aside className="hidden lg:flex flex-col gap-4 flex-1 sticky top-0">
            {/* Your Profile */}
            <SideCard>
              <div className="p-7">
                <p className="text-[10px] font-semibold text-[rgba(232,226,212,0.45)] uppercase tracking-widest mb-3">
                  Your Profile
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-13 h-13 rounded-full bg-linear-to-br from-[#c8884a] to-[#b07a40] flex items-center justify-center text-[#1a1008] text-xl font-bold shrink-0 ring-2 ring-[#c8884a]/25 select-none">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#f0e8d8] truncate">
                      {user?.name ?? "Guest User"}
                    </p>
                    <p className="text-xs text-[#c8884a] font-medium mt-0.5">
                      {isLoggedIn ? "Active member" : "Visitor"}
                    </p>
                  </div>
                </div>

                {/* XP bar */}
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#e8e2d4] font-semibold">Level 12</span>
                  <span className="text-[rgba(232,226,212,0.45)]">
                    2,350 XP
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#141418] rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-linear-to-r from-[#c8884a] to-[#d6a464] rounded-full transition-all duration-500"
                    style={{ width: "78%" }}
                  />
                </div>
                <p className="text-[rgba(232,226,212,0.4)] text-xs">
                  2,350 / 3,000 XP
                </p>

                <Divider />

                {/* Badges */}
                <div className="flex items-center justify-between mb-2 mt-1">
                  <span className="text-xs font-semibold text-[#e8e2d4]">
                    Badges
                  </span>
                  <button className="text-[#c8884a] text-xs font-medium hover:underline">
                    View all
                  </button>
                </div>
                <div className="flex gap-2">
                  {BADGE_CONFIG.map(({ icon, color }) => (
                    <BadgeTile key={color} icon={icon} color={color} />
                  ))}
                </div>
              </div>
            </SideCard>

            {/* Forum Groups */}
            <SideCard>
              <SideCardHeader>
                <span className="flex items-center gap-2 text-[#f0e8d8] font-semibold text-sm">
                  <Users size={14} className="text-[#c8884a]" />
                  Forum Groups
                  <span className="bg-[rgba(200,136,74,0.15)] text-[#c8884a] text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {groups.length || FALLBACK_GROUPS.length}
                  </span>
                </span>
                {isLoggedIn && (
                  <button
                    onClick={() => setOpenCreateForum(true)}
                    aria-label="Create forum group"
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-[rgba(200,136,74,0.2)] text-[rgba(232,226,212,0.45)] hover:border-[#c8884a] hover:text-[#c8884a] transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                )}
              </SideCardHeader>

              <div className="px-3 pb-3 space-y-0.5">
                {/* Social Feed shortcut */}
                <button
                  onClick={handleBackToSocial}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                    ${
                      selectedGroup === null
                        ? "bg-[rgba(200,136,74,0.15)] text-[#c8884a]"
                        : "text-[rgba(232,226,212,0.55)] hover:bg-[rgba(200,136,74,0.1)] hover:text-[#e8e2d4]"
                    }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[rgba(200,136,74,0.15)] flex items-center justify-center shrink-0">
                    <Rss size={13} />
                  </div>
                  <span className="font-medium">Social Feed</span>
                </button>

                <Divider />

                {displayGroups.map((group, i) => (
                  <GroupButton
                    key={group._id}
                    group={group}
                    index={i}
                    active={selectedGroup === group._id}
                    onClick={() => handleGroupSelect(group._id)}
                  />
                ))}

                {groups.length > 8 && (
                  <Link
                    to="/forum"
                    className="block text-center text-[#c8884a] text-xs font-medium py-1.5 hover:underline"
                  >
                    View All Groups →
                  </Link>
                )}

                <div className="pt-2">
                  <Link
                    to="/forum"
                    className="flex items-center justify-center gap-2 w-full border border-[rgba(200,136,74,0.3)] text-[#c8884a] font-semibold text-sm py-2 rounded-lg hover:bg-[rgba(200,136,74,0.1)] transition-colors"
                  >
                    <Users size={13} />
                    Explore All Groups
                  </Link>
                </div>
              </div>
            </SideCard>

            {/* Trending Topics */}
            <SideCard>
              <SideCardHeader>
                <span className="flex items-center gap-2 text-[#f0e8d8] font-semibold text-sm">
                  <TrendingUp size={14} className="text-[#c8884a]" />
                  Trending Topics
                </span>
                <button className="text-[#c8884a] text-xs font-medium hover:underline">
                  View all
                </button>
              </SideCardHeader>
              <ul className="px-3 pb-4 space-y-0.5">
                {TRENDING_TOPICS.map(([topic, count]) => (
                  <li key={topic}>
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[rgba(200,136,74,0.1)] transition-colors">
                      <span className="flex items-center gap-2 text-[#e8e2d4] text-sm">
                        <Hash size={12} className="text-[#c8884a]" />
                        {topic}
                      </span>
                      <span className="text-[rgba(232,226,212,0.45)] text-xs">
                        {count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </SideCard>

            {/* Community Stats */}
            <SideCard>
              <div className="p-4">
                <p className="text-[10px] font-semibold text-[rgba(232,226,212,0.45)] uppercase tracking-widest mb-3">
                  Community Stats
                </p>
                <ul className="space-y-3">
                  {COMMUNITY_STATS.map(({ icon: Icon, color, val, label }) => (
                    <li key={label} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[rgba(200,136,74,0.12)] rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={14} className={color} />
                      </div>
                      <span className="font-bold text-[#f0e8d8]">{val}</span>
                      <span className="text-[rgba(232,226,212,0.45)] text-xs">
                        • {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </SideCard>

            {/* Quick Links */}
            <SideCard>
              <div className="p-4">
                <p className="text-[10px] font-semibold text-[rgba(232,226,212,0.45)] uppercase tracking-widest mb-3">
                  Quick Links
                </p>
                <ul className="space-y-0.5">
                  {/* Profile link needs dynamic path — keep inline */}
                  <li>
                    <Link
                      to={`/profile/${user?.id ?? ""}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[rgba(200,136,74,0.1)] transition-colors group"
                    >
                      <span className="flex items-center gap-2.5 text-sm text-[rgba(232,226,212,0.55)] group-hover:text-[#e8e2d4] transition-colors">
                        <User size={14} className="text-[#c8884a]" />
                        Your Profile
                      </span>
                      <ChevronRight
                        size={13}
                        className="text-[rgba(232,226,212,0.25)] group-hover:text-[rgba(232,226,212,0.55)] transition-colors"
                      />
                    </Link>
                  </li>
                  {QUICK_LINKS.map(({ text, path, icon: Icon }) => (
                    <li key={text}>
                      <Link
                        to={path}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[rgba(200,136,74,0.1)] transition-colors group"
                      >
                        <span className="flex items-center gap-2.5 text-sm text-[rgba(232,226,212,0.55)] group-hover:text-[#e8e2d4] transition-colors">
                          <Icon size={14} className="text-[#c8884a]" />
                          {text}
                        </span>
                        <ChevronRight
                          size={13}
                          className="text-[rgba(232,226,212,0.25)] group-hover:text-[rgba(232,226,212,0.55)] transition-colors"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SideCard>
          </aside>

          {/* ══════════ MAIN FEED ══════════ */}
          <main className=" flex flex-col gap-4 ">
            {/* Page header */}
            <div
              className="rounded-2xl p-4 relative overflow-hidden border border-(--browse-border-white-subtle)"
              style={{
                background: "var(--browse-panel-gradient)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[rgba(200,136,74,0.15)] rounded-xl flex items-center justify-center shrink-0">
                  {selectedGroup ? (
                    <MessageSquare size={19} className="text-[#c8884a]" />
                  ) : (
                    <Rss size={19} className="text-[#c8884a]" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-(--browse-text-strong)">
                    {selectedGroup
                      ? (selectedGroupData?.name ?? "Forum")
                      : "Social Media Feed"}
                  </h1>
                  <p className=" text-xs text-(--browse-primary)">
                    {selectedGroup
                      ? (selectedGroupData?.description ?? "Group discussions")
                      : "Share updates, connect with others, and join conversations"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Link
                  to="/videos"
                  className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-soft) transition-colors no-underline"
                >
                  <Video size={15} />
                  View Videos
                </Link>
                {isLoggedIn && (
                  <button
                    onClick={() => setOpenCreate(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-hover) transition-colors"
                  >
                    <Plus size={14} />
                    {selectedGroup ? "Create Thread" : "Create Post"}
                  </button>
                )}
              </div>
            </div>

            {/* Post composer */}
            <div
              className="bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-xl p-4"
              style={{
                background: "var(--browse-panel-gradient)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#c8884a] flex items-center justify-center text-[#1a1008] font-bold text-sm shrink-0 select-none">
                  {userInitial}
                </div>
                <button
                  onClick={() => isLoggedIn && setOpenCreate(true)}
                  className="flex-1 bg-[#141418] border border-[rgba(200,136,74,0.2)] rounded-xl px-4 py-4 text-[rgba(232,226,212,0.45)] text-sm text-left hover:border-[rgba(200,136,74,0.4)] transition-colors"
                >
                  What's on your mind?
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 pl-12  border-[rgba(200,136,74,0.15)]">
                <div className="flex flex-wrap gap-1">
                  {COMPOSER_ACTIONS.map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[rgba(232,226,212,0.55)] text-sm font-medium hover:bg-[rgba(200,136,74,0.1)] hover:text-[#e8e2d4] transition-colors"
                    >
                      <Icon size={20} className={color} />
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => isLoggedIn && setOpenCreate(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-hover) transition-colors"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div
              className="bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-xl px-4"
              style={{
                background: "var(--browse-panel-gradient)",
              }}
            >
              <div className="flex items-center justify-between gap-3 overflow-x-auto">
                <nav className="flex min-w-max" aria-label="Feed tabs">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors
                        ${
                          activeTab === tab.key
                            ? "border-[#c8884a] text-[#c8884a]"
                            : "border-transparent text-[rgba(232,226,212,0.55)] hover:text-[#e8e2d4]"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
                <button className="flex items-center gap-1.5 text-[rgba(232,226,212,0.55)] text-xs border border-[rgba(200,136,74,0.2)] px-3 py-1.5 rounded-lg hover:border-[#c8884a] hover:text-[#e8e2d4] transition-colors shrink-0">
                  <Filter size={12} />
                  Filter
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-xl overflow-hidden p-2">
              <Posts
                refreshTrigger={refreshPosts}
                type={selectedGroup ? "thread" : "post"}
                groupId={selectedGroup}
              />
            </div>
          </main>
        </div>
      </div>

      {/* ══════════ CREATE POST MODAL ══════════ */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title={selectedGroup ? "Create Thread" : "Create Post"}
      >
        <CreatePost
          onPostCreated={() => {
            setOpenCreate(false);
            triggerRefresh();
          }}
          type={selectedGroup ? "thread" : "post"}
          groupId={selectedGroup}
        />
      </Modal>

      {/* ══════════ CREATE FORUM GROUP MODAL ══════════ */}
      <Modal
        open={openCreateForum}
        onClose={closeCreateForum}
        title="Create Forum Group"
      >
        <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
          <Field
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <Field
            label="Description"
            value={groupDesc}
            onChange={(e) => setGroupDesc(e.target.value)}
            multiline
            required
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeCreateForum}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-[rgba(200,136,74,0.2)] text-[rgba(232,226,212,0.55)] text-sm font-medium hover:border-[#c8884a] hover:text-[#e8e2d4] transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`${btnPrimary} text-sm px-5 py-2 disabled:opacity-40`}
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Creating…
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SocialMedia;
