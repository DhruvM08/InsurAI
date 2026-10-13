export const POLICY_TYPES = [
  {
    id: 'health',
    name: 'Health Insurance',
    short: 'Health',
    description: 'Comprehensive coverage for medical expenses, hospitalization, and wellness programs to keep you healthy.',
    icon: '🏥',
    coverage: '₹50,00,000',
    premium: 'Starting at ₹1,200/mo',
    features: ['24/7 Virtual Care', 'Prescription Drug Coverage', 'Mental Health Support'],
  },
  {
    id: 'life',
    name: 'Life Insurance',
    short: 'Life',
    description: 'Secure your family’s financial future with flexible term or whole life options designed for peace of mind.',
    icon: '🛡️',
    coverage: '₹1,00,00,000',
    premium: 'Starting at ₹900/mo',
    features: ['Tax-Free Death Benefit', 'Living Benefits Rider', 'Guaranteed Renewability'],
  },
  {
    id: 'auto',
    name: 'Auto Insurance',
    short: 'Auto',
    description: 'Complete protection for your vehicle against accidents, theft, and third-party liability liabilities.',
    icon: '🚗',
    coverage: '₹10,00,000',
    premium: 'Starting at ₹850/mo',
    features: ['Accident Forgiveness', 'Roadside Assistance', 'New Car Replacement'],
  },
  {
    id: 'home',
    name: 'Home Insurance',
    short: 'Home',
    description: 'Defend your home and belongings against unforeseen damage, theft, and natural disasters.',
    icon: '🏠',
    coverage: '₹75,00,000',
    premium: 'Starting at ₹1,500/mo',
    features: ['Dwelling Coverage', 'Personal Property Protection', 'Liability Coverage'],
  },
];

export const TOTAL_POLICIES = POLICY_TYPES.length;
