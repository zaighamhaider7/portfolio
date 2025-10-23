// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon       from '@mui/icons-material/HomeOutlined';
import SecurityOutlinedIcon   from '@mui/icons-material/SecurityOutlined';

// if you still need the other icons later you can keep importing them here …

// ---------------------------------------------------------------------------
// MENU
// ---------------------------------------------------------------------------

export default {
  items: [
    {
      id: 'navigation',
      title: 'Materially',
      caption: 'Dashboard',
      type: 'group',
      icon: NavigationOutlinedIcon,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: HomeOutlinedIcon,
          url: '/dashboard/default'
        },

        {
          id: 'content',
          title: 'Content',
          type: 'collapse',
          icon: SecurityOutlinedIcon,
          children: [
            // ───────── Case Studies ─────────
            {
              id: 'case-studies',
              title: 'Case Studies',
              type: 'collapse',
              children: [
                {
                  id: 'case-studies-view',
                  title: 'View Case Studies',
                  type: 'item',
                  url: '/Portfolio/Content/CaseyStudies-View',
                  target: true
                },
                {
                  id: 'case-studies-upload',
                  title: 'Upload Case Studies',
                  type: 'item',
                  url: '/Portfolio/Content/CaseyStudies',
                  target: true
                }
              ]
            },


  {
              id: 'website',
              title: 'Website',
              type: 'collapse',
              children: [
                {
                  id: 'website-view',
                  title: 'Website',
                  type: 'item',
                  url: '/Portfolio/Content/website-view',
                  target: true
                },
                {
                  id: 'case-studies-upload',
                  title: 'Upload Website Design',
                  type: 'item',
                  url: '/Portfolio/Content/website',
                  target: true
                }
              ]
            },




            // ───────── Mobile Development (NEW collapse, now mirrors Case Studies) ─────────
            {
              id: 'mobile-development',
              title: 'Mobile Development',
              type: 'collapse',
              children: [
                {
                  id: 'mobile-development-view',
                  title: 'View Mobile Development',
                  type: 'item',
                  url: '/Portfolio/Content/mobile-development-view',
                  target: true
                },
                {
                  id: 'mobile-development-upload',
                  title: 'Upload Mobile Development',
                  type: 'item',
                  url: '/Portfolio/Content/mobile-development',
                  target: true
                }
              ]
            },
            {
              id: 'mobile-development',
              title: 'SD Case Studies',
              type: 'collapse',
              children: [
                {
                  id: 'case-view',
                  title: 'View SD Case Studies',
                  type: 'item',
                  url: '/Portfolio/Content/sd-view',
                  target: true
                },
                {
                  id: 'uploa-upload',
                  title: 'Upload Case Studies',
                  type: 'item',
                  url: '/Portfolio/Content/sd-upload',
                  target: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
