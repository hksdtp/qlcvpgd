import { useState } from "react";
import UserSelectionHeader from "./components/UserSelectionHeader";
import UserItem from "./components/UserItem";
import UserSelectionBottom from "./components/UserSelectionBottom";
import NewTaskScreen from "./components/NewTaskScreen";
import TaskDetailScreen from "./components/TaskDetailScreen";
import DeleteModal from "./components/DeleteModal";
import SaveModal from "./components/SaveModal";
import ChecklistScreen from "./components/ChecklistScreen";
import CommentScreen from "./components/CommentScreen";

type Screen = 
  | "user-selection"
  | "new-task"
  | "task-detail"
  | "checklist"
  | "comments";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("user-selection");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      initials: "NA",
      avatarColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      selected: false,
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranthibinh@gmail.com",
      initials: "TB",
      avatarColor: "bg-gradient-to-br from-pink-400 to-pink-600",
      selected: false,
    },
    {
      id: 3,
      name: "Lê Hoàng Cường",
      email: "lehoangcuong@gmail.com",
      initials: "LC",
      avatarColor: "bg-gradient-to-br from-purple-400 to-purple-600",
      selected: false,
    },
    {
      id: 4,
      name: "Phạm Minh Đức",
      email: "phamminhduc@gmail.com",
      initials: "PD",
      avatarColor: "bg-gradient-to-br from-green-400 to-green-600",
      selected: false,
    },
  ]);

  const toggleUserSelection = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, selected: !user.selected } : user
    ));
  };

  const hasSelectedUsers = users.some(user => user.selected);

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case "new-task":
        return (
          <NewTaskScreen
            onClose={() => setShowSaveModal(true)}
            onSave={(task) => {
              console.log("Task saved:", task);
              setCurrentScreen("task-detail");
            }}
          />
        );
      case "task-detail":
        return (
          <TaskDetailScreen
            onBack={() => setCurrentScreen("user-selection")}
            onDelete={() => setShowDeleteModal(true)}
            onOpenChecklist={() => setCurrentScreen("checklist")}
            onOpenComments={() => setCurrentScreen("comments")}
          />
        );
      case "checklist":
        return <ChecklistScreen onBack={() => setCurrentScreen("task-detail")} />;
      case "comments":
        return <CommentScreen onBack={() => setCurrentScreen("task-detail")} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto relative overflow-hidden">
            {/* Liquid Glass Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center">
              <div className="w-full">
                {/* User Selection Header */}
                <UserSelectionHeader />

                {/* User List */}
                <div className="pb-8">
                  <div className="bg-white/30 backdrop-blur-xl rounded-[20px] mx-4 overflow-hidden shadow-xl shadow-black/5 border border-white/40 mb-6">
                    {users.map((user) => (
                      <div key={user.id} onClick={() => toggleUserSelection(user.id)}>
                        <UserItem
                          name={user.name}
                          email={user.email}
                          initials={user.initials}
                          avatarColor={user.avatarColor}
                          selected={user.selected}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Confirm Button */}
                  <div onClick={() => hasSelectedUsers && setCurrentScreen("new-task")}>
                    <UserSelectionBottom hasSelected={hasSelectedUsers} />
                  </div>
                </div>

                {/* Quick Nav Buttons for Demo */}
                <div className="px-4 space-y-2 mt-4">
                  <button
                    onClick={() => setCurrentScreen("task-detail")}
                    className="w-full bg-white/30 backdrop-blur-xl rounded-[20px] px-4 py-3 text-[15px] text-black border border-white/40 active:bg-white/40 transition-colors"
                  >
                    Demo: Xem chi tiết công việc
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderScreen()}

      {/* Modals */}
      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            setCurrentScreen("user-selection");
          }}
        />
      )}

      {showSaveModal && (
        <SaveModal
          onCancel={() => setShowSaveModal(false)}
          onSave={() => {
            setShowSaveModal(false);
            setCurrentScreen("task-detail");
          }}
          onDiscard={() => {
            setShowSaveModal(false);
            setCurrentScreen("user-selection");
          }}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-bottom {
          padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        }
        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}
