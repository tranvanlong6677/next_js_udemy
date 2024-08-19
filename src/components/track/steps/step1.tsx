"use client";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./theme.scss";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface IPropsStep1 {
  setPercentProgress: (x: number) => void;
  setValue: (x: number) => void;
  setFileUpload: (x: string) => void;
  setFileName: (x: string) => void;
}
interface IProps {
  type: string;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const InputButtonUpload = (props: IProps) => {
  const { type } = props;
  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onClick={(e) => {
          e.preventDefault();
          // e.stopPropagation();
        }}
      >
        Upload {type}
        <VisuallyHiddenInput type="file" />
      </Button>
    </>
  );
};
const Step1 = (props: IPropsStep1) => {
  const { data: session } = useSession();
  const { setPercentProgress, setValue, setFileUpload, setFileName } = props;

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles && acceptedFiles[0]) {
        const audio = acceptedFiles[0];
        const formData = new FormData();
        formData.append("fileUpload", audio);

        try {
          const res = await axios.post(
            "http://localhost:8000/api/v1/files/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
                delay: 1000,
              },
              onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentage = Math.floor((loaded * 100) / total!);
                setValue(1);
                setPercentProgress(percentage);
              },
            }
          );
          if (
            res &&
            res?.data &&
            res?.data?.data &&
            res?.data?.data?.fileName
          ) {
            setFileUpload(res?.data?.data?.fileName);
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
      }
    },
    [session]
  );
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      audio: ["audio/*"],
    },
  });
  const files = (acceptedFiles as FileWithPath[]).map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // useEffect(() => {
  //   if (filesUpload && filesUpload.name) {
  //     setFileName(filesUpload.name);
  //   }
  // }, [filesUpload]);

  return (
    <>
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <InputButtonUpload type="file" />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    </>
  );
};

export default Step1;
