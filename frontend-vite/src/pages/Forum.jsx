import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchForumGroups, createForumGroup } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  X,
  MessageSquare,
  Users,
  TrendingUp,
  Loader2,
  ChevronRight,
  Briefcase,
  User,
  Hash,
  MessageCircle,
  Code2,
  Palette,
  Smartphone,
  BarChart2,
  Trophy,
  Star,
  Flame,
  Rocket,
  Activity,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

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

const TRENDING_TOPICS = [
  ["Web Development", "1.2K"],
  ["React", "842"],
  ["Remote Work", "632"],
  ["Freelancing", "521"],
  ["UI / UX Design", "412"],
];

const BADGE_CONFIG = [
  { icon: Trophy, color: "bg-[rgba(200,136,74,0.2)]  text-[#c8884a]" },
  { icon: Star, color: "bg-[rgba(83,74,183,0.25)]  text-[#a09be0]" },
  { icon: Flame, color: "bg-[rgba(162,46,121,0.2)]  text-[#d07bbf]" },
  { icon: Rocket, color: "bg-[rgba(13,110,204,0.2)]  text-[#6ba8e0]" },
];

const COMMUNITY_STATS = [
  { icon: Users, color: "text-[#c8884a]", val: "1.2K", label: "Total Groups" },
  {
    icon: MessageCircle,
    color: "text-[#a09be0]",
    val: "15.4K",
    label: "Total Posts",
  },
  { icon: Users, color: "text-[#6ba8e0]", val: "84", label: "Active Members" },
  {
    icon: Activity,
    color: "text-[#5ec9a0]",
    val: "320",
    label: "Active Today",
  },
];

