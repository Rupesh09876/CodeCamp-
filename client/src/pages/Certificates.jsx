import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Lock, Award, Shield, FileCheck, Share2, Crown, X, Printer, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import api from '../api';

const Certificates = () => {
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isPro = user?.plan === 'pro';

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isPro) return;
      try {
        const res = await api.get('/progress/my-courses');
        // Filter for courses with 100% completion
        const completed = res.data.filter(p => p.completionPercentage === 100);
        setCompletedCourses(completed);
      } catch (err) {
        console.error('Failed to fetch certificates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [isPro]);

  const handleDownload = () => {
    window.print();
  };

  if (isPro && loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--color-base)] p-6">
        <Card className="max-w-2xl w-full text-center p-12 border-0 shadow-2xl bg-white rounded-[32px]">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black mb-4 text-slate-900 tracking-tight">Pro Certificates</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Professional certificates are exclusive to CodeCamp Pro members. Upgrade now to earn industry-recognized credentials and boost your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl gap-2">
                <Crown className="w-5 h-5 text-yellow-300" /> Upgrade to Pro
              </Button>
            </Link>
            <Link to="/practice">
              <Button variant="ghost" className="!text-black !border-slate-300 hover:bg-slate-50">Return to Practice</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-base)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 text-slate-900 tracking-tight flex items-center gap-3">
              <Shield className="w-10 h-10 text-indigo-600" /> Professional Certificates
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg">Earn and manage your professional credentials here.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Crown className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Active Plan</p>
              <p className="text-sm font-black text-slate-900">CodeCamp Pro</p>
            </div>
          </div>
        </div>

        {/* Certificate List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedCourses.length > 0 ? completedCourses.map((progress) => (
            <Card 
              key={progress.course._id} 
              className="flex flex-col p-6 rounded-3xl transition-all relative group border bg-white border-indigo-200 shadow-xl shadow-indigo-100/20"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                  <FileCheck className="w-6 h-6" />
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              <h3 className="text-lg font-bold mb-1 text-slate-900 leading-tight flex-grow">{progress.course.title}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">CODECAMP • {progress.course.category}</p>

              <div className="pt-4 border-t border-slate-100">
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 gap-2"
                  onClick={() => setSelectedCert(progress.course)}
                >
                  <Award className="w-4 h-4" /> View Certificate
                </Button>
              </div>
            </Card>
          )) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Award className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Certificates Yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">Complete a course to 100% to unlock your professional certificate.</p>
              <Link to="/practice">
                <Button className="bg-indigo-600 text-white px-8">Browse Courses</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full flex flex-col gap-4 animate-in zoom-in-95 duration-200 print:p-0">
            
            {/* Modal Controls (Hide during print) */}
            <div className="flex justify-between items-center print:hidden">
              <h2 className="text-white font-bold text-xl flex items-center gap-2">
                <Award className="text-yellow-400" /> Certificate Preview
              </h2>
              <div className="flex gap-2">
                <Button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 border-0" onClick={handleDownload}>
                   <Printer className="w-5 h-5" />
                </Button>
                <Button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 border-0" onClick={() => setSelectedCert(null)}>
                   <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* THE ACTUAL CERTIFICATE (Designed to look professional) */}
            <div className="bg-white p-12 md:p-20 relative border-[16px] border-slate-900 shadow-2xl rounded-sm print:m-0 print:border-0 print:shadow-none min-h-[600px] flex flex-col">
              
              {/* Decorative Corner Borders */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-indigo-600 m-4"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-indigo-600 m-4"></div>

              {/* Logo & Header */}
              <div className="text-center mb-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="text-sm font-black uppercase tracking-[0.5em] text-slate-400 mb-2">Certificate of Achievement</div>
                <h1 className="text-slate-900 font-serif text-5xl md:text-6xl italic">Certificate of Completion</h1>
              </div>

              {/* Recipient Info */}
              <div className="text-center flex-grow flex flex-col justify-center">
                <p className="text-xl text-slate-500 font-medium mb-4">This is to certify that</p>
                <h2 className="text-slate-900 font-black text-4xl md:text-6xl underline underline-offset-8 mb-8 decoration-indigo-600">
                   {user?.name || 'STUDENT NAME'}
                </h2>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-2">
                  has successfully completed the requirements for the professional course
                </p>
                <h3 className="text-slate-900 font-extrabold text-2xl md:text-3xl mb-8 uppercase tracking-tight">
                  {selectedCert.title}
                </h3>
              </div>

              {/* Signatures & Verification */}
              <div className="flex flex-col md:flex-row justify-between items-end gap-12 pt-12 border-t border-slate-100">
                <div className="text-center w-full md:w-auto">
                   <div className="font-serif italic text-2xl text-slate-800 mb-2">CodeCamp Team</div>
                   <div className="h-px bg-slate-300 w-48 mb-2 mx-auto"></div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Training Director</div>
                </div>

                <div className="flex flex-col items-center gap-2">
                   <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-300 uppercase rotate-12">
                      Verified QR Code
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: CC-CERT-{selectedCert.id}-2026</p>
                </div>

                <div className="text-center w-full md:w-auto">
                   <div className="font-bold text-lg text-slate-800 mb-2">April 25, 2026</div>
                   <div className="h-px bg-slate-300 w-48 mb-2 mx-auto"></div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</div>
                </div>
              </div>

              {/* Bottom Branding */}
              <div className="mt-12 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                CodeCamp - The Future of Learning
              </div>
            </div>
            
            {/* Modal Footer Controls */}
            <div className="flex justify-center gap-4 print:hidden">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 py-3 font-bold" onClick={handleDownload}>
                Download Certificate
              </Button>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={() => setSelectedCert(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
