import { render, screen, fireEvent } from '@testing-library/react';
import { NAVIGATE_LOGIN, NAVIGATE_RECOVERY, NAVIGATE_REGISTER, handleNavigate, RenderLink } from './NavigationUtils';

describe('NavigationUtil', () => {
    describe('handleNavigate', () => {
        it('should call onNavigate with the correct page', () => {
            const mockOnNavigate = jest.fn();
            const page = NAVIGATE_REGISTER;

            handleNavigate(mockOnNavigate, page);

            expect(mockOnNavigate).toHaveBeenCalledWith(page);
            expect(mockOnNavigate).toHaveBeenCalledTimes(1);
        });
    });

    describe('RenderLink', () => {
        it('should render the link with the correct text', () => {
            render(<RenderLink text="Sign Up" page={NAVIGATE_REGISTER} onNavigate={() => {}} />);
            expect(screen.getByText('Sign Up')).toBeInTheDocument();
        });

        it('should call onNavigate when the link is clicked', () => {
            const mockOnNavigate = jest.fn();
            const page = NAVIGATE_RECOVERY;

            render(<RenderLink text="Recover Password" page={page} onNavigate={mockOnNavigate} />);
            const linkElement = screen.getByText('Recover Password');
            fireEvent.click(linkElement);

            expect(mockOnNavigate).toHaveBeenCalledWith(page);
            expect(mockOnNavigate).toHaveBeenCalledTimes(1);
        });

        it('should have the correct class name', () => {
            render(<RenderLink text="Login" page={NAVIGATE_LOGIN} onNavigate={() => {}} />);
            const linkElement = screen.getByText('Login');
            expect(linkElement).toHaveClass('span-link');
        });
    });
});
