"use client";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";

import { TrackContext } from "@/app/lib/context/track.context";
import { useContext, useEffect } from "react";

export const ProfileTrackElement = (props: { data: ITrackTop }) => {
  const { trackCurrent, setTrackCurrent } =
    useContext<ITrackContext>(TrackContext);
  const { data } = props;
  console.log(">>> check data", data);
  const theme = useTheme();

  return (
    <>
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "200px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {data?.title?.toUpperCase()}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {data?.description}
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton aria-label="previous">
              {theme.direction === "rtl" ? (
                <SkipNextIcon />
              ) : (
                <SkipPreviousIcon />
              )}
            </IconButton>
            <IconButton
              aria-label="play/pause"
              onClick={() => {
                if (
                  trackCurrent &&
                  trackCurrent.isPlaying === true &&
                  trackCurrent._id === data._id
                ) {
                  setTrackCurrent({ ...trackCurrent, isPlaying: false });
                  return;
                }
                setTrackCurrent({ ...data, isPlaying: true });
              }}
            >
              {trackCurrent?.isPlaying && trackCurrent?._id === data?._id ? (
                <PauseIcon sx={{ height: 38, width: 38 }} />
              ) : (
                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
              )}
            </IconButton>
            <IconButton aria-label="next">
              {theme.direction === "rtl" ? (
                <SkipPreviousIcon />
              ) : (
                <SkipNextIcon />
              )}
            </IconButton>
          </Box>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 200 }}
          image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.imgUrl}`}
          alt="Live from space album cover"
        />
      </Card>
    </>
  );
};
