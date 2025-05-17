export const copyDjProject = async (project: unknown) => {
  await navigator.clipboard.writeText(JSON.stringify(project, null, 2));
};
