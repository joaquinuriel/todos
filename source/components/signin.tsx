import { Button, Container, Input, Progress, Text, useInput } from "@nextui-org/react";
import { signIn as signInWith } from "next-auth/react";
import { useCallback, useMemo } from "react";

export default function SignIn() {
  const username = useInput("");
  const password = useInput("");

  const validity = useMemo(() => {
    var n = 1;
    if (password.value.length > 7) n++;
    if (/[A-Z]/g.test(password.value)) n++;
    if (/[0-9]/g.test(password.value)) n++;
    return n * 25;
  }, [password.value]);

  const signIn = useCallback(() => {
    signInWith("credentials", {
      username: username.value,
      password: password.value,
    });
  }, [username.value, password.value]);

  const useGithub = useCallback(() => {
    signInWith("github");
  }, []);

  return (
    <Container
      fluid
      display="flex"
      direction="column"
      css={{
        w: "fit-content",
        h: "100vh",
        jc: "center",
        "&>*+*": { mt: "1rem" }
      }}>
      <Text h1>Bienvenido!</Text>
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
      <Progress size="xs" value={validity} color={
        validity < 50 ? "error" : validity < 75 ? "warning" : "success"
      } />
      <Button flat onPress={signIn}>
        Iniciar sesión
      </Button>
      <Button css={{ bg: "$accents9" }} onPress={useGithub}>
        Continuar con GitHub
      </Button>
    </Container>
  );
}
