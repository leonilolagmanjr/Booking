import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CreatePost from "../components/posts/CreatePost";
import Posts from "../components/posts/Posts";
import { fetchForumGroups } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Plus,
  X,
  Users,
  MessageSquare,
  ChevronRight,
  Loader2,
  Info,
  Radio,
  TrendingUp,
  Hash,
} from "lucide-react";

// ── design tokens ─────────────────────────────────────────────────────────────
// bg:      #0d1117
// surface: #161b22
// card:    #1e1e26
// border:  rgba(200,136,74,0.2)
// amber:   #c8884a
// text-hi: #f0e8d8
// text-lo: rgba(232,226,212,0.55)

const THREAD_TABS = ["All Threads", "Popular", "Latest", "Unanswered"];

const TRENDING_TOPICS = [
  "AI",
  "Cloud",
  "CyberSecurity",
  "Research",
  "Programming",
  "DataScience",
  "WebDev",
];

const FALLBACK_CONTRIBUTORS = [
  { rank: 1, name: "John Doe", level: 45, initial: "J" },
  { rank: 2, name: "Mike Smith", level: 39, initial: "M" },
  { rank: 3, name: "Sarah Johnson", level: 31, initial: "S" },
  { rank: 4, name: "Charlie Brown", level: 28, initial: "C" },
  { rank: 5, name: "Alex Kim", level: 22, initial: "A" },
];

// rank badge colors
const rankColors = [
  "#c8884a",
  "#8b8fa8",
  "#b07a40",
  "rgba(200,136,74,0.4)",
  "rgba(200,136,74,0.3)",
];

