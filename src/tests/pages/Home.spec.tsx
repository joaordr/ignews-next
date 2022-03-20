import { render, screen } from '@testing-library/react';

import Home from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/react', () => {
    return {
        useSession: () => [null, false]
    }
});

describe('Home page', () => {
    it('renders corectly', () => {
        render(<Home product={{ priceId: 'fake-price-id', amount: 'R$ 10,00' }} />);

        expect(screen.getByText(/R\$ 10,00/i)).toBeInTheDocument();
    })
})