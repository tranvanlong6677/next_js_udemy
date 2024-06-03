import { RefObject, useEffect, useState } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};

// WaveSurfer hook
export const useWavesurfer = (
  containerRef: RefObject<HTMLDivElement>,
  options: Omit<WaveSurferOptions, "container">
) => {
  const [wavesurfer, setWavesurfer] = useState<any>(null);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    console.log("WaveSurfer", options);
    if (!containerRef.current) {
      return;
    }

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);

  return wavesurfer;
};
