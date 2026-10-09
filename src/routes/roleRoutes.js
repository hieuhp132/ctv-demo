const adminRoutes = {
  profile: "/admin/profile",
  jobs: "/admin/jobs",
  jobDetail: "/admin/job/:id",
  statistics: "/admin/statistics",
  candidates: "/admin/candidates",
  savedJobs: "/admin/saved-jobs",
  myBrand: "/admin/my-brand",
  users: "/admin/users",
  notification: "/admin/notifications",
};

export const ROLE_ROUTES = {
  admin: adminRoutes,
  lower_admin: adminRoutes,

  recruiter: {
    dashboard: "/recruiter/dashboard",
    profile: "/recruiter/profile",
    jobs: "/recruiter/jobs",
    jobDetail: "/recruiter/job/:id",
    savedJobs: "/recruiter/saved-jobs",
    candidates: "/recruiter/candidates",
    notification: "/recruiter/notifications",
  },
};

export const ROLE_NAV_ITEMS = {
  admin: [
    { label: "Dashboard", path: ROLE_ROUTES.admin.jobs },
    { label: "Statistics", path: ROLE_ROUTES.admin.statistics },
    { label: "Candidate Management", path: ROLE_ROUTES.admin.candidates },
    { label: "Saved Jobs", path: ROLE_ROUTES.admin.savedJobs },
    { label: "User Management", path: ROLE_ROUTES.admin.users },
  ],
  lower_admin: [
    { label: "Dashboard", path: adminRoutes.jobs },
    { label: "Statistics", path: adminRoutes.statistics },
    { label: "Candidate Management", path: adminRoutes.candidates },
    { label: "Saved Jobs", path: adminRoutes.savedJobs },
    { label: "User Management", path: adminRoutes.users },
  ],
  recruiter: [
    { label: "Dashboard", path: ROLE_ROUTES.recruiter.dashboard },
    { label: "Jobs", path: ROLE_ROUTES.recruiter.jobs },
    { label: "My Candidates", path: ROLE_ROUTES.recruiter.candidates },
    { label: "Saved Jobs", path: ROLE_ROUTES.recruiter.savedJobs },
  ],
};
