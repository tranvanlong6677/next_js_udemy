import { ProfileTrackElement } from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Profile has list track you uploaded",
};

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const fetchDataListTracksByUser = async () => {
    const listTracksByUser = await sendRequest<
      IBackendRes<IModelPaginate<ITrackTop>>
    >({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
      method: "POST",
      body: {
        id: params?.id,
      },
    });
    if (listTracksByUser.data) {
      return listTracksByUser.data.result;
    } else {
      return null;
    }
  };

  const listTracks = await fetchDataListTracksByUser();

  return (
    <Container sx={{ marginTop: 6 }}>
      <Grid container spacing={2}>
        {listTracks?.map((track) => (
          <Grid item xs={6} key={`track-${track._id}`}>
            <ProfileTrackElement data={track} />
          </Grid>
        )) || <>No items</>}
      </Grid>
    </Container>
  );
};

export default ProfilePage;
