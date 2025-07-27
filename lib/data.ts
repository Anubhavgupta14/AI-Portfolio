import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'anubhavgu2002@gmail.com',

    emailSubject: "Let's build together...",
    emailBody: 'Hi Anubhav, I am reaching out to you because...',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/Anubhavgupta14' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/anubhavgupta14' },
    { name: 'x', url: 'https://www.x.com/theanubhav14' },
];

export const MY_STACK = {
    frontend: [
        {
            name: 'HTML',
            icon: '/logo/html.png'
        },
        {
            name: 'CSS',
            icon: '/logo/css.png'
        },
        {
            name: 'JavaScript',
            icon: '/logo/js.png',
        },
        {
            name: 'TypeScript',
            icon: '/logo/ts.png',
        },
        {
            name: 'React',
            icon: '/logo/react.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        {
            name: 'Redux',
            icon: '/logo/redux.png',
        },
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind.png',
        },
        {
            name: 'GSAP',
            icon: '/logo/gsap.png',
        },
        {
            name: 'Bootstrap',
            icon: '/logo/bootstrap.svg',
        },
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.png',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.png',
        },
        {
            name: 'Python',
            icon: '/logo/python.png'
        }
    ],
    database: [
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'Prisma',
            icon: '/logo/prisma.png',
        },
    ],
    Devops: [
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'Kubernates',
            icon: '/logo/k8s.png',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
    ],
    "LLM Frameworks": [
        {
            name: 'Langchain',
            icon: '/logo/langchain.svg'
        },
        {
            name: 'Langgraph',
            icon: '/logo/langgraph.svg'
        },
        {
            name: 'Langsmith',
            icon: '/logo/langsmith.svg'
        },
    ]
};

