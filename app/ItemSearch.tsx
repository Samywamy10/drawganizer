"use client";

interface ItemSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const ItemSearch: React.FC<ItemSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search items and drawers"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-3 bg-[#1a1a1a] rounded-xl 
        border border-transparent 
        focus:outline-none 
        focus:ring-2 focus:ring-blue-500/50
        text-white placeholder-gray-500
        transition-all duration-300"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
    </div>
  );
};
