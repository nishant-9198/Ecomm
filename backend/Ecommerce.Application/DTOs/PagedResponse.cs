using System;
using System.Collections.Generic;

namespace Ecommerce.Application.DTOs
{
    public class PagedResponse<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage => Page < TotalPages;
        public bool HasPreviousPage => Page > 1;

        public PagedResponse()
        {
        }

        public PagedResponse(IEnumerable<T> items, int page, int pageSize, int totalItems)
        {
            Items = items;
            Page = page;
            PageSize = pageSize;
            TotalItems = totalItems;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
        }
    }
}
