export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules = {
  'react': 'https://github.com/reactjs/react.dev',
  'react-use': 'https://github.com/streamich/react-use',
  'tailwindcss': 'https://github.com/tailwindlabs/tailwindcss.com',

  'valtio': 'https://github.com/pmndrs/valtio',

  'motion': 'https://github.com/motiondivision/motion',

  'next': 'https://github.com/vercel/next.js',
  'nest': 'https://github.com/nestjs/docs.nestjs.com',

  'vue': 'https://github.com/vuejs/docs',
  'pinia': 'https://github.com/vuejs/pinia',
  'nuxt': 'https://github.com/nuxt/nuxt',
  'vite': 'https://github.com/vitejs/vite',
  'unocss': 'https://github.com/unocss/unocss',

  'pnpm': 'https://github.com/pnpm/pnpm.io',
  'tsdown': 'https://github.com/rolldown/tsdown',
  'vitest': 'https://github.com/vitest-dev/vitest',

  'vitepress': 'https://github.com/vuejs/vitepress',
}

/**
 * Already generated skills, sync with their `skills/` directory
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'slidev': {
    official: true,
    source: 'https://github.com/slidevjs/slidev',
    skills: {
      slidev: 'slidev',
    },
  },

  'vueuse': {
    official: true,
    source: 'https://github.com/vueuse/skills',
    skills: { 'vueuse-functions': 'vueuse-functions' },
  },

  'valtio-define': {
    source: 'https://github.com/hairyf/valtio-define',
    skills: {
      'valtio-define': 'valtio-define',
    },
  },

  'vue-best-practices': {
    source: 'https://github.com/hyf0/vue-skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
    },
  },

  'turborepo': {
    official: true,
    source: 'https://github.com/vercel/turborepo',
    skills: {
      turborepo: 'turborepo',
    },
  },

  'web-design-guidelines': {
    source: 'https://github.com/vercel-labs/agent-skills',
    skills: {
      'web-design-guidelines': 'web-design-guidelines',
    },
  },
}

/**
 * Hand-written skills with Hairyf's preferences/tastes/recommendations
 */
export const manual = [
  'hairy',
  'antfu',
]
