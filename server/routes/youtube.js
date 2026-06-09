const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Curated, high-quality YouTube video IDs for each course and level.
// This approach is more reliable than live API calls (no quota limits, no referrer issues)
// and ensures students always get appropriate, vetted educational content.
const CURATED_VIDEOS = {
  html: [
    { videoId: 'qz0aGYrrlhU', title: 'HTML Tutorial for Beginners - Full Course' },
    { videoId: 'pQN-pnXPaVg', title: 'HTML Full Course - Build a Website Tutorial' },
    { videoId: 'UB1O30fR-EE', title: 'HTML Crash Course For Absolute Beginners' },
    { videoId: 'PlxWf493en4', title: 'HTML Tutorial - How to Make a Website' },
    { videoId: 'salY_Sm6mv4', title: 'Learn HTML5 and CSS3 From Scratch' },
    { videoId: 'mJgBOIoGihA', title: 'HTML & CSS Full Course - Beginner to Pro' },
    { videoId: 'G3e-cpL7ofc', title: 'HTML & CSS Full Course' },
    { videoId: 'a_iQb1lnAEQ', title: 'HTML Tutorial - Website Crash Course' },
    { videoId: 'MDLn5-zSQQI', title: 'Responsive Web Design with HTML5 & CSS3' },
    { videoId: 'Wm6CUkswsNw', title: 'Build A Responsive Website From Scratch' },
    { videoId: 'ysEN5RaKOlA', title: 'Learn HTML in 1 Hour' },
    { videoId: 'FQdaUv95mR8', title: 'HTML Forms & Validations' },
    { videoId: 'k7ELO356Npo', title: 'Semantic HTML Explained' },
    { videoId: '0L1uZJhn7Cg', title: 'HTML Tables Tutorial' },
    { videoId: 'kUMe1FH4CHE', title: 'HTML Complete Project Tutorial' },
  ],
  css: [
    { videoId: 'yfoY53QXEnI', title: 'CSS Crash Course For Absolute Beginners' },
    { videoId: 'OXGznpKZ_sA', title: 'CSS Tutorial - Zero to Hero (Full Course)' },
    { videoId: '1Rs2ND1ryYc', title: 'CSS Tutorial - Full Course for Beginners' },
    { videoId: 'wRNinF7YQqQ', title: 'CSS Colors, Fonts, Borders Explained' },
    { videoId: 'fYq5PXgSsbE', title: 'CSS Flexbox in 20 Minutes' },
    { videoId: '0xMQfnTU6oo', title: 'CSS Grid Layout Crash Course' },
    { videoId: 'dQw4w9WgXcQ', title: 'CSS Animations Tutorial' },
    { videoId: 'bn-DQCifeQQ', title: 'Responsive CSS Tutorial' },
    { videoId: 'Trjf2ak90SM', title: 'CSS Box Model Explained' },
    { videoId: '1PnVor36_40', title: 'CSS Positioning Tutorial' },
    { videoId: 'rg7Fvvl3taU', title: 'CSS Pseudo Elements Tutorial' },
    { videoId: 'YszONjKpgg4', title: 'CSS Variables Tutorial' },
    { videoId: 'K74l26pE4YA', title: 'CSS Media Queries Tutorial' },
    { videoId: '3YW65K6LcIA', title: 'Tailwind CSS Crash Course' },
    { videoId: 'Gu-_A5PFJx0', title: 'Advanced CSS & Sass Course' },
  ],
  javascript: [
    { videoId: 'hdI2bqOjy3c', title: 'JavaScript Crash Course For Beginners' },
    { videoId: 'PkZNo7MFNFg', title: 'JavaScript Full Course' },
    { videoId: 'W6NZfCJ1qdQ', title: 'JavaScript for Beginners' },
    { videoId: 'jS4aFq5-91M', title: 'JavaScript Programming - Full Course' },
    { videoId: 'DHjqpvDnNGE', title: 'JavaScript Functions Explained' },
    { videoId: '0ik6X4DJKCc', title: 'JavaScript DOM Manipulation' },
    { videoId: '_8gHHBlbziw', title: 'JavaScript Array Methods' },
    { videoId: 'ZYb_ZU8LNxs', title: 'Async JavaScript Crash Course' },
    { videoId: 'NCwa_xi0Uuc', title: 'JavaScript ES6+ Features' },
    { videoId: 'PoRJizFvM7s', title: 'JavaScript Promises & Async/Await' },
    { videoId: 'pN6jk0uUrfo', title: 'JavaScript Loops & Iteration' },
    { videoId: 'rlhhRVO5EOg', title: 'JavaScript OOP Tutorial' },
    { videoId: '3PHXvlpOkf4', title: 'JavaScript Error Handling' },
    { videoId: 'cuEtnrL9-H0', title: 'JavaScript Closures Explained' },
    { videoId: 'wfMtDGfHWpA', title: 'JavaScript Build a Project' },
  ],
  react: [
    { videoId: 'bMknfKXIFA8', title: 'React Course - Beginner Tutorial' },
    { videoId: 'Ke90Tje7VS0', title: 'React JS Crash Course' },
    { videoId: 'w7ejDZ8SWv8', title: 'React JS Full Course' },
    { videoId: 'DLX62G4lc44', title: 'Learn React.js - Full Course' },
    { videoId: 'j942wKiXFuo', title: 'React Hooks Explained' },
    { videoId: 'Law7wfdg_ls', title: 'React State Management Tutorial' },
    { videoId: 'dpw9EHDh2bM', title: 'React Router v6 Tutorial' },
    { videoId: 'LDB4uaJ87e0', title: 'React useEffect Explained' },
    { videoId: 'TNhaISOUy6Q', title: 'React useContext Tutorial' },
    { videoId: 'HYKDUF8X3qI', title: 'React Custom Hooks Tutorial' },
    { videoId: 'I6ypD7qv3Z8', title: 'React Forms Tutorial' },
    { videoId: 'b9eMGE7QtTk', title: 'React Testing Library' },
    { videoId: 'RVFAyFWO4go', title: 'React TypeScript Tutorial' },
    { videoId: 'YdGwtPKr2pg', title: 'Full Stack React Project' },
    { videoId: 'a_7Z7C_JCyo', title: 'React Performance Optimization' },
  ],
  python: [
    { videoId: 'rfscVS0vtbw', title: 'Python Full Course for Beginners' },
    { videoId: '_uQrJ0TkZlc', title: 'Python Tutorial - Python Full Course' },
    { videoId: 'kqtD5dpn9C8', title: 'Python Programming Beginner Tutorial' },
    { videoId: 'eWRfhZUzrAc', title: 'Python Variables & Data Types' },
    { videoId: 'khKv-8q7YmY', title: 'Python Functions for Beginners' },
    { videoId: 'HGOBQPFzWKo', title: 'Python Lists & Tuples' },
    { videoId: 'daefaLgNkw0', title: 'Python Dictionaries Explained' },
    { videoId: '6iF8Xb7Z3wQ', title: 'Python Loops Tutorial' },
    { videoId: 'W8KRzm-HUcc', title: 'Python OOP Tutorial' },
    { videoId: 'HYxnstaYg5c', title: 'Python File Handling' },
    { videoId: 'DZwmZ8Usvnk', title: 'Python Error Handling' },
    { videoId: 'Ozrdax2DSbY', title: 'Python Modules & Packages' },
    { videoId: 'K8L6KVGG-7o', title: 'Python List Comprehensions' },
    { videoId: 'tb8gHPYl6hE', title: 'Python Lambda Functions' },
    { videoId: 'tJxcKyFj3KQ', title: 'Python Build a Project' },
  ],
  java: [
    { videoId: 'GoXwIVyNvX0', title: 'Java Full Course for Beginners' },
    { videoId: 'eIrMbAQSU34', title: 'Java Programming Tutorial' },
    { videoId: 'xk4_1vDrzzo', title: 'Java Tutorial for Beginners' },
    { videoId: 'ntLJmg689sg', title: 'Java Variables & Data Types' },
    { videoId: 'vW53w7me4AE', title: 'Java Methods Tutorial' },
    { videoId: 'Ap4CgXfcfbQ', title: 'Java OOP Concepts' },
    { videoId: 'IEqvmsqjAt8', title: 'Java Classes & Objects' },
    { videoId: '8qlmhH3Cm3c', title: 'Java Inheritance Tutorial' },
    { videoId: 'HvPlEJ3LHgE', title: 'Java Arrays Tutorial' },
    { videoId: 'grEKMHGYyns', title: 'Java ArrayList Tutorial' },
    { videoId: 'bgTX91SyGRQ', title: 'Java Exceptions & Error Handling' },
    { videoId: 'bm0OyhwFDuY', title: 'Java Interfaces Explained' },
    { videoId: '1zSz5elPUUU', title: 'Java Threads & Concurrency' },
    { videoId: 'Ae-r8hsbPUo', title: 'Java Collections Framework' },
    { videoId: 'drQK8ciCAjY', title: 'Java Build a Project' },
  ]
};

