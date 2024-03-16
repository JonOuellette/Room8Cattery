import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from './UserProfile';
import Room8Api from '../../api/api';
import { UserContext } from '../UserContext';

jest.mock('../../api/api');

describe('UserProfile', () => {
    test('renders user profile and toggles modals', async () => {
        const mockUser = { username: 'johndoe', first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
        
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <UserProfile />
            </UserContext.Provider>
        );
        
        expect(screen.getByText(`${mockUser.username}'s Profile`)).toBeInTheDocument();
        
        // Test modal interactions
        fireEvent.click(screen.getByText('Edit Profile'));
        fireEvent.click(screen.getByText('Change Password'));
        
      
    });
});
