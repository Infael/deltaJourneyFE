import { exitFullscreen, startFullscreen } from "@/lib/fullscreenUtils";
import { viewAtom } from "@/state/viewAtom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const useViewControl = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const [view, setViewAtom] = useAtom(viewAtom);

  const toggleHud = () => {
    setViewAtom((prev) => ({
      ...prev,
      showedHud: !prev.showedHud,
    }));
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      setFullscreen(true);
      startFullscreen();
    } else {
      setFullscreen(false);
      exitFullscreen();
    }
  };

  const togglePresentationMode = () => {
    if (!fullscreen || view.showedHud) {
      setFullscreen(true);
      startFullscreen();
      setViewAtom((prev) => ({
        ...prev,
        showedHud: false,
        presentationMode: true,
      }));
    } else {
      setFullscreen(false);
      exitFullscreen();
      setViewAtom((prev) => ({
        ...prev,
        showedHud: true,
        presentationMode: false,
      }));
    }
  };

  // handle closing presentation mode when exiting fullscreen (by pressing ESC for example)
  useEffect(() => {
    const handleFullscreenClose = () => {
      if (!document.fullscreenElement) {
        setFullscreen(false);
        setViewAtom((prev) => ({
          ...prev,
          showedHud: true,
          presentationMode: false,
        }));
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenClose);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenClose);
    };
  }, []);

  return {
    toggleHud,
    toggleFullscreen,
    togglePresentationMode,
    fullscreen,
    view,
  };
};
