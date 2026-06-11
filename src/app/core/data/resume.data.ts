export const RESUME_DATA = {
    profile: {
        name: 'Mohammed Shihabul Haque',
        role: 'Senior Software Engineer & Team Lead',
        phone: '+91 9895113071',
        email: 'shihabvmh51@gmail.com',
        location: 'Pattambi, India 679303',
        summary: 'Strategic Lead with 5.6 years of experience specializing in architecting scalable front-end solutions and leading high-performing Agile teams. Expert in Angular (v2–18) and modern JavaScript ecosystems, with a proven ability to translate complex business objectives into robust technical roadmaps. Focused on optimizing product functionality and mentoring cross-functional teams to deliver enterprise-grade software that prioritizes user experience and system performance.',
        social: {
            linkedin: 'https://www.linkedin.com/in/mohammed-shihabul-haque/',
            github: 'https://github.com/SHIHABULHAQUE'
        }
    },
    experience: [
        {
            company: 'Muthootu Mini',
            location: 'Kochi',
            role: 'Senior Software Engineer (Team Lead)',
            period: '07/2025 - Current',
            description: [
                'Led a team of software developers in designing, implementing, and maintaining complex software solutions, enhancing product functionality and user experience.',
                'Refined and upgraded existing software to continuously improve performance.',
                'Collaborated with cross-functional teams to gather requirements, specify system functionalities, and develop robust software architectures.',
                'Coordinated with product managers to define clear project scopes, ensuring alignment with business goals and objectives.'
            ]
        },
        {
            company: 'Thomsun Infocare',
            location: 'Kochi, India',
            role: 'Senior Software Engineer',
            period: '12/2022 - 06/2025',
            description: [
                'Translated business requirements into technical specifications and implementations.',
                'Debugging issues in the application code to ensure it is working correctly.',
                'Developed, maintained and released web related user interfaces and prepared systems design documentation.',
                'Leading angular project development.',
                'Researched, analyzed, and developed product features of increasingly complex nature.',
                'Wrote clean, maintainable, and efficient code following best practices and coding standards.',
                'Used version control systems like Git to manage and track changes to code.',
                'Working on two major projects: an ERP application using Angular 15.'
            ]
        },
        {
            company: 'Geojit Technologies',
            location: 'Kochi, India',
            role: 'Software Engineer',
            period: '08/2021 - 12/2022',
            description: [
                'Developed new, efficient and well-tested code for a variety of different software projects.',
                'Collaborated with designers and product managers to develop innovative products.',
                'Database handling using SQL.',
                'Creating jasper reports.',
                'Using Gitlab.',
                'Worked on 4+ projects with various version of angular 7,10,13.'
            ]
        },
        {
            company: 'Iroid Technologies',
            location: 'Kochi',
            role: 'Angular Developer',
            period: '07/2020 - 08/2021',
            description: [
                'Developed user interfaces with the latest front-end technologies.',
                'Improved web design and usability through UX testing.',
                'Ensured that all code complies with best practices and standards set by the company or organization.',
                'Designing, coding, testing, and deploying the application.',
                'Identify and resolve bugs and issues in the web applications.',
                'Work with cross-functional teams, including designers and backend developers, to ensure seamless integration and functionality.'
            ]
        }
    ],
    education: [
        {
            degree: 'Bachelor of Computer Application (BCA)',
            field: 'Computer Science',
            institution: 'MES KVM College, Valanchery',
            year: '2019'
        },
        {
            degree: 'Higher Secondary Education',
            field: 'Computer Science',
            institution: 'GHSS - Pattambi',
            year: '2016'
        }
    ],
    skills: [
        'Angular (v2-18)', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3/SCSS',
        'RxJS', 'NgRx', 'Azure DevOps', 'Git/GitLab', 'Jira',
        'Angular Material', 'PrimeNG', 'Ant Design', 'Syncfusion', 'Bootstrap',
        'Dot Net', 'SQL', 'Jasper Reports', 'CI/CD Pipeline', 'Agile/Scrum',
        'Team Leadership', 'Performance Monitoring', 'Unit Testing'
    ],
    projects: [
        {
            title: 'ERP Application: Finance & Trading',
            description: 'A comprehensive Enterprise Resource Planning system for finance management, featuring real-time trading modules, detailed reporting, and automated reconciliation processes.',
            challenge: 'Standardizing heterogeneous trading procedures and account books across distributed business networks, which led to synchronization bottlenecks.',
            solution: 'Designed a centralized enterprise web platform in Angular 15, integrated with an asynchronous .NET queue processor and partitioned SQL Server database tables.',
            impact: 'Reduced database load times by 40% and automated accounting reconciliations for 100K+ transaction runs.',
            architecture: 'Layered Micro-frontend structure with distributed NgRx store caches.',
            technologies: ['Angular 15', '.NET Core', 'SQL Server', 'NgRx'],
            link: '#'
        },
        {
            title: 'Third-Party Integrations',
            description: 'Seamless integration modules for Insurance, SIP, and PAN verification services, enhancing the core banking platform with external service capabilities.',
            challenge: 'Integrating external services like SIP, Insurance, and PAN verification APIs which had erratic latency spikes and inconsistent schemas.',
            solution: 'Architected a resilient gateway middleware with retry policies, token storage, and local cache policies.',
            impact: 'Maintained 99.9% uptime during third-party outages and sped up customer verification flows by 65%.',
            architecture: 'Gateway Router API Proxy with client throttling controls.',
            technologies: ['Angular', 'Web API', 'REST', 'JSON'],
            link: '#'
        },
        {
            title: 'Customer Information System (CIS)',
            description: 'Centralized database and management interface for customer data, ensuring data integrity, quick retrieval, and compliant KYC processing.',
            challenge: 'Managing heavy customer databases and complying with KYC/AML audits without slowing down service desks.',
            solution: 'Engineered a centralized CIS portal in Angular, using optimized Entity Framework Core queries and lazy-loaded tab segments.',
            impact: 'Accelerated customer search times under 150ms and achieved 100% compliance during regional KYC audits.',
            architecture: 'Service-oriented database layer with CQRS query models.',
            technologies: ['Angular', 'C#', 'Entity Framework', 'Bootstrap'],
            link: '#'
        },
        {
            title: 'Mutual Fund Back-Office',
            description: 'Back-office administration tool for mutual fund management, tracking portfolio performance, user investments, and regulatory compliance reports.',
            challenge: 'Visualizing volatile portfolio trends and generating audit reports with high latency and slow rendering cycles.',
            solution: 'Developed a reactive portfolio dashboard in Angular 13 with RxJS debounce operators and PrimeNG data matrices.',
            impact: 'Eliminated UI locks during high-frequency data streams and generated PDF audits in 2 seconds.',
            architecture: 'RxJS reactive state streams and worker-thread background PDF generation.',
            technologies: ['Angular 13', 'RxJS', 'SQL', 'PrimeNG'],
            link: '#'
        },
        {
            title: 'Loan Against Shares (LAS)',
            description: 'End-to-end management system for processing loans against securities, including collateral valuation, limit management, and loan disbursement.',
            challenge: 'Calculating loan limits against volatile equity securities dynamically without risking margin calls.',
            solution: 'Created a real-time limits calculator with SQL Stored Procedures and an automated trigger-based risk engine.',
            impact: 'Calculated collateral valuations instantly and dropped risk exposures by 28%.',
            architecture: 'SQL transactional calculations backed by .NET Core background workers.',
            technologies: ['Angular', '.NET', 'SQL Stored Procedures'],
            link: '#'
        },
        {
            title: 'iROHUB E-Learning Platform',
            description: 'Interactive e-learning application delivering courses and assessments, featuring video streaming, progress tracking, and certification generation.',
            challenge: 'Optimizing bandwidth consumption and tracking module progressions for thousands of concurrent video streams.',
            solution: 'Built an e-learning container with Node.js streaming, custom video cache proxies, and MongoDB progress trackers.',
            impact: 'Saved 30% bandwidth costs and supported 5K+ monthly active student certifications.',
            architecture: 'Node.js video proxy gateway coupled with MongoDB event sourcing.',
            technologies: ['Angular', 'Node.js', 'MongoDB', 'Express'],
            link: '#'
        }
    ],
    certifications: [
        'Angular', 'React Js', '.Net'
    ]
};
