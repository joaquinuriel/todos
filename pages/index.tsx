import { Main, SignIn } from "@components";
import { fetcher } from "@helpers";
import { useUser } from "@hooks";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Navbar,
  Text,
  useInput,
  useModal,
  User,
} from "@nextui-org/react";
import to from "await-to-js";
import axios from "axios";
import { useCallback, useState } from "react";
import useSWR from "swr";

export default function Home() {
  const { user, loading } = useUser();
  const { data, mutate, error } = useSWR(
    user && "/api/projects?id=" + user.id,
    fetcher
  );
  const [creating, setLoading] = useState(false);
  const modal = useModal();
  const input = useInput("");

  console.table(user);
  console.table(data);

  const newProject = useCallback(() => {
    if (!user) return;
    setLoading(true);
    (async function () {
      const name = input.value;
      const id = user.id;
      const promise = axios.post("/api/projects/create", { name, id });
      const [err, res] = await to(promise);
      if (res) await mutate();
      setLoading(false);
      modal.setVisible(false);
    })();
  }, [user, input.value, mutate, modal]);

  if (loading) return <div />;
  if (!user) return <SignIn />;

  return (
    <>
      <Navbar variant="sticky">
        {/* <Navbar.Brand> */}
        {/* <Navbar.Toggle aria-label="toggle menu" /> */}
        <Text h3 css={{ m: 0 }}>
          Proyectos
        </Text>
        <Avatar src={user.image!} text={user.name! || user.email!} />
        {/* </Navbar.Brand> */}
      </Navbar>
      <Main>
        {data?.projects.map((project: any) => (
          <Text blockquote key={project.id}>
            {project.name}
          </Text>
        ))}

        <Button css={{ w: "100%" }} onPress={() => modal.setVisible(true)}>
          Crear Proyecto
        </Button>

        <Modal {...modal.bindings}>
          <Modal.Header css={{ bg: "$gradient" }}>
            <Text h4 color="white">
              Nuevo Proyecto
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              aria-label="proyecto"
              placeholder="nombre del proyecto"
              {...input.bindings}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat onClick={newProject}>
              {creating ? "Cargando..." : "Crear"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Main>
    </>
  );
}
