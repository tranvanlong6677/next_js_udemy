"use client";

import { useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useWavesurfer } from "@/utils/customHook";

const WaveTrack = () => {
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);

  const optionsMemo = useMemo(() => {
    return {
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      url: `/api?audio=${fileName}`,
    };
  }, []);

  // const options = {
  //   waveColor: "rgb(200, 0, 200)",
  //   progressColor: "rgb(100, 0, 100)",
  //   url: `/api?audio=${fileName}`,
  // };

  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  // useEffect(() => {
  //     if (containerRef.current) {
  //         const wavesurfer = WaveSurfer.create({
  //             container: containerRef.current,
  //             waveColor: 'rgb(200, 0, 200)',
  //             progressColor: 'rgb(100, 0, 100)',
  //             url: `/api?audio=${fileName}`,
  //         })

  //         return () => {
  //             wavesurfer.destroy()
  //         }
  //     }
  // }, [])

  return <div ref={containerRef}>wave track</div>;
};

export default WaveTrack;
