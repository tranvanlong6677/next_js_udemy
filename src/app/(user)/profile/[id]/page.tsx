import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProfileTrackElement } from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { getServerSession } from "next-auth";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  console.log(">>> check params: " + params);
  const fetchDataListTracksByUser = async () => {
    const listTracksByUser = await sendRequest<
      IBackendRes<IModelPaginate<ITrackTop>>
    >({
      url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
      method: "POST",
      body: {
        id: params?.id,
      },
      // headers: {
      //   Authorization: `Bearer ${session?.access_token}`,
      // },
    });
    if (listTracksByUser.data) {
      return listTracksByUser.data.result;
    } else {
      return null;
    }
  };

  const listTracks = await fetchDataListTracksByUser();
  console.log(">>> check list tracks", listTracks);

  return (
    <Container sx={{ marginTop: 6 }}>
      <Grid container spacing={2}>
        {
          listTracks?.map((track) => (
            <Grid item xs={6} key={`track-${track._id}`}>
              <ProfileTrackElement data={track} />
            </Grid>
          )) || <>No items</>

          // <Grid item xs={6}>
          //   <TrackCard />
          // </Grid>
        }
      </Grid>
    </Container>
  );
};

export default ProfilePage;
