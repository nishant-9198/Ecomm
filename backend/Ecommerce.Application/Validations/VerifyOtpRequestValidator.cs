using FluentValidation;
using Ecommerce.Application.DTOs;

namespace Ecommerce.Application.Validations
{
    public class VerifyOtpRequestValidator : AbstractValidator<VerifyOtpRequest>
    {
        public VerifyOtpRequestValidator()
        {
            RuleFor(x => x.Mobile)
                .NotEmpty().WithMessage("Mobile number is required.")
                .Length(10).WithMessage("Mobile number must be exactly 10 digits.")
                .Matches(@"^\d+$").WithMessage("Mobile number must contain only numbers.");

            RuleFor(x => x.Otp)
                .NotEmpty().WithMessage("OTP is required.")
                .Length(6).WithMessage("OTP must be exactly 6 digits.")
                .Matches(@"^\d+$").WithMessage("OTP must contain only numbers.");
        }
    }
}
