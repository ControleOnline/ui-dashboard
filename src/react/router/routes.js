import ReportPage from '../pages/ReportPage';

const reportRoutes = [
  {
    name: 'ReportIndex',
    path: 'report',
    component: ReportPage,
    options: {
      headerShown: true,
      headerBackVisible: true,
      title: 'Relatórios',
      showBottomToolBar: false,
      showCompanyFilter: true,
      companyFilterMode: 'icon',
    },
  },
];

export default reportRoutes;
