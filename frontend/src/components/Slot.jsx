import { useSearchModalStore } from "../store/searchModal";
import { useMediaStore } from "../store/mediaStore";
import { useEditModalStore } from "../store/editStore";
import { useDrag, useDrop } from "react-dnd";
import { Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ItemType = "SLOT";

export const Slot = ({ index }) => {
  // Search Modal State Store
  const setShowSearchModal = useSearchModalStore((state) => state.setShowSearchModal);

  // Edit Modal State Store
  const setShowEditModal = useEditModalStore((state) => state.setShowEditModal);

  // Media Item State Store
  const slotIndexClicked = useMediaStore((state) => state.slotIndexClicked);
  const setSlotIndexClicked = useMediaStore((state) => state.setSlotIndexClicked);
  const currentMediaList = useMediaStore((state) => state.currentMediaList);
  const swapMediaItems = useMediaStore((state) => state.swapMediaItems);
  const deleteMediaItem = useMediaStore((state) => state.deleteMediaItem);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        swapMediaItems(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative w-[165px] h-[280px] rounded-[30px] flex items-center justify-center text-[#B1FA63] text-9xl font-heading cursor-pointer hover:opacity-100 duration-300 overflow-hidden z-20 ${currentMediaList.items[index].imageUrl !== '' ? "opacity-100 border-transparent" : "opacity-35 border-[#B1FA63] border-2 border-dashed z-0"
        }`}
      style={{
        opacity: isDragging ?? 0.1,
        boxShadow: currentMediaList.items[slotIndexClicked] ? "0 4px 8px rgba(0, 0, 0, 1)" : "none",
      }}
      onClick={() => {
        if (currentMediaList.items[index].imageUrl !== '') {
          setSlotIndexClicked(index);
          setShowEditModal(true);
        } else {
          setSlotIndexClicked(index);
          setShowSearchModal(true);
        }
      }}
    >
      {currentMediaList.items[index].imageUrl !== '' ? (
        <img
          src={currentMediaList.items[index].imageUrl}
          alt="mediaItem"
          className="w-full h-full object-cover z-20"
        />
      ) : (
        <div className="mb-10">+</div>
      )}
      {index >= 10 && (
        <button
          className="absolute top-3 right-3 text-red-500 p-1 rounded-lg bg-stone-500 bg-opacity-0 hover:bg-opacity-50 duration-150"
          onClick={(e) => {
            e.stopPropagation();
            deleteMediaItem(index);
          }}
        >
          <Trash2 className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};