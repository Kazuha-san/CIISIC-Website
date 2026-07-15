import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, FileText, CheckCircle, Clock, AlertTriangle, Search, 
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Check, X, 
  Grid, ListFilter, SlidersHorizontal, RefreshCw, LayoutDashboard
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SubmissionStatus } from '../types';
import { stripHTML } from '../lib/html';

export const AdminDashboard: React.FC = () => {
  const { submissions, updateSubmissionStatus, showToast, resetData, currentUser } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract all unique sectors for the filter dropdown
  const uniqueSectors = useMemo(() => {
    const sectors = submissions.map(s => s.company.industrySector);
    return ['All', ...Array.from(new Set(sectors))];
  }, [submissions]);

  // Compute metrics cards
  const metrics = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter(s => s.status === 'Pending').length,
      approved: submissions.filter(s => s.status === 'Approved').length,
      rejected: submissions.filter(s => s.status === 'Rejected').length
    };
  }, [submissions]);

  // Process search, filters, and sort
  const processedSubmissions = useMemo(() => {
    let result = [...submissions];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s => 
          s.details.title.toLowerCase().includes(q) ||
          s.company.companyName.toLowerCase().includes(q) ||
          s.company.representativeName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Sector filter
    if (sectorFilter !== 'All') {
      result = result.filter(s => s.company.industrySector === sectorFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      }
      if (sortBy === 'date-desc') {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      }
      if (sortBy === 'title-asc') {
        return a.details.title.localeCompare(b.details.title);
      }
      return 0;
    });

    return result;
  }, [submissions, searchQuery, statusFilter, sectorFilter, sortBy]);

  // Paginated subset
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedSubmissions.slice(startIndex, startIndex + itemsPerPage);
  }, [processedSubmissions, currentPage]);

  const totalPages = Math.ceil(processedSubmissions.length / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Quick Action handlers
  const handleQuickApprove = (id: string) => {
    updateSubmissionStatus(id, 'Approved', 'Quick Approved via Admin Ledger.');
    showToast(`Submission ${id} Approved successfully!`, 'success');
  };

  const handleQuickReject = (id: string) => {
    updateSubmissionStatus(id, 'Rejected', 'Rejected via Quick Actions.');
    showToast(`Submission ${id} marked as Rejected.`, 'info');
  };

  const handleResetData = () => {
    if (window.confirm('This will restore all default submissions and sign out current session. Proceed?')) {
      resetData();
      showToast('System data successfully reset to mock baseline.', 'info');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-[#8f6d3b]" />
            <h1 className="text-2xl font-black text-[#0b2545] font-display tracking-tight">
              Welcome back, {currentUser?.name || 'Admin'}
            </h1>
          </div>
          <p className="text-xs text-slate-500">Conduct administrative reviews, download attachments, and issue decisions on filed research statements.</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-none flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Submissions</div>
            <div className="text-3xl font-black text-[#0b2545] font-display leading-none">{metrics.total}</div>
          </div>
          <div className="p-3 bg-blue-50 text-[#0b2545] rounded-xl"><FileText className="h-5 w-5" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-none flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved</div>
            <div className="text-3xl font-black text-emerald-600 font-display leading-none">{metrics.approved}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="h-5 w-5" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-none flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rejected</div>
            <div className="text-3xl font-black text-red-600 font-display leading-none">{metrics.rejected}</div>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="h-5 w-5" /></div>
        </div>

      </div>

      {/* Query Filter panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-none space-y-4 mb-6">
        
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Title, Ref ID, Company Name, or Representative..."
              className="block w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0b2545] bg-slate-50/50"
            />
          </div>

          {/* Sorting and Filter dropdowns */}
          <div className="flex flex-wrap gap-3 items-center">
            
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:border-[#0b2545]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={sectorFilter}
              onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:border-[#0b2545]"
            >
              {uniqueSectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector === 'All' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:border-[#0b2545]"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>

          </div>

        </div>

      </div>

      {/* Main Submissions Ledger Table/Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-none overflow-hidden">
        
        {processedSubmissions.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <SlidersHorizontal className="h-10 w-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-slate-700 text-sm">No Matching Results Found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try refining your keyword search.</p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); }}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-[#0b2545] border border-slate-200"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] uppercase font-black tracking-widest font-mono">
                    <th className="px-6 py-4">Filing ID &amp; Date</th>
                    <th className="px-6 py-4">Filing Corporation</th>
                    <th className="px-6 py-4">Problem statement Title</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                  {paginatedSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Filing ID & Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col leading-tight">
                          <span className="font-mono font-bold text-[#0b2545] text-xs">{sub.id}</span>
                          <span className="text-[10px] text-slate-400 mt-1">{new Date(sub.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Filing Corporation */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-xs">
                          <span className="font-bold text-slate-800 leading-tight">{sub.company.companyName}</span>
                          <span className="text-xs text-slate-400 mt-0.5 truncate">{sub.company.representativeName} • {sub.company.email}</span>
                          <span className="text-[10px] text-[#8f6d3b] font-semibold mt-1 font-mono uppercase">{sub.company.industrySector}</span>
                        </div>
                      </td>

                      {/* Problem Title */}
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-bold text-[#0b2545] line-clamp-1 leading-normal">
                            {sub.details.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{stripHTML(sub.details.description)}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {getStatusBadge(sub.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/details/${sub.id}`}
                            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-[#0b2545] hover:text-white transition-all shadow-sm"
                            title="View Full Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          
                          {sub.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleQuickApprove(sub.id)}
                                className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                title="Approve Problem"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleQuickReject(sub.id)}
                                className="p-1.5 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Reject Problem"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stack Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {paginatedSubmissions.map((sub) => (
                <div key={sub.id} className="p-5 space-y-4">
                  
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">ID: {sub.id}</span>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">{sub.details.title}</h3>
                    </div>
                    <div className="shrink-0">{getStatusBadge(sub.status)}</div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong className="text-slate-700">Company:</strong> {sub.company.companyName}</p>
                    <p><strong className="text-slate-700">Sector:</strong> {sub.company.industrySector}</p>
                    <p><strong className="text-slate-700">Representative:</strong> {sub.company.representativeName}</p>
                    <p><strong className="text-slate-700">Filing Date:</strong> {new Date(sub.submittedDate).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-slate-100/60">
                    <span className="text-[10px] text-slate-400 font-mono">Filing Date: {new Date(sub.submittedDate).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Link
                        to={`/details/${sub.id}`}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#0b2545] flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" /> View Details
                      </Link>
                      {sub.status === 'Pending' && (
                        <button
                          onClick={() => handleQuickApprove(sub.id)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                <span className="text-xs text-slate-400 font-semibold">
                  Showing page {currentPage} of {totalPages} ({processedSubmissions.length} statements matching query)
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`h-8 w-8 text-xs font-bold rounded-lg border transition-all ${
                        currentPage === i + 1
                          ? 'bg-[#0b2545] border-[#0b2545] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
};
