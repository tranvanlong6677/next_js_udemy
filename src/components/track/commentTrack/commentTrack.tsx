"use client";
import {
  Alert,
  AlertColor,
  Box,
  Container,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import CommentElement from "./commentElement";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WaveSurfer from "wavesurfer.js";
export interface ICommentsTrack {
  dataComment: ICommentTrack[];
  track: ITrackTop;
  wavesurfer: WaveSurfer | null;
}
const CommentsTrack = (props: ICommentsTrack) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { dataComment, track, wavesurfer } = props;
  const [yourCommentInput, setYourCommentInput] = useState<string>("");
  const [openNotification, setOpenNotification] = useState<boolean>(false);

  const [notificationsType, setNotificationsType] = useState<
    AlertColor | undefined
  >(undefined);
  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotification(false);
  };
  const handleComment = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: {
          content: yourCommentInput,
          track: track._id,
          moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        },
      });

      if (res && res.statusCode === 201) {
        setOpenNotification(true);
        setNotificationsType("success");
        setYourCommentInput("");
        router.refresh();
      }
    } catch (error) {
      setOpenNotification(true);
      setNotificationsType("error");
      setYourCommentInput("");
    }
  };
  return (
    <>
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notificationsType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notificationsType === "success"
            ? "Comment successfully!!!"
            : "Comment failed!!!"}
        </Alert>
      </Snackbar>
      <Container sx={{ marginTop: 4 }}>
        <Box component={"div"} sx={{ marginBottom: 2 }}>
          <TextField
            sx={{ width: "100%" }}
            id="standard-helperText"
            label="Comment"
            variant="standard"
            value={yourCommentInput}
            onChange={(e) => setYourCommentInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleComment();
              }
            }}
          />
        </Box>
        <Grid container>
          <Grid xs={3} item>
            <Box
              component={"div"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                component={"img"}
                src={fetchDefaultImages(track?.uploader?.type)}
                sx={{ width: "200px" }}
              />

              <Box component={"span"}>{track?.uploader?.email}</Box>
              <Box component={"h2"} sx={{ margin: 0 }}>
                Uploader
              </Box>
            </Box>
          </Grid>
          <Grid xs={9} item>
            <Grid container display={"flex"} flexDirection={"column"} gap={4}>
              {dataComment?.map((item: ICommentTrack, index: number) => {
                return (
                  <Grid item key={`item-${index}`}>
                    <CommentElement
                      data={item}
                      track={track}
                      wavesurfer={wavesurfer}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CommentsTrack;
