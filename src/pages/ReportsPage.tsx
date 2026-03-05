import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { useAuth } from '@/contexts/AuthContext';
import AppHeader from '@/components/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ReportsPage = () => {
  const { reports } = useInspection();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userReports = user?.role === 'admin' ? reports : reports.filter((r) => r.createdBy === user?.id);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">All Reports</h2>
        </div>

        {userReports.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No reports found.</div>
        ) : (
          <div className="space-y-3">
            {userReports.map((r) => (
              <Card key={r.id} className="cursor-pointer border-border shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate(`/preview/${r.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-foreground">{r.projectName}</p>
                    <p className="text-sm text-muted-foreground">{r.location} • {r.dateOfInspection} • Report #{r.inspectionReportNo}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
