"use client";

import { fetchDefaultImages } from "@/utils/api";
import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import WaveSurfer from "wavesurfer.js";
dayjs.extend(relativeTime);
interface IProps {
  data: ICommentTrack;
  track: ITrackTop;
  wavesurfer: WaveSurfer | null;
}
const CommentElement = (props: IProps) => {
  const { data, track, wavesurfer } = props;
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const handleSeekToTime = (commentTime: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(commentTime / duration);
      wavesurfer.play();
    }
  };
  return (
    <>
      <Grid container>
        <Grid item xs={9} display={"flex"} gap={1}>
          <Box
            component={"img"}
            src={fetchDefaultImages(data.user.type)}
            sx={{ width: "40px", marginTop: "4px" }}
          />
          <Box component={"div"} display={"flex"} flexDirection={"column"}>
            <Box component={"span"} sx={{ fontSize: "12px" }}>
              {data.user.email} at
              <Box
                component={"span"}
                onClick={() => {
                  handleSeekToTime(data.moment);
                }}
                sx={{
                  cursor: "pointer",
                  ":hover": {
                    fontWeight: 700,
                    textDecoration: "underline",
                  },
                }}
              >
                {"  "}
                <b>{formatTime(data.moment)}</b>
              </Box>
            </Box>

            <Box component={"span"} sx={{ fontWeight: 500, fontSize: "16px" }}>
              {data?.content}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={3} sx={{ fontWeight: 100, fontSize: "14px" }}>
          {dayjs(data?.createdAt).fromNow()}
        </Grid>
      </Grid>
    </>
  );
};

export default CommentElement;
