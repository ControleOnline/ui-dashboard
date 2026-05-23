export const routes = [
  {
    path: "/report/",
    component: () => import("@controleonline/ui-layout/src/vue/layouts/AdminLayout.vue"),
    children: [
      {
        name: "ReportIndex",
        path: "",
        component: () => import("../pages/ReportPage.vue"),
      },
    ],
  },
];
