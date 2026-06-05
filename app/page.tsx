"use client";
import { useEffect, useState } from "react";
import { getPortfolio } from "@/lib/api";

const PROFILE_ID = process.env.NEXT_PUBLIC_PROFILE_ID!;

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolio(PROFILE_ID)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading portfolio...</p>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-red-400">Error: {error}</p>
    </main>
  );

  const { profile, projects } = data;

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <p className="text-blue-400 text-sm font-mono mb-3">
          {profile.role || "AI Systems Engineer • Backend Developer"}
        </p>
        <h1 className="text-5xl font-bold mb-4">{profile.full_name}</h1>
        <p className="text-gray-300 text-xl mb-6 max-w-2xl">
          {profile.tagline || profile.summary}
        </p>
        {profile.open_to?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {profile.open_to.map((item: string) => (
              <span key={item} className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank"
              className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
              GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank"
              className="border border-gray-600 px-5 py-2 rounded-lg hover:border-gray-400 transition">
              LinkedIn
            </a>
          )}
        </div>
      </section>

      {projects?.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-10 text-gray-100">Featured Projects</h2>
          <div className="space-y-12">
            {projects.map((project: any) => (
              <div key={project.id} className="border border-gray-800 rounded-xl p-8 hover:border-gray-600 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    {project.tagline && (
                      <p className="text-blue-400 text-sm mt-1">{project.tagline}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank"
                        className="text-gray-400 hover:text-white text-sm transition">
                        GitHub →
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank"
                        className="text-gray-400 hover:text-white text-sm transition">
                        Live →
                      </a>
                    )}
                  </div>
                </div>
                {project.problem && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Problem</p>
                    <p className="text-gray-300">{project.problem}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Solution</p>
                    <p className="text-gray-300">{project.solution}</p>
                  </div>
                )}
                {project.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tech_stack.map((tech: string) => (
                      <span key={tech} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.skills?.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-gray-100">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill: string) => (
              <span key={skill} className="bg-gray-900 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Contact</h2>
        <p className="text-gray-400 mb-4">{profile.email}</p>
        {profile.location && (
          <p className="text-gray-500 text-sm">{profile.location}</p>
        )}
      </section>

    </main>
  );
}
