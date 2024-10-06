import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { InputButtonUpload } from "./step1";
import { useEffect, useRef, useState } from "react";
import ProgressBar from "./progressBar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import Image from "next/image";
interface IProps {
  percentProgress: number;
  fileUpload: string;
  setFileUpload: (value: string) => void;
  fileName: string;
  setValue: (x: number) => void;
}

export interface INewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imgUrl: string;
  category: string;
}

const BasicInformation = (props: IProps) => {
  const toast = useToast();
  const { data: session } = useSession();
  const { percentProgress, setFileUpload, fileUpload, fileName, setValue } =
    props;
  const [info, setInfo] = useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });
  const titleRef = useRef(null);

  const handleUploadImage = async (image: any) => {
    const formData = new FormData();
    formData.append("fileUpload", image);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      if (res && res?.data && res?.data?.data && res?.data?.data?.fileName) {
        setInfo({ ...info, imgUrl: res?.data?.data?.fileName });
      }
    } catch (error) {
      console.log(
        "Error uploading audio file: ",
        // @ts-ignore
        error?.response?.data?.message
      );
      // @ts-ignore
      alert(error?.response?.data?.message);
    }
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: FileWithPath[]) =>
      handleUploadImage(acceptedFiles[0]),

    accept: {
      image: ["image/*"],
    },
  });

  const handleSubmitForm = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
      method: "POST",
      body: {
        ...info,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      toast.success(res.message);
      setValue(0);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    setInfo({ ...info, trackUrl: fileUpload });
  }, [fileUpload]);
  return (
    <>
      <Box component={"div"} sx={{ marginBottom: 2 }}>
        <Box component={"p"}>{fileUpload}</Box>
        <ProgressBar percentProgress={percentProgress} />
      </Box>
      <Grid container>
        <Grid item xs={4}>
          <Grid item xs={12} sx={{ marginBottom: 2 }}>
            <Box
              component={"div"}
              sx={{
                width: "100%",
                height: "300px",
                margin: "0 auto",
                backgroundColor: "#ccc",
              }}
            >
              {info && info?.imgUrl && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                  alt="Image user"
                  style={{ width: "100%" }}
                  height={300}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} display={"flex"} justifyContent={"center"}>
            <Box>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <InputButtonUpload type="image" />
              </div>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={8} display={"flex"} justifyContent={"center"}>
          <Grid
            item
            width={"80%"}
            gap={3}
            display={"flex"}
            flexDirection={"column"}
          >
            <FormControl sx={{ width: "100%" }} variant="standard">
              <TextField
                ref={titleRef}
                autoFocus
                label="Title"
                variant="standard"
                // error={isErrorTitle}
                // helperText={errorMessage}
                value={info?.title}
                onChange={(e) => {
                  setInfo({ ...info, title: e.target.value });
                }}
              />
            </FormControl>

            <FormControl sx={{ width: "100%" }} variant="standard">
              <TextField
                label="Description"
                variant="standard"
                value={info?.description}
                onChange={(e) => {
                  setInfo({ ...info, description: e.target.value });
                }}
              />
            </FormControl>

            <FormControl sx={{ width: "100%" }} variant="standard">
              <InputLabel>Category</InputLabel>
              <Select
                variant="standard"
                value={info?.category}
                label="Category"
                onChange={(e) => {
                  setInfo({ ...info, category: e.target.value });
                }}
              >
                <MenuItem value={"CHILL"}>CHILL</MenuItem>
                <MenuItem value={"WORKOUT"}>WORKOUT</MenuItem>
                <MenuItem value={"PARTY"}>PARTY</MenuItem>
              </Select>
            </FormControl>
            <Grid margin={"0 auto"}>
              <Button
                variant="contained"
                sx={{ width: "100px" }}
                onClick={() => handleSubmitForm()}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default BasicInformation;
