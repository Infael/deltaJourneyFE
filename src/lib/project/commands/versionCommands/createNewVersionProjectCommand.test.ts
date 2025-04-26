import { describe, expect, it, vi } from "vitest";
import { Project } from "../../models/project";
import { createNewVersionProjectCommand } from "./createNewVersionProjectCommand";

describe("createNewVersionProjectCommand", () => {
  it("should add a new version to the project", () => {
    // Mock the crypto.randomUUID function
    const mockUUID = "1234-5678-1234-5678-uuid";
    vi.spyOn(global.crypto, "randomUUID").mockReturnValue(mockUUID);

    const initialProject: Project = {
      id: "project-1",
      title: "Test Project",
      createdTime: "2023-01-01T00:00:00.000Z",
      modifiedTime: "2023-01-01T00:00:00.000Z",
      versions: [],
      applicationVersion: "1.0.0",
      description: "Project description",
    };

    const updatedProject = createNewVersionProjectCommand(initialProject, { name: "New Version", createFrom: "empty" });

    expect(updatedProject.versions).toHaveLength(1);
    expect(updatedProject.versions[0]).toEqual({
      id: mockUUID,
      name: "New Version",
      createdTime: expect.any(String),
      modifiedTime: expect.any(String),
      description: "",
      metrics: [],
      touchpoints: [],
    });
    expect(updatedProject.modifiedTime).not.toBe(initialProject.modifiedTime);

    // Restore the original implementation of crypto.randomUUID
    vi.restoreAllMocks();
  });

  it("should not mutate the original project object", () => {
    const mockUUID = "1234-5678-1234-5678-uuid";
    vi.spyOn(global.crypto, "randomUUID").mockReturnValue(mockUUID);

    const initialProject: Project = {
      id: "project-1",
      title: "Test Project",
      createdTime: "2023-01-01T00:00:00.000Z",
      modifiedTime: "2023-01-01T00:00:00.000Z",
      versions: [],
      applicationVersion: "1.0.0",
      description: "Project description",
    };

    const updatedProject = createNewVersionProjectCommand(initialProject, { name: "New Version", createFrom: "empty" });

    expect(updatedProject).not.toBe(initialProject);
    expect(initialProject.versions).toHaveLength(0);

    vi.restoreAllMocks();
  });

  it("should create a new version from the current layout", () => {
    const mockUUID = "1234-5678-1234-5678-uuid";
    vi.spyOn(global.crypto, "randomUUID").mockReturnValue(mockUUID);

    const initialProject: Project = {
      id: "project-1",
      title: "Test Project",
      createdTime: "2023-01-01T00:00:00.000Z",
      modifiedTime: "2023-01-01T00:00:00.000Z",
      versions: [
        {
          id: "version-1",
          name: "Version 1",
          createdTime: "2023-01-01T00:00:00.000Z",
          modifiedTime: "2023-01-01T00:00:00.000Z",
          description: "",
          metrics: [],
          touchpoints: [],
        },
      ],
      applicationVersion: "1.0.0",
      description: "Project description",
    };

    const updatedProject = createNewVersionProjectCommand(initialProject, {
      name: "New Version",
      createFrom: "lastLayout",
    });

    expect(updatedProject.versions).toHaveLength(2);
    expect(updatedProject.versions[0]).toEqual({
      id: mockUUID,
      name: "New Version",
      createdTime: expect.any(String),
      modifiedTime: expect.any(String),
      description: "",
      metrics: [],
      touchpoints: [],
    });
    expect(updatedProject.modifiedTime).not.toBe(initialProject.modifiedTime);

    vi.restoreAllMocks();
  });
});
