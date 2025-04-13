import { describe, expect, test } from "vitest";
import { Project } from "../../models/project";
import { renameProjectCommand } from "./renameProjectCommand";

describe("renameProjectCommand", () => {
  test("should rename the project and update the modifiedTime", () => {
    const mockProject: Project = {
      id: "1",
      title: "Old Project Name",
      createdTime: "2023-01-01T00:00:00.000Z",
      modifiedTime: "2023-01-01T00:00:00.000Z",
      applicationVersion: "1.0.0",
      description: "Project description",
      versions: [],
    };

    const data = { name: "New Project Name" };

    const result = renameProjectCommand(mockProject, data);

    expect(result.title).toBe("New Project Name");
    expect(result.modifiedTime).not.toBe(mockProject.modifiedTime);
    expect(new Date(result.modifiedTime).getTime()).toBeGreaterThan(new Date(mockProject.modifiedTime).getTime());
    expect(result).toEqual({
      ...mockProject,
      title: "New Project Name",
      modifiedTime: result.modifiedTime,
    });
  });

  test("should not modify the original project object", () => {
    const mockProject: Project = {
      id: "1",
      title: "Old Project Name",
      createdTime: "2023-01-01T00:00:00.000Z",
      modifiedTime: "2023-01-01T00:00:00.000Z",
      applicationVersion: "1.0.0",
      description: "Project description",
      versions: [],
    };

    const data = { name: "New Project Name" };

    const originalProjectCopy = { ...mockProject };

    renameProjectCommand(mockProject, data);

    expect(mockProject).toEqual(originalProjectCopy);
  });
});