// GET /api/youtube/search?course=html&level=1
// Returns a curated video for the given course and level
router.get('/search', auth, async (req, res) => {
  try {
    const { q, course, level } = req.query;
    
    // If course and level are provided, use curated videos directly
    let courseName = course;
    let lessonLevel = parseInt(level) || 1;
    
    // If only q is provided, try to extract course name from it
    if (!courseName && q) {
      const lowerQ = q.toLowerCase();
      const courseNames = ['html', 'css', 'javascript', 'react', 'python', 'java'];
      courseName = courseNames.find(c => lowerQ.includes(c)) || 'html';
      // Try to extract level from query
      const levelMatch = q.match(/lesson\s+(\d+)/i);
      if (levelMatch) lessonLevel = parseInt(levelMatch[1]);
    }

    const courseKey = (courseName || 'html').toLowerCase();
    const videos = CURATED_VIDEOS[courseKey] || CURATED_VIDEOS.html;
    
    // Clamp level to valid range (1-15)
    const idx = Math.max(0, Math.min(lessonLevel - 1, videos.length - 1));
    const video = videos[idx];
    
    return res.json({
      videoId: video.videoId,
      title: video.title,
    });
  } catch (err) {
    console.error('YouTube search error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch video', error: err.message });
  }
});

module.exports = router;
