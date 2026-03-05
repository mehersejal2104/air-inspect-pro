import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import AppHeader from '@/components/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Settings, ListChecks, Image } from 'lucide-react';

const adminCards = [
  { label: 'Edit Report Template', desc: 'Customize format, logos, and layout', icon: Settings, path: '/admin/template' },
  { label: 'Manage Checklist Points', desc: 'Add, edit, or remove default checklist items', icon: ListChecks, path: '/admin/checklist' },
  { label: 'View All Reports', desc: 'Browse all inspection reports', icon: FileText, path: '/reports' },
];

const AdminDashboard = () => {
  const { reports } = useInspection();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage inspection system settings</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-border shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{reports.length}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((c) => (
            <Card key={c.path} className="cursor-pointer border-border shadow-sm transition-all hover:shadow-md hover:border-primary/30" onClick={() => navigate(c.path)}>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