const QUICK_LINKS = [
  { text: "Social Feed", path: "/social", icon: MessageSquare },
  { text: "Browse Jobs", path: "/jobs", icon: Briefcase },
  {
    text: "Your Profile",
    path: `/profile/${useAuth?.user?.id || ""}`,
    icon: User,
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

const SideCard = ({ children, className = "" }) => (
  <div
    className={`bg-[#1e1e26] rounded-xl border border-[rgba(200,136,74,0.2)] overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const SideCardHeader = ({ children }) => (
  <div className="flex items-center justify-between px-4 pt-4 pb-2">
    {children}
  </div>
);

const Divider = () => (
  <div className="border-t border-[rgba(200,136,74,0.2)] my-2" />
);

// ─── modal ───────────────────────────────────────────────────────────────────

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

// ─── group card ──────────────────────────────────────────────────────────────

const GroupCard = ({ group, index }) => {
  const Icon = GROUP_ICONS[index % GROUP_ICONS.length];
  const color = GROUP_COLORS[index % GROUP_COLORS.length];
  return (
    <Link
      to={`/forum/${group._id}`}
      className="block bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-xl p-4 transition-all hover:border-[#c8884a] hover:shadow-[0_0_20px_rgba(200,136,74,0.15)] group"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#f0e8d8] mb-1 group-hover:text-[#c8884a] transition-colors">
            {group.name}
          </h3>
          <p className="text-[rgba(232,226,212,0.55)] text-sm line-clamp-2 mb-3">
            {group.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[rgba(232,226,212,0.45)] text-xs flex items-center gap-1.5">
              <Users size={12} className="text-[#c8884a]" />
              {group.createdBy?.name || "Unknown"}
            </span>
            <span className="text-[#c8884a] text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Group
              <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Forum = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchForumGroups();
        setGroups(data);
      } catch (err) {
        console.error("Error fetching forum groups:", err);
      }
    };
    loadGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await createForumGroup({ name, description }, token);
      setName("");
      setDescription("");
      setOpenCreate(false);
      const data = await fetchForumGroups();
      setGroups(data);
    } catch (err) {
      console.error("Error creating forum group:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const btnOutline =
    "flex items-center gap-1.5 border border-[rgba(200,136,74,0.3)] text-[#e8e2d4] font-medium rounded-lg transition-colors " +
    "hover:border-[#c8884a] hover:text-[#c8884a]";

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

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
                      {user ? "Active member" : "Visitor"}
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

            {/* Active Groups */}
            <SideCard>
              <SideCardHeader>
                <span className="flex items-center gap-2 text-[#f0e8d8] font-semibold text-sm">
                  <Users size={14} className="text-[#c8884a]" />
                  Active Groups
                </span>
              </SideCardHeader>
              <div className="px-3 pb-3 space-y-0.5">
                {groups.slice(0, 5).map((group, i) => (
                  <Link
                    key={group._id}
                    to={`/forum/${group._id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[rgba(200,136,74,0.1)] transition-colors group"
                  >
                    <div
                      className={`w-7 h-7 ${
                        GROUP_COLORS[i % GROUP_COLORS.length]
                      } rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <MessageSquare size={12} />
                    </div>
                    <span className="text-sm text-[rgba(232,226,212,0.55)] group-hover:text-[#e8e2d4] transition-colors truncate">
                      {group.name}
                    </span>
                  </Link>
                ))}
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
                  <li>
                    <Link
                      to="/social"
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[rgba(200,136,74,0.1)] transition-colors group"
                    >
                      <span className="flex items-center gap-2.5 text-sm text-[rgba(232,226,212,0.55)] group-hover:text-[#e8e2d4] transition-colors">
                        <MessageSquare size={14} className="text-[#c8884a]" />
                        Social Feed
                      </span>
                      <ChevronRight
                        size={13}
                        className="text-[rgba(232,226,212,0.25)] group-hover:text-[rgba(232,226,212,0.55)] transition-colors"
                      />
                    </Link>
                  </li>
                  {QUICK_LINKS.slice(1).map(({ text, path, icon: Icon }) => (
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

          {/* ══════════ MAIN CONTENT ══════════ */}
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
                  <MessageSquare size={19} className="text-[#c8884a]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-(--browse-text-strong)">
                    Community Forum
                  </h1>
                  <p className=" text-xs text-(--browse-primary)">
                    Join discussions, share knowledge, and connect with others
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--browse-primary)"
                />
                <input
                  type="text"
                  placeholder="Search forum groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-(--browse-surface) border border-(--browse-primary-border) rounded-lg text-(--browse-text) text-sm placeholder-(--browse-placeholder) outline-none focus:border-(--browse-primary) transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 bg-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-hover) transition-colors"
              >
                <Search size={15} />
                Search Forum
              </button>

              {user && (
                <button
                  onClick={() => setOpenCreate(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-soft) transition-colors no-underline"
                >
                  <Plus size={14} />
                  Create Group
                </button>
              )}
            </div>

            {/* Groups count */}
            <div
              className="bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-xl px-4"
              style={{
                background: "var(--browse-panel-gradient)",
              }}
            >
              <div className="flex items-center justify-between gap-3 overflow-x-auto">
                <p className="text-sm text-[rgba(232,226,212,0.55)] flex items-center gap-2 py-3.5">
                  <Users size={19} className="text-[#c8884a]" />
                  {filteredGroups.length} Group
                  {filteredGroups.length !== 1 ? "s" : ""} Available
                </p>
                <button className="flex items-center gap-1.5 text-[rgba(232,226,212,0.55)] text-xs border border-[rgba(200,136,74,0.2)] px-4 py-1.5 rounded-lg hover:border-[#c8884a] hover:text-[#e8e2d4] transition-colors shrink-0">
                  <Filter size={12} />
                  Filter
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {/* Groups grid */}
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGroups.map((group, i) => (
                  <GroupCard key={group._id} group={group} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-[rgba(200,136,74,0.1)] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-[#c8884a]" />
                </div>
                <h3 className="text-lg font-bold text-[#f0e8d8] mb-2">
                  {searchTerm ? "No groups found" : "No forum groups yet"}
                </h3>
                <p className="text-[rgba(232,226,212,0.55)] text-sm max-w-sm mx-auto mb-6">
                  {searchTerm
                    ? `No groups matching "${searchTerm}"`
                    : "Be the first to create a forum group and start the conversation!"}
                </p>
                {user && (
                  <button
                    onClick={() => setOpenCreate(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-hover) transition-colors"
                  >
                    <Plus size={14} />
                    Create First Group
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ══════════ CREATE GROUP MODAL ══════════ */}
      <Modal
        open={openCreate}
        onClose={() => !loading && setOpenCreate(false)}
        title="Create Forum Group"
      >
        <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
          <Field
            label="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Field
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            required
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpenCreate(false)}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-[rgba(200,136,74,0.2)] text-[rgba(232,226,212,0.55)] text-sm font-medium hover:border-[#c8884a] hover:text-[#e8e2d4] transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-(--browse-primary) text-(--browse-white) rounded-lg font-semibold text-sm hover:bg-(--browse-primary-hover) transition-colors"
            >
              {loading ? (
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

export default Forum;
