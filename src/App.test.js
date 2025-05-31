import {act, render, screen} from '@testing-library/react';
import App, {AppContent} from './App';
import UserData from './data/UserData';
import themeListenerSingletonInstance from './singles/ThemeListenerSingleton';
import {AppRoutes} from "./AppRoutes";
import {TestMemoryRouterWithPathWrapper, TestMemoryRouterWrapper} from "./util/TestUtils";

jest.mock('./data/UserData');
jest.mock('./singles/ThemeListenerSingleton');


describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        UserData.getThemeName = jest.fn().mockResolvedValue('Default');
        themeListenerSingletonInstance.addObserver = jest.fn();
        themeListenerSingletonInstance.removeObserver = jest.fn();
    });

    describe('Main App functionality', () => {
        test('renders main container with proper classes', () => {
            render(
                <TestMemoryRouterWrapper>
                    <AppContent theme="Default"/>
                </TestMemoryRouterWrapper>
            );

            const mainElement = screen.getByRole('main');
            expect(mainElement).toHaveClass('App', 'theme-style');
        });

        test('sets correct document title', () => {
            render(
                <TestMemoryRouterWrapper>
                    <AppContent theme="Default"/>
                </TestMemoryRouterWrapper>
            );

            expect(document.title).toBe('Nebula App');
        });

        test('applies default theme when UserData returns null', async () => {
            UserData.getThemeName.mockResolvedValue(null);
            render(
                <TestMemoryRouterWrapper>
                    <AppContent theme="Default"/>
                </TestMemoryRouterWrapper>
            );

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            const mainElement = screen.getByRole('main');
            expect(mainElement).toHaveAttribute('data-theme', 'Default');
        });

        test('applies theme from UserData', async () => {
            UserData.getThemeName.mockResolvedValue('Dark');
            render(
                <TestMemoryRouterWrapper>
                    <AppContent theme="Dark"/>
                </TestMemoryRouterWrapper>
            );

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            const mainElement = screen.getByRole('main');
            expect(mainElement).toHaveAttribute('data-theme', 'Dark');
        });
    });

    describe('Theme handling', () => {
        test('registers and unregisters theme observer', () => {
            window.history.pushState({}, '', '/nebula/app');

            const {unmount} = render(<App/>);
            expect(themeListenerSingletonInstance.addObserver).toHaveBeenCalled();

            unmount();
            expect(themeListenerSingletonInstance.removeObserver).toHaveBeenCalled();
        });

        test('updates theme when observer is called', async () => {
            UserData.getThemeName
                .mockResolvedValueOnce('Light')
                .mockResolvedValueOnce('Dark');

            window.history.pushState({}, '', '/nebula/app');

            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                render(<App/>);
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(themeListenerSingletonInstance.addObserver).toHaveBeenCalled();

            const observer = themeListenerSingletonInstance.addObserver.mock.calls[0][0];

            await act(async () => {
                await observer();
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            const mainElement = screen.getByRole('main');
            expect(mainElement).toHaveAttribute('data-theme', 'Dark');
        });
    });

    describe('Routing', () => {
        test('renders login page at root path', () => {
            render(
                <TestMemoryRouterWithPathWrapper path={['/']}>
                    <AppRoutes/>
                </TestMemoryRouterWithPathWrapper>
            );

            expect(screen.getByRole('heading', {name: /login/i})).toBeInTheDocument();
            expect(screen.getByAltText('logo')).toBeInTheDocument();
            expect(screen.getByText(/username or email:/i)).toBeInTheDocument();
            expect(screen.getByText(/password:/i)).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
        });

        test('renders registration links', () => {
            render(
                <TestMemoryRouterWithPathWrapper path={['/']}>
                    <AppRoutes/>
                </TestMemoryRouterWithPathWrapper>
            );

            expect(screen.getByText(/haven't account\?/i)).toBeInTheDocument();
            expect(screen.getByText('Create account')).toBeInTheDocument();
            expect(screen.getByText('Restore it')).toBeInTheDocument();
        });

        test('renders form inputs', () => {
            render(
                <TestMemoryRouterWrapper>
                    <AppContent theme="Default"/>
                </TestMemoryRouterWrapper>
            );

            const usernameInput = screen.getByLabelText(/username or email:/i);
            const passwordInput = screen.getByLabelText(/password:/i);

            expect(usernameInput).toHaveClass('input-default');
            expect(passwordInput).toHaveClass('input-default');
        });

        test.each([
            ['/confirm', 'Confirmation Account'],
            ['/redirect', 'Redirect Page']
        ])('renders %s page at path %s', async (path, expectedTitle) => {
            render(
                <TestMemoryRouterWithPathWrapper path={[path]}>
                    <AppRoutes/>
                </TestMemoryRouterWithPathWrapper>
            );
        });
    });

    describe('Login functionality', () => {
        test('login form is interactive', () => {
            render(
                <TestMemoryRouterWrapper>
                    <AppContent theme="Default"/>
                </TestMemoryRouterWrapper>
            );

            const usernameInput = screen.getByLabelText(/username or email:/i);
            const passwordInput = screen.getByLabelText(/password:/i);
            const loginButton = screen.getByRole('button', {name: /login/i});

            expect(usernameInput).toBeEnabled();
            expect(passwordInput).toBeEnabled();
            expect(loginButton).toBeEnabled();
        });
    });
});
