import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { useAuth } from '@/contexts/AuthContext';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardPlus, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { reports } = useInspection();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userReports = reports.filter((r) => r.createdBy === user?.id);
  const completed = userReports.filter((r) => r.status === 'completed').length;
  const pending = userReports.filter((r) => r.status === 'pending').length;

  const stats = [
    { label: 'Total Inspections', value: userReports.length, icon: FileText, color: 'text-primary' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">Inspector Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="animate-fade-in border-border shadow-sm">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Button size="lg" onClick={() => navigate('/create-inspection')} className="gap-2">
            <ClipboardPlus className="h-5 w-5" />
            Create New Inspection
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/reports')} className="gap-2">
            <FileText className="h-5 w-5" />
            View Previous Reports
          </Button>
        </div>

        {userReports.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Reports</h3>
            <div className="space-y-3">
              {userReports.slice(-5).reverse().map((r) => (
                <Card key={r.id} className="cursor-pointer border-border shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate(`/preview/${r.id}`)}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-foreground">{r.projectName}</p>
                      <p className="text-sm text-muted-foreground">{r.location} • {r.dateOfInspection}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
