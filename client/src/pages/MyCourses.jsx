import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { BookOpen, PlayCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/progress/my-courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch my courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
  }

  const inProgress = courses.filter(c => c.completionPercentage < 100);
  const completed = courses.filter(c => c.completionPercentage === 100);

  return (
    <div className="bg-[var(--color-base)] h-full text-[var(--color-text-primary)] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
            <BookOpen className="text-indigo-500 w-8 h-8" /> My Courses
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Track your progress and pick up exactly where you left off.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-card)] rounded-2xl border border-[var(--color-ui-border)] shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your learning journey begins here</h2>
            <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-8">
              It looks like you haven't started any courses yet. Choose a topic and write your first line of code today!
            </p>
            <Link to="/practice/html/1">
              <Button size="lg" className="px-8 shadow-lg shadow-indigo-500/20">
                Start Practicing HTML
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* In Progress */}
            {inProgress.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <PlayCircle className="text-orange-500 w-6 h-6" /> In Progress
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgress.map((cp, idx) => (
                    <Card key={idx} className="flex flex-col bg-[var(--color-card)] border border-[var(--color-ui-border)] hover:border-indigo-300 transition-all hover:shadow-lg">
                      <div className="h-40 rounded-xl bg-indigo-50 mb-5 border border-indigo-100 overflow-hidden">
                         {cp.course.thumbnail ? (
                           <img src={cp.course.thumbnail} alt={cp.course.title} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-indigo-500 font-extrabold text-5xl">
                             {cp.course.category}
                           </div>
                         )}
                      </div>
                      <h3 className="font-bold text-xl mb-2 truncate">{cp.course.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-grow">{cp.course.description || 'Continue your learning journey.'}</p>
                      
                      <div className="space-y-2 mb-6 mt-auto">
                        <div className="flex justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
                          <span>{cp.completedLessonsCount} Lessons Completed</span>
                          <span className="text-indigo-600">{Math.round(cp.completionPercentage || (cp.completedLessonsCount * 10))}%</span>
                        </div>
                        <div className="w-full bg-[var(--color-surface)] rounded-full h-2">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${cp.completionPercentage || (cp.completedLessonsCount * 10)}%` }}></div>
                        </div>
                      </div>
                      
                      <Link to={`/practice/${cp.course.category.toLowerCase()}/${cp.completedLessonsCount + 1}`}>
                        <Button className="w-full justify-between group">
                          Continue Learning
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle className="text-green-500 w-6 h-6" /> Completed
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completed.map((cp, idx) => (
                    <Card key={idx} className="flex flex-col bg-[var(--color-card)] border border-green-200 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                      <div className="h-32 rounded-xl bg-green-50 mb-5 border border-green-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/10"></div>
                        <CheckCircle className="w-12 h-12 text-green-500 absolute" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{cp.course.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{cp.course.category}</p>
                      <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 mt-auto">
                        Review Course
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
