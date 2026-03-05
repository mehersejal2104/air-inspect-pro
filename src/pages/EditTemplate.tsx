import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const EditTemplate = () => {
  const { template, updateTemplate } = useInspection();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...template });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    updateTemplate(form);
    toast.success('Template saved successfully');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Edit Report Template</h2>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader><CardTitle>Template Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'formatNo', label: 'Format Number' },
              { key: 'revisionNo', label: 'Revision Number' },
              { key: 'issueDate', label: 'Issue Date' },
              { key: 'reportTitle', label: 'Report Title' },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label>{f.label}</Label>
                <Input value={(form as any)[f.key]} onChange={(e) => update(f.key, e.target.value)} />
              </div>
            ))}

            <div className="space-y-1.5">
              <Label>Layout Style</Label>
              <Select value={form.layoutStyle} onValueChange={(v) => update('layoutStyle', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Save Template
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditTemplate;
