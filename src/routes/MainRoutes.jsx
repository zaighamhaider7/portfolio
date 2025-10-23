import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const MobileDev = Loadable(lazy(() => import('views/Dashboard/Content/App-Dev')));
const CaseStudy = Loadable(lazy(() => import('views/Dashboard/Content/CaseStudy')));

const SDCaseStudy = Loadable(lazy(() => import('views/Dashboard/Content/Sd-Upload')));

const SDCaseStudyView = Loadable(lazy(() => import('views/Dashboard/Content/Sd-View')));

const Web = Loadable(lazy(() => import('views/Dashboard/Content/website')));
const WebView = Loadable(lazy(() => import('views/Dashboard/Content/website-view')));

const CaseStudyView = Loadable(lazy(() => import('views/Dashboard/Content/CaseStudy-view')));
const MobileDevView = Loadable(lazy(() => import('views/Dashboard/Content/mobile-developement-view')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },
     {
      path: '/Portfolio/Content/CaseyStudies',
      element: <CaseStudy />
    },
    
     {
      path: '/Portfolio/Content/mobile-development-view',
      element: <MobileDevView />
    },
     {
      path: '/Portfolio/Content/CaseyStudies-view',
      element: <CaseStudyView />
    },
      {
      path: '/Portfolio/Content/sd-upload',
      element: <SDCaseStudy />
    },
      {
      path: '/Portfolio/Content/sd-view',
      element: <SDCaseStudyView />
    },
    
     {
      path: '/Portfolio/Content/website',
      element: <Web />
    }, {
      path: '/Portfolio/Content/website-view',
      element: <WebView />
    }, {
      path: '/Portfolio/Content/mobile-development',
      element: <MobileDev />
    },
    { path: '/utils/util-typography', element: <UtilsTypography /> },
    { path: '/sample-page', element: <SamplePage /> }
  ]
};

export default MainRoutes;
