import "react-h5-audio-player/lib/styles.css";
import { AppBar, Box, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import { useHasMounted } from "@/utils/customHook";
import { useContext, useEffect, useRef } from "react";
import { TrackContext } from "@/app/lib/context/track.context";
const FooterPlays = () => {
  const { trackCurrent, setTrackCurrent } =
    useContext<ITrackContext>(TrackContext);
  const playerFooterRef = useRef<any>(null);
  useEffect(() => {
    if (trackCurrent?.isPlaying) {
      playerFooterRef?.current?.audio?.current?.play();
    } else {
      playerFooterRef?.current?.audio?.current?.pause();
    }
  }, [trackCurrent]);

  const hasMounted = useHasMounted();
  if (!hasMounted) {
    return <></>;
  }

  return (
    <Box
      sx={{
        ".rhap_main": {},
        ".rhap_progress-section": {
          display: "flex",
        },
        ".rhap_controls-section": {
          display: "flex",
        },
      }}
    >
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "#f2f2f2",
        }}
      >
        <Container
          sx={{
            display: "flex",
            gap: "40px",
            alignItems: "center",
            ".rhap_main": {
              gap: "40px",
            },
            ".information_track_footer": {
              minWidth: "200px",
            },
          }}
        >
          <AudioPlayer
            ref={playerFooterRef}
            autoPlay
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${trackCurrent?.trackUrl}`}
            volumeJumpStep={10}
            volume={0.5}
            loop={true}
            style={{ boxShadow: "unset", backgroundColor: "#f2f2f2" }}
            layout={"horizontal-reverse"}
            onPause={() => {
              if (trackCurrent) {
                setTrackCurrent({ ...trackCurrent, isPlaying: false });
              }
            }}
            onPlay={() => {
              if (trackCurrent) {
                setTrackCurrent({ ...trackCurrent, isPlaying: true });
              }
            }}

            // other props here
          />

          <div
            style={{
              color: "black",
            }}
            className="information_track_footer"
          >
            <div
              style={{
                color: "#ccc",
              }}
            >
              {trackCurrent?.description}
            </div>
            <div>{trackCurrent?.title}</div>
          </div>
        </Container>
      </AppBar>
    </Box>
  );
};
export default FooterPlays;
