import { getCourseImage } from '../utils/courseImage';

const INSTRUCTORS = [
  'Dr. Sarah Mitchell', 'Prof. James Carter', 'Dr. Emily Chen', 'Mr. Daniel Wright',
  'Ms. Olivia Brown', 'Dr. Michael Lee', 'Prof. Anita Desai', 'Mr. Robert King',
];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['4 Weeks', '6 Weeks', '8 Weeks', '10 Weeks', '12 Weeks'];

const CATEGORY_BLURBS = {
  'Web Development': 'Build modern, responsive websites and web applications using the latest tools and best practices.',
  'Data Science': 'Turn raw data into actionable insights using statistics, Python, and modern data tooling.',
  'UI/UX Design': 'Design intuitive, user-centered digital products from research through to polished prototypes.',
  'Mobile Development': 'Build and ship native and cross-platform mobile apps for iOS and Android.',
  'Cloud Computing': 'Design, deploy, and scale applications on modern cloud infrastructure.',
  'Cyber Security': 'Protect systems and data by learning how attackers think and how to defend against them.',
  Business: 'Develop the strategic and analytical skills needed to grow and manage a business.',
  Marketing: 'Reach and convert customers using modern digital marketing channels and strategies.',
};

// Course catalog grouped by category so each course's name, category and
// (generated) thumbnail all stay in sync with one another.
const COURSE_CATALOG = {
  'Web Development': [
    'Complete Web Development Bootcamp',
    'Modern JavaScript: Zero to Hero',
    'React.js: Build Real-World Apps',
    'Node.js & Express API Development',
    'Full-Stack Development with the MERN Stack',
    'CSS Mastery: Flexbox, Grid & Animations',
  ],
  'Data Science': [
    'Python for Data Science and Machine Learning',
    'Data Analysis with Pandas & NumPy',
    'Statistics and Probability for Data Science',
    'Machine Learning A-Z',
    'Deep Learning with TensorFlow',
    'SQL for Data Analysts',
  ],
  'UI/UX Design': [
    'UI/UX Design Fundamentals',
    'Figma for Product Designers',
    'User Research and Usability Testing',
    'Design Systems in Practice',
    'Mobile App Design Masterclass',
    'Prototyping and Wireframing Essentials',
  ],
  'Mobile Development': [
    'iOS App Development with Swift',
    'Android Development with Kotlin',
    'React Native: Build Cross-Platform Apps',
    'Flutter & Dart Complete Guide',
    'Mobile App Architecture Patterns',
    'Publishing Apps to App Store & Play Store',
  ],
  'Cloud Computing': [
    'AWS Certified Solutions Architect',
    'Microsoft Azure Fundamentals',
    'Google Cloud Platform Essentials',
    'Docker & Kubernetes for Beginners',
    'DevOps and CI/CD Pipelines',
    'Serverless Computing with AWS Lambda',
  ],
  'Cyber Security': [
    'Ethical Hacking and Penetration Testing',
    'Network Security Fundamentals',
    'Cybersecurity Risk Management',
    'Web Application Security',
    'Cryptography Essentials',
    'Security Operations and Incident Response',
  ],
  Business: [
    'Business Strategy and Management',
    'Financial Analysis for Managers',
    'Entrepreneurship: From Idea to Launch',
    'Project Management Professional (PMP) Prep',
    'Business Analytics with Excel',
    'Leadership and Team Management',
  ],
  Marketing: [
    'Digital Marketing Masterclass',
    'Search Engine Optimization (SEO) Fundamentals',
    'Social Media Marketing Strategy',
    'Content Marketing and Copywriting',
    'Google Ads & PPC Advertising',
    'Email Marketing Automation',
  ],
};

function buildCatalog() {
  let index = 0;
  const courses = [];
  for (const [category, names] of Object.entries(COURSE_CATALOG)) {
    names.forEach((name) => {
      const price = 19.99 + (index % 6) * 20;
      const rating = Math.round((3.6 + ((index * 7) % 15) / 10) * 10) / 10;
      courses.push({
        id: String(index + 1),
        name,
        instructor: INSTRUCTORS[index % INSTRUCTORS.length],
        category,
        duration: DURATIONS[index % DURATIONS.length],
        level: LEVELS[index % LEVELS.length],
        price: Math.round(price * 100) / 100,
        description: `${name}. ${CATEGORY_BLURBS[category]}`,
        rating: Math.min(rating, 5),
        thumbnail: getCourseImage(category, name),
      });
      index += 1;
    });
  }
  return courses;
}

const CATALOG = buildCatalog();

export async function fetchCoursesFromApi() {
  // Simulates a network round-trip so loading states behave the same
  // way they would against a real backend.
  await new Promise((resolve) => setTimeout(resolve, 400));
  return CATALOG;
}
