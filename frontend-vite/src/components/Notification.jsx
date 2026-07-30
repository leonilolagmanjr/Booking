import React, { useState, useContext, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { acceptFriendRequest, denyFriendRequest } from "../services/api";
import { FriendContext } from "../context/FriendContext";

import UserLink from "./UserLink";

const Notification = () => {
  const [open, setOpen] = useState(false);

  const { friendRequests, notifyFriendListUpdated } = useContext(FriendContext);

  const menuRef = useRef(null);

  const handleAccept = async (requesterId) => {
    try {
      const token = localStorage.getItem("token");

      await acceptFriendRequest(requesterId, token);

      notifyFriendListUpdated();
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  const handleDeny = async (requesterId) => {
    try {
      const token = localStorage.getItem("token");

      await denyFriendRequest(requesterId, token);

      notifyFriendListUpdated();
    } catch (err) {
      console.error("Error denying friend request:", err);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          text-[#DCD7C9]
          transition-all
          hover:bg-[#A27B5C]/10
        "
      >
        <Bell size={20} />

        {friendRequests.length > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-10
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-[#A27B5C]
              px-1
              text-[10px]
              font-bold
              text-[#2C3639]
            "
          >
            {friendRequests.length}
          </span>
        )}
      </button>

      {/* Animated Dropdown */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -15,
              scale: 0.95,
            }}
            transition={{
              duration: 0.22,
              ease: [0.16, 0.2, 0.3, 1],
            }}
            className="
              absolute
              left-2
              top-20
              z-50
              w-97.5
              overflow-hidden
              rounded-2xl
              border
              border-[#C08A5D]/20
              bg-[#111827]
              shadow-[0_20px_50px_rgba(0,0,0,.45)]
            "
          >
            {/* Arrow */}

            <div
              className="
                absolute
                -top-2
                left-6
                h-4
                w-4
                rotate-45
                border-l
                border-t
                border-[#C08A5D]/20
                bg-[#111827]
              "
            />

            {/* Header */}

            <div
              className="
                border-b
                border-[#C08A5D]/10
                px-6
                py-5
              "
            >
              <h3
                className="
                  text-lg
                  font-semibold
                  text-[#DCD7C9]
                "
              >
                Friend Requests
              </h3>
            </div>

            {/* Empty State */}

            {friendRequests.length === 0 ? (
              <div
                className="
                  flex
                  h-55
                  items-center
                  justify-center
                  px-6
                "
              >
                <p
                  className="
                    text-center
                    text-base
                    text-[#DCD7C9]/60
                  "
                >
                  No new friend requests.
                </p>
              </div>
            ) : (
              <div
                className="
                  max-h-105
                  overflow-y-auto
                "
              >
                {friendRequests.map((req) => (
                  <div
                    key={req._id}
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-[#C08A5D]/10
                      px-5
                      py-4
                      transition-colors
                      hover:bg-[#C08A5D]/5
                    "
                  >
                    {/* User Info */}

                    <div className="mr-3 flex-1">
                      <UserLink
                        userId={req._id}
                        name={req.name}
                        className="
                          text-[15px]
                          font-semibold
                          text-[#DCD7C9]
                        "
                      />

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#DCD7C9]/60
                        "
                      >
                        {req.email}
                      </p>
                    </div>

                    {/* Actions */}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="
                          rounded-lg
                          bg-green-500
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-white
                          transition-colors
                          hover:bg-green-600
                        "
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleDeny(req._id)}
                        className="
                          rounded-lg
                          bg-red-500
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-white
                          transition-colors
                          hover:bg-red-600
                        "
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
