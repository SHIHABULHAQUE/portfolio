export const RESUME_DATA = {
    profile: {
        name: 'Mohammed Shihabul Haque',
        role: 'Senior Software Engineer & Team Lead',
        phone: '+91 9895113071',
        email: 'shihabvmh51@gmail.com',
        location: 'Pattambi, Kerala, India 679303',
        years: 6,
        summary: 'Senior Software Engineer and Team Lead with 6+ years of experience building scalable front-end and back-end web applications with Angular (v2–21), .NET, TypeScript and SQL. Leads Agile development teams, translates business requirements into technical roadmaps, and delivers enterprise applications in finance, ERP and e-learning domains. Focused on performance optimization, clean code, and mentoring cross-functional teams to ship reliable, user-friendly software.',
        social: {
            linkedin: 'https://www.linkedin.com/in/mohammed-shihabul-haque/',
            github: 'https://github.com/SHIHABULHAQUE'
        }
    },
    experience: [
        {
            company: 'Muthoottu Mini',
            location: 'Kochi, India',
            role: 'Senior Software Engineer (Team Lead)',
            period: '07/2025 - Current',
            description: [
                'Lead a team of software developers in designing, implementing and maintaining complex Angular and .NET solutions, improving product functionality and user experience.',
                'Refactor and upgrade existing applications to continuously improve performance and maintainability.',
                'Collaborate with cross-functional teams to gather requirements, define system functionality and design robust software architectures.',
                'Work with product managers to define project scope and keep delivery aligned with business goals.'
            ]
        },
        {
            company: 'Thomsun Infocare',
            location: 'Kochi, India',
            role: 'Senior Software Engineer',
            period: '12/2022 - 06/2025',
            description: [
                'Led Angular development for an enterprise ERP application (Finance & Trading modules) built on Angular 15.',
                'Translated business requirements into technical specifications, system design documentation and working features.',
                'Developed, maintained and released web user interfaces; researched and built increasingly complex product features.',
                'Debugged and resolved application issues to ensure stable, reliable releases.',
                'Wrote clean, maintainable and efficient code following best practices, and managed source code with Git.'
            ]
        },
        {
            company: 'Geojit Technologies',
            location: 'Kochi, India',
            role: 'Software Engineer',
            period: '08/2021 - 12/2022',
            description: [
                'Delivered 4+ financial software projects using Angular 7, 10 and 13, including a Mutual Fund Back-Office application and a Loan Against Shares (LAS) system.',
                'Developed new, efficient and well-tested code across multiple projects.',
                'Designed and managed SQL databases and built business reports using Jasper Reports.',
                'Collaborated with designers and product managers to build new product features; managed code with GitLab.'
            ]
        },
        {
            company: 'Iroid Technologies',
            location: 'Kochi, India',
            role: 'Angular Developer',
            period: '07/2020 - 08/2021',
            description: [
                'Built responsive user interfaces with Angular and modern front-end technologies, including the iROHUB E-Learning application.',
                'Improved web design and usability through UX testing.',
                'Designed, coded, tested and deployed applications in line with company coding standards.',
                'Identified and fixed bugs, and worked with designers and back-end developers to ensure seamless integration.'
            ]
        }
    ],
    education: [
        {
            degree: 'Bachelor of Computer Applications (BCA)',
            field: 'Computer Science',
            institution: 'MES KVM College, Valanchery, Kerala',
            year: '2019'
        },
        {
            degree: 'Higher Secondary Education',
            field: 'Computer Science',
            institution: 'GHSS Pattambi, Kerala',
            year: '2016'
        },
        {
            degree: 'High School (SSLC)',
            field: '',
            institution: 'Majlis HSS Vengad, Valanchery, Kerala',
            year: ''
        }
    ],
    skills: [
        { title: 'Front-end', icon: 'assets/icons/angular.svg', items: ['Angular (7, 10, 13, 15, 17, up to 21)', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'jQuery'] },
        { title: 'UI libraries', icon: '', items: ['Angular Material', 'PrimeNG', 'Ant Design', 'Syncfusion'] },
        { title: 'Back-end & database', icon: 'assets/icons/dotnet.svg', items: ['.NET', 'REST API development', 'SQL', 'SQL database management'] },
        { title: 'DevOps & tools', icon: '', items: ['Git', 'GitLab', 'Azure DevOps', 'CI/CD pipelines', 'Jira', 'Microsoft Teams', 'Jasper Reports'] },
        { title: 'Practices', icon: '', items: ['Agile / Scrum', 'Unit testing', 'Debugging', 'Performance monitoring', 'System design documentation', 'Requirements analysis'] },
        { title: 'Leadership', icon: '', items: ['Team leadership', 'Project management', 'Mentoring', 'Stakeholder collaboration'] }
    ],
    projects: [
        {
            title: 'ERP Application: Finance & Trading',
            category: 'Enterprise · Finance',
            metric: '40%',
            metricLabel: 'shorter database load times',
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
            category: 'Platform · APIs',
            metric: '99.9%',
            metricLabel: 'uptime through partner outages',
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
            category: 'Banking · KYC',
            metric: '<150ms',
            metricLabel: 'customer search',
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
            category: 'Wealth · Dashboards',
            metric: '2s',
            metricLabel: 'to generate PDF audits',
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
            category: 'Lending · Risk',
            metric: '−28%',
            metricLabel: 'risk exposure',
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
            category: 'EdTech · Streaming',
            metric: '5K+',
            metricLabel: 'monthly certified learners',
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
        'Angular', 'React JS', '.NET'
    ]
};