export const PROJECTS: IProject[] = [
    {
        title: 'Pinewheel AI',
        slug: 'pinewheel-ai',
        techStack: ['Next.js', 'LLM Integration', 'Langchain', 'Python', 'Web Optimization'],
        // Note: Replace with actual image paths
        thumbnail: '/projects/thumbnail/pinewheel.png',
        images: [
            '/projects/images/pinewheel2.jpeg',
            '/projects/images/pinewheel1.png',
        ],
        liveUrl: 'https://pinewheel.ai',
        year: 2025,
        description: `
        A cybersecurity platform that leverages AI to automate and enhance security testing. <br/><br/>
        Key Features: <br/>
        <ul>
            <li>🤖 ML Integration: Integrated machine learning models to automate vulnerability assessments, achieving a 95% accuracy rate.</li>
            <li>⚡ Web App Optimization: Optimized the web application by 50% by reducing bundle size and improving compile time.</li>
            <li>🔎 Dynamic Request Fuzzer: Produced a logic to analyze and fuzz HTTP requests using LLMs, improving security testing efficiency.</li>
            <li>✍️ Blog Management: Developed a blog management system for knowledge sharing.</li>
        </ul>
        `,
        role: `As a Full Stack Developer, my role involves integrating AI/ML models into the core platform, leading optimization efforts to enhance performance, and developing new security tools using large language models.`,
    },
    {
        title: 'The Hollywood Reporter India',
        slug: 'hollywood-reporter-india',
        techStack: ['React', 'Redux', 'JavaScript', 'State Management', 'API Performance'],
        // Note: Replace with actual image paths
        thumbnail: '/projects/thumbnail/hollywood.jpeg',
        images: [
            '/projects/images/hollywood1.png',
            '/projects/images/hollywood2.png',
        ],
        liveUrl: 'https://hollywoodreporterindia.com',
        year: 2024,
        description: `
        A high-traffic media website for 'The Hollywood Reporter India' under the RPSG Group. The project focused on robust content delivery, seamless state management, and high availability. <br/><br/>
        Key Achievements:<br/>
        <ul>
            <li>📈 Increased user conversions by 20% through strategic development.</li>
            <li>🔄 Implemented React Redux for seamless state management across the application.</li>
            <li>🛠️ Developed functionalities for the admin dashboard.</li>
            <li>⏱️ Monitored production systems to ensure 99.9% uptime and optimal API performance.</li>
        </ul>
        `,
        role: `As a Full Stack Developer at Zerror Studios, I played a key role in building the website, focusing on both frontend state management with Redux and backend system monitoring to ensure high performance and reliability.`,
    },
    {
        title: 'Soul Vedic Store',
        slug: 'soul-vedic-store',
        techStack: [
            'Next.js',
            'Redux',
            'Express.js',
            'Node.js',
            'MongoDB',
            'CSS',
            'JavaScript',
        ],
        // Note: Replace with actual image paths
        thumbnail: '/projects/thumbnail/soulvedic.jpeg',
        images: [
            '/projects/images/soulvedic1.png',
            '/projects/images/soulvedic2.png',
        ],
        liveUrl: 'https://soul-vedic-project.vercel.app', // The resume mentions a "Live Demo"
        sourceCode: 'https://github.com/Anubhavgupta14/SoulVedic-Store', // The resume mentions "Code"
        year: 2024,
        description: `
        An e-commerce fashion platform designed to provide an engaging and seamless shopping experience. <br/><br/>
        Key Features: <br/>
        <ul>
            <li>✨ Engaging Animations: Implemented GSAP animations, which improved user engagement by 20%.</li>
            <li>🛒 Persistent Cart: Used Redux Persist for seamless cart state management, enabling checkout without login and increasing conversions by 15%.</li>
            <li>🚚 Automated Shipping: Integrated Shiprocket to automate shipping workflows and streamline logistics.</li>
            <li>⚡ Fast Data Retrieval: Structured RESTful APIs in Express.js, improving data retrieval speed by 40%.</li>
        </ul>
        `,
        role: `As the sole developer, I was responsible for the end-to-end development, including frontend, backend, and third-party integrations to build a feature-rich e-commerce platform.`,
    },
    {
        title: 'The Design Engg',
        slug: 'the-design-engg',
        techStack: [
            'Next.js',
            'Express.js',
            'Node.js',
            'MongoDB',
            'CSS',
            'HTML',
            'JavaScript',
        ],
        // Note: Replace with actual image paths
        thumbnail: '/projects/thumbnail/design.jpeg',
        images: [
            '/projects/images/design1.png',
            '/projects/images/design2.png',
        ],
        liveUrl: 'https://thedesignengg.vercel.app', // The resume mentions a "Live Demo"
        sourceCode: 'https://github.com/Anubhavgupta14/Dsign_Engg', // The resume mentions "Code"
        year: 2023,
        description: `
        A specialized platform featuring a metallurgical calculator to automate complex industrial calculations, significantly reducing manual workload for professionals in the field. <br/><br/>
        Key Features:<br/>
        <ul>
            <li>️‍️⚙️ Industrial Calculator: Built a tool to automate metallurgical calculations, reducing manual workload by 30%.</li>
            <li>💳 Payment Integration: Integrated CCAvenue and PayPal, which increased transaction success rates by 10%.</li>
            <li>📈 Client Dashboard: Organized a client dashboard for order tracking, file downloads, and subscription management, improving customer satisfaction by 15%.</li>
        </ul>
        `,
        role: `I developed this platform from the ground up, focusing on creating a robust backend for calculations, integrating secure payment gateways, and building a user-friendly client dashboard to manage services.`,
    },
    {
        title: 'Lets-Test',
        slug: 'lets-test',
        techStack: ['Next.js', 'MongoDB', 'Tailwind CSS', 'Shadcn'],
        // Note: Replace with actual image paths
        thumbnail: '/projects/thumbnail/test.jpeg',
        images: [
            '/projects/images/test1.jpeg',
            '/projects/images/test2.png',
        ],
        liveUrl: 'https://lets-test12.vercel.app/', // The resume mentions a "Live Demo"
        sourceCode: 'https://github.com/Anubhavgupta14/lets-test', // The resume mentions "Code"
        year: 2025,
        description: `
        A mock test platform where companies can create and host test series for students. The platform was successfully tested with over 300 users and is tailored for competitive exam aspirants (JEE/NEET).<br/><br/>
        Key Features:<br/>
        <ul>
            <li>📝 Custom Test Series: Allows companies to create and manage their own test series for students.</li>
            <li>👨‍🎓 Student-Focused: Specifically assessed for competitive exam aspirants like JEE/NEET, providing an interactive test experience.</li>
            <li>✅ User Tested: The platform has been validated and tested by a user base of over 300 individuals.</li>
        </ul>
        `,
        role: `My role was to develop the entire platform, creating the infrastructure for companies to build tests and for students to have an interactive and smooth test-taking experience.`,
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'Full Stack Developer (Internship)',
        company: 'Pinewheel Labs',
        duration: 'Jan 2025 - Present',
    },
    {
        title: 'Full Stack Developer (Freelance)',
        company: 'Pixels & Grids',
        duration: 'Nov 2024 - Dec 2024',
    },
    {
        title: 'Full Stack Developer (Part Time)',
        company: 'Zerror Studios',
        duration: 'June 2023 - Oct 2024',
    },
    {
        title: 'Frontend Developer (Internship)',
        company: 'Zerror Studios',
        duration: 'July 2023 - April 2023',
    },
];
