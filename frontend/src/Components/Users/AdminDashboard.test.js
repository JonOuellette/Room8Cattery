import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import Room8Api from '../../api/api';
import ReactModal from 'react-modal';


// Mock the Room8Api methods used in the AdminDashboard
jest.mock('../../api/api', () => ({
    exportCats: jest.fn(),
    exportFosters: jest.fn()
}));

ReactModal.setAppElement(document.createElement('div')); // Set app element for testing

describe('AdminDashboard', () => {
    test('renders Admin Dashboard and exports data', async () => {
        render(<AdminDashboard />);

        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Create New User')).toBeInTheDocument();
        
        Room8Api.exportCats.mockResolvedValue({ sheet_url: 'http://catsheet.url' });
        Room8Api.exportFosters.mockResolvedValue({ sheet_url: 'http://fosterssheet.url' });
        
        fireEvent.click(screen.getByText('Export Cats to Google Sheets'));
        fireEvent.click(screen.getByText('Export Fosters to Google Sheets'));
        
        
    });
});
