
import React, { useState } from 'react';
import { VaultTable, VaultField } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TableFormProps {
  onSubmit: (table: VaultTable) => void;
  onCancel: () => void;
}

const TableForm: React.FC<TableFormProps> = ({ onSubmit, onCancel }) => {
  const [tableName, setTableName] = useState('');
  const [description, setDescription] = useState('');
  const [purposes, setPurposes] = useState<string[]>([]);
  const [purposeInput, setPurposeInput] = useState('');
  const [fields, setFields] = useState<VaultField[]>([]);
  const [currentField, setCurrentField] = useState<Partial<VaultField>>({
    name: '',
    type: 'string',
    sensitivity: 'LOW',
    accessControl: []
  });
  const [accessControlInput, setAccessControlInput] = useState('');

  const handleAddPurpose = () => {
    if (!purposeInput.trim()) return;
    setPurposes([...purposes, purposeInput.trim()]);
    setPurposeInput('');
  };

  const handleRemovePurpose = (index: number) => {
    setPurposes(purposes.filter((_, i) => i !== index));
  };

  const handleAddAccessControl = () => {
    if (!accessControlInput.trim()) return;
    setCurrentField({
      ...currentField,
      accessControl: [...(currentField.accessControl || []), accessControlInput.trim()]
    });
    setAccessControlInput('');
  };

  const handleRemoveAccessControl = (index: number) => {
    setCurrentField({
      ...currentField,
      accessControl: (currentField.accessControl || []).filter((_, i) => i !== index)
    });
  };

  const handleAddField = () => {
    if (!currentField.name || !currentField.type || !currentField.sensitivity) {
      toast({
        title: "Error",
        description: "Please complete all field properties",
        variant: "destructive"
      });
      return;
    }

    setFields([
      ...fields, 
      {
        name: currentField.name!,
        type: currentField.type!,
        sensitivity: currentField.sensitivity as 'LOW' | 'MEDIUM' | 'HIGH',
        accessControl: currentField.accessControl || []
      }
    ]);
    
    setCurrentField({
      name: '',
      type: 'string',
      sensitivity: 'LOW',
      accessControl: []
    });
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableName || !description || purposes.length === 0 || fields.length === 0) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    const table: VaultTable = {
      tableName,
      description,
      purpose: purposes,
      fields
    };

    onSubmit(table);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-background rounded-md">
      <div className="space-y-4">
        <div>
          <Label htmlFor="tableName">Table Name</Label>
          <Input 
            id="tableName" 
            value={tableName} 
            onChange={(e) => setTableName(e.target.value)}
            placeholder="e.g., user_profile"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of this table"
            rows={2}
          />
        </div>

        <div>
          <Label>Purposes</Label>
          <div className="flex gap-2">
            <Input 
              value={purposeInput} 
              onChange={(e) => setPurposeInput(e.target.value)}
              placeholder="e.g., verification"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddPurpose} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {purposes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {purposes.map((purpose, index) => (
                <div 
                  key={index}
                  className="bg-vault-100 text-vault-800 px-2 py-1 rounded-md text-sm flex items-center"
                >
                  {purpose}
                  <button
                    type="button"
                    onClick={() => handleRemovePurpose(index)}
                    className="ml-2 text-vault-600 hover:text-vault-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Table Fields</h3>
        
        <div className="space-y-4 p-4 border rounded-md bg-background">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="fieldName">Field Name</Label>
              <Input 
                id="fieldName" 
                value={currentField.name} 
                onChange={(e) => setCurrentField({...currentField, name: e.target.value})}
                placeholder="e.g., first_name"
              />
            </div>
            
            <div>
              <Label htmlFor="fieldType">Type</Label>
              <Select 
                value={currentField.type} 
                onValueChange={(value) => setCurrentField({...currentField, type: value})}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fieldSensitivity">Sensitivity</Label>
              <Select 
                value={currentField.sensitivity} 
                onValueChange={(value) => setCurrentField({...currentField, sensitivity: value as any})}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Access Control</Label>
            <div className="flex gap-2">
              <Input 
                value={accessControlInput} 
                onChange={(e) => setAccessControlInput(e.target.value)}
                placeholder="e.g., kyc_agent"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddAccessControl} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {(currentField.accessControl?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentField.accessControl?.map((role, index) => (
                  <div 
                    key={index}
                    className="bg-security-100 text-security-800 px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRemoveAccessControl(index)}
                      className="ml-2 text-security-600 hover:text-security-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            type="button" 
            variant="secondary" 
            className="w-full mt-2"
            onClick={handleAddField}
          >
            Add Field
          </Button>
        </div>

        {fields.length > 0 && (
          <div className="mt-4 border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="py-2 px-4 text-left">Field Name</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Sensitivity</th>
                  <th className="py-2 px-4 text-left">Access Control</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{field.name}</td>
                    <td className="py-2 px-4">{field.type}</td>
                    <td className="py-2 px-4">
                      <div className={`security-badge-${field.sensitivity.toLowerCase()}`}>
                        {field.sensitivity}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-wrap gap-1">
                        {field.accessControl.map((role, i) => (
                          <span key={i} className="text-xs bg-slate-100 px-1 rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Table</Button>
      </div>
    </form>
  );
};

export default TableForm;
