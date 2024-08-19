"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { Box, Button } from "@mui/material";
import Link from "next/link";

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
            border: "1px solid #ccc",
            height: "200px",
          },
          // img: {
          //   height: "200px",
          // },
        }}
      >
        <h2>{props?.category}</h2>
        <Slider {...settings}>
          {props?.data && props?.data.length > 0 ? (
            props?.data.map((item: ITrackTop, index: number) => {
              return (
                <div className="song-items" key={`item-${index}`}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                    alt=""
                  />
                  <Link
                    href={`/track/${item._id}?audio=${item.trackUrl}`}
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
