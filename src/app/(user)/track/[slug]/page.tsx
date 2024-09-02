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
    nextOption: {
      cache: "no-store",
    },
  });
  const fetchDataComment = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `http://localhost:8000/api/v1/tracks/comments`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      queryParams: {
        current: 1,
        pageSize: 10,
        trackId: params.slug,
        sort: "-createdAt",
      },
    });
    return res;
  };

  const fetchTrackLikedByUser = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `http://localhost:8000/api/v1/likes`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      console.log(">>> check liked", res.data.result);
      return res.data.result;
    } catch (error) {
      return null;
    }
  };
  const trackLikedByUser = await fetchTrackLikedByUser();

  const isLikedTrack = trackLikedByUser?.find(
    (item: any) => item._id === params.slug
  );

  const arrComments = await fetchDataComment();

  return (
    <Container>
      <WaveTrack
        dataTrack={res?.data ? res?.data : null}
        comments={arrComments.data.result}
        isLikedTrack={isLikedTrack ? isLikedTrack : false}
      />

      {/* <CommentsTrack
        dataComment={arrComments.data.result}
        track={res?.data as ITrackTop}
      /> */}
    </Container>
  );
};

export default DetailTrackPage;
