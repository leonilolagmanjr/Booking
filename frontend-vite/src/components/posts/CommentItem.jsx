import React from "react";
import { MessageCircle } from "lucide-react";
import UserLink from "../UserLink";
import dayjs from "dayjs";

const CommentItem = ({ comment }) => {
  const userName = comment.user?.name ?? "Unknown User";
  const userInitial = userName.charAt(0)?.toUpperCase() || "U";

  return (
    <article className="group/comment flex gap-3 rounded-xl border border-[rgba(200,136,74,0.14)] bg-[#1e1e26] px-3.5 py-3 transition-colors hover:border-[rgba(200,136,74,0.3)] hover:bg-[#22222b]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(200,136,74,0.16)] text-xs font-black text-[#c8884a] ring-1 ring-[rgba(200,136,74,0.22)]">
        {userInitial}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <UserLink
            compact
            userId={comment.user?._id}
            name={userName}
            className="text-xs"
          />
          <span className="h-1 w-1 rounded-full bg-[rgba(232,226,212,0.25)]" />
          <time className="text-[11px] text-[rgba(232,226,212,0.42)]">
            {dayjs(comment.createdAt).format("MMM D, h:mm A")}
          </time>
        </div>

        <p className="mt-1 whitespace-pre-line text-sm leading-5 text-[#e8e2d4]">
          {comment.text}
        </p>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[rgba(232,226,212,0.42)]">
          <MessageCircle
            size={12}
            className="text-[#c8884a] opacity-70 transition-opacity group-hover/comment:opacity-100"
          />
          Reply
        </div>
      </div>
    </article>
  );
};

export default CommentItem;
