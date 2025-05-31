import {MemoryRouter} from "react-router-dom";

export const TestMemoryRouterWrapper = ({ children }) => (
    <MemoryRouter
        basename="/nebula/app"
        initialEntries={['/nebula/app']}
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        {children}
    </MemoryRouter>
);

export const TestMemoryRouterWithPathWrapper = ({ path, children }) => (
    <MemoryRouter
        basename="/nebula/app"
        initialEntries={path.map(p => `/nebula/app${p}`)}
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        {children}
    </MemoryRouter>
);

