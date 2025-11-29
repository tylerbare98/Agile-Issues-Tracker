import { Paper, Typography, Box } from '@mui/material';
import { Droppable } from '@hello-pangea/dnd';
import type { Issue, IssueStatus } from '../../types/issue';
import { IssueCard } from './IssueCard';

interface ColumnProps {
  title: string;
  status: IssueStatus;
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
}

export const Column = ({ title, status, issues, onEdit, onDelete }: ColumnProps) => {
  return (
    <Paper
      sx={{
        p: 2,
        width: { xs: '100%', md: 300 },
        minWidth: { md: 300 },
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title} ({issues.length})
      </Typography>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: { xs: 200, md: 400 },
              bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
              borderRadius: 1,
              p: 1,
            }}
          >
            {issues.map((issue, index) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};
