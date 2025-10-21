interface UserSelectionBottomProps {
  hasSelected: boolean;
}

export default function UserSelectionBottom({ hasSelected }: UserSelectionBottomProps) {
  return (
    <div className="px-4">
      <div className="flex justify-center">
        <button 
          disabled={!hasSelected}
          className={`px-16 h-12 rounded-xl transition-all ${
            hasSelected 
              ? "bg-[#007AFF] text-white active:scale-98 shadow-lg shadow-blue-500/30 cursor-pointer" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <span className="text-[17px]">Xác nhận</span>
        </button>
      </div>
    </div>
  );
}
