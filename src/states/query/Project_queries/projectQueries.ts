import { useQuery, useMutation } from "@tanstack/react-query";
import {
  addProject,
  deleteProject,
  editProject,
  getAllProjectsByAdminId,
  getAllProjectsByClientId,
  getProjectById,
} from "../../../api/project_requests";
import { ProjectType, UpdateProjectDataType } from "../../../types/types";
import { queryClient } from "../../..";
import { FileData } from "../../../types/types";

export const useFetchAllProjectsByClientId = (clientId: string | undefined, projectTableforClient: boolean) => {
  return useQuery(
    ["projects", clientId],
    () => (clientId ? getAllProjectsByClientId(clientId) : null),
    {
      enabled: projectTableforClient && !!clientId,
    }
  );
};

export const useFetchProjectByProjectId = (projectId: string) => {
  return useQuery(["project", projectId], () => getProjectById(projectId));
};

export const useAddNewProject = () => {
  const AddProjectMutationHandler = useMutation((formData: FormData) => {
    return addProject(formData); // Ensure `addProject` handles `FormData`
  });

  return AddProjectMutationHandler;
};

export const useUpdateProject = (
  projectId: string | undefined,
  clientId: string | undefined
) => {
  const UpdateProjectMutationHandler = useMutation(
    (variables: {
      projectId: string;
      updatedProjectData: FormData; // Updated to accept FormData
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

export const useFetchAllProjectsByAdminId = (adminId: string | null, projectTableforClient: boolean) => {
  return useQuery(
    ["projects/admin", adminId],
    () => (adminId ? getAllProjectsByAdminId(adminId) : null),
    {
      enabled: !projectTableforClient && !!adminId,
    }
  );
};
