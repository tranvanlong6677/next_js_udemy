"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";
import flower from "../../../public/flowers.jpg";

const NextArrow = (props: any) => {
  return (
    <Button
      variant="outlined"
      sx={{
        position: "absolute",
        right: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        minWidth: "30px",
        width: "35px",
        zIndex: 2,
        border: "1px solid #ccc",
        color: "#ccc",
      }}
      onClick={() => {
        props.onClick();
      }}
    >
      {">"}
    </Button>
  );
};

const PrevArrow = (props: any) => {
  return (
    <Button
      variant="outlined"
      sx={{
        position: "absolute",
        left: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        minWidth: "30px",
        width: "35px",
        zIndex: 2,
        border: "1px solid #ccc",
        color: "#ccc",
      }}
      onClick={() => {
        props.onClick();
      }}
    >
      {"<"}
    </Button>
  );
};
const MainSlider = (props: { data: ITrackTop[]; category: string }) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <Box
        sx={{
          margin: "0 50px 200px",
          ".slick-slide": {
            padding: "0 10px",
          },
          img: {
            height: "200px",
          },
        }}
      >
        <h2>{props?.category}</h2>
        <Slider {...settings}>
          {props?.data && props?.data.length > 0 ? (
            props?.data.map((item: ITrackTop, index: number) => {
              return (
                <div className="song-items" key={`item-${index}`}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "200px",
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                      alt="images tracks"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <Link
                    href={`/track/${convertSlugUrl(item.title)}-${
                      item._id
                    }.html?audio=${item.trackUrl}&id=${item._id}`}
                    style={{ color: "unset", textDecoration: "unset" }}
                  >
                    <h4>{item?.title}</h4>
                  </Link>

                  <h5>{item?.description}</h5>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </Slider>
      </Box>
    </>
  );
};

export default MainSlider;
