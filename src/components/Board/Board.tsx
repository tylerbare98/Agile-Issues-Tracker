import { useState, useMemo } from 'react';
import { Box, Container, Button, TextField, MenuItem, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addIssue,
  updateIssue,
  deleteIssue,
  updateIssueStatus,
  setFilter,
} from '../../features/issues/issuesSlice';
import type { Issue, IssueStatus } from '../../types/issue';
import { Column } from './Column';
import { IssueDialog } from './IssueDialog';
import { useSnackbar } from '../Layout/SnackbarNotification';

export const Board = () => {
  const dispatch = useAppDispatch();
  const { issues, filter } = useAppSelector((state) => state.issues);
  const { showSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        issue.description.toLowerCase().includes(filter.search.toLowerCase());
      const matchesStatus = filter.status === 'all' || issue.status === filter.status;
      const matchesPriority = filter.priority === 'all' || issue.priority === filter.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [issues, filter]);

  const todoIssues = filteredIssues.filter((i) => i.status === 'todo');
  const inProgressIssues = filteredIssues.filter((i) => i.status === 'inProgress');
  const doneIssues = filteredIssues.filter((i) => i.status === 'done');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as IssueStatus;

    dispatch(updateIssueStatus({ id: draggableId, status: newStatus }));
    showSnackbar('Issue status updated', 'success');
  };

  const handleSave = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'> | Issue) => {
    if ('id' in issueData) {
      dispatch(updateIssue(issueData));
      showSnackbar('Issue updated successfully', 'success');
    } else {
      dispatch(addIssue(issueData));
      showSnackbar('Issue created successfully', 'success');
    }
    setEditingIssue(null);
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteIssue(id));
    showSnackbar('Issue deleted', 'info');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingIssue(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            New Issue
          </Button>
          <TextField
            label="Search issues"
            variant="outlined"
            size="small"
            value={filter.search}
            onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <TextField
            select
            label="Status"
            size="small"
            value={filter.status}
            onChange={(e) => dispatch(setFilter({ status: e.target.value as IssueStatus | 'all' }))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="inProgress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
          <TextField
            select
            label="Priority"
            size="small"
            value={filter.priority}
            onChange={(e) => dispatch(setFilter({ priority: e.target.value }))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            overflowX: { md: 'auto' },
            pb: 2
          }}
        >
          {(filter.status === 'all' || filter.status === 'todo') && (
            <Column
              title="To Do"
              status="todo"
              issues={todoIssues}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {(filter.status === 'all' || filter.status === 'inProgress') && (
            <Column
              title="In Progress"
              status="inProgress"
              issues={inProgressIssues}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {(filter.status === 'all' || filter.status === 'done') && (
            <Column
              title="Done"
              status="done"
              issues={doneIssues}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Box>
      </DragDropContext>

      <IssueDialog
        open={dialogOpen}
        issue={editingIssue}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </Container>
  );
};
