import { ProblemStatement, User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Rajesh Sharma',
    email: 'industry@ciisic.org',
    role: 'industry',
    companyName: 'Tata Motors Ltd',
    designation: 'Head of Innovation & R&D'
  },
  {
    id: 'user_2',
    name: 'Anjali Desai',
    email: 'admin@ciisic.org',
    role: 'admin',
    companyName: 'Confederation of Indian Industry (CII)',
    designation: 'Senior Administrator - II Collaboration'
  }
];

export const INITIAL_SUBMISSIONS: ProblemStatement[] = [
  {
    id: 'PS-2026-001',
    company: {
      industryName: 'Automotive & Manufacturing',
      companyName: 'Tata Motors Ltd',
      representativeName: 'Rajesh Sharma',
      designation: 'Head of Innovation & R&D',
      email: 'industry@cii.in',
      phone: '+91 98765 43210',
      website: 'www.tatamotors.com',
      industrySector: 'Automotive'
    },
    details: {
      title: 'AI-Based Predictive Maintenance for Robotic Welding Arms',
      description: 'Design and deploy a predictive maintenance system utilizing IoT vibration sensors and temperature feeds to forecast failures in heavy-duty spot welding robotic units 48 hours in advance.',
      businessChallenge: 'Unscheduled welding line failures currently lead to production halts costing over $15,000 per hour. Present scheduled maintenance schemes are inefficient and fail to capture sudden thermal degradation.',
      existingProcess: 'Maintenance is conducted purely on a fixed calendar basis (every 30 operating days) or reactively after critical failure alerts sound on the main PLC board.',
      expectedOutcome: 'A high-accuracy machine learning model operating on edge processors that triggers dynamic warning codes with at least 88% precision to prevent production halts.',
      projectObjectives: 'Analyze multi-axial vibration data, build a continuous thermal anomaly detection pipeline, and develop a real-time web dashboard for shopfloor engineers.'
    },
    technical: {
      requiredTechnologies: ['Python', 'TensorFlow', 'MQTT', 'Docker', 'React', 'TimescaleDB'],
      requiredSkills: ['Machine Learning', 'Time-series Analysis', 'Signal Processing', 'Embedded Systems'],
      preferredBranches: ['Mechanical Engineering', 'Computer Science', 'Robotics & Automation'],
      preferredAcademicYear: 'Postgraduate / Final Year UG',
      difficultyLevel: 'Hard',
      expectedDuration: '6 Months'
    },
    additional: {
      expectedDeliverables: 'Trained model files, sensor ingestion API scripts, operational dashboard prototype, and a deployment guideline document.',
      additionalNotes: 'Selected research teams will be provided access to physical lab mockups and historical telemetry logs.',
      fileAttachmentName: 'robotic_arm_telemetry_specs.pdf',
      declarationAccepted: true
    },
    status: 'Pending',
    submittedDate: '2026-07-09T14:32:00Z'
  },
  {
    id: 'PS-2026-002',
    company: {
      industryName: 'Healthcare & Pharma',
      companyName: 'Biocon Biologics',
      representativeName: 'Dr. Vikram Seth',
      designation: 'Lead Bioprocess Scientist',
      email: 'vikram.seth@biocon.com',
      phone: '+91 91234 56789',
      website: 'www.biocon.com',
      industrySector: 'Pharmaceuticals'
    },
    details: {
      title: 'Automated Bio-Reactor Foam Anomaly Control',
      description: 'An AI-powered computer vision and sensor fusion solution to detect excessive foam formation in bioreactors, which degrades protein yields, and trigger proportional anti-foam injection pumps.',
      businessChallenge: 'Manual bioreactor inspection is labor-intensive and prone to oversight, occasionally causing foam overflows that contaminate filters and ruin entire multi-million rupee batches.',
      existingProcess: 'Technicians manually verify the sight glass every 2 hours and inject anti-foam chemicals based on qualitative visual assessment.',
      expectedOutcome: 'An automated closed-loop system reducing foaming-related yield drops to zero and saving up to 15% in anti-foam chemical usage.',
      projectObjectives: 'Construct a camera feed segmentation model to classify foam volume levels, link with chemical dispenser actuators, and track bioreactor metrics.'
    },
    technical: {
      requiredTechnologies: ['OpenCV', 'PyTorch', 'Raspberry Pi', 'Modbus TCP', 'FastAPI'],
      requiredSkills: ['Computer Vision', 'Deep Learning', 'Process Control Systems', 'Python'],
      preferredBranches: ['Biotechnology', 'Electronics & Instrumentation', 'Computer Engineering'],
      preferredAcademicYear: 'Pre-final / Final Year UG',
      difficultyLevel: 'Medium',
      expectedDuration: '4 Months'
    },
    additional: {
      expectedDeliverables: 'Bioreactor foam segmentation model, real-time control system code, simulation dashboard, and test documentation.',
      additionalNotes: 'Work involves coordination with our Bangalore bio-processing unit.',
      fileAttachmentName: 'bioreactor_vision_system_setup.pdf',
      declarationAccepted: true
    },
    status: 'Approved',
    submittedDate: '2026-07-05T09:15:00Z',
    reviewRemarks: 'Excellent proposal. Addresses a critical industry pain point with highly practical parameters.'
  },
  {
    id: 'PS-2026-003',
    company: {
      industryName: 'Renewable Energy',
      companyName: 'Adani Green Energy',
      representativeName: 'Nisha Mehta',
      designation: 'Director of Solar Operations',
      email: 'nisha.mehta@adani.com',
      phone: '+91 99887 76655',
      website: 'www.adanigreenenergy.com',
      industrySector: 'Energy & Utilities'
    },
    details: {
      title: 'Deep Learning Solar Irradiance and Grid Load Forecast',
      description: 'Formulate localized weather forecasting models paired with solar plant telemetry to compute power generation capacity 6 hours ahead, facilitating optimized power distribution scheduling.',
      businessChallenge: 'Sudden cloud cover results in load drops which strain regional power grids. Accurate intraday forecasts are needed to avoid penalties from state electricity dispatch centres.',
      existingProcess: 'Relies on generalized regional satellite weather reports which lack local farm precision, leading to high prediction errors (MAPE around 18%).',
      expectedOutcome: 'Localized forecast model with Mean Absolute Percentage Error (MAPE) below 6% using historical solar data and real-time cloud tracking cameras.',
      projectObjectives: 'Correlate sky camera feeds with pyranometer readings, build a sequence-to-sequence neural network, and generate exportable dispatch reports.'
    },
    technical: {
      requiredTechnologies: ['Python', 'LSTM/GRU', 'PyTorch', 'InfluxDB', 'Streamlit'],
      requiredSkills: ['Recurrent Neural Networks', 'Meteorological Data Analysis', 'API Integration'],
      preferredBranches: ['Electrical Engineering', 'Energy Systems', 'Data Science'],
      preferredAcademicYear: 'Final Year UG / PG Researchers',
      difficultyLevel: 'Hard',
      expectedDuration: '6 Months'
    },
    additional: {
      expectedDeliverables: 'Forecasting neural network, data ingestion pipelines, solar forecasting portal prototype, and technical documentation.',
      additionalNotes: 'Data will be provided from our Rajasthan plant sites.',
      fileAttachmentName: 'solar_telemetry_historical_sample.csv',
      declarationAccepted: true
    },
    status: 'Rejected',
    submittedDate: '2026-06-28T11:40:00Z',
    reviewRemarks: 'This requires specialized meteorological hardware which is difficult to replicate in standard institute labs. Please simplify scope.'
  }
];
