export interface TechBadgeInfo {
  name: string;
  slug: string;
  category: 'languages' | 'frontend' | 'backend' | 'database' | 'devops' | 'ai_ml' | 'tools';
  color: string;
  logo: string;
  logoColor?: string;
}

export const TECH_CATALOG: TechBadgeInfo[] = [
  // Languages
  { name: 'TypeScript', slug: 'typescript', category: 'languages', color: '3178C6', logo: 'typescript', logoColor: 'white' },
  { name: 'JavaScript', slug: 'javascript', category: 'languages', color: 'F7DF1E', logo: 'javascript', logoColor: 'black' },
  { name: 'Python', slug: 'python', category: 'languages', color: '3776AB', logo: 'python', logoColor: 'white' },
  { name: 'PHP', slug: 'php', category: 'languages', color: '777BB4', logo: 'php', logoColor: 'white' },
  { name: 'Go', slug: 'go', category: 'languages', color: '00ADD8', logo: 'go', logoColor: 'white' },
  { name: 'Rust', slug: 'rust', category: 'languages', color: '000000', logo: 'rust', logoColor: 'white' },
  { name: 'Java', slug: 'java', category: 'languages', color: '007396', logo: 'openjdk', logoColor: 'white' },
  { name: 'C++', slug: 'cplusplus', category: 'languages', color: '00599C', logo: 'cplusplus', logoColor: 'white' },
  { name: 'C#', slug: 'csharp', category: 'languages', color: '239120', logo: 'csharp', logoColor: 'white' },
  { name: 'Ruby', slug: 'ruby', category: 'languages', color: 'CC342D', logo: 'ruby', logoColor: 'white' },
  { name: 'Swift', slug: 'swift', category: 'languages', color: 'F05138', logo: 'swift', logoColor: 'white' },
  { name: 'Kotlin', slug: 'kotlin', category: 'languages', color: '7F52FF', logo: 'kotlin', logoColor: 'white' },
  { name: 'SQL', slug: 'sql', category: 'languages', color: '4479A1', logo: 'mysql', logoColor: 'white' },
  { name: 'HTML5', slug: 'html5', category: 'languages', color: 'E34F26', logo: 'html5', logoColor: 'white' },
  { name: 'CSS3', slug: 'css3', category: 'languages', color: '1572B6', logo: 'css3', logoColor: 'white' },

  // Frontend
  { name: 'React', slug: 'react', category: 'frontend', color: '20232A', logo: 'react', logoColor: '61DAFB' },
  { name: 'Next.js', slug: 'nextdotjs', category: 'frontend', color: '000000', logo: 'nextdotjs', logoColor: 'white' },
  { name: 'Vue.js', slug: 'vuejs', category: 'frontend', color: '4FC08D', logo: 'vuedotjs', logoColor: 'white' },
  { name: 'Nuxt.js', slug: 'nuxtjs', category: 'frontend', color: '00DC82', logo: 'nuxtdotjs', logoColor: 'white' },
  { name: 'Angular', slug: 'angular', category: 'frontend', color: 'DD0031', logo: 'angular', logoColor: 'white' },
  { name: 'Svelte', slug: 'svelte', category: 'frontend', color: 'FF3E00', logo: 'svelte', logoColor: 'white' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'frontend', color: '06B6D4', logo: 'tailwindcss', logoColor: 'white' },
  { name: 'Bootstrap', slug: 'bootstrap', category: 'frontend', color: '7952B3', logo: 'bootstrap', logoColor: 'white' },
  { name: 'Redux', slug: 'redux', category: 'frontend', color: '764ABC', logo: 'redux', logoColor: 'white' },
  { name: 'Three.js', slug: 'threejs', category: 'frontend', color: '000000', logo: 'threedotjs', logoColor: 'white' },
  { name: 'Vite', slug: 'vite', category: 'frontend', color: '646CFF', logo: 'vite', logoColor: 'white' },
  { name: 'Astro', slug: 'astro', category: 'frontend', color: 'BC52EE', logo: 'astro', logoColor: 'white' },

  // Backend
  { name: 'Laravel', slug: 'laravel', category: 'backend', color: 'FF2D20', logo: 'laravel', logoColor: 'white' },
  { name: 'Node.js', slug: 'nodedotjs', category: 'backend', color: '339933', logo: 'nodedotjs', logoColor: 'white' },
  { name: 'Express', slug: 'express', category: 'backend', color: '000000', logo: 'express', logoColor: 'white' },
  { name: 'NestJS', slug: 'nestjs', category: 'backend', color: 'E0234E', logo: 'nestjs', logoColor: 'white' },
  { name: 'FastAPI', slug: 'fastapi', category: 'backend', color: '009688', logo: 'fastapi', logoColor: 'white' },
  { name: 'Django', slug: 'django', category: 'backend', color: '092E20', logo: 'django', logoColor: 'white' },
  { name: 'Flask', slug: 'flask', category: 'backend', color: '000000', logo: 'flask', logoColor: 'white' },
  { name: 'Spring Boot', slug: 'springboot', category: 'backend', color: '6DB33F', logo: 'springboot', logoColor: 'white' },
  { name: 'Ruby on Rails', slug: 'rubyonrails', category: 'backend', color: 'CC0000', logo: 'rubyonrails', logoColor: 'white' },
  { name: 'GraphQL', slug: 'graphql', category: 'backend', color: 'E10098', logo: 'graphql', logoColor: 'white' },
  { name: 'gRPC', slug: 'grpc', category: 'backend', color: '244C5A', logo: 'grpc', logoColor: 'white' },
  { name: '.NET', slug: 'dotnet', category: 'backend', color: '512BD4', logo: 'dotnet', logoColor: 'white' },

  // Database
  { name: 'PostgreSQL', slug: 'postgresql', category: 'database', color: '4169E1', logo: 'postgresql', logoColor: 'white' },
  { name: 'MySQL', slug: 'mysql', category: 'database', color: '4479A1', logo: 'mysql', logoColor: 'white' },
  { name: 'Redis', slug: 'redis', category: 'database', color: 'DC382D', logo: 'redis', logoColor: 'white' },
  { name: 'MongoDB', slug: 'mongodb', category: 'database', color: '47A248', logo: 'mongodb', logoColor: 'white' },
  { name: 'SQLite', slug: 'sqlite', category: 'database', color: '003B57', logo: 'sqlite', logoColor: 'white' },
  { name: 'Elasticsearch', slug: 'elasticsearch', category: 'database', color: '005571', logo: 'elasticsearch', logoColor: 'white' },
  { name: 'Prisma', slug: 'prisma', category: 'database', color: '2D3748', logo: 'prisma', logoColor: 'white' },
  { name: 'Supabase', slug: 'supabase', category: 'database', color: '3ECF8E', logo: 'supabase', logoColor: 'white' },
  { name: 'Firebase', slug: 'firebase', category: 'database', color: 'FFCA28', logo: 'firebase', logoColor: 'black' },
  { name: 'Cassandra', slug: 'cassandra', category: 'database', color: '1287B1', logo: 'apachecassandra', logoColor: 'white' },

  // DevOps & Cloud
  { name: 'AWS', slug: 'aws', category: 'devops', color: '232F3E', logo: 'amazonaws', logoColor: 'white' },
  { name: 'Docker', slug: 'docker', category: 'devops', color: '2496ED', logo: 'docker', logoColor: 'white' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'devops', color: '326CE5', logo: 'kubernetes', logoColor: 'white' },
  { name: 'GitHub Actions', slug: 'githubactions', category: 'devops', color: '2088FF', logo: 'githubactions', logoColor: 'white' },
  { name: 'Google Cloud', slug: 'googlecloud', category: 'devops', color: '4285F4', logo: 'googlecloud', logoColor: 'white' },
  { name: 'Azure', slug: 'azure', category: 'devops', color: '0089D6', logo: 'microsoftazure', logoColor: 'white' },
  { name: 'Terraform', slug: 'terraform', category: 'devops', color: '7B42BC', logo: 'terraform', logoColor: 'white' },
  { name: 'Nginx', slug: 'nginx', category: 'devops', color: '009639', logo: 'nginx', logoColor: 'white' },
  { name: 'Linux', slug: 'linux', category: 'devops', color: 'FCC624', logo: 'linux', logoColor: 'black' },
  { name: 'Cloudflare', slug: 'cloudflare', category: 'devops', color: 'F38020', logo: 'cloudflare', logoColor: 'white' },
  { name: 'Vercel', slug: 'vercel', category: 'devops', color: '000000', logo: 'vercel', logoColor: 'white' },

  // AI & Machine Learning
  { name: 'Gemini', slug: 'gemini', category: 'ai_ml', color: '8E75C2', logo: 'google', logoColor: 'white' },
  { name: 'PyTorch', slug: 'pytorch', category: 'ai_ml', color: 'EE4C2C', logo: 'pytorch', logoColor: 'white' },
  { name: 'TensorFlow', slug: 'tensorflow', category: 'ai_ml', color: 'FF6F00', logo: 'tensorflow', logoColor: 'white' },
  { name: 'OpenAI', slug: 'openai', category: 'ai_ml', color: '412991', logo: 'openai', logoColor: 'white' },
  { name: 'Hugging Face', slug: 'huggingface', category: 'ai_ml', color: 'FFD21E', logo: 'huggingface', logoColor: 'black' },
  { name: 'LangChain', slug: 'langchain', category: 'ai_ml', color: '1C3C3C', logo: 'chainlink', logoColor: 'white' },
  { name: 'Scikit-learn', slug: 'scikitlearn', category: 'ai_ml', color: 'F7931E', logo: 'scikitlearn', logoColor: 'white' },
  { name: 'Pandas', slug: 'pandas', category: 'ai_ml', color: '150458', logo: 'pandas', logoColor: 'white' },

  // Tools
  { name: 'Git', slug: 'git', category: 'tools', color: 'F05032', logo: 'git', logoColor: 'white' },
  { name: 'GitHub', slug: 'github', category: 'tools', color: '181717', logo: 'github', logoColor: 'white' },
  { name: 'Postman', slug: 'postman', category: 'tools', color: 'FF6C37', logo: 'postman', logoColor: 'white' },
  { name: 'VS Code', slug: 'visualstudiocode', category: 'tools', color: '007ACC', logo: 'visualstudiocode', logoColor: 'white' },
  { name: 'Figma', slug: 'figma', category: 'tools', color: 'F24E1E', logo: 'figma', logoColor: 'white' },
  { name: 'Jira', slug: 'jira', category: 'tools', color: '0052CC', logo: 'jira', logoColor: 'white' },
  { name: 'Jest', slug: 'jest', category: 'tools', color: 'C21325', logo: 'jest', logoColor: 'white' },
  { name: 'Webpack', slug: 'webpack', category: 'tools', color: '8DD6F9', logo: 'webpack', logoColor: 'black' },
  { name: 'Grafana', slug: 'grafana', category: 'tools', color: 'F46800', logo: 'grafana', logoColor: 'white' },
];

export function getBadgeUrl(techName: string, style: string = 'for-the-badge'): { url: string; tech: TechBadgeInfo } {
  const normalized = techName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matched = TECH_CATALOG.find(t => 
    t.name.toLowerCase() === techName.toLowerCase() ||
    t.slug.toLowerCase() === normalized ||
    t.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
  );

  if (matched) {
    const encodedName = encodeURIComponent(matched.name);
    const logoColor = matched.logoColor || 'white';
    return {
      url: `https://img.shields.io/badge/${encodedName}-${matched.color}?style=${style}&logo=${matched.logo}&logoColor=${logoColor}`,
      tech: matched
    };
  }

  // Fallback for custom tech
  const safeName = encodeURIComponent(techName);
  return {
    url: `https://img.shields.io/badge/${safeName}-20232A?style=${style}`,
    tech: {
      name: techName,
      slug: normalized,
      category: 'tools',
      color: '20232A',
      logo: 'code',
      logoColor: 'white'
    }
  };
}
