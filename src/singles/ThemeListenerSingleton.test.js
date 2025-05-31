import themeListenerSingletonInstance from './ThemeListenerSingleton';
import ObserverManager from './parent/ObserverManager';

describe('ThemeListenerSingleton', () => {
    beforeEach(() => {
        themeListenerSingletonInstance.observers = [];
    });

    test('should be an instance of ObserverManager', () => {
        expect(themeListenerSingletonInstance).toBeInstanceOf(ObserverManager);
    });

    test('should behave like a singleton', () => {
        const instance1 = require('./ThemeListenerSingleton').default;
        const instance2 = require('./ThemeListenerSingleton').default;

        expect(instance1).toBe(instance2);
    });

    test('should inherit ObserverManager functionality', () => {
        const observer = jest.fn();

        themeListenerSingletonInstance.addObserver(observer);
        themeListenerSingletonInstance.notifyObservers();

        expect(observer).toHaveBeenCalled();
    });

    test('should maintain state between imports', () => {
        const observer = jest.fn();
        themeListenerSingletonInstance.addObserver(observer);

        const anotherInstance = require('./ThemeListenerSingleton').default;
        expect(anotherInstance.observers).toContain(observer);
    });
});
