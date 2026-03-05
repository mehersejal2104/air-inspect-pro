import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { toast } from 'sonner';

const ManageChecklist = () => {
  const { masterChecklist, setMasterChecklist } = useInspection();
  const navigate = useNavigate();
  const [items, setItems] = useState([...masterChecklist]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSave = () => {
    setMasterChecklist(items);
    toast.success('Checklist master points saved');
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
          <h2 className="text-2xl font-bold text-foreground">Manage Checklist Points</h2>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Default Checklist Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <Input value={item} onChange={(e) => updateItem(i, e.target.value)} className="flex-1" />
                <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}

            <div className="flex items-center gap-2 pt-2">
              <Input placeholder="New checklist point..." value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} className="flex-1" />
              <Button variant="outline" size="sm" onClick={addItem} className="gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManageChecklist;
