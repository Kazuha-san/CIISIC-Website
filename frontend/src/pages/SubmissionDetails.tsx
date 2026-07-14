import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, FileText, Settings, ShieldAlert, ArrowLeft, CheckCircle, 
  XCircle, Clock, MessageSquare, Download, Calendar, Sparkles, AlertTriangle,
  Edit, Save, X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const SubmissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { submissions, updateSubmissionStatus, updateSubmission, showToast } = useApp();

  const submission = submissions.find((sub) => sub.id === id);

  const [remarks, setRemarks] = useState(submission?.reviewRemarks || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields state
  const [editTitle, setEditTitle] = useState(submission?.details.title || '');
  const [editCompanyName, setEditCompanyName] = useState(submission?.company.companyName || '');
  const [editIndustryCategory, setEditIndustryCategory] = useState(submission?.company.industryName || '');
  const [editIndustrySector, setEditIndustrySector] = useState(submission?.company.industrySector || '');
  const [editDescription, setEditDescription] = useState(submission?.details.description || '');
  const [editBusinessChallenge, setEditBusinessChallenge] = useState(submission?.details.businessChallenge || '');
  const [editExistingProcess, setEditExistingProcess] = useState(submission?.details.existingProcess || '');
  const [editExpectedOutcome, setEditExpectedOutcome] = useState(submission?.details.expectedOutcome || '');
  const [editProjectObjectives, setEditProjectObjectives] = useState(submission?.details.projectObjectives || '');
  const [editTechnologies, setEditTechnologies] = useState(submission?.technical.requiredTechnologies.join(', ') || '');
  const [editSkills, setEditSkills] = useState(submission?.technical.requiredSkills.join(', ') || '');
  const [editBranches, setEditBranches] = useState(submission?.technical.preferredBranches.join(', ') || '');
  const [editDuration, setEditDuration] = useState(submission?.technical.expectedDuration || '');

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#0b2545] font-display">Submission Not Found</h2>
        <p className="text-sm text-slate-500">The requested problem statement reference ID does not exist or has been removed.</p>
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2545] bg-[#eef4f8] px-4 py-2 rounded-xl border border-blue-100">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateSubmissionStatus(submission.id, 'Approved', remarks.trim() || 'Approved by CII Administration.');
      setIsSubmitting(false);
      showToast(`Submission ${submission.id} has been APPROVED.`, 'success');
      navigate('/admin/dashboard');
    }, 600);
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      showToast('A review remark/rejection reason is required to reject a submission.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      updateSubmissionStatus(submission.id, 'Rejected', remarks.trim());
      setIsSubmitting(false);
      showToast(`Submission ${submission.id} has been REJECTED/RETURNED with reasons.`, 'info');
      navigate('/admin/dashboard');
    }, 600);
  };

  const handleSave = () => {
    if (!editTitle.trim() || editTitle.trim().length < 25) {
      showToast('Title must be at least 25 characters.', 'error');
      return;
    }
    if (!editDescription.trim() || editDescription.trim().length < 25) {
      showToast('Description must be at least 25 characters.', 'error');
      return;
    }

    const updatedSubmission = {
      ...submission,
      company: {
        ...submission.company,
        companyName: editCompanyName,
        industryName: editIndustryCategory,
        industrySector: editIndustrySector
      },
      details: {
        ...submission.details,
        title: editTitle,
        description: editDescription,
        businessChallenge: editBusinessChallenge,
        existingProcess: editExistingProcess,
        expectedOutcome: editExpectedOutcome,
        projectObjectives: editProjectObjectives
      },
      technical: {
        ...submission.technical,
        requiredTechnologies: editTechnologies.split(',').map(s => s.trim()).filter(Boolean),
        requiredSkills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredBranches: editBranches.split(',').map(s => s.trim()).filter(Boolean),
        expectedDuration: editDuration
      },
      editedByAdmin: true
    };

    updateSubmission(updatedSubmission);
    setIsEditing(false);
    showToast('Submission details updated and marked as Edited by CII Admin.', 'success');
  };

  const handleCancel = () => {
    setEditTitle(submission.details.title);
    setEditCompanyName(submission.company.companyName);
    setEditIndustryCategory(submission.company.industryName);
    setEditIndustrySector(submission.company.industrySector);
    setEditDescription(submission.details.description);
    setEditBusinessChallenge(submission.details.businessChallenge);
    setEditExistingProcess(submission.details.existingProcess);
    setEditExpectedOutcome(submission.details.expectedOutcome);
    setEditProjectObjectives(submission.details.projectObjectives);
    setEditTechnologies(submission.technical.requiredTechnologies.join(', '));
    setEditSkills(submission.technical.requiredSkills.join(', '));
    setEditBranches(submission.technical.preferredBranches.join(', '));
    setEditDuration(submission.technical.expectedDuration);
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" /> Approved for Distribution
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-4 w-4 text-red-600" /> Rejected / Returned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock className="h-4 w-4 text-amber-500" /> Pending Administrative Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title block with back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1 flex-1">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0b2545] transition-colors mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Command Ledger
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              REF ID: {submission.id}
            </span>
            <span className="text-xs text-slate-400 font-medium">Submitted on: {new Date(submission.submittedDate).toLocaleString()}</span>
            {submission.editedByAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                Edited by CII Admin
              </span>
            )}
          </div>
          {isEditing ? (
            <div className="mt-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Filing Problem Statement Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-lg font-bold text-[#0b2545] bg-slate-50/50 focus:outline-none focus:border-[#0b2545]"
                placeholder="Problem statement title..."
              />
            </div>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-display tracking-tight mt-1 leading-tight">
              {submission.details.title}
            </h1>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {getStatusBadge(submission.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Details Sections) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Company Profile */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-[#0b2545] font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="h-5 w-5 text-[#8f6d3b]" /> Industry SPOC Profile
            </h2>
            
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Company Name</span>
                  <input
                    type="text"
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Industry category</span>
                  <input
                    type="text"
                    value={editIndustryCategory}
                    onChange={(e) => setEditIndustryCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Company Name</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{submission.company.companyName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Industry category</span>
                  <span className="font-semibold text-slate-700 block mt-0.5">{submission.company.industryName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SPOC Name</span>
                  <span className="font-semibold text-slate-700 block mt-0.5">{submission.company.representativeName} ({submission.company.designation})</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contact Information</span>
                  <span className="text-slate-600 block mt-0.5">{submission.company.email} • {submission.company.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Corporate website</span>
                  <a href={`https://${submission.company.website.replace(/https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#8f6d3b] hover:underline block mt-0.5 font-medium">{submission.company.website}</a>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Problem Statement */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-[#0b2545] font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="h-5 w-5 text-[#8f6d3b]" /> Problem Statement
            </h2>

            {isEditing ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Problem Statement Description</span>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed bg-slate-50/50"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Expected Outcome</span>
                  <textarea
                    rows={3}
                    value={editExpectedOutcome}
                    onChange={(e) => setEditExpectedOutcome(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Problem Statement Description</span>
                  <p className="text-slate-600 leading-relaxed font-medium">{submission.details.description}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expected Outcome</span>
                  <p className="text-slate-600 leading-relaxed font-medium">{submission.details.expectedOutcome}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Deliverables & Terms */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-[#0b2545] font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5 text-[#8f6d3b]" /> Supporting Documents/Attachments
            </h2>

            <div className="space-y-5 text-xs sm:text-sm">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expected Project Deliverables</span>
                <p className="text-slate-600 mt-1 leading-relaxed font-medium">{submission.additional.expectedDeliverables}</p>
              </div>

              {submission.additional.additionalNotes && (
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Additional Notes</span>
                  <p className="text-slate-600 mt-1 leading-relaxed font-medium italic">{submission.additional.additionalNotes}</p>
                </div>
              )}

              {/* Mock Attachment download panel */}
              {submission.additional.fileAttachmentName ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="leading-tight">
                      <p className="font-bold text-slate-800 text-xs truncate max-w-xs">{submission.additional.fileAttachmentName}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">PDF Attachment Verified</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Initiating mock download: ${submission.additional.fileAttachmentName}`)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-[#0b2545] hover:border-[#0b2545] px-3.5 py-1.5 rounded-lg text-xs font-black shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-500 font-semibold italic text-center">
                  No additional data sheets or attachments filed with this statement.
                </div>
              )}

              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 text-[11px] text-slate-500 leading-normal flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Representative official declaration signed and verified. Intellectual property conditions acknowledged by organization.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Review remarks input and Decision buttons) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 space-y-5 sticky top-24">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-[#8f6d3b]" /> Administrative Actions
            </h3>
            
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Review remarks &amp; Instructions
                </label>
                <textarea
                  rows={5}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter comments detailing why this statement is being approved, or reasons and workarounds in case of rejection/return for revisions."
                  className="block w-full p-3.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0b2545] bg-slate-50/50 resize-y leading-relaxed"
                ></textarea>
                <p className="text-[10px] text-slate-400 leading-normal">
                  These remarks will be displayed instantly on the Industry partner&apos;s workspace.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting || isEditing}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-emerald-700/90 hover:bg-emerald-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Approve Statement
                </button>

                <button
                  onClick={handleReject}
                  disabled={isSubmitting || isEditing}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-red-700/90 hover:bg-red-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Reject &amp; Require Reason
                </button>

                <div className="pt-2 border-t border-slate-100">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex justify-center items-center gap-1.5 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 text-[#8f6d3b]" /> Edit Fields
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSave}
                        className="flex justify-center items-center gap-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#0b2545] hover:bg-[#134074] transition-all shadow-sm cursor-pointer"
                      >
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex justify-center items-center gap-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all shadow-sm cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Review Status:</span>
                <span className="font-bold text-slate-700 font-mono">{submission.status}</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
