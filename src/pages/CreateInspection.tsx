import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection, ChecklistItem, InspectionReport } from '@/contexts/InspectionContext';
import { useAuth } from '@/contexts/AuthContext';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CreateInspection = () => {
  const { masterChecklist, addReport } = useInspection();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectName: '',
    contractorName: '',
    makeModel: '',
    location: '',
    identificationNo: '',
    inspectionReportNo: '',
    dateOfInspection: '',
    operatorName: '',
    description: '',
    checkedBy: '',
    verifiedBy: '',
    approvedBy: '',
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    masterChecklist.map((point, i) => ({ id: `cl-${i}`, point, before: '', after: '' }))
  );

  const updateField = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const addChecklistItem = () => {
    setChecklist((c) => [...c, { id: `cl-${Date.now()}`, point: '', before: '', after: '' }]);
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((c) => c.filter((item) => item.id !== id));
  };

  const updateChecklist = (id: string, field: keyof ChecklistItem, value: string) => {
    setChecklist((c) => c.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName || !form.dateOfInspection) {
      toast.error('Please fill in required fields');
      return;
    }
    const report: InspectionReport = {
      id: `rpt-${Date.now()}`,
      ...form,
      checklist,
      status: 'completed',
      createdAt: new Date().toISOString(),
      createdBy: user?.id || '',
    };
    addReport(report);
    toast.success('Inspection report created');
    navigate(`/preview/${report.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Create New Inspection</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle className="text-lg">Project Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                { key: 'projectName', label: 'Project Name *', type: 'text' },
                { key: 'contractorName', label: 'Name of Contractor', type: 'text' },
                { key: 'makeModel', label: 'Make/Model', type: 'text' },
                { key: 'location', label: 'Location', type: 'text' },
                { key: 'identificationNo', label: 'Identification No.', type: 'text' },
                { key: 'inspectionReportNo', label: 'Inspection Report No.', type: 'text' },
                { key: 'dateOfInspection', label: 'Date of Inspection *', type: 'date' },
                { key: 'operatorName', label: 'Name of Operator', type: 'text' },
              ].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input id={f.key} type={f.type} value={(form as any)[f.key]} onChange={(e) => updateField(f.key, e.target.value)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Checklist</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addChecklistItem} className="gap-1">
                <Plus className="h-4 w-4" /> Add Point
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Checklist Point</th>
                      <th className="w-36 px-3 py-2 text-left font-medium text-muted-foreground">Before</th>
                      <th className="w-36 px-3 py-2 text-left font-medium text-muted-foreground">After</th>
                      <th className="w-12 px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {checklist.map((item) => (
                      <tr key={item.id} className="border-b border-border">
                        <td className="px-3 py-2">
                          <Input value={item.point} onChange={(e) => updateChecklist(item.id, 'point', e.target.value)} placeholder="Enter checklist point" className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
                        </td>
                        <td className="px-3 py-2">
                          <Select value={item.before} onValueChange={(v) => updateChecklist(item.id, 'before', v)}>
                            <SelectTrigger className="h-8"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OK">OK</SelectItem>
                              <SelectItem value="Not OK">Not OK</SelectItem>
                              <SelectItem value="N/A">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Select value={item.after} onValueChange={(v) => updateChecklist(item.id, 'after', v)}>
                            <SelectTrigger className="h-8"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OK">OK</SelectItem>
                              <SelectItem value="Not OK">Not OK</SelectItem>
                              <SelectItem value="N/A">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeChecklistItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle className="text-lg">Description</CardTitle></CardHeader>
            <CardContent>
              <Textarea rows={5} placeholder="Enter detailed description..." value={form.description} onChange={(e) => updateField('description', e.target.value)} />
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle className="text-lg">Signatures</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Checked By</Label>
                <Input value={form.checkedBy} onChange={(e) => updateField('checkedBy', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Verified By</Label>
                <Input value={form.verifiedBy} onChange={(e) => updateField('verifiedBy', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Approved By</Label>
                <Input value={form.approvedBy} onChange={(e) => updateField('approvedBy', e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" size="lg">Submit & Preview Report</Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('/dashboard')}>Cancel</Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateInspection;
