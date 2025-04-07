export const startFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  }
};

export const exitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};
