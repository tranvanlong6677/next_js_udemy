"use client";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { redirect, useRouter } from "next/navigation";

const AuthSignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [errorUsernameDetail, setErrorUsernameDetail] = useState<string>("");
  const [errorPasswordDetail, setErrorPasswordDetail] = useState<string>("");

  const [notificationsType, setNotificationsType] = useState<
    AlertColor | undefined
  >(undefined);
  const [openNotification, setOpenNotification] = useState<boolean>(false);

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotification(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickLogin = async () => {
    setIsErrorPassword(false);
    setIsErrorUsername(false);
    setErrorPasswordDetail("");
    setErrorUsernameDetail("");
    setNotificationsType(undefined);
    if (!username) {
      setIsErrorUsername(true);
      setErrorUsernameDetail("Username is required");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPasswordDetail("Password is required");
      return;
    }

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (!res?.error) {
      setOpenNotification(true);
      setNotificationsType("success");
      router.push("/");
    } else {
      setOpenNotification(true);
      setNotificationsType("error");
    }
  };

  return (
    <>
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notificationsType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notificationsType === "success"
            ? "Login successfully!!!"
            : "Login failed!!!"}
        </Alert>
      </Snackbar>
      <Grid
        container
        // spacing={4}
        justifyContent={"center"}
        sx={{
          margin: "200px auto 0",
          textAlign: "center",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          //   lg={4}
          sx={{
            padding: "16px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
          justifyContent={"center"}
        >
          <Link
            href="/"
            style={{
              display: "block",
              textAlign: "left",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <ArrowBackIcon />
          </Link>
          <Typography variant="h3">Login</Typography>
          <Grid item xs={12} sx={{ marginBottom: "30px" }}>
            <FormControl sx={{ width: "100%" }} variant="outlined">
              <TextField
                autoFocus
                label="Username"
                variant="standard"
                error={isErrorUsername}
                helperText={errorUsernameDetail}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: "30px" }}>
            <FormControl
              sx={{ width: "100%" }}
              variant="outlined"
              error={isErrorPassword}
              required={true}
            >
              <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{ marginLeft: "-12px" }}
              >
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleClickLogin();
                  }
                }}
                error={isErrorPassword}
                required={true}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText sx={{ margin: "3px 0 0" }}>
                {errorPasswordDetail}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            size="large"
            sx={{ width: "100%" }}
            onClick={() => {
              handleClickLogin();
            }}
          >
            Login
          </Button>
          <Grid item xs={6} sx={{ margin: "40px auto" }}>
            <Divider>Or</Divider>
          </Grid>

          <Grid justifyContent={"center"} display={"flex"}>
            <Grid item>
              <Button
                onClick={() => {
                  signIn("github");
                }}
              >
                <GitHubIcon />
              </Button>
            </Grid>
            <Grid item>
              <Button>
                <GoogleIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthSignIn;