const ForumCategory = () => {
  const { groupId } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Threads");

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);
        const groups = await fetchForumGroups();
        const foundGroup = groups.find((g) => g._id === groupId);
        setGroup(foundGroup);
      } catch (err) {
        console.error("Error fetching forum group:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGroup();
  }, [groupId]);

  const triggerRefresh = () => setRefreshPosts((p) => !p);

  /* ── Loading ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0d1117" }}
      >
        <Loader2
          size={48}
          className="animate-spin"
          style={{ color: "#c8884a" }}
        />
      </div>
    );
  }

  /* ── Not Found ── */
  if (!group) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: "#0d1117", color: "#e8e2d4" }}
      >
        <div className="text-center max-w-md">
          <Users
            size={64}
            className="mx-auto mb-4 opacity-40"
            style={{ color: "#c8884a" }}
          />
          <p className="text-2xl font-bold mb-2" style={{ color: "#f0e8d8" }}>
            Group Not Found
          </p>
          <p
            className="text-sm mb-6"
            style={{ color: "rgba(232,226,212,0.55)" }}
          >
            The forum group you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            to="/forum"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
            style={{ backgroundColor: "#c8884a", color: "#1a1008" }}
          >
            <ArrowLeft size={15} /> Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  const groupInitial = group.name.charAt(0).toUpperCase();
  const creatorInitial = group.createdBy?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0d1117", color: "#e8e2d4" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Breadcrumb ── */}
        {/* Bottom nav */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link
            to="/forum"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#c8884a" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0e8d8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#c8884a")}
          >
            <ArrowLeft size={20} /> Return to Forum Overview
          </Link>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ════════════════════════════════
              LEFT SIDEBAR
          ════════════════════════════════ */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4 lg:sticky lg:top-24">
            {/* Group identity card */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "#161b22",
                borderColor: "rgba(200,136,74,0.2)",
              }}
            >
              {/* Avatar area */}
              <div
                className="flex flex-col items-center py-8 px-4"
                style={{
                  background:
                    "linear-gradient(160deg, #1e1e26 0%, #161b22 100%)",
                }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mb-4 ring-4"
                  style={{
                    backgroundColor: "#c8884a",
                    color: "#1a1008",
                    ringColor: "rgba(200,136,74,0.3)",
                    boxShadow: "0 0 32px rgba(200,136,74,0.25)",
                  }}
                >
                  {groupInitial}
                </div>
                <p
                  className="font-extrabold text-lg text-center"
                  style={{ color: "#f0e8d8" }}
                >
                  {group.name}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(232,226,212,0.55)" }}
                >
                  Discussion Group
                </p>

                {/* Tag badge */}
                <span
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: "rgba(200,136,74,0.12)",
                    borderColor: "rgba(200,136,74,0.25)",
                    color: "#c8884a",
                  }}
                >
                  <Users size={11} />
                  {group.createdBy?.name ?? "Group"}
                </span>
              </div>
            </div>

            {/* Top Contributors */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "#161b22",
                borderColor: "rgba(200,136,74,0.2)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "rgba(200,136,74,0.15)" }}
              >
                <span
                  className="font-bold text-sm"
                  style={{ color: "#f0e8d8" }}
                >
                  Top Contributors
                </span>
              </div>
              <ul className="px-3 py-2 flex flex-col gap-0.5">
                {FALLBACK_CONTRIBUTORS.map(({ rank, name, level, initial }) => (
                  <li
                    key={rank}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl transition-colors cursor-pointer"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(200,136,74,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {/* rank number */}
                    <span
                      className="w-5 text-center text-xs font-black shrink-0"
                      style={{ color: rankColors[rank - 1] }}
                    >
                      {rank}
                    </span>
                    {/* avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: "rgba(200,136,74,0.2)",
                        color: "#c8884a",
                      }}
                    >
                      {initial}
                    </div>
                    {/* name */}
                    <span
                      className="flex-1 text-sm font-medium truncate"
                      style={{ color: "#e8e2d4" }}
                    >
                      {name}
                    </span>
                    {/* level badge */}
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: "rgba(200,136,74,0.12)",
                        color: "#c8884a",
                      }}
                    >
                      Level {level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Topics */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "#161b22",
                borderColor: "rgba(200,136,74,0.2)",
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: "rgba(200,136,74,0.15)" }}
              >
                <TrendingUp size={14} style={{ color: "#c8884a" }} />
                <span
                  className="font-bold text-sm"
                  style={{ color: "#f0e8d8" }}
                >
                  Trending Topics
                </span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {TRENDING_TOPICS.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-colors"
                    style={{
                      backgroundColor: "rgba(200,136,74,0.08)",
                      borderColor: "rgba(200,136,74,0.18)",
                      color: "rgba(232,226,212,0.7)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#c8884a";
                      e.currentTarget.style.color = "#c8884a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(200,136,74,0.18)";
                      e.currentTarget.style.color = "rgba(232,226,212,0.7)";
                    }}
                  >
                    <Hash size={10} />
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* ════════════════════════════════
              MAIN CONTENT
          ════════════════════════════════ */}
          <main className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Group header banner */}
            <div
              className="rounded-2xl border overflow-hidden relative"
              style={{
                backgroundColor: "#161b22",
                borderColor: "rgba(200,136,74,0.2)",
                backgroundImage:
                  "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(200,136,74,0.07) 0%, transparent 70%)",
              }}
            >
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                {/* Text block */}
                <div className="flex-1 min-w-0">
                  <h1
                    className="text-3xl font-extrabold mb-1"
                    style={{ color: "#f0e8d8" }}
                  >
                    {group.name}
                  </h1>

                  <p
                    className="text-sm font-medium leading-relaxed mb-5 max-w-lg"
                    style={{ color: "#c8884a" }}
                  >
                    {group.description}
                  </p>

                  {/* inline stats */}
                  <div className="flex items-center gap-6 flex-wrap">
                    {[
                      { Icon: Users, val: "245", label: "Members" },
                      { Icon: MessageSquare, val: "132", label: "Threads" },
                    ].map(({ Icon, val, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Icon size={15} style={{ color: "#c8884a" }} />
                        <span
                          className="font-bold"
                          style={{ color: "#f0e8d8" }}
                        >
                          {val}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "rgba(232,226,212,0.45)" }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                    {/* online */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"
                        style={{ boxShadow: "0 0 6px #22c55e" }}
                      />
                      <span className="font-bold" style={{ color: "#f0e8d8" }}>
                        18
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(232,226,212,0.45)" }}
                      >
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA buttons */}
                {user && (
                  <div className="flex flex-col gap-2 shrink-0 sm:w-44">
                    <button
                      onClick={() => setOpenCreate(true)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-colors"
                      style={{
                        backgroundColor: "#c8884a",
                        color: "#1a1008",
                        boxShadow: "0 0 16px rgba(200,136,74,0.25)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#b07a40")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#c8884a")
                      }
                    >
                      <Plus size={15} /> Create Thread
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm border transition-colors"
                      style={{
                        borderColor: "rgba(200,136,74,0.3)",
                        color: "rgba(232,226,212,0.7)",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#c8884a";
                        e.currentTarget.style.color = "#c8884a";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(200,136,74,0.3)";
                        e.currentTarget.style.color = "rgba(232,226,212,0.7)";
                      }}
                    >
                      <Info size={14} /> About Group
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs + filter row */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "#161b22",
                borderColor: "rgba(200,136,74,0.2)",
              }}
            >
              <div className="flex items-center justify-between px-4 overflow-x-auto">
                <nav className="flex min-w-max">
                  {THREAD_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                      style={{
                        borderColor:
                          activeTab === tab ? "#c8884a" : "transparent",
                        color:
                          activeTab === tab
                            ? "#c8884a"
                            : "rgba(232,226,212,0.55)",
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== tab)
                          e.currentTarget.style.color = "#e8e2d4";
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== tab)
                          e.currentTarget.style.color =
                            "rgba(232,226,212,0.55)";
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
                {/* sort button */}
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium shrink-0 ml-3 transition-colors"
                  style={{
                    borderColor: "rgba(200,136,74,0.2)",
                    color: "rgba(232,226,212,0.55)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#c8884a";
                    e.currentTarget.style.color = "#c8884a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,136,74,0.2)";
                    e.currentTarget.style.color = "rgba(232,226,212,0.55)";
                  }}
                >
                  Latest Activity ▾
                </button>
              </div>
            </div>

            {/* Posts feed */}

            <Posts
              refreshTrigger={refreshPosts}
              type="thread"
              groupId={groupId}
            />
          </main>
        </div>
      </div>

      {/* ════════════════════════════════
          CREATE THREAD MODAL
      ════════════════════════════════ */}
      {openCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpenCreate(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
            style={{
              backgroundColor: "#1e1e26",
              borderColor: "rgba(200,136,74,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 pt-5 pb-4 border-b"
              style={{ borderColor: "rgba(200,136,74,0.15)" }}
            >
              <h2
                className="flex items-center gap-2 text-base font-bold"
                style={{ color: "#f0e8d8" }}
              >
                <Plus size={17} style={{ color: "#c8884a" }} />
                Create New Thread
              </h2>
              <button
                onClick={() => setOpenCreate(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "rgba(232,226,212,0.55)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#e8e2d4";
                  e.currentTarget.style.backgroundColor =
                    "rgba(200,136,74,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(232,226,212,0.55)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X size={17} />
              </button>
            </div>
            <div className="px-6 py-5">
              <CreatePost
                onPostCreated={() => {
                  setOpenCreate(false);
                  triggerRefresh();
                }}
                type="thread"
                groupId={groupId}
              />
              <div
                className="mt-5 pt-4 border-t"
                style={{ borderColor: "rgba(200,136,74,0.15)" }}
              >
                <button
                  onClick={() => setOpenCreate(false)}
                  className="w-full py-2.5 rounded-xl border text-sm font-semibold transition-colors"
                  style={{
                    borderColor: "rgba(200,136,74,0.3)",
                    color: "#c8884a",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(200,136,74,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumCategory;
