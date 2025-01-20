import { useEffect, useRef } from "react";
import { useHelpModalStore } from "../store/helpModalStore";

export const HelpModal = () => {
  const showHelp = useHelpModalStore((state) => state.showHelp);
  const setShowHelp = useHelpModalStore((state) => state.setShowHelp);
  const page = useHelpModalStore((state) => state.page);
  const setPage = useHelpModalStore((state) => state.setPage);
  const modalRef = useRef(null);
  const helpButtonRef = useHelpModalStore((state) => state.helpButtonRef);

  return (
    <>
      {showHelp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-30"
          onClick={() => setShowHelp(false)}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`fixed top-40 w-[840px] h-[614px] bg-[#B1FA63] flex-col rounded-[30px] border-8 border-lime-900 justify-center z-50 transition-opacity duration-300 ${
          showHelp
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } `}
      >
        {page == 1 ? (
          <span className="font-heading text-4xl mt-3 flex justify-center items-center p-7">
            What is medium crawler?
          </span>
        ) : (
          <span className="font-heading text-4xl mt-3 flex justify-center items-center p-7">
            How does medium crawler work?
          </span>
        )}
        {page == 1 ? (
          <div className="flex justify-center gap-5 relative">
            <div className="w-[400px] h-[400px] bg-gray-400 rounded-[30px] flex justify-center items-center font-heading text-white">
              insert gif here
            </div>
            <div className="w-[315px] h-[400px]">
              <span className="font-heading text-[20px]">
                Medium Crawler is a creative tool that allows you to curate and
                display your yearly watchlists in a stunning collage format. Use
                our intuitive platform to add media from popular sources or
                input your own.
                <br />
                <br />
                Discover, showcase, and share your favorite media with friends
                and the community. Whether it's movies, books, TV shows, anime,
                manga, or games, we’ve got you covered!
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-5 relative font-heading">
            <div>
              <p className="text-2xl">
                1. Start a Watchlist
                <br />
                <span className="text-xl">
                  &nbsp;&nbsp;&#8226;&nbsp;&nbsp; Create a watchlist to showcase
                  your favorite media
                </span>
                <br />
                <span className="text-xl">
                  &nbsp;&nbsp;&#8226;&nbsp;&nbsp; Add items by searching from
                  integrated APIs or manually inputting details
                </span>
                <br />
                2. Customize Your Collage
                <br />
                <span className="text-xl">
                  &nbsp;&nbsp;&#8226;&nbsp;&nbsp; Drag, drop, and rearrange
                  items to your liking
                </span>
                <br />
                <span className="text-xl">
                  &nbsp;&nbsp;&#8226;&nbsp;&nbsp; Toggle between ranked and
                  unranked modes for a personalized look
                </span>
                <br />
                3. Save and Share
                <br />
                <span className="text-xl">
                  &nbsp;&nbsp;&#8226;&nbsp;&nbsp; Finalize your watchlist and
                  share it as a beautiful
                </span>
                <br />
                <span className="text-xl">
                  &nbsp;&nbsp;&#8226;&nbsp;&nbsp; Post your creation on social
                  media or send it directly to friends
                </span>
                <br />
              </p>
            </div>
          </div>
        )}
        <div className="w-full flex justify-end items-start absolute bottom-2 right-0">
          <span className="font-heading text-2xl mr-5">
            <span
              className="cursor-pointer text-3xl"
              onClick={() => {
                if (page == 2) {
                  setPage(1);
                }
              }}
            >
              &lt;&nbsp;
            </span>
            <span>{page} / 2</span>
            <span
              className="cursor-pointer text-3xl"
              onClick={() => {
                if (page == 1) {
                  setPage(2);
                }
              }}
            >
              &nbsp;&gt;
            </span>
          </span>
        </div>
      </div>
    </>
  );
};
