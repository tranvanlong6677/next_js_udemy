import AuthSignIn from "@/components/auth/auth.signin";
import { Container } from "@mui/material";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const SignIn = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <Container>
      <AuthSignIn />
    </Container>
  );
};

export default SignIn;
