import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  TrendingUp,
  WorkOutline,
  Groups,
  Speed,
  AccessTime,
  Verified,
  EmojiEvents,
  Add,
  Star,
  Category,
  ArrowForward,
  Shield,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
} from "@mui/icons-material";
import { fetchJobs } from "../services/api";
import Leaderboard from "../components/gamify/Leaderboard";
import briefcaseImg from "../assets/bfcase_bg_img.png";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);

  const getRandomJobs = (jobsArr, count = 4) => {
    if (!Array.isArray(jobsArr) || jobsArr.length === 0) return [];
    return jobsArr
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  };

  useEffect(() => {
    const getJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await fetchJobs(token);
        setJobs(data);
        setFeaturedJobs(getRandomJobs(data));
        setLoaded(true);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setLoaded(true);
      }
    };
    getJobs();
  }, []);

  const categories = [
    { name: "Web Development", icon: "💻", count: "124 jobs" },
    { name: "Graphic Design", icon: "🎨", count: "89 jobs" },
    { name: "Writing & Translation", icon: "✍️", count: "156 jobs" },
    { name: "Digital Marketing", icon: "📈", count: "102 jobs" },
  ];

  const stats = [
    { number: "10K+", label: "Active Freelancers", Icon: Groups },
    { number: "5K+", label: "Completed Jobs", Icon: Verified },
    { number: "98%", label: "Success Rate", Icon: EmojiEvents },
    { number: "4.9/5", label: "Client Rating", Icon: Star },
  ];

  const insights = [
    { label: "Avg. Response Time", value: "2.3 hours", Icon: Speed },
    { label: "Project Success Rate", value: "97.8%", Icon: EmojiEvents },
    { label: "Active Freelancers", value: "12,458", Icon: Groups },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0d1117", color: "#e6e6ef" }}
    >
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex items-center "
        style={{
          backgroundImage: `url(${briefcaseImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Dark overlay so left text stays readable, fades out toward the right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.85) 35%, rgba(13,17,23,0.4) 60%, rgba(13,17,23,0.05) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 md:py-20">
          {/* Left – text (max half-width so it doesn't cover the briefcase) */}
          <div className="max-w-lg">
            {/* Badge */}
            <span
              className="inline-flex items-center gap-2 text-sm font-bold px-4 py-1.5 rounded-full mb-6 border"
              style={{
                backgroundColor: "rgba(249,115,22,0.12)",
                color: "#f97316",
                borderColor: "rgba(249,115,22,0.25)",
              }}
            >
              <Shield style={{ fontSize: "1rem", color: "#f97316" }} />
              Trusted by 50,000+ Businesses
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white mb-4">
              Hire Top Talent
              <br />
              for Any Job — <span style={{ color: "#f97316" }}>Fast</span>
            </h1>

            <p
              className="text-base leading-relaxed mb-8 max-w-sm"
              style={{ color: "#8b8fa8" }}
            >
              Connect with skilled freelancers and businesses in minutes.
              Quality work delivered on time, every time.
            </p>

            <div className="flex flex-wrap gap-3">
              <RouterLink
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#f97316",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ea6c0a";
                  e.currentTarget.style.boxShadow =
                    "0 6px 28px rgba(249,115,22,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f97316";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(249,115,22,0.35)";
                }}
              >
                Find Talent <ArrowForward style={{ fontSize: "1rem" }} />
              </RouterLink>

              <RouterLink
                to="/post-job"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 border"
                style={{
                  color: "#e6e6ef",
                  borderColor: "rgba(220,220,220,0.3)",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  backdropFilter: "blur(4px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f97316";
                  e.currentTarget.style.borderColor = "#f97316";
                  e.currentTarget.style.backgroundColor =
                    "rgba(249,115,22,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#e6e6ef";
                  e.currentTarget.style.borderColor = "rgba(220,220,220,0.3)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)";
                }}
              >
                Post a Job
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section
        className="border-b py-4"
        style={{
          backgroundColor: "#1e1e26",
          borderColor: "rgba(200,136,74,0.18)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ number, label, Icon }, i) => (
              <div key={i} className="text-center">
                <div
                  className="flex justify-center mb-1"
                  style={{ color: "#f97316" }}
                >
                  <Icon style={{ fontSize: "1.5rem" }} />
                </div>
                <p className="text-white font-extrabold text-1xl leading-none">
                  {number}
                </p>
                <p
                  className="text-sm font-medium mt-1"
                  style={{ color: "#8b8fa8" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left column ── */}
          <div className="flex-1 min-w-0">
            {/* Featured Jobs */}
            <div className="mb-10">
              {/* Section header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                  >
                    <WorkOutline
                      style={{ color: "#f97316", fontSize: "1.2rem" }}
                    />
                  </div>
                  <span className="text-white font-bold text-lg">
                    Featured Jobs
                  </span>
                </div>
                <RouterLink
                  to="/jobs"
                  className="flex items-center gap-1 text-sm font-semibold transition-colors duration-150 hover:text-white"
                  style={{ color: "#f97316" }}
                >
                  View all jobs <ArrowForward style={{ fontSize: "0.9rem" }} />
                </RouterLink>
              </div>

              {loaded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredJobs.length > 0 ? (
                    featuredJobs.map((job) => (
                      <RouterLink
                        key={job._id}
                        to={`/job/${job._id}`}
                        className="block h-full no-underline"
                        onMouseEnter={() => setHoveredCard(job._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div
                          className="rounded-2xl h-full border transition-all duration-200 overflow-hidden"
                          style={{
                            backgroundColor: "#1e1e26",
                            borderColor:
                              hoveredCard === job._id
                                ? "rgba(200,136,74,0.55)"
                                : "rgba(200,136,74,0.18)",
                            transform:
                              hoveredCard === job._id
                                ? "translateY(-6px)"
                                : "none",
                            boxShadow:
                              hoveredCard === job._id
                                ? "0 12px 32px rgba(249,115,22,0.15)"
                                : "none",
                          }}
                        >
                          <div className="p-5">
                            {/* Title + badge */}
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-white font-bold text-sm leading-snug flex-1">
                                {job.title}
                              </span>
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0"
                                style={{
                                  backgroundColor:
                                    job.status === "open"
                                      ? "#f97316"
                                      : "rgba(249,115,22,0.12)",
                                  color:
                                    job.status === "open" ? "#fff" : "#f97316",
                                }}
                              >
                                {job.status}
                              </span>
                            </div>

                            {/* Meta */}
                            <p
                              className="text-xs mb-3"
                              style={{ color: "#8b8fa8" }}
                            >
                              Remote • Full Time
                            </p>

                            {/* Price */}
                            <p
                              className="font-extrabold text-xl mb-3"
                              style={{ color: "#f97316" }}
                            >
                              {(job.currency || "USD") === "USD" ? "$" : "₱"}
                              {(job.price || 0).toFixed(2)}
                            </p>

                            {/* Date */}
                            <div className="flex items-center gap-1.5 mb-4">
                              <AccessTime
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#8b8fa8",
                                }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: "#8b8fa8" }}
                              >
                                Posted{" "}
                                {new Date(job.dateListed).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Footer */}
                            <div
                              className="flex items-center justify-between pt-3 border-t"
                              style={{ borderColor: "rgba(200,136,74,0.18)" }}
                            >
                              <span
                                className="flex items-center gap-1 text-xs"
                                style={{ color: "#8b8fa8" }}
                              >
                                <Star
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "#f97316",
                                  }}
                                />
                                4.8 • 12 proposals
                              </span>
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    job.status === "open"
                                      ? "#22c55e"
                                      : "#8b8fa8",
                                  boxShadow:
                                    job.status === "open"
                                      ? "0 0 6px #22c55e"
                                      : "none",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </RouterLink>
                    ))
                  ) : (
                    <div className="col-span-2">
                      <div
                        className="rounded-2xl text-center py-14 border-2 border-dashed"
                        style={{
                          backgroundColor: "#1e1e26",
                          borderColor: "#f97316",
                        }}
                      >
                        <WorkOutline
                          style={{
                            fontSize: 48,
                            color: "#f97316",
                            opacity: 0.6,
                            marginBottom: 12,
                          }}
                        />
                        <p className="text-white font-bold mb-2">
                          No featured jobs available
                        </p>
                        <p
                          className="text-sm mb-6 max-w-xs mx-auto"
                          style={{ color: "#8b8fa8" }}
                        >
                          Check back later for new opportunities or be the first
                          to post a job
                        </p>
                        <RouterLink
                          to="/post-job"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-colors duration-150"
                          style={{ backgroundColor: "#f97316" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ea6c0a")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f97316")
                          }
                        >
                          <Add style={{ fontSize: "1rem" }} />
                          Post Your First Job
                        </RouterLink>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Popular Categories */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                >
                  <Category style={{ color: "#f97316", fontSize: "1.2rem" }} />
                </div>
                <span className="text-white font-bold text-lg">
                  Popular Categories
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden group"
                    style={{
                      backgroundColor: "#1e1e26",
                      borderColor: "rgba(200,136,74,0.18)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#f97316";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 28px rgba(249,115,22,0.15)";
                      e.currentTarget.style.backgroundColor = "#252530";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(200,136,74,0.18)";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.backgroundColor = "#1e1e26";
                    }}
                  >
                    {/* Open badge */}
                    <span
                      className="absolute top-2.5 right-2.5 text-white font-bold text-xs px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: "#f97316", fontSize: "0.6rem" }}
                    >
                      Open
                    </span>
                    <div className="p-5 text-center">
                      <span className="text-4xl block mb-3 transition-transform duration-200 group-hover:scale-110">
                        {cat.icon}
                      </span>
                      <p className="text-white font-bold text-sm mb-1">
                        {cat.name}
                      </p>
                      <p
                        className="font-bold text-xs"
                        style={{ color: "#f97316" }}
                      >
                        {cat.count}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="sticky top-24 flex flex-col gap-4">
              {/* Leaderboard card */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  backgroundColor: "#1e1e26",
                  borderColor: "rgba(200,136,74,0.18)",
                }}
              >
                <div
                  className="flex items-center gap-3 px-5 py-4 border-b"
                  style={{ borderColor: "rgba(200,136,74,0.18)" }}
                >
                  <TrendingUp
                    style={{ color: "#f97316", fontSize: "1.2rem" }}
                  />
                  <span className="text-white font-bold text-base">
                    Top Users by XP
                  </span>
                </div>
                <Leaderboard />
              </div>

              {/* Platform Insights card */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  backgroundColor: "#1e1e26",
                  borderColor: "rgba(200,136,74,0.18)",
                }}
              >
                <div
                  className="flex items-center gap-3 px-5 py-4 border-b"
                  style={{ borderColor: "rgba(200,136,74,0.18)" }}
                >
                  <TrendingUp
                    style={{ color: "#f97316", fontSize: "1.2rem" }}
                  />
                  <span className="text-white font-bold text-base">
                    Platform Insights
                  </span>
                </div>
                <div className="px-5 py-2">
                  {insights.map(({ label, value, Icon }, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3.5"
                      style={{
                        borderBottom:
                          i < insights.length - 1
                            ? "1px solid rgba(200,136,74,0.18)"
                            : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          style={{ color: "#f97316", fontSize: "1.1rem" }}
                        />
                        <span className="text-sm" style={{ color: "#8b8fa8" }}>
                          {label}
                        </span>
                      </div>
                      <span className="text-white font-bold text-sm">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer
        className="border-t text-center py-10"
        style={{
          backgroundColor: "#161b22",
          borderColor: "rgba(200,136,74,0.18)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Brand */}
          <p className="text-2xl font-black tracking-tight mb-3">
            <span style={{ color: "#f97316" }}>P</span>
            <span className="text-white">Build</span>
          </p>

          <p
            className="text-sm leading-relaxed mb-6 max-w-md mx-auto"
            style={{ color: "#8b8fa8" }}
          >
            Building the future of freelance collaboration and professional
            connections.
          </p>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {[
              "About",
              "Privacy Policy",
              "Terms of Service",
              "Contact",
              "Help Center",
            ].map((item) => (
              <span
                key={item}
                className="text-sm cursor-pointer transition-colors duration-150 hover:text-orange-400"
                style={{ color: "#8b8fa8" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f97316")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8b8fa8")}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-3 mb-8">
            {[Facebook, Twitter, LinkedIn, Instagram].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-150"
                style={{
                  borderColor: "rgba(200,136,74,0.18)",
                  color: "#8b8fa8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f97316";
                  e.currentTarget.style.borderColor = "#f97316";
                  e.currentTarget.style.backgroundColor =
                    "rgba(249,115,22,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#8b8fa8";
                  e.currentTarget.style.borderColor = "rgba(200,136,74,0.18)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon style={{ fontSize: "1rem" }} />
              </button>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-xs pt-6 border-t"
            style={{ color: "#8b8fa8", borderColor: "rgba(200,136,74,0.18)" }}
          >
            © {new Date().getFullYear()} PBuild. Connecting talent with
            opportunity. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
