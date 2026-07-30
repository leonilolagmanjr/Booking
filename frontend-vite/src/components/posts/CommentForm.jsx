import React, { useState } from "react";
import { Send } from "lucide-react";

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <label htmlFor="comment-text" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a thoughtful reply..."
          rows={2}
          className="
            max-h-32 min-h-11 w-full resize-y rounded-xl border border-[rgba(200,136,74,0.18)]
            bg-[#141418] px-3.5 py-2.5 text-sm leading-5 text-[#e8e2d4] outline-none
            placeholder:text-[rgba(232,226,212,0.34)]
            transition-all hover:border-[rgba(200,136,74,0.34)]
            focus:border-[#c8884a] focus:ring-2 focus:ring-[rgba(200,136,74,0.18)]
          "
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        aria-label="Submit comment"
        className="
          flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c8884a]
          text-[#1a1008] shadow-[0_0_14px_rgba(200,136,74,0.22)] transition-all
          hover:bg-[#b77a3f] disabled:cursor-not-allowed disabled:bg-[rgba(200,136,74,0.16)]
          disabled:text-[rgba(232,226,212,0.32)] disabled:shadow-none
        "
      >
        <Send size={17} />
      </button>
    </form>
  );
};

export default CommentForm;
