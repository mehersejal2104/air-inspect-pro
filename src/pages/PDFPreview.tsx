import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Shield, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PDFPreview = () => {
  const { id } = useParams();
  const { reports, template } = useInspection();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  const report = reports.find((r) => r.id === id);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`inspection-${report?.inspectionReportNo || id}.pdf`);
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center p-20">
          <p className="text-muted-foreground">Report not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="no-print mb-6 flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>

        <div className="mx-auto max-w-[210mm] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <div ref={reportRef} className="p-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div className="mb-1 flex items-start justify-between border border-foreground/20">
              <div className="flex items-center gap-3 border-r border-foreground/20 p-3" style={{ width: '35%' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <span className="font-industrial text-lg font-bold tracking-wider text-foreground">ARKADE</span>
              </div>
              <div className="flex-1 text-xs">
                <div className="grid grid-cols-2">
                  {[
                    ['Format No.:', template.formatNo],
                    ['Revision No.:', template.revisionNo],
                    ['Issued Date:', template.issueDate],
                    ['Revision Date:', ''],
                    ['Project:', report.projectName],
                    ['Inspection Report No:', report.inspectionReportNo],
                    ['Name of Contractor:', report.contractorName],
                    ['Date of Inspection:', report.dateOfInspection],
                    ['Make/Model:', report.makeModel],
                    ['Identification No.:', report.identificationNo],
                    ['Location:', report.location],
                    ['Name of Operator:', report.operatorName],
                  ].map(([label, val], i) => (
                    <div key={i} className="border-b border-foreground/10 px-2 py-1" style={{ backgroundColor: i < 2 ? 'hsl(24 95% 53% / 0.08)' : undefined }}>
                      <span className="font-semibold text-foreground">{label}</span> <span className="text-foreground/80">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center border-l border-foreground/20 p-3" style={{ width: '10%' }}>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <span className="mt-1 text-center text-[8px] font-bold leading-tight text-foreground">SAFETY FIRST</span>
                </div>
              </div>
            </div>

            {/* Title Bar */}
            <div className="mb-1 flex items-center border-l-4 border-primary bg-primary/10 px-4 py-2">
              <h2 className="font-industrial text-sm font-bold tracking-widest text-foreground">{template.reportTitle}</h2>
            </div>

            {/* Approved / Checker / Maker */}
            <div className="mb-4 flex justify-end gap-8 text-xs text-foreground/70">
              <span><strong>Approved By:</strong> {report.approvedBy}</span>
              <span><strong>Checker:</strong> {report.verifiedBy}</span>
              <span><strong>Maker:</strong> {report.checkedBy}</span>
            </div>

            {/* Checklist Table */}
            <div className="mb-6 border border-foreground/20">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-foreground/5">
                    <th className="border-r border-foreground/20 px-3 py-2 text-left font-semibold text-foreground" style={{ width: '50%' }}>Checklist Points</th>
                    <th className="border-r border-foreground/20 px-3 py-2 text-center font-semibold text-foreground" style={{ width: '25%' }}>Before</th>
                    <th className="px-3 py-2 text-center font-semibold text-foreground" style={{ width: '25%' }}>After</th>
                  </tr>
                </thead>
                <tbody>
                  {report.checklist.map((item, i) => (
                    <tr key={i} className="border-t border-foreground/10">
                      <td className="border-r border-foreground/20 px-3 py-1.5 text-foreground">{item.point}</td>
                      <td className="border-r border-foreground/20 px-3 py-1.5 text-center text-foreground">{item.before}</td>
                      <td className="px-3 py-1.5 text-center text-foreground">{item.after}</td>
                    </tr>
                  ))}
                  {report.checklist.length === 0 && (
                    <tr><td colSpan={3} className="px-3 py-8 text-center text-foreground/40">No checklist items</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="mb-1 text-xs font-semibold text-foreground">Description:</p>
              <p className="min-h-[60px] whitespace-pre-wrap text-xs text-foreground/80">{report.description || '—'}</p>
            </div>

            {/* Signature Footer */}
            <div className="border-t-2 border-foreground/20 pt-4">
              <div className="flex justify-between text-xs">
                <div>
                  <p className="font-semibold text-foreground">Checked By:</p>
                  <p className="mt-6 border-t border-foreground/30 pt-1 text-foreground/70">{report.checkedBy}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">Verified By:</p>
                  <p className="mt-6 border-t border-foreground/30 pt-1 text-foreground/70">{report.verifiedBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDFPreview;
