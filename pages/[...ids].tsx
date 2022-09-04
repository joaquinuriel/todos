import { Main } from "@components";
import { Text } from "@nextui-org/react";
import prisma from "@prisma";
import { Project, Task } from "@prisma/client";

interface nestedTask extends Task {
  children: nestedTask[];
}

interface Props {
  project: Project & { tasks: nestedTask[] };
}

const reducer = (
  progress: number,
  task: nestedTask,
  _i: number,
  { length }: nestedTask[]
): number => {
  if (task.done) return progress + 100 / length;
  if (task.children) {
    return progress + task.children.reduce(reducer, 0) / length;
  }
  return progress;
};

export default function Page({ project }: Props) {
  const progress = project.tasks ? project.tasks.reduce(reducer, 0) : 0

  return (
    <Main>
      <Text h1>{project.name}</Text>
      <Text h2>{progress}%</Text>
      {project.tasks.map((task) => (
        <Text key={task.id}>{task.title}</Text>
      ))}
    </Main>
  );
}

export async function getStaticProps({ params }) {
  const { ids } = params;
  const [uid, pid] = ids as [string, string];
  const project = await prisma.project.findUnique({
    where: { id: pid },
    include: { tasks: { include: { children: true } } },
  });

  const { createdAt, updatedAt } = project;

  return {
    props: {
      project: {
        ...project,
        createdAt: new Date(createdAt).toLocaleDateString(),
        updatedAt: new Date(updatedAt).toLocaleDateString(),
      }
    },
    revalidate: 60 * 60 * 24 * 7,
  };
}

export async function getStaticPaths() {
  const projects = await prisma.project.findMany({
    include: { users: true },
  });
  const paths = projects.reduce((prev, project) => {
    const uids = project.users.map((u) => u.id);
    return [
      ...prev,
      ...uids.map((uid) => ({ params: { ids: [uid, project.id] } })),
    ];
  }, [] as any[]);
  return { paths, fallback: "blocking" };
}
