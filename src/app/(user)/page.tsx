import { Container } from "@mui/material";
import MainSlider from "@/components/main/main.slider";
import { sendRequestJS } from "@/utils/old.api";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export default async function HomePage() {
  // const { data: session } = useSession();
  const session = await getServerSession(authOptions);

  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10,
    },
  });

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10,
    },
  });

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10,
    },
  });

  return (
    <>
      <Container>
        <MainSlider
          data={chills && chills?.data ? chills?.data : []}
          category={"chills".toUpperCase()}
        />
        <MainSlider
          data={workouts && workouts?.data ? workouts?.data : []}
          category={"workouts".toUpperCase()}
        />
        <MainSlider
          data={party && party?.data ? party?.data : []}
          category={"party".toUpperCase()}
        />
      </Container>
    </>
  );
}
