const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPortfolio(profileId: string) {
  const res = await fetch(`${API_URL}/api/v1/portfolio/${profileId}`);
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return res.json();
}

export async function updateProfile(profileId: string, data: object) {
  const res = await fetch(`${API_URL}/api/v1/profiles/${profileId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function createProject(data: object) {
  const res = await fetch(`${API_URL}/api/v1/projects/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function updateProject(projectId: string, data: object) {
  const res = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function deleteProject(projectId: string) {
  const res = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
}

export async function getProjects(profileId: string) {
  const res = await fetch(`${API_URL}/api/v1/projects/profile/${profileId}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}
