import { SignIn } from "@components";
import { useUser } from "@hooks";
import { Button, Container, Input, Text, useInput } from "@nextui-org/react";
import axios from "axios";
import { signIn as signInWith } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function SignUp() {
  const { user, loading } = useUser();
  console.log("user", user);
  const username = useInput("");
  const password = useInput("");

  const signUp = useCallback(() => {
    if (!user) return;
    (async function () {
      await axios.post("/api/auth/signup", {
        email: user.email,
        username: username.value,
        password: password.value,
      });
      await signInWith("credentials", {
        username: username.value,
        password: password.value,
        callbackUrl: "/",
      });
    })();
  }, [user, username.value, password.value]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <SignIn />;

  return (
    <Container
      fluid
      display="flex"
      direction="column"
      css={{ "&>*+*": { mt: "1rem" } }}>
      <Text h1>Ultimo paso!</Text>
      <Input disabled value={user.email!} />
      <Input
        aria-label="username"
        placeholder="username"
        {...username.bindings}
      />
      <Input.Password
        aria-label="password"
        placeholder="password"
        {...password.bindings}
      />
      <Button onPress={signUp}>Crear cuenta</Button>
    </Container>
  );
}
