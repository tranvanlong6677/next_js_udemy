import "react-h5-audio-player/lib/styles.css";
import { AppBar, Box, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import { useHasMounted } from "@/utils/customHook";
const FooterPlays = () => {
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
          }}
        >
          <AudioPlayer
            autoPlay
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
            onPlay={(e) => console.log("onPlay")}
            volumeJumpStep={10}
            volume={0.5}
            loop={true}
            style={{ boxShadow: "unset", backgroundColor: "#f2f2f2" }}
            // other props here
          />

          <div
            style={{
              color: "black",
            }}
          >
            <div
              style={{
                color: "#ccc",
              }}
            >
              Long Tran
            </div>
            <div>Em của ngày hôm qua</div>
          </div>
        </Container>
      </AppBar>
    </Box>
  );
};
export default FooterPlays;
