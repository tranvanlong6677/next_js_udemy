import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  console.log(">>> check res server", res);
  return (
    <Container>
      <WaveTrack dataTrack={res?.data ? res?.data : null} />
    </Container>
  );
};

export default DetailTrackPage;
