using FluentValidation;
using Ecommerce.Application.DTOs;

namespace Ecommerce.Application.Validations
{
    public class OrderCreateDtoValidator : AbstractValidator<OrderCreateDto>
    {
        public OrderCreateDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Order ID is required.");

            RuleFor(x => x.Total)
                .GreaterThan(0).WithMessage("Total amount must be greater than zero.");

            RuleFor(x => x.Products)
                .NotEmpty().WithMessage("Order must contain at least one item.");

            RuleFor(x => x.Address)
                .NotNull().WithMessage("Shipping address is required.");

            RuleFor(x => x.Address.Name)
                .NotEmpty().WithMessage("Name is required in shipping address.");

            RuleFor(x => x.Address.House)
                .NotEmpty().WithMessage("House/Apartment number is required.");

            RuleFor(x => x.Address.Address1)
                .NotEmpty().WithMessage("Street address is required.");

            RuleFor(x => x.Address.City)
                .NotEmpty().WithMessage("City is required.");

            RuleFor(x => x.Address.State)
                .NotEmpty().WithMessage("State is required.");

            RuleFor(x => x.Address.Country)
                .NotEmpty().WithMessage("Country is required.");
        }
    }
}
