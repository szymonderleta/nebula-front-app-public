import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PasswordRecovery from "./PasswordRecovery";
import ValidationUtils from "../../util/ValidationUtils";
import ResetPasswordRequest from "../../api/pasword/ResetPasswordRequest";

jest.mock("../../util/ValidationUtils");
jest.mock("../../api/pasword/ResetPasswordRequest");

describe("PasswordRecovery Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("UI and initial state", () => {
        test("renders the form by default", () => {
            render(<PasswordRecovery onNavigate={jest.fn()} />);

            expect(screen.getByRole("heading", { name: /password recovery/i })).toBeInTheDocument();
            expect(screen.getByLabelText("Email:")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
        });

        test("does not display recovery success message initially", () => {
            render(<PasswordRecovery onNavigate={jest.fn()} />);
            expect(screen.queryByText(/recovery link has been sent/i)).not.toBeInTheDocument();
        });
    });

    describe("Email input validation", () => {
        test("calls ValidationUtils.isEmailValid when email is entered", () => {
            ValidationUtils.isEmailValid.mockReturnValue(false);

            render(<PasswordRecovery onNavigate={jest.fn()} />);

            const emailInput = screen.getByLabelText("Email:");
            fireEvent.change(emailInput, { target: { value: "invalid-email" } });

            expect(ValidationUtils.isEmailValid).toHaveBeenCalledWith("invalid-email");
        });

        test("shows alert with invalid email when validation fails", () => {
            ValidationUtils.isEmailValid.mockReturnValue(false);
            window.alert = jest.fn();

            render(<PasswordRecovery onNavigate={jest.fn()} />);

            const emailInput = screen.getByLabelText("Email:");
            fireEvent.change(emailInput, { target: { value: "invalid@example" } });

            fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

            expect(window.alert).toHaveBeenCalledWith("It is not a valid email address: invalid@example");
        });

        test("does not trigger password recovery request with invalid email", () => {
            ValidationUtils.isEmailValid.mockReturnValue(false);

            render(<PasswordRecovery onNavigate={jest.fn()} />);

            fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "invalid@example" } });
            fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

            expect(ResetPasswordRequest).not.toHaveBeenCalled();
        });
    });

    describe("Password recovery process", () => {
        test("triggers password recovery request on valid email", async () => {
            ValidationUtils.isEmailValid.mockReturnValue(true);
            ResetPasswordRequest.mockResolvedValueOnce({ success: true, data: {} });

            render(<PasswordRecovery onNavigate={jest.fn()} />);

            fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "valid@example.com" } });
            fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

            await waitFor(() => {
                expect(ResetPasswordRequest).toHaveBeenCalledWith("valid@example.com");
            });
        });

        test("displays recovery success message after successful request", async () => {
            ValidationUtils.isEmailValid.mockReturnValue(true);
            ResetPasswordRequest.mockResolvedValueOnce({ success: true, data: {} });

            render(<PasswordRecovery onNavigate={jest.fn()} />);

            fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "valid@example.com" } });
            fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

            await waitFor(() => {
                expect(screen.getByText(/restore your password/i)).toBeInTheDocument();
            });

            expect(screen.queryByRole("heading", { name: /password recovery/i })).not.toBeInTheDocument();
        });

        test("does not display recovery success message when request fails", async () => {
            ValidationUtils.isEmailValid.mockReturnValue(true);
            ResetPasswordRequest.mockRejectedValueOnce(new Error("Request failed"));
            const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

            render(<PasswordRecovery onNavigate={jest.fn()} />);

            fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "valid@example.com" } });
            fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

            await waitFor(() => {
                expect(screen.queryByText(/recovery link has been sent/i)).not.toBeInTheDocument();
            });
            consoleErrorMock.mockRestore();
        });

        test("does not display recovery success message when request returns success: false", async () => {
            ValidationUtils.isEmailValid.mockReturnValue(true);
            ResetPasswordRequest.mockResolvedValueOnce({ success: false, message: "User not found" });

            render(<PasswordRecovery onNavigate={jest.fn()} />);

            fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "valid@example.com" } });
            fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

            await waitFor(() => {
                expect(screen.queryByText(/recovery link has been sent/i)).not.toBeInTheDocument();
            });
        });
    });

    describe("Navigation links", () => {
        test("navigates to login when Login link is clicked", () => {
            const mockNavigate = jest.fn();
            render(<PasswordRecovery onNavigate={mockNavigate} />);

            fireEvent.click(screen.getByText("Login"));

            expect(mockNavigate).toHaveBeenCalledWith("login");
        });

        test("navigates to registration when Create account link is clicked", () => {
            const mockNavigate = jest.fn();
            render(<PasswordRecovery onNavigate={mockNavigate} />);

            fireEvent.click(screen.getByText("Create account"));

            expect(mockNavigate).toHaveBeenCalledWith("register");
        });
    });
});
