import { render, screen, fireEvent } from '@testing-library/react';
import EditProfileForm from './EditProfileForm';
import Room8Api from '../../api/api';

jest.mock('../../api/api');

describe('EditProfileForm', () => {
    test('renders and updates user profile', async () => {
        render(<EditProfileForm close={() => {}} />);
        
        const saveButton = screen.getByText('Save Changes');
        expect(saveButton).toBeInTheDocument();
        
        // Simulate form field changes and submission
        fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'john@example.com' } });
        
        Room8Api.updateUser.mockResolvedValue({});
        
        fireEvent.click(saveButton);
        
        
    });
});
