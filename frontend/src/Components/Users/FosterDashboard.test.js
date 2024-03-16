import { render, screen } from '@testing-library/react';
import FosterDashboard from './FosterDashboard';
import Room8Api from '../../api/api';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../api/api');

describe('FosterDashboard', () => {
    test('renders Foster Dashboard', async () => {
        render(
          <BrowserRouter>
            <FosterDashboard />
          </BrowserRouter>
        );

        
        Room8Api.getUserDetailsById.mockResolvedValue({
            first_name: 'John',
            
        });
        Room8Api.getFosterCats.mockResolvedValue([
           
        ]);

       
    });
});
