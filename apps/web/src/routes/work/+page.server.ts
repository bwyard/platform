// ============================================================
// Work page server load
// ============================================================

import type { PageServerLoad } from './$types';

export interface CaseStudy {
  title: string;
  description: string;
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    title: 'SaaS Platform Build',
    description:
      'Led architecture and delivery for a multi-tenant SaaS product from initial scoping through first paying customers. Established CI/CD, defined the data model, hired the first three engineers, and shipped an MVP in under four months.',
    tags: ['Architecture', 'SaaS', 'Team Build', 'Product Strategy'],
  },
  {
    title: 'Legacy Modernisation',
    description:
      'Took a decade-old monolith with no tests and no documentation and produced a phased modernisation plan the business could fund and execute incrementally. Reduced deployment lead time from weeks to hours without a big-bang rewrite.',
    tags: ['Modernisation', 'Technical Debt', 'Migration', 'Risk Reduction'],
  },
  {
    title: 'Engineering Team Scale-Up',
    description:
      'Worked with a founder-led company doubling headcount from four to twelve engineers. Introduced structured onboarding, a lightweight RFC process, and clear ownership boundaries — keeping velocity high through rapid growth.',
    tags: ['Team Scaling', 'Process Design', 'Engineering Culture'],
  },
];

export const load: PageServerLoad = () => {
  return { caseStudies };
};
