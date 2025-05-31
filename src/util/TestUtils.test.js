import {render, screen} from '@testing-library/react';
import {TestMemoryRouterWrapper} from "./TestUtils";
import LoginForm from "../view/page/LoginForm";

describe('TestUtils', () => {
    test('renders login form correctly', () => {
        render(
            <TestMemoryRouterWrapper>
                <LoginForm/>
            </TestMemoryRouterWrapper>
        );

        // Check for "Login" header
        expect(screen.getByRole('heading', {level: 1, name: /login/i})).toBeInTheDocument();

        // Check for username or email label
        expect(screen.getByLabelText(/username or email:/i)).toBeInTheDocument();

        // Check for password label
        expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();

        // Check for login button
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();

        // Check for "Haven't account?" and link
        expect(screen.getByText(/haven't account\?/i)).toBeInTheDocument();
        expect(screen.getByText(/create account/i)).toBeInTheDocument();

        // Check for "Forgot password?" and link
        expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
        expect(screen.getByText(/restore it/i)).toBeInTheDocument();
    });
});
