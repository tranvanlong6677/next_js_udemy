"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";

// Initiate Context
export const TrackContext = createContext<ITrackContext>({
  trackCurrent: null,
  setTrackCurrent: () => undefined,
});
// Provide Context
export const TrackContextProvider = ({ children }: { children: ReactNode }) => {
  const trackCurrentInitial = {
    _id: "",
    title: "",
    description: "",
    category: "",
    imgUrl: "",
    trackUrl: "",
    countLike: 0,
    countPlay: 0,
    uploader: {
      _id: "",
      email: "",
      name: "",
      role: "",
      type: "",
    },
    isDeleted: false,
    createdAt: "",
    updatedAt: "",
    isPlaying: false,
  };

  const [trackCurrent, setTrackCurrent] =
    useState<ITrackCurrent>(trackCurrentInitial);

  return (
    <TrackContext.Provider
      value={
        {
          trackCurrent,
          setTrackCurrent,
        } as ITrackContext
      }
    >
      {children}
    </TrackContext.Provider>
  );
};

// export default useTrackContext = () => useContext(TrackContext);
