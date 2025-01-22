import {
  BadgePlus,
  CaseLower,
  CircleHelp,
  ListFilterPlus,
  ListOrdered,
  PencilLine,
  Share,
} from "lucide-react";
import { Slot } from "./Slot";
import { useEffect, useRef, useState } from "react";
import { useMediaStore } from "../store/mediaStore";
import { useHelpModalStore } from "../store/helpModalStore";
import { HelpModal } from "./HelpModal";
import { SearchModal } from "./SearchModal";
import { EditModal } from "./EditModal";
import { Toaster } from "react-hot-toast";
import { Dock, DockIcon, DockItem, DockLabel } from "./ui/Dock";
import { ShareModal } from "./ShareModal";
import { useShareModalStore } from "../store/shareModalStore";
import { ManageListsModal } from "./ManageListsModal";
import html2canvas from 'html2canvas';
import { Navbar } from "./Navbar";

export const Collage = () => {
  const mediaLists = useMediaStore((state) => state.mediaLists);
  const currentMediaList = useMediaStore((state) => state.currentMediaList);
  const setCurrentMediaList = useMediaStore(
    (state) => state.setCurrentMediaList
  );
  const updateMediaListName = useMediaStore(
    (state) => state.updateMediaListName
  );
  const showHelp = useHelpModalStore((state) => state.showHelp);
  const setShowHelp = useHelpModalStore((state) => state.setShowHelp);
  const [showRanking, setShowRanking] = useState(false);
  const setPage = useHelpModalStore((state) => state.setPage);
  const showManageListsModal = useMediaStore(
    (state) => state.showManageListsModal
  );
  const setShowManageListsModal = useMediaStore(
    (state) => state.setShowManageListsModal
  );
  const [showTitles, setShowTitles] = useState(false)

  const [mediaListTitle, setMediaListTitle] = useState(currentMediaList.name);
  const addMediaItem = useMediaStore((state) => state.addMediaItem);

  useEffect(() => {
    setMediaListTitle(currentMediaList.name);
  }, [currentMediaList]);

  useEffect(() => {
    const index = mediaLists.findIndex(
      (list) => list.name === currentMediaList.name
    );
    if (index !== -1) {
      updateMediaListName(index, mediaListTitle);
      setCurrentMediaList({ ...currentMediaList, name: mediaListTitle });
    }
  }, [mediaListTitle]);

  const dockElements = [
    {
      title: "Instructions",
      icon: (
        <CircleHelp
          onClick={() => {
            setShowHelp(!showHelp);
            setPage(1);
          }}
          className="h-full w-full dark:text-neutral-3001 text-[#8ac847] opacity-30 hover:opacity-100 duration-300"
        />
      ),
      href: "#",
    },
    // {
    //   title: "Toggle Sorting",
    //   icon: (
    //     <ListOrdered
    //       onClick={() => setShowRanking(!showRanking)}
    //       className="h-full w-full dark:text-neutral-3001 text-[#8ac847] opacity-30 hover:opacity-100 duration-300"
    //     />
    //   ),
    //   href: "#",
    // },
    {
      title: "Show Titles",
      icon: (
        <CaseLower
          onClick={() => setShowTitles(!showTitles)}
          className="h-full w-full dark:text-neutral-3001 text-[#8ac847] opacity-30 hover:opacity-100 duration-300"
        />
      ),
      href: "#",
    },
    {
      title: "Add Media",
      icon: (
        <BadgePlus
          onClick={() => addMediaItem()}
          className="h-full w-full dark:text-neutral-3001 text-[#8ac847] opacity-30 hover:opacity-100 duration-300"
        />
      ),
      href: "#",
    },
    {
      title: "Share",
      icon: (
        <Share
          onClick={() => {
            captureAndShare();
          }}
          className="h-full w-full dark:text-neutral-3001 text-[#8ac847] opacity-30 hover:opacity-100 duration-300"
        />
      ),
      href: "#",
    },
    {
      title: "Manage Lists",
      icon: (
        <ListFilterPlus
          onClick={() => setShowManageListsModal(!showManageListsModal)}
          className="h-full w-full dark:text-neutral-3001 text-[#8ac847] opacity-30 hover:opacity-100 duration-300"
        />
      ),
      href: "#",
    },
  ];

  const dockRef = useRef(null);
  const promo = useRef(null);
  const [showTrash, setShowTrash] = useState(true);

  const captureAndShare = async (action) => {
    const element = document.getElementById('collage-screenshot');
    if (element) {
      dockRef.current.style.opacity = 0;
      promo.current.style.opacity = 100;
      setShowTrash(false)
      // Add a slight delay to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 500)).then(() => {
        setTimeout(() => {
          dockRef.current.style.opacity = 30;
          promo.current.style.opacity = 0;
          setShowTrash(true);
        }, 500);
      });
      const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
      const dataUrl = canvas.toDataURL('image/png');
      const newWindow = window.open();
      newWindow.document.write(`<img src="${dataUrl}" alt="Screenshot"/>`);
    }
  };

  return (
    <div id="collage-screenshot" className="relative flex flex-col items-center justify-start w-[70%] min-h-screen bg-[#0A0B06] overflow-visible pt-24">
      <Navbar />
      <div className="absolute font-heading z-50 text-lg">
        <Toaster />
      </div>
      <div className="relative group">
        <PencilLine className="absolute left-0 w-16 h-16 text-gray-400 opacity-0 group-hover:opacity-10 duration-150" />
        <input
          type="text"
          className="font-heading text-3xl text-[#B1FA63] bg-inherit placeholder:text-[#B1FA63] w-[800px] border text-center border-none scale-[1.5]"
          placeholder={currentMediaList.name}
          value={mediaListTitle}
          onClick={() => {
            setMediaListTitle("");
          }}
          onChange={(e) => setMediaListTitle(e.target.value)}
        />
      </div>
      <HelpModal />
      <SearchModal />
      <EditModal />
      <ShareModal />
      <ManageListsModal />
      <div className="w-[80%] h-auto grid grid-cols-5 gap-x-[20px] gap-y-[20px] items-start place-items-center place-content-start py-10">
        {currentMediaList.items.map((mediaItem, index) => (
          <div key={index} className="relative flex flex-col justify-center items-center">
            <div className="relative">
              <Slot index={index} className="relative" showTrash={showTrash}/>
              {showRanking && (
                <div className="absolute text-2xl text-[#444C48] -top-8 -left-8 w-[50px] h-[50px] bg-[#232f16] bg-opacity-100 font-heading text-center rounded-lg flex justify-center items-end z-10">
                  <span className="text-center mb-1">
                    &nbsp;{index + 1}
                  </span>
                </div>
              )}
            </div>
            <span className={`text-sm font-heading text-white my-1 text-center ${showTitles ? 'opacity-100' : 'opacity-0'}`}>{currentMediaList.items[index].title}</span>
          </div>
        ))}
      </div>
      <span ref={promo} className="absolute bottom-5 text-base mt-16 font-heading text-white opacity-0">share your own media collage at <span className="text-[#B1FA63]">mediumcrawler.vercel.app</span></span>
      <div ref={dockRef} className="sticky bottom-0 left-1/2 max-w-full -translate-x-1/2 opacity-30 hover:opacity-100 duration-300 z-50">
        <Dock className="items-end pb-1">
          {dockElements.map((item, idx) => (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 "
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>
    </div>
  );
};