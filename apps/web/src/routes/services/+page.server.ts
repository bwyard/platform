// ============================================================
// Services page server load
// ============================================================

import type { PageServerLoad } from './$types';

export interface ServiceItem {
  title: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    title: 'Technical Strategy & Roadmap',
    description:
      'Translate business goals into a clear, prioritised technical plan. Working with founders and leadership to define what to build, when to build it, and where to invest — so your team ships the right things in the right order.',
  },
  {
    title: 'Architecture Review',
    description:
      "A structured review of your current system: what's working, what's carrying risk, and what needs to change. Delivered as a written assessment with prioritised recommendations your team can act on immediately.",
  },
  {
    title: 'Team Mentorship',
    description:
      'Hands-on support for your engineers — code reviews, pairing sessions, career conversations, and process improvements. Helping teams level up without burning out their senior individual contributors.',
  },
  {
    title: 'Vendor & Tech Selection',
    description:
      'Evaluating a new database, cloud provider, third-party API, or framework? We run the due diligence: technical fit, operational overhead, cost at scale, and vendor risk. You get a clear recommendation with the reasoning behind it.',
  },
  {
    title: 'CTO-as-a-Service Retainer',
    description:
      'Ongoing fractional CTO engagement — typically 8–16 hours per month. Executive presence in leadership meetings, technical due diligence for fundraising, and a consistent senior voice in architectural decisions as your company grows.',
  },
  {
    title: 'Hosting & Managed Infrastructure',
    description:
      'EU-based hosting for small businesses that want a reliable, secure home for their site or app without managing servers themselves. We handle the setup, maintenance, uptime monitoring, and backups — you focus on running your business.',
  },
];

export const load: PageServerLoad = () => {
  return { services };
};
