import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
    method: "GET",
    nextOption: {
      cache: "no-store",
    },
  });

  return {
    title: product.data?.title,
    description: product.data?.description,
    openGraph: {
      title: `${product.data?.title}`,
      description: "hihihi",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`,
      ],
    },
  };
}

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);

  const idTrack = params.slug.split(".html")[0].split("-")[
    params.slug.split(".html")[0].split("-").length - 1
  ];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${idTrack}`,
    method: "GET",
    nextOption: {
      cache: "no-store",
    },
  });

  const fetchDataComment = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      queryParams: {
        current: 1,
        pageSize: 10,
        trackId: idTrack,
        sort: "-createdAt",
      },
    });
    return res;
  };

  const fetchTrackLikedByUser = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
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
        comments={arrComments.data?.result}
        isLikedTrack={isLikedTrack ? isLikedTrack : false}
      />
    </Container>
  );
};

export default DetailTrackPage;
