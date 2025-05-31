import avatarListenerSingletonInstance from './AvatarListenerSingleton';
import ObserverManager from './parent/ObserverManager';

describe('AvatarListenerSingleton', () => {
    beforeEach(() => {
        avatarListenerSingletonInstance.observers = [];
    });

    test('should be an instance of ObserverManager', () => {
        expect(avatarListenerSingletonInstance).toBeInstanceOf(ObserverManager);
    });

    test('should behave like a singleton', () => {
        const instance1 = require('./AvatarListenerSingleton').default;
        const instance2 = require('./AvatarListenerSingleton').default;

        expect(instance1).toBe(instance2);
    });

    test('should inherit ObserverManager functionality', () => {
        const observer = jest.fn();

        avatarListenerSingletonInstance.addObserver(observer);
        avatarListenerSingletonInstance.notifyObservers();

        expect(observer).toHaveBeenCalled();
    });

    test('should maintain state between imports', () => {
        const observer = jest.fn();
        avatarListenerSingletonInstance.addObserver(observer);

        const anotherInstance = require('./AvatarListenerSingleton').default;
        expect(anotherInstance.observers).toContain(observer);
    });
});