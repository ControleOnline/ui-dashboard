export const routes = [
  {
    path: "/dashboard/",
    component: () => import("@controleonline/ui-layout/src/vue/layouts/AdminLayout.vue"),
    children: [
      {
        name: "DashboardIndex",
        path: "",
        component: () => import("../pages/DashboardPage.vue"),
      },
    ],
  },
];
