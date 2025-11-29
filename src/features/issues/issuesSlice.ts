import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Issue, IssueStatus } from '../../types/issue';

interface IssuesState {
  issues: Issue[];
  filter: {
    search: string;
    status: IssueStatus | 'all';
    priority: string;
  };
}

const initialState: IssuesState = {
  issues: [],
  filter: {
    search: '',
    status: 'all',
    priority: 'all',
  },
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    addIssue: (state, action: PayloadAction<Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newIssue: Issue = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.issues.push(newIssue);
      localStorage.setItem('issues', JSON.stringify(state.issues));
    },
    updateIssue: (state, action: PayloadAction<Issue>) => {
      const index = state.issues.findIndex((issue) => issue.id === action.payload.id);
      if (index !== -1) {
        state.issues[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('issues', JSON.stringify(state.issues));
      }
    },
    deleteIssue: (state, action: PayloadAction<string>) => {
      state.issues = state.issues.filter((issue) => issue.id !== action.payload);
      localStorage.setItem('issues', JSON.stringify(state.issues));
    },
    updateIssueStatus: (state, action: PayloadAction<{ id: string; status: IssueStatus }>) => {
      const issue = state.issues.find((issue) => issue.id === action.payload.id);
      if (issue) {
        issue.status = action.payload.status;
        issue.updatedAt = new Date().toISOString();
        localStorage.setItem('issues', JSON.stringify(state.issues));
      }
    },
    setFilter: (state, action: PayloadAction<Partial<IssuesState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    loadIssues: (state) => {
      const savedIssues = localStorage.getItem('issues');
      if (savedIssues) {
        state.issues = JSON.parse(savedIssues);
      }
    },
  },
});

export const { addIssue, updateIssue, deleteIssue, updateIssueStatus, setFilter, loadIssues } = issuesSlice.actions;
export default issuesSlice.reducer;
