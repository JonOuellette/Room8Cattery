import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FosterDashboard from './FosterDashboard';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../UserContext';

// Mock the entire module with vi.mock
vi.mock('../../api/api', () => ({
  getUserDetailsById: vi.fn(() => Promise.resolve({ first_name: 'John' })),
  getFosterCats: vi.fn(() => Promise.resolve([])),
}));

describe('FosterDashboard', () => {
  it('renders Foster Dashboard', async () => {
    // Set up mock values for the context and API responses
    const mockUser = { id: '1', name: 'John' };

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockUser }}>
          <FosterDashboard />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Add your assertion here
    // Example:
    // await screen.findByText('John'); // Assuming 'John' should be in the document if the component renders correctly.
  });
});
