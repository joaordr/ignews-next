import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import SubscribeButton from '.';

jest.mock('next-auth/react');
jest.mock("next/router");

describe('SubscribeButton component', () => {
    it('Renders correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: null, status: "unauthenticated" });

        render(<SubscribeButton />)

        expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    });

    it('redirect user to sign in when NOT authenticated', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: null, status: "unauthenticated" });

        const signInMocked = mocked(signIn);

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now');

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it("redirects user to posts when user already has a subscription", () => {
        const useRouterMocked = jest.mocked(useRouter);
        const useSessionMocked = jest.mocked(useSession);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: { name: "John Doe", email: "john.doe@example.com" },
                expires: "fake-expires",
                activeSubscription: true,
            },
            status: "authenticated",
        });

        useRouterMocked.mockReturnValueOnce({ push: pushMock } as any);

        const { debug } = render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe Now');

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWith('/posts');
        debug()
    });

})

