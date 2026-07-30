import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleUserRound } from "lucide-react";

const UserLink = ({ userId, name, className = "", compact = false }) => {
  const { user } = useAuth();

  const isOwn = userId === user?.id;
  const displayName = isOwn ? name : name || "Unknown";

  if (!userId) {
    return <span className={className}>{displayName}</span>;
  }

  if (compact) {
    return (
      <Link
        to={`/profile/${userId}`}
        className={`
          text-[#f0e8d8]
          hover:text-[#c8884a]
          transition-colors
          font-bold
          ${className}
        `}
      >
        {displayName}
      </Link>
    );
  }

  return (
    <Link to={`/profile/${userId}`} className="inline-block no-underline">
      <div className="flex items-center rounded-lg px-5 py-2 transition-colors hover:bg-white/5">
        <CircleUserRound className="mr-2" size={24} />
        <span
          className={`
            text-sm
            text-white
            hover:text-[#DCD7C9]
            transition-colors
            ${className}
          `}
        >
          {displayName}
        </span>
      </div>
    </Link>
  );
};

export default UserLink;
