"use client";

import {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWavesurfer } from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import "./wave.scss";
import { Box, Button, Chip, Tooltip } from "@mui/material";
import { TrackContext } from "@/app/lib/context/track.context";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import CommentsTrack from "./commentTrack/commentTrack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSession } from "next-auth/react";

export interface IProps {
  dataTrack: ITrackTop | null;
  comments: any;
  isLikedTrack: boolean;
}
const WaveTrack = (props: IProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { dataTrack, comments, isLikedTrack } = props;
  const { trackCurrent, setTrackCurrent } =
    useContext<ITrackContext>(TrackContext);
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");

  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const firstViewRef = useRef(true);

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
    const duration = wavesurfer?.getDuration() ?? 0;
    return (moment / duration) * 100;
  };

  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  const handleLikedOrDisliked = async (quantity: number) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `http://localhost:8000/api/v1/likes`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: {
        track: dataTrack?._id,
        quantity: quantity,
      },
    });
    console.log(">>> check liked", res);
    return res;
  };
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
  const handleClickLike = async (quantity: number) => {
    await handleLikedOrDisliked(quantity);
    router.refresh();
  };
  const handleIncreaseView = async () => {
    try {
      await sendRequest<IBackendRes<any>>({
        url: `http://localhost:8000/api/v1/tracks/increase-view`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: {
          trackId: dataTrack?._id,
        },
      });

      router.refresh();
    } catch (error) {
      return null;
    }
  };
  return (
    <>
      <Box className="wave-track-container">
        <Box sx={{ display: "flex", padding: "50px 500px 100px 30px" }}>
          <Button
            onClick={() => {
              onPlayPause();
              if (firstViewRef && firstViewRef.current) {
                handleIncreaseView();
                firstViewRef.current = false;
              }
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
            height: "100%",
            top: "0",
            right: "30px",
            display: "flex",
            alignItems: "center",
            // top: "20px",
            // right: "20px",
          }}
        >
          <img
            style={{
              width: "250px",
            }}
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${dataTrack?.imgUrl}`}
            alt=""
          />
        </div>
        <div
          ref={containerRef}
          className="wave-form-container"
          style={{ width: "70%", marginLeft: "10px" }}
        >
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
            {comments?.map((item: any, index: number) => {
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
                    src={fetchDefaultImages(item.user.type)}
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
      <Box
        component={"div"}
        display={"flex"}
        justifyContent={"space-between"}
        sx={{ marginTop: 4 }}
      >
        <Chip
          icon={<FavoriteIcon sx={isLikedTrack ? { fill: "red" } : {}} />}
          label="Like"
          onClick={() => {
            const quantity = isLikedTrack ? -1 : 1;
            handleClickLike(quantity);
          }}
          sx={isLikedTrack ? { color: "red" } : {}}
        />

        <Box component={"div"} display={"flex"} gap={3}>
          <Box component={"div"} display={"flex"} gap={"3px"}>
            <PlayArrowIcon />
            <Box component={"span"}>{dataTrack?.countPlay}</Box>
          </Box>
          <Box component={"div"} display={"flex"} gap={"3px"}>
            <FavoriteIcon sx={isLikedTrack ? { color: "red" } : {}} />
            <Box component={"span"}>{dataTrack?.countLike}</Box>
          </Box>
        </Box>
      </Box>
      <CommentsTrack
        dataComment={comments}
        track={dataTrack as ITrackTop}
        wavesurfer={wavesurfer}
      />
    </>
  );
};

export default WaveTrack;
