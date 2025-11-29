import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material';
import type { Issue, IssueStatus, IssuePriority } from '../../types/issue';

const TEAM_MEMBERS = [
  'Unassigned',
  'John Doe',
  'Jane Smith',
  'Bob Johnson',
  'Sarah Wilson',
  'Mike Chen',
];

interface IssueDialogProps {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
  onSave: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'> | Issue) => void;
}

export const IssueDialog = ({ open, issue, onClose, onSave }: IssueDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as IssueStatus,
    priority: 'medium' as IssuePriority,
    assignee: '',
  });

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        assignee: issue.assignee,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: 'Unassigned',
      });
    }
  }, [issue, open]);

  const handleSubmit = () => {
    if (issue) {
      onSave({ ...issue, ...formData });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{issue ? 'Edit Issue' : 'Create New Issue'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as IssueStatus })}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="inProgress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
          <TextField
            select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as IssuePriority })}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </TextField>
          <TextField
            select
            label="Assignee"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
          >
            {TEAM_MEMBERS.map((member) => (
              <MenuItem key={member} value={member}>
                {member}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!formData.title}>
          {issue ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
