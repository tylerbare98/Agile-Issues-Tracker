import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import type { Issue } from '../../types/issue';
import { Draggable } from '@hello-pangea/dnd';

interface IssueCardProps {
  issue: Issue;
  index: number;
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'success',
  medium: 'info',
  high: 'warning',
  critical: 'error',
} as const;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const IssueCard = ({ issue, index, onEdit, onDelete }: IssueCardProps) => {
  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 8 : 2}
          sx={{
            mb: 2,
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' },
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {issue.title}
              </Typography>
              <Box>
                <IconButton size="small" onClick={() => onEdit(issue)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(issue.id)} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {issue.description}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={issue.priority}
                color={priorityColors[issue.priority]}
                size="small"
              />
              <Chip label={issue.assignee} size="small" variant="outlined" />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Created: {formatDate(issue.createdAt)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
