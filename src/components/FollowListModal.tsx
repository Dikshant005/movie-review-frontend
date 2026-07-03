import { X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserListProfile } from '../api/users';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: UserListProfile[];
}

export default function FollowListModal({ isOpen, onClose, title, users }: FollowListModalProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 relative">
                <h3 className="text-lg font-bold text-white w-full text-center">{title}</h3>
                <button
                  onClick={onClose}
                  className="absolute right-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {users.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No users found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => {
                          onClose();
                          // navigate to their profile in the future if we have public profiles
                          // navigate(`/profile/${user.username}`);
                        }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 p-[2px]">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
