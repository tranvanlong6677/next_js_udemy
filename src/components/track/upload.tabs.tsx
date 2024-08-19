"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Step1 from "./steps/step1";
import BasicInformation from "./steps/basicInformation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UploadTabs = () => {
  const [value, setValue] = useState(0);
  const [percentProgress, setPercentProgress] = useState<number>(0);
  const [fileUpload, setFileUpload] = useState<string>(""); //tên file khi upload lên server
  const [fileName, setFileName] = useState<string>(""); //tên file nguyên bản trong máy
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  console.log("render upload tabs");
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        border: "1px solid #ccc",
        margin: 5,
      }}
    >
      <Box
        sx={{
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tracks" disabled={value === 1} />
          <Tab label="Basic Information" disabled={value === 0} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Step1
          setPercentProgress={setPercentProgress}
          setValue={setValue}
          setFileUpload={setFileUpload}
          setFileName={setFileName}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BasicInformation
          percentProgress={percentProgress}
          fileUpload={fileUpload}
          setFileUpload={setFileUpload}
          fileName={fileName}
          setValue={setValue}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default UploadTabs;
