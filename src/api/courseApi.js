import axiosClient from './axiosClient';

const INSTRUCTORS = [
  'Dr. Sarah Mitchell', 'Prof. James Carter', 'Dr. Emily Chen', 'Mr. Daniel Wright',
  'Ms. Olivia Brown', 'Dr. Michael Lee', 'Prof. Anita Desai', 'Mr. Robert King',
];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['4 Weeks', '6 Weeks', '8 Weeks', '10 Weeks', '12 Weeks'];

function hashIndex(id, mod) {
  return id % mod;
}

function toTitleCase(str = '') {
  return str.replace(/(^|-|\s)\w/g, (c) => c.toUpperCase()).replace(/-/g, ' ');
}

export function transformProductToCourse(product) {
  return {
    id: String(product.id),
    name: product.title,
    instructor: INSTRUCTORS[hashIndex(product.id, INSTRUCTORS.length)],
    category: toTitleCase(product.category),
    duration: DURATIONS[hashIndex(product.id, DURATIONS.length)],
    level: LEVELS[hashIndex(product.id, LEVELS.length)],
    price: product.price,
    description: product.description,
    rating: product.rating,
    thumbnail: product.thumbnail,
  };
}

export async function fetchCoursesFromApi() {
  const res = await axiosClient.get('/products?limit=60');
  return res.data.products.map(transformProductToCourse);
}
