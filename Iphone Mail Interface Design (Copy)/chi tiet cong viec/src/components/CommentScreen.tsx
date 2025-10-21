import { ChevronLeft, Send, Heart, Reply } from "lucide-react";
import { useState } from "react";

interface CommentScreenProps {
  onBack: () => void;
}

interface Comment {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  text: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
  isReply?: boolean;
}

export default function CommentScreen({ onBack }: CommentScreenProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Nguyễn Văn An",
      initials: "NA",
      avatarColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      text: "Design này trông rất đẹp! Mình rất thích hiệu ứng liquid glass.",
      timestamp: "2 giờ trước",
      likes: 5,
      liked: true,
      replies: [
        {
          id: 2,
          author: "Trần Thị Bình",
          initials: "TB",
          avatarColor: "bg-gradient-to-br from-pink-400 to-pink-600",
          text: "Mình cũng nghĩ vậy! Có thể làm tutorial không?",
          timestamp: "1 giờ trước",
          likes: 2,
          liked: false,
          isReply: true,
        }
      ]
    },
    {
      id: 3,
      author: "Lê Hoàng Cường",
      initials: "LC",
      avatarColor: "bg-gradient-to-br from-purple-400 to-purple-600",
      text: "Cần review lại phần animation, có vẻ hơi lag trên các thiết bị cũ.",
      timestamp: "30 phút trước",
      likes: 1,
      liked: false,
    },
    {
      id: 4,
      author: "Phạm Minh Đức",
      initials: "PD",
      avatarColor: "bg-gradient-to-br from-green-400 to-green-600",
      text: "Đã test trên iPhone 12, mọi thứ hoạt động mượt mà 👍",
      timestamp: "10 phút trước",
      likes: 3,
      liked: false,
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const toggleLike = (commentId: number, isReply: boolean = false, parentId?: number) => {
    setComments(comments.map(comment => {
      if (isReply && comment.id === parentId && comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
              : reply
          )
        };
      }
      if (comment.id === commentId) {
        return { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 };
      }
      return comment;
    }));
  };

  const sendComment = () => {
    if (newComment.trim()) {
      // Logic to add comment
      setNewComment("");
      setReplyingTo(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto relative overflow-hidden flex flex-col">
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[#007AFF]" />
            </button>
            <div className="text-[17px] text-black">Bình luận</div>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              {/* Main Comment */}
              <div className="bg-white/30 backdrop-blur-xl rounded-[20px] p-4 shadow-xl shadow-black/5 border border-white/40">
                {/* Author Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${comment.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-white text-[14px]">{comment.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] text-black">{comment.author}</div>
                    <div className="text-[13px] text-gray-500">{comment.timestamp}</div>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-[15px] text-gray-800 mb-3 ml-13">
                  {comment.text}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 ml-13">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className="flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${comment.liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                    />
                    <span className={`text-[13px] ${comment.liked ? 'text-red-500' : 'text-gray-500'}`}>
                      {comment.likes}
                    </span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-1.5 text-gray-500 active:scale-95 transition-transform"
                  >
                    <Reply className="w-5 h-5" />
                    <span className="text-[13px]">Trả lời</span>
                  </button>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-3 space-y-3">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-white/20 backdrop-blur-xl rounded-[20px] p-4 shadow-lg shadow-black/5 border border-white/30"
                    >
                      {/* Author Info */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-full ${reply.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <span className="text-white text-[12px]">{reply.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] text-black">{reply.author}</div>
                          <div className="text-[12px] text-gray-500">{reply.timestamp}</div>
                        </div>
                      </div>

                      {/* Reply Text */}
                      <p className="text-[14px] text-gray-800 mb-2 ml-11">
                        {reply.text}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-4 ml-11">
                        <button
                          onClick={() => toggleLike(reply.id, true, comment.id)}
                          className="flex items-center gap-1.5 active:scale-95 transition-transform"
                        >
                          <Heart
                            className={`w-4 h-4 ${reply.liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                          />
                          <span className={`text-[12px] ${reply.liked ? 'text-red-500' : 'text-gray-500'}`}>
                            {reply.likes}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white/70 backdrop-blur-2xl border-t border-gray-200/50 px-4 py-3">
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2">
              <Reply className="w-4 h-4 text-[#007AFF]" />
              <span className="text-[13px] text-gray-600">Đang trả lời...</span>
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-auto text-[13px] text-[#007AFF]"
              >
                Huỷ
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendComment()}
              className="flex-1 bg-gray-100/50 rounded-full px-4 py-2 text-[15px] text-black placeholder:text-gray-400 outline-none"
            />
            <button
              onClick={sendComment}
              disabled={!newComment.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                newComment.trim()
                  ? 'bg-[#007AFF] text-white active:scale-95'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
