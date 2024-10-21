import { useQuery, useMutation } from "@tanstack/react-query";
import {
  addProject,
  deleteProject,
  editProject,
  getAllProjectsByClientId,
  getProjectById,
} from "../../../api/project_requests";
import { ProjectType, UpdateProjectDataType } from "../../../types/types";
import { queryClient } from "../../..";

export const useFetchAllProjectsByClientId = (clientId: string | undefined) => {
  return useQuery(
    ["projects", clientId],
    () => (clientId ? getAllProjectsByClientId(clientId) : null),
    {
      enabled: !!clientId,
    }
  );
};

export const useFetchProjectByProjectId = (projectId: string) => {
  return useQuery(["project", projectId], () => getProjectById(projectId));
};

export const useAddNewProject = () => {
  const AddProjectMutationHandler = useMutation((projectData: ProjectType) =>
    addProject(projectData)
  );
  return AddProjectMutationHandler;
};

export const useUpdateProject = (
  projectId: string | undefined,
  clientId: string | undefined
) => {
  const UpdateProjectMutationHandler = useMutation(
    (variables: {
      projectId: string;
      updatedProjectData: UpdateProjectDataType;
    }) => editProject(variables.projectId, variables.updatedProjectData),
    {
      onSuccess: () => {
        if (clientId) {
          queryClient.invalidateQueries(["projects", clientId]);
        }
        if (projectId) {
          queryClient.invalidateQueries(["project", projectId]);
        }
      },
    }
  );
  return UpdateProjectMutationHandler;
};

export const useDeleteProject = (clientId: string | undefined) => {
  const DeleteProjectMutationHandler = useMutation(
    (projectId: string) => deleteProject(projectId),
    {
      onSuccess: (data) => {
        console.log("after delete in query-", data);
        if (clientId) {
          queryClient.invalidateQueries(["projects", clientId]);
        }
      },
    }
  );
  return DeleteProjectMutationHandler;
};
