import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPostedJobs,
  fetchCompletedJobs,
  fetchAcceptedJobs,
  getUserProfile,
  getFriendRequests,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFriend } from "../context/FriendContext";
import Posts from "../components/posts/Posts";
import FriendActions from "../components/friends/FriendActions";
import UserLink from "../components/UserLink";
import LevelBar from "../components/gamify/LevelBar";

import {
  Edit,
  MapPin,
  Phone,
  Mail,
  Star,
  Trophy,
  TrendingUp,
  BarChart2,
  GraduationCap,
  Badge,
  Users,
  Zap,
  ClipboardList,
  FileText,
  ChevronRight,
  MoreVertical,
  Camera,
  Pencil,
  CheckCircle,
} from "lucide-react";

const StatCard = ({ icon, value, label, trend }) => (
  <div className="flex-1 rounded-xl bg-[#1a1f2e] p-6 h-full flex flex-col gap-2 min-w-0">
    <div className="text-[#C08A5D] mb-1">{icon}</div>
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-white/50">{label}</span>
    {trend && (
      <span className="text-xs text-green-400 flex items-center gap-1">
        ↑ {trend} <span className="text-white/40">vs last month</span>
      </span>
    )}
  </div>
);

const SectionCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-[#151b27] border border-white/6 p-6 ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon, title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <span className="text-[#C08A5D]">{icon}</span>
      <span className="text-white font-bold text-base">{title}</span>
    </div>
    {action && (
      <button className="text-[#C08A5D] text-sm flex items-center gap-1 hover:text-[#d9a06a] transition-colors">
        {action} <ChevronRight size={14} />
      </button>
    )}
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/6 last:border-0">
    <span className="text-[#C08A5D] mt-0.5 shrink-0">{icon}</span>
    <div>
      <p className="text-[#C08A5D] text-xs mb-0.5">{label}</p>
      <p className="text-white/80 text-sm">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getFriendStatus,
    notifyFriendListUpdated,
    openChatWithUser,
    friendRequests,
  } = useFriend();

  const [profile, setProfile] = useState({});
  const [postedJobs, setPostedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [requestSent, setRequestSent] = useState(null);
  const [isFriend, setIsFriend] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(null);
  const [loadingFriendStatus, setLoadingFriendStatus] = useState(true);
  const [refreshProfile, setRefreshProfile] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("badges");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const viewedProfile = await getUserProfile(userId, token);

        setProfile(viewedProfile);
        setIsCurrentUser(userId === user?.id);

        const [posted, completed, accepted] = await Promise.all([
          fetchPostedJobs(userId, token),
          fetchCompletedJobs(userId, token),
          fetchAcceptedJobs(userId, token),
        ]);

        setPostedJobs(posted);
        setCompletedJobs(completed);
        setAcceptedJobs(accepted);

        await updateFriendStatus();
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
        setLoadingFriendStatus(false);
      }
    };

    if (user?.id) fetchProfileData();
  }, [userId, user, getFriendStatus, refreshProfile]);

  const updateFriendStatus = async () => {
    try {
      const status = await getFriendStatus(userId);
      setIsFriend(status === "friends");
      setRequestSent(status === "requestSent");
      setHasPendingRequest(status === "requestReceived");

      if (userId === user?.id) {
        const token = localStorage.getItem("token");
        await getFriendRequests(token);
        setHasPendingRequest(false);
        setRequestSent(false);
        setIsFriend(false);
      }
    } catch (err) {
      console.error("Error updating friend status:", err);
    }
  };

  useEffect(() => {
    updateFriendStatus();
  }, [friendRequests, userId, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1420]">
        <div className="w-14 h-14 rounded-full border-4 border-[#C08A5D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ background: "#0f1420" }}>
      <div className="mx-auto max-w-6xl">
        {/* ================================
            PROFILE HEADER CARD
        ================================ */}
        <div
          className="rounded-2xl p-8 mb-5 relative overflow-hidden border border-white/6"
          style={{
            background: "linear-gradient(145deg, #1a1f2e 0%, #151b27 100%)",
          }}
        >
          {/* Top Row: Avatar + Info + Actions */}
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-45 h-45 rounded-full overflow-hidden"
                style={{ border: "3px solid #C08A5D" }}
              >
                <img
                  src={
                    profile.profileImage ||
                    "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png"
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isCurrentUser && (
                <button className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#C08A5D] flex items-center justify-center">
                  <Camera size={13} className="text-[#0f1420]" />
                </button>
              )}
            </div>

            {/* Name + Info */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white text-3xl font-bold">
                  <UserLink name={profile.name} className="text-white" />
                </span>
                <CheckCircle size={18} className="text-[#C08A5D] shrink-0" />
              </div>

              <div className="flex items-center gap-2 mt-1 text-white text-sm">
                <Mail size={15} className="text-[#C08A5D]" />
                <span>{profile.email || "No email provided"}</span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-white/40 text-xs">
                <span>No bio provided yet.</span>
                {isCurrentUser && (
                  <Pencil size={12} className="text-[#C08A5D] cursor-pointer" />
                )}
              </div>

              {/* Chips */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white">
                  <Users size={11} className="text-[#C08A5D]" />
                  {profile.connections?.length || 0} Friends
                </span>
              </div>
            </div>

            {/* Edit + More */}
            <div className="flex items-center gap-2 shrink-0">
              {isCurrentUser && (
                <button
                  onClick={() => navigate("/editprofile")}
                  className="flex items-center gap-2 rounded-lg bg-[#C08A5D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d9a06a] transition-colors"
                >
                  <Edit size={14} />
                  EDIT PROFILE
                </button>
              )}
            </div>
          </div>

          {/* Friend Actions (non-current user) */}
          {!isCurrentUser && (
            <div className="mt-4">
              <FriendActions
                userId={userId}
                isCurrentUser={isCurrentUser}
                isFriend={isFriend}
                requestSent={requestSent}
                hasPendingRequest={hasPendingRequest}
                loadingFriendStatus={loadingFriendStatus}
                openChatWithUser={openChatWithUser}
                updateFriendStatus={updateFriendStatus}
                notifyFriendListUpdated={notifyFriendListUpdated}
                friendRequests={friendRequests}
              />
            </div>
          )}

          {/* Level Bar */}
          <div className="mt-2 rounded-xl p-4">
            <LevelBar xp={profile.xp || 0} level={profile.level || 1} />
          </div>

          {/* Tabs */}
          <div className=" flex items-center justify-between border-b border-white/6">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("badges")}
                className={`flex items-center gap-2 px-2 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px
                  ${
                    activeTab === "badges"
                      ? "text-[#C08A5D] border-[#C08A5D]"
                      : "text-white/50 border-transparent hover:text-white/70"
                  }`}
              >
                <Star size={14} /> Badges
              </button>
              <button
                onClick={() => setActiveTab("accomplishments")}
                className={`flex items-center gap-2 px-2 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px
                  ${
                    activeTab === "accomplishments"
                      ? "text-[#C08A5D] border-[#C08A5D]"
                      : "text-white/50 border-transparent hover:text-white/70"
                  }`}
              >
                <Trophy size={14} /> Accomplishments
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "badges" && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide justify-center w-full">
                {(profile.badges?.length > 0
                  ? profile.badges
                  : [
                      {
                        icon: "🏆",
                        name: "Early Adopter",
                        desc: "Joined early PBuild community",
                      },
                      {
                        icon: "⭐",
                        name: "Rising Star",
                        desc: "Reached Level 5",
                      },
                      {
                        icon: "🔥",
                        name: "Top Contributor",
                        desc: "Made 50+ contributions",
                      },
                      {
                        icon: "💼",
                        name: "Job Crusher",
                        desc: "Completed 25 jobs",
                      },
                      {
                        icon: "🚀",
                        name: "On a Roll",
                        desc: "7 days streak active",
                      },
                      {
                        icon: "🎯",
                        name: "Detail Oriented",
                        desc: "Received 10+ 5-star reviews",
                      },
                    ]
                ).map((badge, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-35 rounded-xl bg-[#1a1f2e] border border-white/6 p-3 flex flex-col items-center gap-1 text-center hover:border-[#C08A5D]/30 transition-colors"
                  >
                    <div className="w-18 h-18 rounded-full bg-[#0f1420] flex items-center justify-center text-2xl mb-1">
                      {badge.icon || "🏅"}
                    </div>
                    <span className="text-[#C08A5D] text-xs font-semibold leading-tight">
                      {badge.name}
                    </span>
                    <span className="text-white/40 text-[10px] leading-tight">
                      {badge.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "accomplishments" && (
              <div className="flex gap-4">
                <div className="flex-1 rounded-xl bg-[#1a1f2e] p-8.5 text-center">
                  <ClipboardList
                    size={28}
                    className="text-[#C08A5D] mx-auto mb1"
                  />
                  <p className="text-2xl font-bold text-white">
                    {completedJobs.length}
                  </p>
                  <p className="text-white/50 text-xs">Jobs Completed</p>
                </div>
                <div className="flex-1 rounded-xl bg-[#1a1f2e] p-8.5 text-center">
                  <FileText size={28} className="text-[#C08A5D] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {postedJobs.length}
                  </p>
                  <p className="text-white/50 text-xs">Jobs Posted</p>
                </div>
                <div className="flex-1 rounded-xl bg-[#1a1f2e] p-4 text-center">
                  <span className="text-[#C08A5D] text-xl font-black block mb-2">
                    XP
                  </span>
                  <p className="text-2xl font-bold text-white">
                    {profile.xp || 0}
                  </p>
                  <p className="text-white/50 text-xs">Earned XP</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stats Row */}
          <div className="mt-4 pt-4 border-t border-white/6 flex gap-8 justify-between items-center  px-26">
            <div className="flex items-center gap-2">
              <ClipboardList size={40} className="text-[#C08A5D]" />
              <div>
                <p className="text-3xl font-bold text-white">
                  {completedJobs.length}
                </p>
                <p className="text-white/40 text-xs">Jobs Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText size={40} className="text-[#C08A5D]" />
              <div>
                <p className="text-3xl font-bold text-white">
                  {postedJobs.length}
                </p>
                <p className="text-white/40 text-xs">Jobs Posted</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#C08A5D] font-black text-3xl">XP</span>
              <div>
                <p className="text-3xl font-bold text-white">
                  {profile.xp || 0}
                </p>
                <p className="text-white/40 text-xs">Earned XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================
            MAIN 2-COLUMN LAYOUT
        ================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* Overview */}
            <SectionCard>
              <SectionTitle
                icon={<BarChart2 size={18} />}
                title="Overview"
                action="View all"
              />
              <p className="text-white/40 text-xs -mt-3 mb-4">
                Your activity at a glance
              </p>
              <div className="flex gap-4">
                <StatCard
                  icon={<ClipboardList size={22} />}
                  value={completedJobs.length}
                  label="Jobs Completed"
                  trend="12%"
                />
                <StatCard
                  icon={<FileText size={22} />}
                  value={postedJobs.length}
                  label="Jobs Posted"
                  trend="8%"
                />
                <StatCard
                  icon={<span className="font-black text-base">XP</span>}
                  value={profile.xp || 0}
                  label="Earned XP"
                  trend="15%"
                />
              </div>
            </SectionCard>

            {/* Posts */}
            <SectionCard className="flex-1">
              <SectionTitle
                icon={<FileText size={18} />}
                title="Posts"
                action="View all posts"
              />
              <p className="text-white/40 text-xs -mt-3 mb-4">
                Your recent job posts
              </p>
              <Posts
                userId={userId}
                onPostUpdate={() => setRefreshProfile((prev) => prev + 1)}
              />
            </SectionCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* Basic Information */}
            <SectionCard>
              <SectionTitle
                icon={<Badge size={18} />}
                title="Basic Information"
              />
              <InfoRow
                icon={<MapPin size={15} />}
                label="Location"
                value={profile.location || "Not specified"}
              />
              <InfoRow
                icon={<Phone size={15} />}
                label="Phone"
                value={profile.phone || "Not specified"}
              />
              <div className="pt-3">
                <p className="text-[#C08A5D] text-xs mb-1.5">
                  Remote Availability
                </p>
                <span
                  className={`text-sm font-medium ${
                    profile.remoteAvailability
                      ? "text-[#C08A5D]"
                      : "text-white/60"
                  }`}
                >
                  {profile.remoteAvailability
                    ? "Available for Remote Work"
                    : "Not Available Remotely"}
                </span>
              </div>
            </SectionCard>

            {/* Skills & Certifications */}
            <SectionCard>
              <SectionTitle
                icon={<GraduationCap size={18} />}
                title="Skills & Certifications"
              />

              {profile.skills?.length > 0 && (
                <div className="mb-3">
                  <p className="text-[#C08A5D] text-xs mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 5).map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-[#C08A5D]/30 bg-[#C08A5D]/10 px-2.5 py-0.5 text-xs text-[#C08A5D]"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 5 && (
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/40">
                        +{profile.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {profile.languages?.length > 0 && (
                <div className="mb-3">
                  <p className="text-[#C08A5D] text-xs mb-2">Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.languages.map((lang, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-[#C08A5D]/30 bg-[#C08A5D]/10 px-2.5 py-0.5 text-xs text-[#C08A5D]"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.certifications?.length > 0 && (
                <div>
                  <p className="text-[#C08A5D] text-xs mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.certifications.slice(0, 3).map((cert, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-[#C08A5D]/30 bg-[#C08A5D]/10 px-2.5 py-0.5 text-xs text-[#C08A5D]"
                      >
                        {cert}
                      </span>
                    ))}
                    {profile.certifications.length > 3 && (
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/40">
                        +{profile.certifications.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {!profile.skills?.length &&
                !profile.languages?.length &&
                !profile.certifications?.length && (
                  <p className="text-white/40 text-sm italic">
                    No skills or certifications added yet
                  </p>
                )}
            </SectionCard>

            {/* Ratings & Performance */}
            <SectionCard>
              <SectionTitle
                icon={<Star size={18} />}
                title="Ratings & Performance"
              />
              <div className="flex flex-col gap-0">
                <div className="flex items-center justify-between py-3 border-b border-white/6">
                  <span className="text-white/70 text-sm">Average Rating</span>
                  <span className="text-[#C08A5D] font-bold text-sm">
                    {profile.rating || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/6">
                  <span className="text-white/70 text-sm">
                    Job Success Rate
                  </span>
                  <span className="text-[#C08A5D] font-bold text-sm">
                    {profile.successRate || "N/A"}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/70 text-sm">Total Completed</span>
                  <span className="text-[#C08A5D] font-bold text-sm">
                    {completedJobs.length}
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
