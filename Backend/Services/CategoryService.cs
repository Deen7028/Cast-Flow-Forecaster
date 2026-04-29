using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Interfaces
{
    public interface ICategoryService
    {
        IEnumerable<tmCategories> GetAll();
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

        public IEnumerable<tmCategories> GetAll()
        {
            return _context.tmCategories.Where(c => c.isActive == true).ToList();
        }
    }
}
