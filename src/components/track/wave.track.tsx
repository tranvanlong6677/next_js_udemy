"use client";

import {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { useSearchParams } from "next/navigation";
import { useWavesurfer } from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import "./wave.scss";
import { Box, Button, Tooltip } from "@mui/material";
import { TrackContext } from "@/app/lib/context/track.context";
const arrComments = [
  {
    id: 1,
    avatar: "http://localhost:8000/images/chill1.png",
    moment: 10,
    user: "username 1",
    content: "just a comment1",
  },
  {
    id: 2,
    avatar: "http://localhost:8000/images/chill1.png",
    moment: 30,
    user: "username 2",
    content: "just a comment3",
  },
  {
    id: 3,
    avatar: "http://localhost:8000/images/chill1.png",
    moment: 50,
    user: "username 3",
    content: "just a comment3",
  },
];
export interface IProps {
  dataTrack: ITrackTop | null;
}
const WaveTrack = (props: IProps) => {
  const { dataTrack } = props;
  const { trackCurrent, setTrackCurrent } =
    useContext<ITrackContext>(TrackContext);
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");

  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;
    if (typeof window !== "undefined") {
      // colors
      const canvas = document.createElement("canvas");
      const ctx = document.createElement("canvas").getContext("2d")!;
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }

    return {
      url: `/api?audio=${fileName}`,
      barWidth: 3,
      height: 100,
      cursorWidth: 3,
      waveColor: gradient,
      progressColor: progressGradient,
      cursorColor: "#000",
    };
  }, []);

  const callLeft = (moment: number) => {
    const durationHardCode = 199;
    return (moment / durationHardCode) * 100;
  };

  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  useEffect(() => {
    if (!wavesurfer) return;
    setIsPlaying(false);
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secondsRemainder = Math.round(seconds) % 60;
      const paddedSeconds = `0${secondsRemainder}`.slice(-2);
      return `${minutes}:${paddedSeconds}`;
    };

    const timeEl = timeRef.current!;
    const durationEl = durationRef.current!;

    const hover = hoverRef.current!;
    const waveform = containerRef.current!;
    waveform.addEventListener(
      "pointermove",
      (e) => (hover.style.width = `${e.offsetX}px`)
    );

    const subscriptions = [
      wavesurfer?.on("play", () => {
        setIsPlaying(true);
      }),
      wavesurfer?.on("pause", () => {
        setIsPlaying(false);
      }),
      wavesurfer.on(
        "decode",
        (duration) => (durationEl.textContent = formatTime(duration))
      ),
      wavesurfer.on(
        "timeupdate",
        (currentTime) => (timeEl.textContent = formatTime(currentTime))
      ),
    ];
    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  // neu current track o footer chay thi wavesurfer o trang detail se dung
  useEffect(() => {
    if (wavesurfer && trackCurrent?.isPlaying) {
      wavesurfer.pause();
    }
  }, [trackCurrent]);

  // load trang detail track, neu chua co current track thi se cho track hien tai detail thanh current track
  useEffect(() => {
    if (dataTrack && dataTrack?._id && !trackCurrent?._id) {
      setTrackCurrent({ ...dataTrack, isPlaying: false } as ITrackCurrent);
    }
  }, [dataTrack]);
  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer && wavesurfer.playPause();
      setIsPlaying(wavesurfer.isPlaying());
    }
  }, [wavesurfer]);
  return (
    <Box className="wave-track-container">
      <Box sx={{ display: "flex", padding: "50px 500px 100px 30px" }}>
        <Button
          onClick={() => {
            onPlayPause();
            if (dataTrack && wavesurfer) {
              setTrackCurrent({
                ...trackCurrent,
                isPlaying: false,
              } as ITrackCurrent);
            }
          }}
          className="button-play-pause"
        >
          {isPlaying === true ? <PauseCircleIcon /> : <PlayCircleIcon />}
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
          }}
        >
          <Box
            component={"h1"}
            sx={{
              background: "#000",
              color: "#fff",
              fontSize: "24px",
              margin: 0,
              fontWeight: "100",
              lineHeight: "none",
            }}
          >
            {dataTrack?.title}
          </Box>
          <Box
            component={"h3"}
            sx={{
              background: "#000",
              color: "#fff",
              fontSize: "16px",
              margin: 0,
              alignSelf: "flex-start",
              fontWeight: "100",
              lineHeight: "none",
              paddingBottom: "-6px",
              display: "block",
            }}
          >
            {dataTrack?.description}
          </Box>
        </Box>
      </Box>
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "20px",
        }}
      >
        <img
          style={{
            width: "150px",
            zIndex: -100,
          }}
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${dataTrack?.imgUrl}`}
          alt=""
        />
      </div>
      <div ref={containerRef} className="wave-form-container">
        <div ref={timeRef} className="time"></div>
        <div ref={durationRef} className="duration"></div>
        <div className="hover" ref={hoverRef}></div>
        <div
          className="overlay"
          style={{
            position: "absolute",
            height: "30px",
            width: "100%",
            bottom: "0",
            background: "#ccc",
          }}
        ></div>
        <div className="commments">
          {arrComments?.map((item, index) => {
            return (
              <Tooltip
                title={`${item?.content}`}
                placement="bottom-end"
                arrow
                key={`item-${index}`}
              >
                <img
                  onPointerMove={(e) => {
                    const hover = hoverRef.current!;
                    hover.style.width = `${callLeft(item.moment)}%`;
                  }}
                  key={item.id}
                  src={`http://localhost:8000/images/chill1.png`}
                  style={{
                    width: "20px",
                    height: "20px",
                    position: "absolute",
                    top: "70px",
                    left: `${callLeft(item.moment)}%`,
                    zIndex: "20",
                  }}
                  alt=""
                />
              </Tooltip>
            );
          })}
        </div>
      </div>
    </Box>
  );
};

export default WaveTrack;
