import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChecklistItem {
  id: string;
  point: string;
  before: 'OK' | 'Not OK' | 'N/A' | '';
  after: 'OK' | 'Not OK' | 'N/A' | '';
}

export interface InspectionReport {
  id: string;
  projectName: string;
  contractorName: string;
  makeModel: string;
  location: string;
  identificationNo: string;
  inspectionReportNo: string;
  dateOfInspection: string;
  operatorName: string;
  checklist: ChecklistItem[];
  description: string;
  checkedBy: string;
  verifiedBy: string;
  approvedBy: string;
  status: 'completed' | 'pending';
  createdAt: string;
  createdBy: string;
}

export interface TemplateConfig {
  formatNo: string;
  revisionNo: string;
  issueDate: string;
  reportTitle: string;
  companyLogoUrl: string;
  safetyLogoUrl: string;
  layoutStyle: 'modern' | 'classic';
}

interface InspectionContextType {
  reports: InspectionReport[];
  addReport: (report: InspectionReport) => void;
  template: TemplateConfig;
  updateTemplate: (template: TemplateConfig) => void;
  masterChecklist: string[];
  setMasterChecklist: (items: string[]) => void;
}

const defaultTemplate: TemplateConfig = {
  formatNo: 'ADL-OH&S-C029',
  revisionNo: 'R0',
  issueDate: '1st September 25',
  reportTitle: 'AIR COMPRESSOR INSPECTION',
  companyLogoUrl: '',
  safetyLogoUrl: '',
  layoutStyle: 'modern',
};

const defaultChecklist = [
  'General condition of compressor',
  'Oil level check',
  'Belt tension and condition',
  'Air filter condition',
  'Safety valve operation',
  'Pressure gauge accuracy',
  'Drain valve operation',
  'Electrical connections',
  'Vibration levels',
  'Cooling system check',
];

const InspectionContext = createContext<InspectionContextType | null>(null);

export const InspectionProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<InspectionReport[]>(() => {
    const stored = localStorage.getItem('inspection_reports');
    return stored ? JSON.parse(stored) : [];
  });

  const [template, setTemplate] = useState<TemplateConfig>(() => {
    const stored = localStorage.getItem('inspection_template');
    return stored ? JSON.parse(stored) : defaultTemplate;
  });

  const [masterChecklist, setMasterChecklistState] = useState<string[]>(() => {
    const stored = localStorage.getItem('inspection_master_checklist');
    return stored ? JSON.parse(stored) : defaultChecklist;
  });

  const addReport = (report: InspectionReport) => {
    const updated = [...reports, report];
    setReports(updated);
    localStorage.setItem('inspection_reports', JSON.stringify(updated));
  };

  const updateTemplate = (t: TemplateConfig) => {
    setTemplate(t);
    localStorage.setItem('inspection_template', JSON.stringify(t));
  };

  const setMasterChecklist = (items: string[]) => {
    setMasterChecklistState(items);
    localStorage.setItem('inspection_master_checklist', JSON.stringify(items));
  };

  return (
    <InspectionContext.Provider value={{ reports, addReport, template, updateTemplate, masterChecklist, setMasterChecklist }}>
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspection = () => {
  const ctx = useContext(InspectionContext);
  if (!ctx) throw new Error('useInspection must be used within InspectionProvider');
  return ctx;
};
