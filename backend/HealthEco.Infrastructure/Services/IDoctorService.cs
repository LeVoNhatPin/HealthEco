using HealthEco.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthEco.Infrastructure.Services
{
    public interface IDoctorService
    {
        Task<Doctor?> GetByIdAsync(int id);
    }

}
