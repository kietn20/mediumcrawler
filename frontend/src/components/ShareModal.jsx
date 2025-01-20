import { useState } from "react";
import { useShareModalStore } from "../store/shareModalStore";

export const ShareModal = () => {
  const showShareModal = useShareModalStore((state) => state.showShareModal);
  const setShowShareModal = useShareModalStore((state) => state.setShowShareModal);


  return (
    <>
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-30"
          onClick={() => setShowShareModal(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 w-[50%] m-5 h-[80%] bg-[#f0f1ea] flex flex-col rounded-[30px] border-8 border-lime-900 z-50 transition-opacity duration-300 items-center setShowShareModal p-2 font-heading ${showShareModal
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          } `}
      >
        <span className="text-3xl">Choose a sharing method</span>
        <div className="w-full h-auto flex justify-center my-4">
          <img src="" alt="Collage Screenshot" className="rounded-lg" />
        </div>
        <div className="flex justify-between items-center text-black text-xl gap-5 bottom-10 pt-5">
          <button
            onClick={() => handleShare('clipboard')}
            className="p-3 rounded-lg bg-slate-500 text-white opacity-50 hover:opacity-100 hover:bg-[#8ac847] duration-300"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={() => handleShare('download')}
            className="p-3 rounded-lg bg-slate-500 text-white opacity-50 hover:opacity-100 hover:bg-[#8ac847] duration-300"
          >
            Download
          </button>
          <button
            onClick={() => handleShare('newTab')}
            className="p-3 rounded-lg bg-slate-500 text-white opacity-50 hover:opacity-100 hover:bg-[#8ac847] duration-300"
          >
            Open Image in New Tab
          </button>
        </div>
      </div>
    </>
  );
};