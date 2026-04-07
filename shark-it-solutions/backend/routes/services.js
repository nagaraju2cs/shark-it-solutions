const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const SERVICES = [
  {
    id: 1,
    slug: 'cloud-engineering',
    name: 'Cloud Engineering',
    icon: '☁️',
    shortDesc: 'Architect, migrate and manage scalable cloud infrastructure on AWS, Azure & GCP.',
    fullDesc: 'We design, deploy and manage enterprise-grade cloud infrastructure tailored to your business needs. From lift-and-shift migrations to cloud-native architectures, our AWS-certified engineers deliver resilient, secure and cost-optimized solutions.',
    technologies: ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudFormation', 'Ansible'],
    plans: { starter: 9999, professional: 24999, enterprise: 59999 },
    features: ['Cloud Architecture Design', 'Migration Planning & Execution', 'Cost Optimization', 'Auto-scaling Setup', 'Disaster Recovery', '24/7 Monitoring']
  },
  {
    id: 2,
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🛡️',
    shortDesc: 'Enterprise-grade security — pen testing, SOC, threat monitoring and compliance.',
    fullDesc: 'Protect your digital assets with multi-layered cybersecurity services. Our certified ethical hackers and security analysts deliver penetration testing, vulnerability assessments, SOC-as-a-service, and compliance management.',
    technologies: ['CrowdStrike', 'Splunk', 'SIEM', 'Nessus', 'Metasploit', 'Wireshark'],
    plans: { starter: 9999, professional: 24999, enterprise: 59999 },
    features: ['Penetration Testing', 'Vulnerability Assessment', 'SOC Monitoring', 'SIEM Implementation', 'Compliance (ISO 27001, PCI DSS)', 'Incident Response']
  },
  {
    id: 3,
    slug: 'ai-solutions',
    name: 'AI Solutions & Support',
    icon: '🤖',
    shortDesc: 'AI chatbots, ML pipelines, automation workflows and intelligent analytics.',
    fullDesc: 'Integrate artificial intelligence into your business workflows. We build and deploy AI-powered chatbots, machine learning models, automation pipelines, and intelligent analytics dashboards that drive smarter decisions.',
    technologies: ['OpenAI', 'LangChain', 'TensorFlow', 'Python', 'FastAPI', 'HuggingFace'],
    plans: { starter: 9999, professional: 24999, enterprise: 59999 },
    features: ['AI Chatbot Development', 'ML Model Deployment', 'Process Automation', 'Data Analytics Dashboards', 'LLM Integration', 'AI Strategy Consulting']
  },
  {
    id: 4,
    slug: 'web-development',
    name: 'Web Development',
    icon: '💻',
    shortDesc: 'Full-stack React, Node.js and Python applications built to scale.',
    fullDesc: 'We build fast, secure and scalable web applications for businesses of all sizes. From landing pages to enterprise portals, our full-stack developers deliver pixel-perfect interfaces backed by robust APIs.',
    technologies: ['React', 'Next.js', 'Node.js', 'Python', 'Django', 'PostgreSQL', 'MongoDB'],
    plans: { starter: 9999, professional: 24999, enterprise: 59999 },
    features: ['Custom Web Applications', 'API Development', 'E-Commerce Solutions', 'CMS Integration', 'Performance Optimization', 'SEO-Ready Architecture']
  },
  {
    id: 5,
    slug: 'system-administration',
    name: 'System Administration',
    icon: '🖥️',
    shortDesc: 'Windows Server, Active Directory, VMware and full infrastructure management.',
    fullDesc: 'End-to-end system administration including server provisioning, Active Directory management, VMware virtualization, patch management, and 24/7 monitoring to keep your infrastructure running at peak performance.',
    technologies: ['Windows Server', 'Active Directory', 'VMware', 'Hyper-V', 'SCCM', 'PowerShell'],
    plans: { starter: 9999, professional: 24999, enterprise: 59999 },
    features: ['Server Setup & Configuration', 'Active Directory Management', 'Virtualization', 'Patch Management', 'Backup & Recovery', 'Performance Monitoring']
  },
  {
    id: 6,
    slug: 'linux-administration',
    name: 'Linux Administration',
    icon: '🐧',
    shortDesc: 'Ubuntu, RHEL, CentOS server management, shell scripting and OS hardening.',
    fullDesc: 'Expert Linux server administration covering installation, configuration, performance tuning, security hardening, shell scripting and open-source stack management across all major distributions.',
    technologies: ['Ubuntu', 'RHEL', 'CentOS', 'Bash', 'Docker', 'Nginx', 'Apache'],
    plans: { starter: 9999, professional: 24999, enterprise: 59999 },
    features: ['Linux Server Management', 'Shell Scripting', 'Performance Tuning', 'Security Hardening', 'Docker & Container Management', 'Log Management']
  },
  {
    id: 7,
    slug: 'database-support',
    name: 'Database Support',
    icon: '🗄️',
    shortDesc: 'MySQL, PostgreSQL, MongoDB, Oracle — DBA support, migration and optimization.',
    fullDesc: 'Comprehensive database administration services including design, deployment, migration, performance tuning, backup strategies and 24/7 DBA support across all major relational and NoSQL database platforms.',
    technologies: ['MySQL', 'PostgreSQL', 'MongoDB', 'MSSQL', 'Oracle', 'Redis', 'Elasticsearch'],
    plans: { starter: 9999, professional: 24999, enterprise: 59999 },
    features: ['Database Design & Modeling', 'Migration & Upgrades', 'Query Optimization', 'Replication & Clustering', 'Backup & Disaster Recovery', '24/7 DBA Support']
  }
];

// GET all services (public)
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: SERVICES.length, data: SERVICES });
});

// GET single service by slug (public)
router.get('/:slug', (req, res) => {
  const service = SERVICES.find(s => s.slug === req.params.slug);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, data: service });
});

module.exports = router;
