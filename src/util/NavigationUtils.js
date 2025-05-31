export const NAVIGATE_REGISTER = 'register';
export const NAVIGATE_RECOVERY = 'recovery';
export const NAVIGATE_LOGIN = 'login';

export const MESSAGE_HEADER_CONFIRMATION = "Thank you for signing up. To complete the process, click on the link sent to your email during the registration.";
export const MESSAGE_RECOVERY_SUCCESS = "A link to restore your password has been sent to the email address you provided.";

export const MESSAGE_REGISTER_PROMPT = "Haven't account?";
export const MESSAGE_RECOVERY_PROMPT = "Forgot password?";
export const MESSAGE_LOGIN_PROMPT = "Already have account?";

export const ERROR_INVALID_EMAIL = "It is not a valid email address: ";

export const handleNavigate = (onNavigate, page) => {
    onNavigate(page);
};
export const RenderLink = ({ text, page, onNavigate }) => (
    <span className="span-link" onClick={() => handleNavigate(onNavigate, page)}>
        {text}
    </span>
);
