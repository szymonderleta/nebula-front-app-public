// test.js
import React from "react";
import {render, fireEvent, screen, waitFor, act} from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";
import ValidationUtils from "../../util/ValidationUtils";

jest.mock("../../util/ValidationUtils", () => ({
    isLoginValid: jest.fn(),
    isEmailValid: jest.fn(),
    isStrongPassword: jest.fn(),
    isPasswordMatches: jest.fn(),
    isBirthDateValid: jest.fn(),
    isNationalityValid: jest.fn(),
    isGenderValid: jest.fn(),
    isRegistrationDataValid: jest.fn(),
}));

test("renders the RegistrationForm component", () => {
    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);
    expect(screen.getByText("Registration form")).toBeInTheDocument();
    expect(screen.getByText("Register Account")).toBeInTheDocument();
});

test("validates login field", () => {
    ValidationUtils.isLoginValid.mockReturnValue(false);
    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);

    const loginInput = screen.getByLabelText("Your login:");
    fireEvent.change(loginInput, { target: { value: "invalid_login" } });
    expect(ValidationUtils.isLoginValid).toHaveBeenCalledWith("invalid_login");

    // Use a regex to match the validation message flexibly
    expect(screen.getByText(/login can only contain letters, numbers and the '-' sign/i)).toBeInTheDocument();
});

test("validates email field", () => {
    ValidationUtils.isEmailValid.mockReturnValue(false);
    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);

    const emailInput = screen.getByLabelText("Email:");
    fireEvent.change(emailInput, { target: { value: "invalid_email" } });
    expect(ValidationUtils.isEmailValid).toHaveBeenCalledWith("invalid_email");

    // Use a RegExp to match the expected error message
    expect(screen.getByText(/email can only contain letters, numbers and the '-' sign/i)).toBeInTheDocument();
});

test("validates password fields", () => {
    ValidationUtils.isStrongPassword.mockReturnValue(false);
    ValidationUtils.isPasswordMatches.mockReturnValue(false);
    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);

    const passwordInput = screen.getByLabelText("Your Password:");
    fireEvent.change(passwordInput, { target: { value: "weakpass" } });
    expect(ValidationUtils.isStrongPassword).toHaveBeenCalledWith("weakpass");
    expect(screen.getByText("The password must contain at least 8 characters, numbers or letters.")).toBeInTheDocument();

    const confirmPasswordInput = screen.getByLabelText(/repeat password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: "different" } });
    expect(ValidationUtils.isPasswordMatches).toHaveBeenCalledWith("weakpass", "different");
    expect(screen.getByText("Passwords must meets.")).toBeInTheDocument();
});

test("validates birthdate field", async () => {
    const mockValidation = jest.spyOn(ValidationUtils, 'isBirthDateValid');
    mockValidation.mockImplementation(() => false);

    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);

    const birthdateInput = screen.getByLabelText("Birthdate:");

    fireEvent.change(birthdateInput, {
        target: {
            value: "invalid_date"
        }
    });

    await waitFor(() => {
        expect(mockValidation).toHaveBeenCalled();
    });

    expect(screen.getByText("Enter valid birthdate value.")).toBeInTheDocument();
    mockValidation.mockRestore();
});

test("handles nationality validation", () => {
    ValidationUtils.isNationalityValid.mockReturnValue(false);
    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);

    expect(screen.getByText("Select your nationality from list.")).toBeInTheDocument();
});

test("handles gender validation", () => {
    ValidationUtils.isGenderValid.mockReturnValue(false);
    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);

    expect(screen.getByText("Select your gender.")).toBeInTheDocument();
});

test("triggers onRegister when form is valid", () => {
    const onRegisterMock = jest.fn();

    ValidationUtils.isRegistrationDataValid.mockReturnValue(true);

    render(<RegistrationForm onRegister={onRegisterMock} onNavigate={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Your login:"), { target: { value: "validuser" } });
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("Your Password:"), { target: { value: "ValidPass123" } });
    fireEvent.change(screen.getByLabelText(/repeat password/i), { target: { value: "ValidPass123" } });
    fireEvent.change(screen.getByLabelText("Birthdate:"), { target: { value: "1990-01-01" } });

    fireEvent.click(screen.getByText("Register Account"));
    expect(onRegisterMock).toHaveBeenCalledWith({
        login: "validuser",
        email: "user@example.com",
        password: "ValidPass123",
        birthdate: "1990-01-01",
        nationality: "",
        gender: "",
    });
});

test("shows alert when validation fails during registration", () => {
    ValidationUtils.isRegistrationDataValid.mockReturnValue(false);
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<RegistrationForm onRegister={jest.fn()} onNavigate={jest.fn()} />);

    fireEvent.click(screen.getByText("Register Account"));
    expect(window.alert).toHaveBeenCalledWith("Fields wasn't correct filled!");
});
