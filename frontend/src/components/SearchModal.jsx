import { useEffect, useRef, useState } from "react";
import { useSearchModalStore } from "../store/searchModal";
import {
  Film,
  BadgeJapaneseYen,
  Gamepad2,
  BookMarked,
  BadgePlus,
  Search,
  ListRestart,
} from "lucide-react";
import { useMediaStore } from "../store/mediaStore";
import { useEditModalStore } from "../store/editStore";
import axios from "axios";
import { Tooltip } from "./ui/Tooltip";

export const SearchModal = () => {
  // Search Modal State Store
  const showSearchModal = useSearchModalStore((state) => state.showSearchModal);
  const setShowSearchModal = useSearchModalStore(
    (state) => state.setShowSearchModal
  );
  const searchModalRef = useRef(null);

  // Media Item State Store
  const setMediaItem = useMediaStore((state) => state.setMediaItem);
  const slotIndexClicked = useMediaStore((state) => state.slotIndexClicked);
  const setSlotIndexClicked = useMediaStore(
    (state) => state.setSlotIndexClicked
  );

  // Edit Modal State Store
  const setShowEditModal = useEditModalStore((state) => state.setShowEditModal);

  // Local states
  const [selectedSuggestion, setSelectedSuggestion] =
    useState("Movie | TV Show | Anime");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Refs
  const searchResultRef = useRef(null);
  const searchBarRef = useRef(null);

  const handleSuggestionClick = (option) => {
    setSelectedSuggestion(option);
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      const response = await axios.get("https://mediumcrawler-backend.vercel.app/api/search", {
        params: { query: searchQuery, type: selectedSuggestion },
      });
      console.log('Search Results:', response.data);
      setSearchResults(Array.isArray(response.data) ? response.data : []);
      scrollToTopSearchResults();
    } catch (error) {
      console.error("Error searching media:", error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (searchQuery.trim() === "") return;

      try {
        const response = await axios.get("https://mediumcrawler-backend.vercel.app/api/search", {
          params: { query: searchQuery, type: selectedSuggestion },
        });
        console.log('Search Results:', response.data);
        setSearchResults(Array.isArray(response.data) ? response.data : []);
        scrollToTopSearchResults();
      } catch (error) {
        console.error("Error searching media:", error);
      }
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedSuggestion("Movie | TV Show | Anime");
  };

  useEffect(() => {
    if (showSearchModal && searchBarRef.current) {
      setTimeout(() => {
        searchBarRef.current.focus();
        setSelectedSuggestion("Movie | TV Show | Anime");
      }, 50);
    }
  }, [showSearchModal]);

  const scrollToTopSearchResults = () => {
    searchResultRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMediaSelect = (media) => {
    setMediaItem(slotIndexClicked, {
      title: media.title,
      imageUrl: `https://mediumcrawler-backend.vercel.app/proxy?url=${encodeURIComponent(media.imageUrl)}`,
      releaseDate: media.releaseDate,
    });
    setShowSearchModal(false);
    resetSearch();
  };

  return (
    <>
      {showSearchModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            setShowSearchModal(false);
            resetSearch();
          }}
        ></div>
      )}
      <div
        ref={searchModalRef}
        className={`fixed top-80 left-1/2 transform -translate-x-1/2 w-[800px] flex-col justify-center z-50 transition-opacity duration-300 shadow-md md:min-w-[450px] bg-white rounded-xl font-heading ${showSearchModal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          } `}
      >
        <div className="relative rounded-xl flex justify-between items-center">
          <input
            ref={searchBarRef}
            type="text"
            className="w-full px-4 py-3 text-base outline-none border-b border-r rounded-xl"
            placeholder="Type in the title of media to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Tooltip text="Reset Search">
            <button
              className="p-3 m-1 rounded-xl hover:bg-[#B1FA63] duration-200 border-b border-r border-l"
              onClick={resetSearch}
            >
              <ListRestart className="w-6 h-6" />
            </button>
          </Tooltip>
          <Tooltip text="Search">
            <button
              className="p-3 mr-1 rounded-2xl hover:bg-[#B1FA63] duration-200 border-b border-r border-l"
              onClick={handleSearch}
            >
              <Search className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>
        <div ref={searchResultRef} className="max-h-[350px] overflow-y-auto">
          {searchResults.map((media) => (
            <div
              key={media.id}
              className="flex items-center p-2 cursor-pointer hover:bg-[#B1FA63] hover:bg-opacity-50"
              onClick={() => handleMediaSelect(media)}
            >
              <img
                src={media.imageUrl}
                alt={media.title}
                className="w-12 h-16 mr-4"
              />
              <div>
                <div className="font-bold">{media.title}</div>
                <div className="text-sm text-gray-500">{media.releaseDate}</div>
              </div>
            </div>
          ))}
          <div className="p-2">
            <div className="px-2 pb-1.5 text-xs font-semibold text-gray-600">
              Choose a type of media
            </div>
            <div className="space-y-1">
              <div
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${selectedSuggestion === "Movie | TV Show | Anime"
                    ? "bg-[#B1FA63]"
                    : "hover:bg-[#B1FA63] hover:bg-opacity-50"
                  }`}
                onClick={() => handleSuggestionClick("Movie | TV Show | Anime")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSuggestionClick("Movie | TV Show | Anime");
                  }
                }}
              >
                <Film className="mr-2 h-4 w-4" />
                <span className="mb-1">Movie | TV Show | Anime</span>
              </div>
              <div
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${selectedSuggestion === "Manga"
                    ? "bg-[#B1FA63]"
                    : "hover:bg-[#B1FA63] hover:bg-opacity-50"
                  }`}
                onClick={() => handleSuggestionClick("Manga")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSuggestionClick("Manga");
                  }
                }}
              >
                <BadgeJapaneseYen className="mr-2 h-4 w-4" />
                <span className="mb-1">Manga</span>
              </div>
              <div
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${selectedSuggestion === "Video Game"
                    ? "bg-[#B1FA63]"
                    : "hover:bg-[#B1FA63] hover:bg-opacity-50"
                  }`}
                onClick={() => handleSuggestionClick("Video Game")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSuggestionClick("Video Game");
                  }
                }}
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                <span className="mb-1">Video Game</span>
              </div>
              <div
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${selectedSuggestion === "Book"
                    ? "bg-[#B1FA63]"
                    : "hover:bg-[#B1FA63] hover:bg-opacity-50"
                  }`}
                onClick={() => handleSuggestionClick("Book")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSuggestionClick("Book");
                  }
                }}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                <span className="mb-1">Books</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-200 mx-2" />
          <div className="p-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-600">
              Manually add media item
            </div>
            <div className="space-y-1">
              <div
                className="flex items-center p-2 rounded-md cursor-pointer hover:bg-[#B1FA63]"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setMediaItem(slotIndexClicked, {
                    title: "",
                    imageUrl: "",
                    description: "",
                    releaseDate: "",
                  });
                  setShowSearchModal(false);
                  resetSearch();
                  setShowEditModal(true);
                }}
              >
                <BadgePlus className="mr-2 h-4 w-4" />
                <span className="mb-1">Add Media</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};