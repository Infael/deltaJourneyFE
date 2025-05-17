export const pasteDjProject = async () => {
  const text = await navigator.clipboard.readText();

  try {
    const project = JSON.parse(text);
    if (typeof project !== "object" || project === null) {
      throw new Error("Parsed JSON is not an object.");
    }
    return project;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error;
  }
};
