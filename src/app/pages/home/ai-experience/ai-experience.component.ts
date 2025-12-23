import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface AiUseCase {
title: string;
description: string;
tech: string[];
}


@Component({
selector: 'app-ai-experience',
standalone: true,
imports: [CommonModule],
templateUrl: './ai-experience.component.html',
styleUrls: ['./ai-experience.component.scss']
})
export class AiExperienceComponent {
useCases: AiUseCase[] = [
{
title: 'AI‑Assisted Workflow Automation',
description:
'Integrated LLM-powered features to automate internal workflows, reducing manual effort and improving turnaround time.',
tech: ['LLM APIs', 'Angular', 'REST APIs']
},
{
title: 'Document Generation & Summarization',
description:
'Implemented AI-driven document generation and summarization for enterprise users, improving productivity and accuracy.',
tech: ['Prompt Engineering', 'Angular', 'API Integration']
},
{
title: 'Intelligent User Assistance',
description:
'Built contextual AI assistance inside applications to guide users and improve UX in complex systems.',
tech: ['LLMs', 'Angular', 'UX Optimization']
}
];
}
