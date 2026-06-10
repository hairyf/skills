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
  'react-router': 'https://github.com/remix-run/react-router',
  'react-use': 'https://github.com/streamich/react-use',

  'tailwindcss': 'https://github.com/tailwindlabs/tailwindcss.com',
  'nativewind': 'https://github.com/nativewind/website',

  'valtio': 'https://github.com/pmndrs/valtio',

  'motion': 'https://github.com/motiondivision/motion',
  'anime': 'https://github.com/juliangarnier/anime',
  'pixijs': 'https://github.com/pixijs/pixijs',

  'next': 'https://github.com/vercel/next.js',
  'nest': 'https://github.com/nestjs/docs.nestjs.com',

  'vue': 'https://github.com/vuejs/docs',
  'vue-router': 'https://github.com/vuejs/router',

  'uniapp-x': 'https://gitcode.com/dcloud/unidocs-uni-app-x-zh',
  'uniapp': 'https://gitcode.com/dcloud/unidocs-zh',

  'writing-styles-juejin': 'https://github.com/hairyf/juejin-excellent-article',

  'tauri': 'https://github.com/tauri-apps/tauri-docs',
  'flutter': 'https://github.com/flutter/flutter',
  'electron': 'https://github.com/electron/electron',
  'electron-forge': 'https://github.com/electron-forge/electron-forge-docs',
  'react-native': 'https://github.com/facebook/react-native-website',
  'react-native-expo': 'https://github.com/expo/expo',
  'react-native-reusables': 'https://github.com/founded-labs/react-native-reusables',

  'unplugin': 'https://github.com/unjs/unplugin',
  'unjs': 'https://github.com/unjs/website',
  'undocs': 'https://github.com/unjs/undocs',

  'arch-unplugin': 'https://github.com/unplugin/unplugin-starter',
  'arch-tsdown': 'https://github.com/antfu/starter-ts',
  'arch-tsdown-monorepo': 'https://github.com/hairyf/starter-monorepo',

  'arch-tsdown-cli': 'https://github.com/hairyf/starter-cli',
  'arch-vscode': 'https://github.com/antfu/starter-vscode',
  'arch-nuxt': 'https://github.com/antfu/vitesse-nuxt',
  'arch-nuxt-module-builder': 'https://github.com/nuxt/module-builder',
  'arch-nuxt-lite': 'https://github.com/antfu-collective/vitesse-lite',
  'arch-webext-vue': 'https://github.com/antfu-collective/vitesse-webext',

  'pinia': 'https://github.com/vuejs/pinia',
  'nuxt': 'https://github.com/nuxt/nuxt',
  'vite': 'https://github.com/vitejs/vite',
  'unocss': 'https://github.com/unocss/unocss',

  'pnpm': 'https://github.com/pnpm/pnpm.io',
  'tsdown': 'https://github.com/rolldown/tsdown',
  'vitest': 'https://github.com/vitest-dev/vitest',
  'github': 'https://github.com/github/awesome-copilot',
  'vitepress': 'https://github.com/vuejs/vitepress',

  'taze': 'https://github.com/antfu-collective/taze',

  'openapi-specification': 'https://github.com/OAI/OpenAPI-Specification',
}

/**
 * Already generated skills, sync with their `skills/` directory
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'writing-humanizer-zh': {
    source: 'https://github.com/op7418/Humanizer-zh',
    skills: {
      'writing-humanizer-zh': 'writing-humanizer-zh',
    },
  },
  'writing-humanizer': {
    source: 'https://github.com/blader/humanizer',
    skills: {
      'writing-humanizer': 'writing-humanizer',
    },
  },

  'slidev': {
    official: true,
    source: 'https://github.com/slidevjs/slidev',
    skills: {
      slidev: 'slidev',
    },
  },

  'anthropics': {
    source: 'https://github.com/anthropics/skills',
    skills: {
      'skill-creator': 'create-skill',
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

  'hairylib': {
    source: 'https://github.com/hairyf/hairylib',
    skills: {
      'hairy-utils': 'hairy-utils',
      'hairy-react-lib': 'hairy-react-lib',
    },
  },

  'overlastic': {
    source: 'https://github.com/hairyf/overlastic',
    skills: {
      overlastic: 'overlastic',
    },
  },

  'tsdown': {
    official: true,
    source: 'https://github.com/rolldown/tsdown',
    skills: {
      tsdown: 'tsdown',
    },
  },

  'vuejs-ai': {
    source: 'https://github.com/vuejs-ai/skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
      'vue-router-best-practices': 'vue-router-best-practices',
      'vue-testing-best-practices': 'vue-testing-best-practices',
    },
  },

  'uniwind': {
    source: 'https://github.com/uni-stack/uniwind',
    skills: {
      'migrate-nativewind-to-uniwind': 'migrate-nativewind-to-uniwind',
      'uniwind': 'uniwind',
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

  'e2e-testing': {
    source: 'https://github.com/hieutrtr/ai1-skills',
    skills: {
      'e2e-testing': 'e2e-testing',
    },
  },
}

/**
 * Hand-written skills with Hairyf's preferences/tastes/recommendations
 */
export const manual = [
  'hairy',
  'antfu',
  'github-workflow',
  'arch-upkeep',
  'openapi-specification-v2',
  'openapi-specification-v3.2',
  'create-skill-from-repo',
]
