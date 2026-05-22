// ============================================================
// Work page — static content, no DB.
// ============================================================

import type { PageServerLoad } from './$types';

export interface ThesisProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'active' | 'paused' | 'shipped';
  tech: string;
}

export interface CommercialProject {
  id: string;
  name: string;
  description: string;
}

export interface WorkPageData {
  thesis: ThesisProject[];
  commercial: CommercialProject[];
}

const THESIS_PROJECTS: ThesisProject[] = [
  {
    id: 'score',
    name: 'Score',
    tagline: 'EDM audio framework',
    description:
      'A framework for building electronic music where a song is a pure function of time. no global store, no mutation — only append and advance. built to prove that temporal assembly is a viable compositional model.',
    status: 'active',
    tech: 'TypeScript / Web Audio API',
  },
  {
    id: 'form',
    name: 'Form',
    tagline: 'SDF generative graphics',
    description:
      'Generative visual output using signed distance fields. visual state is computed, not stored — the renderer describes a scene as a pure function of time and context. pairs with Score for live audio-visual performance.',
    status: 'paused',
    tech: 'TypeScript / WebGL / SDF',
  },
  {
    id: 'prime',
    name: 'Prime',
    tagline: 'Rust/WASM math core',
    description:
      'The computational foundation for the ecosystem. high-performance math primitives compiled to WASM. v1.1 shipped and stable — prime-render and state-threaded DSP are next.',
    status: 'shipped',
    tech: 'Rust / WebAssembly',
  },
  {
    id: 'stage',
    name: 'Stage',
    tagline: 'Game runtime',
    description:
      'A game runtime built on the same thesis primitives as Score and Form. game state as a pure function of time and accumulated events — no mutable global state, no imperative scene graph.',
    status: 'paused',
    tech: 'TypeScript / WebGL',
  },
];

const COMMERCIAL_PROJECTS: CommercialProject[] = [
  {
    id: '8ofwands',
    name: '8 of Wands',
    description:
      'Fractional CTO practice and SaaS platform. i work with early-stage teams who need senior technical leadership without a full-time hire. also building the internal platform that will eventually power client deployments.',
  },
  {
    id: 'client-saas',
    name: 'SaaS product work',
    description:
      'End-to-end product builds for clients: architecture, backend, frontend, DevOps. primarily TypeScript/SvelteKit stacks with Node APIs. EU-hosted, production-grade.',
  },
  {
    id: 'client-eng',
    name: 'Engineering leadership',
    description:
      'Embedded fractional CTO work: technical strategy, team structure, code review, hiring, vendor selection. usually 1-2 days a week with early-stage or scaling startups.',
  },
];

export const load: PageServerLoad = (): WorkPageData => {
  return {
    thesis: THESIS_PROJECTS,
    commercial: COMMERCIAL_PROJECTS,
  };
};
