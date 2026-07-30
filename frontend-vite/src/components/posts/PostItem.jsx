import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Repeat2,
  ShieldCheck,
} from "lucide-react";
import {
  addComment,
  deletePost,
  likePost,
  sharePost,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import EditPost from "./EditPost";
import UserLink from "../UserLink";
import dayjs from "dayjs";

const PostItem = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.includes(user?.id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const open = Boolean(anchorEl);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedPost = await likePost(post._id, token);
      setLiked(updatedPost.likes.includes(user?.id));
      setLikesCount(updatedPost.likes.length);
      onPostUpdated();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");
      await sharePost(post._id, token);
      setShareCount((prev) => prev + 1);
      onPostUpdated();
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  const handleAddComment = async (text) => {
    try {
      const token = localStorage.getItem("token");
      const updatedPost = await addComment(post._id, { text }, token);
      setComments(updatedPost.comments);
      setShowCommentForm(false);
      onPostUpdated();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await deletePost(post._id, token);
      onPostUpdated();
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      handleMenuClose();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const userInitial = post.createdBy?.name?.charAt(0)?.toUpperCase() ?? "U";
  const userName = post.createdBy?.name ?? "Unknown User";
  const userLevel = post.createdBy?.level ?? 1;
  const isThread = post.type === "thread";
  const postLabel = isThread ? "Forum Thread" : "Community Post";

  const ActionButton = ({ active, children, onClick, label }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        group flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-2.5 py-2
        text-xs font-semibold transition-all
        ${
          active
            ? "text-[#c8884a] hover:bg-[rgba(200,136,74,0.1)]"
            : "text-[rgba(232,226,212,0.58)] hover:bg-[rgba(200,136,74,0.1)] hover:text-[#e8e2d4]"
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <article className="group/post mb-4 overflow-hidden rounded-xl border border-[rgba(200,136,74,0.18)] bg-[#1e1e26] shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[rgba(200,136,74,0.42)] hover:shadow-[0_18px_46px_rgba(0,0,0,0.26)]">
      <div className="border-b border-[rgba(200,136,74,0.12)] bg-linear-to-r from-[rgba(200,136,74,0.08)] via-transparent to-transparent px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#c8884a] to-[#9f6c38] text-sm font-black text-[#1a1008] ring-2 ring-[#c8884a]/25 shadow-[0_0_20px_rgba(200,136,74,0.16)]">
              {userInitial}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <UserLink
                  compact
                  userId={post.createdBy?._id}
                  name={userName}
                  className="text-sm"
                />
                <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(200,136,74,0.14)] px-2 py-0.5 text-[11px] font-bold text-[#c8884a]">
                  <ShieldCheck size={11} />
                  Level {userLevel}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[rgba(232,226,212,0.46)]">
                <span>{dayjs(post.createdAt).format("MMM D, YYYY")}</span>
                <span className="h-1 w-1 rounded-full bg-[rgba(232,226,212,0.28)]" />
                <span>{dayjs(post.createdAt).format("h:mm A")}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-[rgba(200,136,74,0.2)] bg-[rgba(13,17,23,0.45)] px-2.5 py-1 text-[11px] font-semibold text-[rgba(232,226,212,0.62)] sm:inline-flex">
              {post.pinned && <Pin size={11} className="text-[#c8884a]" />}
              {postLabel}
            </span>

            {user?.id === post.createdBy?._id && (
              <>
                <IconButton
                  aria-label="post options"
                  onClick={handleMenuClick}
                  size="small"
                  sx={{
                    color: "rgba(232,226,212,0.56)",
                    border: "1px solid rgba(200,136,74,0.16)",
                    bgcolor: "rgba(13,17,23,0.22)",
                    "&:hover": {
                      color: "#c8884a",
                      bgcolor: "rgba(200,136,74,0.1)",
                      borderColor: "rgba(200,136,74,0.36)",
                    },
                  }}
                >
                  <MoreHorizontal size={17} />
                </IconButton>
                <Menu
                  id="post-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: "#1e1e26",
                      border: "1px solid rgba(200,136,74,0.2)",
                      boxShadow: "0 18px 42px rgba(0,0,0,0.35)",
                      "& .MuiMenuItem-root": {
                        color: "#e8e2d4",
                        fontSize: "0.875rem",
                        "&:hover": {
                          bgcolor: "rgba(200,136,74,0.1)",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleEdit}>Edit post</MenuItem>
                  <MenuItem onClick={handleDelete} sx={{ color: "#ff8a8a" }}>
                    Delete post
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="p-4">
          <EditPost
            post={post}
            onPostUpdated={onPostUpdated}
            onCancel={handleEditCancel}
          />
        </div>
      ) : (
        <>
          <div className="px-4 pb-4 pt-3">
            {post.sharedFrom && (
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-[rgba(200,136,74,0.18)] bg-[rgba(200,136,74,0.08)] px-2.5 py-1 text-[11px] font-semibold text-[#c8884a]">
                <Repeat2 size={12} />
                Shared from another post
              </div>
            )}

            <p className="whitespace-pre-line text-sm leading-6 text-[#e8e2d4]">
              {post.content}
            </p>

            {post.media && post.media.length > 0 && (
              <div className="mt-4 grid gap-3">
                {post.media.map((media, idx) => {
                  const isVideo = media.url.match(/\.(mp4|webm|ogg)$/i);
                  return isVideo ? (
                    <video
                      key={idx}
                      src={media.url}
                      controls
                      className="max-h-130 w-full rounded-xl border border-[rgba(200,136,74,0.18)] bg-[#0d1117] object-contain"
                    />
                  ) : (
                    <img
                      key={idx}
                      src={media.url}
                      alt="post media"
                      className="max-h-130 w-full rounded-xl border border-[rgba(200,136,74,0.18)] bg-[#0d1117] object-cover"
                    />
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-[rgba(200,136,74,0.12)] py-2 text-xs text-[rgba(232,226,212,0.48)]">
              <span>{likesCount} likes</span>
              <span className="h-1 w-1 rounded-full bg-[rgba(232,226,212,0.24)]" />
              <span>{comments.length} comments</span>
              <span className="h-1 w-1 rounded-full bg-[rgba(232,226,212,0.24)]" />
              <span>{shareCount} shares</span>
            </div>

            <div className="mt-2 grid grid-cols-4 gap-2">
              <ActionButton
                active={liked}
                onClick={handleLike}
                label="Like post"
              >
                <Heart
                  size={17}
                  className={
                    liked
                      ? "fill-current"
                      : "transition-transform group-hover:scale-105"
                  }
                />
                <span className="hidden sm:inline">Like</span>
              </ActionButton>

              <ActionButton
                active={showCommentForm}
                onClick={() => setShowCommentForm(!showCommentForm)}
                label="Comment on post"
              >
                <MessageCircle size={17} />
                <span className="hidden sm:inline">Comment</span>
              </ActionButton>

              <ActionButton onClick={handleShare} label="Share post">
                <Repeat2 size={17} />
                <span className="hidden sm:inline">Share</span>
              </ActionButton>

              <ActionButton label="Save post">
                <Bookmark size={17} />
                <span className="hidden sm:inline">Save</span>
              </ActionButton>
            </div>
          </div>

          {showCommentForm && (
            <div className="border-t border-[rgba(200,136,74,0.12)] bg-[rgba(13,17,23,0.18)] px-4 py-3">
              <CommentForm onSubmit={handleAddComment} />
            </div>
          )}

          {comments.length > 0 && (
            <div className="space-y-2 border-t border-[rgba(200,136,74,0.12)] bg-[#191920] px-4 py-3">
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default PostItem;
