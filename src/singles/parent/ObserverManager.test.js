import ObserverManager from './ObserverManager';

describe('ObserverManager', () => {
    let observerManager;

    beforeEach(() => {
        observerManager = new ObserverManager();
    });

    test('should create empty observers list', () => {
        expect(observerManager.observers).toHaveLength(0);
    });

    test('should add function as observer', () => {
        const observer = jest.fn();
        observerManager.addObserver(observer);
        expect(observerManager.observers).toHaveLength(1);
        expect(observerManager.observers).toContain(observer);
    });

    test('should not add non-function as observer', () => {
        observerManager.addObserver('not a function');
        observerManager.addObserver(123);
        observerManager.addObserver({});
        observerManager.addObserver(null);
        observerManager.addObserver(undefined);

        expect(observerManager.observers).toHaveLength(0);
    });

    test('should remove observer', () => {
        const observer = jest.fn();
        observerManager.addObserver(observer);
        expect(observerManager.observers).toHaveLength(1);

        observerManager.removeObserver(observer);
        expect(observerManager.observers).toHaveLength(0);
    });

    test('should notify all observers', () => {
        const observer1 = jest.fn();
        const observer2 = jest.fn();
        const observer3 = jest.fn();

        observerManager.addObserver(observer1);
        observerManager.addObserver(observer2);
        observerManager.addObserver(observer3);

        observerManager.notifyObservers();

        expect(observer1).toHaveBeenCalledTimes(1);
        expect(observer2).toHaveBeenCalledTimes(1);
        expect(observer3).toHaveBeenCalledTimes(1);
    });

    test('should safely remove non-existing observer', () => {
        const observer = jest.fn();
        const observer2 = jest.fn();

        observerManager.addObserver(observer);
        observerManager.removeObserver(observer2);

        expect(observerManager.observers).toHaveLength(1);
        expect(observerManager.observers).toContain(observer);
    });

    test('should handle multiple adds and removes correctly', () => {
        const observer = jest.fn();

        observerManager.addObserver(observer);
        observerManager.addObserver(observer);
        expect(observerManager.observers).toHaveLength(2);

        observerManager.removeObserver(observer);
        expect(observerManager.observers).toHaveLength(0);
    });
});
