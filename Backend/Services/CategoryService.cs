using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<tmCategories>> GetAllAsync();
    }
}

namespace Backend.Services
{
    using Backend.Interfaces;

    public class CategoryService : ICategoryService
    {
        private readonly WebAppDbContext _context;

        public CategoryService(WebAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<tmCategories>> GetAllAsync()
        {
            return await _context.tmCategories.Where(c => c.isActive == true).ToListAsync();
        }
    }
}
